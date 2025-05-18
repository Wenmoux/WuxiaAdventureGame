<template>
    <div class="player-stats">
      <h3><i class="icon-person"></i>角色状态</h3>
      <ul>
        <li v-for="(value, key) in gameStore.playerStats" :key="key">
          <strong>{{ key }}:</strong> {{ value }}
        </li>
      </ul>
    </div>
  </template>
  
  <script setup>
  import { useGameStore } from '@/stores/gameStore';
  const gameStore = useGameStore();
  </script>
  
  <style scoped>
  .icon-person::before { content: "👤"; margin-right: 5px; }
  .player-stats {
    margin-bottom: 20px;
  }
  .player-stats h3 {
    color: #e6D1B1;
    border-bottom: 1px solid #a07c5b;
    padding-bottom: 5px;
    margin-bottom: 10px;
    font-family: 'KaiTi', 'STKaiti', serif;
  }
  .player-stats ul {
    list-style: none;
    padding: 0;
    font-size: 0.9em;
  }
  .player-stats li {
    padding: 3px 0;
    color: #d0c0a0;
  }
  .player-stats strong {
    color: #e6D1B1;
  }
  </style>