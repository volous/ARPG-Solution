<script setup>
  import { ref, onMounted, onUnmounted } from 'vue';
  import { useWorldStore } from "../stores/world.js";
  import { usePlayerStore } from "../stores/player.js";

  const cavnasRef = ref(null);
  const playerStore = usePlayerStore();
  const worldStore = useWorldStore();
  const keys = {};
  const handleKeyDown = (e) => {keys[e.key.toLowerCase()] = true};
  const handleKeyUp = (e) => {keys[e.key.toLowerCase()] = false};
  const update = () => {
    // UP (Check Top Edge)
    if(keys['w'] || keys['arrowup']) {
      const newY = playerStore.position.y - playerStore.speed;
      // Check Top-Left and Top-Right corners
      // We use -16 for the Top edge (Leading edge)
      // We use +/- 15 for the Width (to avoid sticking to side walls)
      if (isWalkable(playerStore.position.x - 15, newY - 16) &&
        isWalkable(playerStore.position.x + 15, newY - 16)) {
        playerStore.position.y = newY;
      }
    }

    // DOWN (Check Bottom Edge)
    if(keys['s'] || keys['arrowdown']) {
      const newY = playerStore.position.y + playerStore.speed;
      // Check Bottom-Left and Bottom-Right corners
      // We use +16 for the Bottom edge
      if (isWalkable(playerStore.position.x - 15, newY + 16) &&
        isWalkable(playerStore.position.x + 15, newY + 16)) {
        playerStore.position.y = newY;
      }
    }

    // LEFT (Check Left Edge)
    if(keys['a'] || keys['arrowleft']) {
      const newX = playerStore.position.x - playerStore.speed;
      // Check Top-Left and Bottom-Left corners
      // We use -16 for the Left edge
      if (isWalkable(newX - 16, playerStore.position.y - 15) &&
        isWalkable(newX - 16, playerStore.position.y + 15)) {
        playerStore.position.x = newX;
      }
    }

    // RIGHT (Check Right Edge)
    if(keys['d'] || keys['arrowright']) {
      const newX = playerStore.position.x + playerStore.speed;
      // Check Top-Right and Bottom-Right corners
      // We use +16 for the Right edge
      if (isWalkable(newX + 16, playerStore.position.y - 15) &&
        isWalkable(newX + 16, playerStore.position.y + 15)) {
        playerStore.position.x = newX;
      }
    }
  };

  const isWalkable = (targetX, targetY) => {
    const tileX = Math.floor((targetX) / worldStore.tileSize);
    const tileY = Math.floor((targetY) / worldStore.tileSize);
    if(tileY < 0 || tileY >= worldStore.map.length || tileX < 0 || tileX >= worldStore.map[0].length){
      return false;
    }
    return worldStore.map[tileY][tileX] === 0;
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
</style>
