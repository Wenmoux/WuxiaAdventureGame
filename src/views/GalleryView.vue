<template>
    <div class="gallery-view p-2 scrollable-content">
      <h2>图鉴鉴赏</h2>
      <p v-if="unlockedCgsList.length === 0">尚未解锁任何图鉴。</p>
      <div class="cg-grid" v-else>
        <div 
          v-for="cg in gameStore.cgs" 
          :key="cg.id" 
          class="cg-item"
          :class="{ locked: !cg.unlocked }"
          @click="cg.unlocked ? selectCg(cg) : null"
        >
          <img :src="cg.unlocked ? cg.path : '/src/assets/images/cg_locked.png'" :alt="cg.name">
          <p>{{ cg.unlocked ? cg.name : '未解锁' }}</p>
        </div>
      </div>
  
      <ConfirmModal
        :show="selectedCg !== null"
        :title="selectedCg?.name"
        @close="selectedCg = null"
        :showConfirmButton="false"
        cancelText="关闭"
        modalContentClass="cg-modal-content"
      >
        <img v-if="selectedCg" :src="selectedCg.path" :alt="selectedCg.name" class="cg-modal-image">
        <p v-if="selectedCg" class="cg-modal-description">{{ selectedCg.description }}</p>
      </ConfirmModal>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
  import { useGameStore } from '@/stores/gameStore';
  import ConfirmModal from '@/components/ConfirmModal.vue';
  
  const gameStore = useGameStore();
  const selectedCg = ref(null);
  
  const unlockedCgsList = computed(() => gameStore.cgs.filter(cg => cg.unlocked));
  
  function selectCg(cg) {
    selectedCg.value = cg;
  }
  // Make sure you have a placeholder 'cg_locked.png' in src/assets/images/
  </script>
  
  <style scoped>
  .gallery-view {
    text-align: center;
    background-color: rgba(0,0,0,0.3);
  }
  .cg-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 15px;
    margin-top: 20px;
  }
  .cg-item {
    border: 1px solid #a07c5b;
    border-radius: 4px;
    padding: 10px;
    cursor: pointer;
    background-color: rgba(60, 50, 40, 0.7);
    transition: transform 0.2s ease;
  }
  .cg-item:hover:not(.locked) {
    transform: translateY(-5px);
    border-color: #e6D1B1;
  }
  .cg-item.locked {
    opacity: 0.5;
    cursor: default;
  }
  .cg-item img {
    width: 100%;
    height: 120px;
    object-fit: cover;
    border-radius: 3px;
    margin-bottom: 5px;
  }
  .cg-item p {
    margin: 0;
    font-size: 0.9em;
    color: #e6D1B1;
  }
  .cg-item.locked p {
    color: #888;
  }
  
  .cg-modal-content { /* Custom class for ConfirmModal content */
    max-width: 90vw;
    max-height: 90vh;
    overflow-y: auto;
  }
  .cg-modal-image {
    max-width: 100%;
    max-height: 70vh; /* Limit image height within modal */
    display: block;
    margin: 0 auto 15px auto;
    border-radius: 4px;
  }
  .cg-modal-description {
    text-align: center;
    color: #e0e0e0;
  }
  </style>