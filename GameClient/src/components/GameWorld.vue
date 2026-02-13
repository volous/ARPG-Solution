<script setup>
  import { ref, onMounted, onUnmounted } from 'vue';
  import { useWorldStore } from "../stores/world.js";
  import { usePlayerStore } from "../stores/player.js";
  import { useGameManager } from "../stores/gameManager.js";

  const cavnasRef = ref(null);
  const isInventoryOpen = ref(false);
  const playerStore = usePlayerStore();
  const worldStore = useWorldStore();
  const gameManager = useGameManager();
  const keys = {};

  const handleKeyDown = (e) => {
    if(e.key.toLowerCase() === 'i'){
      isInventoryOpen.value = !isInventoryOpen.value;
      return;
    }
    keys[e.key.toLowerCase()] = true;
  };
  const handleKeyUp = (e) => {keys[e.key.toLowerCase()] = false};
  const update = () => {
    if(gameManager.currentScene !== 'world'){
      for(let key in keys) {
        keys[key] = false;
      }
      return;
    }

    const oldX = playerStore.position.x;
    const oldY = playerStore.position.y;

    if(keys['w'] || keys['arrowup']) {
      const newY = playerStore.position.y - playerStore.speed;
      if (isWalkable(playerStore.position.x - 15, newY - 16) &&
        isWalkable(playerStore.position.x + 15, newY - 16)) {
        playerStore.position.y = newY;
      }
    }

    // DOWN (Check Bottom Edge)
    if(keys['s'] || keys['arrowdown']) {
      const newY = playerStore.position.y + playerStore.speed;
      if (isWalkable(playerStore.position.x - 15, newY + 16) &&
        isWalkable(playerStore.position.x + 15, newY + 16)) {
        playerStore.position.y = newY;
      }
    }

    // LEFT (Check Left Edge)
    if(keys['a'] || keys['arrowleft']) {
      const newX = playerStore.position.x - playerStore.speed;
      if (isWalkable(newX - 16, playerStore.position.y - 15) &&
        isWalkable(newX - 16, playerStore.position.y + 15)) {
        playerStore.position.x = newX;
      }
    }

    // RIGHT (Check Right Edge)
    if(keys['d'] || keys['arrowright']) {
      const newX = playerStore.position.x + playerStore.speed;
      if (isWalkable(newX + 16, playerStore.position.y - 15) &&
        isWalkable(newX + 16, playerStore.position.y + 15)) {
        playerStore.position.x = newX;
      }
    }

    checkTriggers(oldX, oldY);
  };

  const isWalkable = (targetX, targetY) => {
    const tileX = Math.floor((targetX) / worldStore.tileSize);
    const tileY = Math.floor((targetY) / worldStore.tileSize);
    if(tileX < 0 || tileX >= worldStore.map[0].length ||
      tileY < 0 || tileY >= worldStore.map.length){
      return false;
    }
    return worldStore.map[tileY][tileX] === 0;
  }

  const checkTriggers = (backX, backY) => {
    const tileX = Math.floor(playerStore.position.x / worldStore.tileSize);
    const tileY = Math.floor(playerStore.position.y / worldStore.tileSize);
    if(tileX === 5 && tileY === 3){
      playerStore.setLastSafePosition(backX, backY);
      gameManager.startCombat();
    }
  }

  const draw = (ctx) => {
    update();
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Calculate camera offset
    const cameraX = playerStore.position.x - ctx.canvas.width / 2;
    const cameraY = playerStore.position.y - ctx.canvas.height / 2;

    // Draw map array
    worldStore.map.forEach((row, y) => {
      row.forEach((tile, x) => {
        const drawX = x * worldStore.tileSize - cameraX;
        const drawY = y * worldStore.tileSize - cameraY;

        if(drawX > -worldStore.tileSize && drawX < ctx.canvas.width &&
           drawY > -worldStore.tileSize && drawY < ctx.canvas.height)
        {
          ctx.fillStyle = tile ? '#555' : '#2d5a27';
          ctx.fillRect(drawX, drawY, worldStore.tileSize, worldStore.tileSize);

          ctx.strokeStyle = '222';
          ctx.strokeRect(drawX, drawY, worldStore.tileSize, worldStore.tileSize);
        }
      });
    });

    // --- Draw Player ---
    ctx.fillStyle = '#42b883';
    // Center the player in the square
    ctx.fillRect(
      playerStore.position.x - cameraX - 16,
      playerStore.position.y - cameraY - 16,
      32, 32
    );

    requestAnimationFrame(() => draw(ctx));
  };

  onMounted(() => {
    for(let key in keys) {
      keys[key] = false;
    }

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    const ctx = cavnasRef.value.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    draw(ctx);
  });

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyDown);
    window.removeEventListener('keyup', handleKeyUp);
  });
</script>

<template>
  <div class="world-container">
    <canvas ref="cavnasRef" width="800" height="600"></canvas>
    <div class="ui-layer">
      <p>Position: {{Math.floor(playerStore.position.x)}}, {{Math.floor(playerStore.position.y)}}</p>
    </div>

    <div v-if="isInventoryOpen" class="inventory-overlay">
      <div class="inventory-window">
        <div class="header">
          <h2>Equipment</h2>
          <button @click="isInventoryOpen = false">X</button>
        </div>

        <div class="inventory-content">
          <div class="equipment-grid">
            <h3>Slots</h3>
            <div v-for="(val, slot) in playerStore.equipment" :key="slot" class="slot-item">
              <span class="slot-name">{{slot}}:</span>
              <span class="item-name" :class="{ 'empty': !val || val === 'None' }">
                {{val && val !== 'None' ? val : '---'}}
              </span>
            </div>
          </div>

          <div class="items-grid">
            <h3>Backpack</h3>
            <div class="backpack-slots">
              <div v-for="n in 20" :keys="n" class="item-slot">
                {{playerStore.inventory[n - 1] || ''}}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
canvas {
  background-color: #242424;
  border: 4px solid #1a1a1a;
  display: block;
  margin: 0 auto;
  image-rendering: pixelated;
}
.ui-layer {
  color: white;
  text-align: center;
  font-family: monospace;
}

.inventory-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 800px;
  height: 600px;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
}

.inventory-window {
  background: #2c3e50;
  border: 3px solid #ecf0f1;
  width: 500px;
  padding: 20px;
  color: white;
}

.header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #555; margin-bottom: 10px; }

.inventory-content { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }

.equipment-grid .slot-item { font-size: 0.8rem; margin-bottom: 5px; display: flex; justify-content: space-between; }
.slot-name { color: #bdc3c7; text-transform: capitalize; }
.item-name { color: #f1c40f; font-weight: bold; }
.item-name.empty { color: #7f8c8d; font-weight: normal; }

.backpack-slots {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 5px;
}
.item-slot {
  width: 40px;
  height: 40px;
  background: #1a1a1a;
  border: 1px solid #555;
}
</style>
