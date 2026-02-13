import { defineStore } from 'pinia';
import { ref } from 'vue';

export const usePlayerStore = defineStore('player', () =>{
  const position = ref({x: 320, y: 320});
  const speed = 3;

  const equipment = ref({
    weapon: null,
    offHand: null,
    helmet: null,
    bodyArmor: null,
    boots: null,
    gloves: null,
    ring1: null,
    ring2: null,
    amulet: null,
    belt: null
  });

  const inventory = ref([]);

  return { position, speed, equipment, inventory };
});
