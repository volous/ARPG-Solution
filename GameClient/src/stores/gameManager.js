import { defineStore } from "pinia";
import { ref } from "vue";
import { usePlayerStore } from "./player.js";

export const useGameManager = defineStore("gameManager", () => {
  const currentScene = ref('world');
  const activeEnemy = ref(null);
  const playerStore = usePlayerStore();

  function startCombat(enemy){
    activeEnemy.value = enemy;
    currentScene.value = 'combat';
  }

  function endCombat(){
    activeEnemy.value = null;
    currentScene.value = 'world';
    playerStore.position.x = playerStore.lastSafePosition.x;
    playerStore.position.y = playerStore.lastSafePosition.y;
    playerStore.clearInput();
  }

  return { currentScene, activeEnemy, startCombat, endCombat };
});
