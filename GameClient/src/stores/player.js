import { defineStore } from 'pinia';
import {computed, ref} from 'vue';

export const usePlayerStore = defineStore('player', () =>{
  const position = ref({x: 320, y: 320});
  const lastSafePosition = ref({x: 320, y: 320});
  const speed = 3;
  const activeKeys = ref({});

  const equipment = ref({});

  const totalDamage = computed(() => {
    return Object.values(equipment.value).reduce((sum, item) => {
      return sum + (item && typeof item === 'object' ? (item.damage || 0) : 0);
    }, 0);
  });
  const totalDefense = computed(() => {
    return Object.values(equipment.value).reduce((sum, item) => sum + (item?.defense || 0), 0);
  });

  const fetchEquipment = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/equipment/my-gear');
      if(response.ok){
        equipment.value = await response.json();
        console.log("Gear loaded: ", equipment.value);
      }
    } catch (err) {
      console.error("API connection failed. Is the C# app running?", err);
    }
  };

  const inventory = ref([]);

  function setLastSafePosition(x, y){
    lastSafePosition.value = {x, y};
  }

  function clearInput(){
    activeKeys.value = {};
  }

  return {
    position,
    speed,
    activeKeys,
    equipment,
    totalDamage,
    totalDefense,
    inventory,
    fetchEquipment,
    clearInput,
    lastSafePosition,
    setLastSafePosition
  };
});
