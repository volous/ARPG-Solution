<script setup>
import {onMounted} from 'vue'
import {usePlayerStore} from "@/stores/player.js";
import GameWorld from './components/GameWorld.vue'
import CombatScreen from './components/CombatScreen.vue'
import {useGameManager} from "@/stores/gameManager.js";

const gameManager = useGameManager();
const playerStore = usePlayerStore();

onMounted(() => {
  playerStore.fetchEquipment();
});
</script>

<template>
  <GameWorld v-if="gameManager.currentScene === 'world'"/>
  <CombatScreen v-if="gameManager.currentScene === 'combat'"/>
</template>
