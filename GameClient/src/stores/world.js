import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useWorldStore = defineStore('world', () => {
  const tileSize = 64;
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

  const droppedItems = ref([]);

  const enemies = ref([
    {
      id: 'slime_01',
      name: 'Slime',
      x: 320, y: 192,
      hp: 20, maxHp: 20,
      isAlive: true,
      loot: { name: 'Slime Goo', id: 'item_goo', damage: 0, defense: 1 }
    }
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

  function spawnLoot(item, x, y){
    droppedItems.value.push({
      ...item,
      x,
      y,
      instanceId: Math.random().toString(36).substring(2, 9)
    });
  }

  return { map, tileSize, enemies, droppedItems, spawnLoot }
});
