import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useWorldStore = defineStore('world', () => {
  const map = ref([
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 1, 1, 0, 0, 0, 0, 1],
    [1, 0, 0, 1, 1, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ]);

  const triggers = ref([
    {
      x: 5, y: 5,
      type: 'portal',
      targetMap: 'dungeon_level_1',
      spawnPos: { x: 5, y: 8 }
    },
    {
      x: 3, y: 3,
      type: 'combat',
      enemyId: 'slime_01'
    }
  ]);

  return { map, triggers, tileSize: 64 }
});
