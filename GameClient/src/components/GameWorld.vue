<script setup>
import {ref, onMounted, onUnmounted, computed} from 'vue';
import {useWorldStore} from "../stores/world.js";
import {usePlayerStore} from "../stores/player.js";
import {useGameManager} from "../stores/gameManager.js";

const canvasRef = ref(null);
const isInventoryOpen = ref(false);
const playerStore = usePlayerStore();
const worldStore = useWorldStore();
const gameManager = useGameManager();
const keys = {};

let animationFrameId = null;

const handleKeyDown = (e) => {
  const key = e.key.toLowerCase();
  if (key === 'i') {
    isInventoryOpen.value = !isInventoryOpen.value;
    // Reset keys when opening inventory to prevent "stuck" movement
    if (isInventoryOpen.value) Object.keys(keys).forEach(k => keys[k] = false);
    return;
  }
  keys[key] = true;
};

const handleKeyUp = (e) => {
  keys[e.key.toLowerCase()] = false;
};

// SAFE CHECK: Prevents the game from crashing if player walks off the array
const isWalkable = (x, y) => {
  const tileX = Math.floor(x / worldStore.tileSize);
  const tileY = Math.floor(y / worldStore.tileSize);

  // Check array bounds
  if (tileY < 0 || tileY >= worldStore.map.length) return false;
  if (tileX < 0 || tileX >= worldStore.map[tileY].length) return false;

  return worldStore.map[tileY][tileX] === 0; // 0 is floor
};

const update = () => {
  if (gameManager.currentScene !== 'world' || isInventoryOpen.value) {
    animationFrameId = requestAnimationFrame(update);
    return;
  }

  const speed = playerStore.speed;
  let nextX = playerStore.position.x;
  let nextY = playerStore.position.y;

  if (keys['w'] || keys['arrowup']) nextY -= speed;
  if (keys['s'] || keys['arrowdown']) nextY += speed;
  if (keys['a'] || keys['arrowleft']) nextX -= speed;
  if (keys['d'] || keys['arrowright']) nextX += speed;

  // Collision detection (checking player corners)
  const padding = 15;
  if (isWalkable(nextX - padding, nextY - padding) &&
    isWalkable(nextX + padding, nextY + padding)) {
    playerStore.position.x = nextX;
    playerStore.position.y = nextY;
  }

  // Combat Trigger check
  worldStore.enemies.forEach(enemy => {
    if (enemy.isAlive) {
      const dist = Math.hypot(enemy.x - playerStore.position.x, enemy.y - playerStore.position.y);
      if (dist < 30) {
        playerStore.setLastSafePosition(playerStore.position.x, playerStore.position.y);
        gameManager.startCombat(enemy);
      }
    }
  });

  // Item Pickup check
  worldStore.droppedItems = worldStore.droppedItems.filter(item => {
    const dist = Math.hypot(item.x - playerStore.position.x, item.y - playerStore.position.y);
    if (dist < 30) {
      playerStore.inventory.push(item);
      return false;
    }
    return true;
  });
  draw();
  animationFrameId = requestAnimationFrame(update);
};

const equipmentSlots = computed(() => {
  const {id, ...slots} = playerStore.equipment;
  return slots;
})

const draw = () => {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  // 1. Clear Canvas
  ctx.fillStyle = '#1a1a1a';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 2. Camera setup (keeps player centered)
  const camX = playerStore.position.x - canvas.width / 2;
  const camY = playerStore.position.y - canvas.height / 2;

  // 3. Draw Map
  worldStore.map.forEach((row, y) => {
    row.forEach((tile, x) => {
      const drawX = x * worldStore.tileSize - camX;
      const drawY = y * worldStore.tileSize - camY;

      ctx.fillStyle = tile === 1 ? '#34495e' : '#2ecc71';
      ctx.strokeStyle = '#27ae60';
      ctx.fillRect(drawX, drawY, worldStore.tileSize, worldStore.tileSize);
      if (tile === 0) ctx.strokeRect(drawX, drawY, worldStore.tileSize, worldStore.tileSize);
    });
  });

  // 4. Draw Dropped Items
  worldStore.droppedItems.forEach(item => {
    ctx.fillStyle = '#f1c40f';
    ctx.beginPath();
    ctx.arc(item.x - camX, item.y - camY, 8, 0, Math.PI * 2);
    ctx.fill();
  });

  // 5. Draw Enemies
  worldStore.enemies.forEach(enemy => {
    if (enemy.isAlive) {
      ctx.fillStyle = '#e74c3c';
      ctx.fillRect(enemy.x - camX - 15, enemy.y - camY - 15, 30, 30);
    }
  });

  // 6. Draw Player
  ctx.fillStyle = '#3498db';
  ctx.fillRect(canvas.width / 2 - 15, canvas.height / 2 - 15, 30, 30);

  update();
  animationFrameId = requestAnimationFrame(draw);
};

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('keyup', handleKeyUp);
  update();
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
  window.removeEventListener('keyup', handleKeyUp);
  cancelAnimationFrame(animationFrameId);
});
</script>

<template>
  <div class="game-container">
    <canvas ref="canvasRef" width="800" height="600"></canvas>

    <div v-if="isInventoryOpen" class="inventory-overlay">
      <div class="inventory-window">
        <div class="header">
          <h2>Inventory</h2>
          <button @click="isInventoryOpen = false">X</button>
        </div>

        <div class="inventory-content">
          <div class="equipment-grid">
            <h3>Equipment</h3>
            <div v-for="(item, slotName) in equipmentSlots" :key="slotName" class="slot-item">
              <span class="slot-name">{{ slotName }}:</span>
              <span :class="['item-name', { empty: !item.name }]">
                {{ item.name || 'Empty' }}
              </span>
              <small v-if="item.name" class="item-stats">
                (DMG: {{ item.damage }}, DEF: {{ item.defense }})
              </small>
            </div>
          </div>
          <div class="backpack-section">
            <h3>Backpack</h3>
            <div class="backpack-slots">
              <div v-for="n in 20" :key="n" class="slot">
                <div v-if="playerStore.inventory[n-1]" class="item">
                  💰 <small>{{ playerStore.inventory[n - 1].name }}</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.game-container {
  position: relative;
  width: 800px;
  margin: 0 auto;
}

canvas {
  border: 4px solid #333;
  display: block;
}

.inventory-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 800px;
  height: 600px;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
}

.inventory-window {
  background: #2c3e50;
  padding: 20px;
  border: 2px solid white;
  width: 500px;
  color: white;
}

.header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.backpack-slots {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
}

.slot {
  width: 70px;
  height: 70px;
  background: #34495e;
  border: 1px solid #555;
  display: flex;
  align-items: center;
  justify-content: center;
}

.item {
  font-size: 0.7rem;
  text-align: center;
}
</style>
