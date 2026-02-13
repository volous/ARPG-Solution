import { defineStore } from "pinia";
import { ref } from "vue";

export const useGameManager = defineStore("gameManager", () => {
  const currentScene = ref('world');

  function startCombat(){
    currentScene.value = 'combat';
  }

  function returnToWorld(){
    currentScene.value = 'world';
  }

  return { currentScene, startCombat, returnToWorld };
});
