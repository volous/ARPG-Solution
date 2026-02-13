import { defineStore } from "pinia";
import { ref } from "vue";
import { usePlayerStore } from "./player.js";

export const useGameManager = defineStore("gameManager", () => {
  const currentScene = ref('world');
  const playerStore = usePlayerStore();

  function startCombat(){
    currentScene.value = 'combat';
  }

  function endCombat(){
    currentScene.value = 'world';
    playerStore.position.y += 64;
  }

  return { currentScene, startCombat, endCombat };
});
