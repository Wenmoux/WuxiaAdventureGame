<template>
    <div class="achievements-view p-2 scrollable-content">
      <h2>成就一览</h2>
      <p>已解锁 {{ unlockedCount }} / {{ totalCount }} 个成就</p>
      <ul class="achievement-list">
        <li 
          v-for="ach in gameStore.achievements" 
          :key="ach.id" 
          class="achievement-item"
          :class="{ unlocked: ach.unlocked }"
        >
          <span class="achievement-icon">{{ ach.unlocked ? '🏆' : '❓' }}</span>
          <div class="achievement-details">
            <h3>{{ ach.name }}</h3>
            <p>{{ ach.description }}</p>
          </div>
          <span class="achievement-status">{{ ach.unlocked ? '已达成' : '未达成' }}</span>
        </li>
      </ul>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue';
  import { useGameStore } from '@/stores/gameStore';
  
  const gameStore = useGameStore();
  
  const unlockedCount = computed(() => gameStore.achievements.filter(a => a.unlocked).length);
  const totalCount = computed(() => gameStore.achievements.length);
  </script>
  
  <style scoped>
  .achievements-view {
    text-align: center;
    background-color: rgba(0,0,0,0.3);
  }
  .achievement-list {
    list-style: none;
    padding: 0;
    margin-top: 20px;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
  }
  .achievement-item {
    background-color: rgba(60, 50, 40, 0.7);
    border: 1px solid #a07c5b;
    border-radius: 5px;
    padding: 15px;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    text-align: left;
  }
  .achievement-item.unlocked {
    border-left: 5px solid #ffd700; /* Gold border for unlocked */
    background-color: rgba(80, 70, 60, 0.8);
  }
  .achievement-icon {
    font-size: 2em;
    margin-right: 15px;
  }
  .achievement-details {
    flex-grow: 1;
  }
  .achievement-details h3 {
    margin: 0 0 5px 0;
    color: #e6D1B1;
  }
  .achievement-details p {
    margin: 0;
    font-size: 0.9em;
    color: #c0a080;
  }
  .achievement-item.unlocked .achievement-details h3 {
    color: #ffd700;
  }
  .achievement-item.unlocked .achievement-details p {
    color: #e6D1B1;
  }
  .achievement-status {
    font-weight: bold;
    color: #aaa;
  }
  .achievement-item.unlocked .achievement-status {
    color: #90EE90; /* Light Green */
  }
  </style>