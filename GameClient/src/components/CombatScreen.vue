<script setup>
import { useGameManager } from "@/stores/gameManager.js";
import { usePlayerStore } from "@/stores/player.js";
import { useWorldStore } from "@/stores/world.js";

const gameManager = useGameManager();
const playerStore = usePlayerStore();
const worldStore = useWorldStore();

const handleAttack = () => {
  if(gameManager.activeEnemy){
    gameManager.activeEnemy.hp -= playerStore.totalDamage;
    console.log(`${gameManager.activeEnemy.name} took damage! Remaining HP: ${gameManager.activeEnemy.hp}`);
    if(gameManager.activeEnemy.hp <= 0){
      if(gameManager.activeEnemy.loot){
        worldStore.spawnLoot(
          gameManager.activeEnemy.loot,
          gameManager.activeEnemy.x,
          gameManager.activeEnemy.y
        );
      }
      gameManager.activeEnemy.isAlive = false;
      alert(`${gameManager.activeEnemy.name} defeated!`);
      gameManager.endCombat();
    }
  }
};
</script>

<template>
  <div class="combat-overlay">
    <div class="battle-scene">
      <div v-if="gameManager.activeEnemy" class="placeholder-enemy">
        {{ gameManager.activeEnemy.name }}
        <div class="hp-bar">
          HP: {{ gameManager.activeEnemy.hp }} / {{ gameManager.activeEnemy.maxHp }}
        </div>
      </div>

      <div class="placeholder-player">
        PLAYER
        <div class="stats">DMG: {{ playerStore.totalDamage }}</div>
      </div>
    </div>

    <div class="combat-ui">
      <button @click=handleAttack>Attack</button>
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
.hp-bar {
  font-size: 1rem;
  color: #ff4757;
  margin-top: 10px;
  background: rgba(255, 255, 255, 0.1);
  padding: 5px;
  border-radius: 4px;
}
.placeholder-enemy {
  position: absolute;
  top: 100px;
  right: 100px;
  color: #ff4757;
  font-size: 2rem;
  text-align: center;
}
.placeholder-player { position: absolute; bottom: 100px; left: 100px; color: #42b883; font-size: 2rem; }
.combat-ui { height: 150px; background: #222; display: flex; gap: 20px; padding: 20px; }
button { padding: 10px 40px; font-size: 1.2rem; cursor: pointer; }
</style>
