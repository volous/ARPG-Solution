<script setup>
import GameWorld from './components/GameWorld.vue'
import CombatScreen from './components/CombatScreen.vue'
import { useGameManager } from "@/stores/gameManager.js";

const gameManager = useGameManager();
</script>

<template>
  <GameWorld v-if="gameManager.currentScene === 'world'"/>
  <CombatScreen v-if="gameManager.currentScene === 'combat'"/>
</template>
