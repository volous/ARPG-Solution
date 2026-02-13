<script setup>
import { useGameManager } from "@/stores/gameManager.js";

const gameManager = useGameManager();
</script>

<template>
  <div class="combat-overlay">
    <div class="battle-scene">
      <div class="placeholder-enemy">ENEMY</div>
      <div class="placeholder-player">PLAYER</div>
    </div>

    <div class="combat-ui">
      <button @click="console.log('Attack!')">Attack</button>
      <button @click="gameManager.endCombat()">Run</button>
    </div>
  </div>
</template>

<style scoped>
.combat-overlay {
  width: 800px;
  height: 600px;
  background: #111;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
}
.battle-scene {
  flex: 1;
  position: relative;
  border-bottom: 2px solid #444;
}

.placeholder-enemy { position: absolute; top: 100px; right: 100px; color: red; font-size: 2rem; }
.placeholder-player { position: absolute; bottom: 100px; left: 100px; color: #42b883; font-size: 2rem; }
.combat-ui { height: 150px; background: #222; display: flex; gap: 20px; padding: 20px; }
button { padding: 10px 40px; font-size: 1.2rem; cursor: pointer; }
</style>
