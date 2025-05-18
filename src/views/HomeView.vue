<template>
    <div class="home-view p-2">
      <h2>剑指风云录：青萍之末</h2>
      <p>开始你的武侠冒险之旅！</p>
      <div class="menu-options">
        <button @click="startNewGame">新的开始</button>
        <button @click="showLoadGameModal = true" :disabled="availableSlots.length === 0">读取进度</button>
        <router-link to="/gallery" class="button-like">图鉴鉴赏</router-link>
        <router-link to="/achievements" class="button-like">成就一览</router-link>
        <router-link to="/settings" class="button-like">游戏设置</router-link>
      </div>
  
      <ConfirmModal 
        :show="showLoadGameModal" 
        title="读取进度"
        @close="showLoadGameModal = false"
        :showConfirmButton="false"
        confirmText="读取"
        cancelText="关闭"
      >
        <div v-if="availableSlots.length > 0">
          <p>选择一个存档槽位加载：</p>
          <ul>
            <li v-for="slot in availableSlots" :key="slot" class="slot-item">
              <span>{{ slot }}</span>
              <button @click="loadSelectedGame(slot)">加载</button>
            </li>
          </ul>
        </div>
        <p v-else>没有可用的存档。</p>
      </ConfirmModal>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { useGameStore } from '@/stores/gameStore';
  import { loadGame, listSaveSlots } from '@/services/saveLoad';
  import ConfirmModal from '@/components/ConfirmModal.vue';
  
  const router = useRouter();
  const gameStore = useGameStore();
  const showLoadGameModal = ref(false);
  const availableSlots = ref([]);
  
  onMounted(() => {
    availableSlots.value = listSaveSlots();
  });
  
  function startNewGame() {
    gameStore.resetGame();
    router.push('/game');
  }
  
  function loadSelectedGame(slotName) {
    if (loadGame(slotName)) {
      router.push('/game');
    }
    showLoadGameModal.value = false;
  }
  </script>
 <style scoped>
 .home-view {
   text-align: center;
   display: flex;
   flex-direction: column;
   align-items: center;
   justify-content: center;
   height: 100%;
   background-color: rgba(0,0,0,0.3); /* Slight overlay */
 }
 .menu-options {
   margin-top: 20px;
   display: flex;
   flex-direction: column;
   gap: 10px;
   width: 250px; /* 父容器宽度固定 */
 }
 
 /* --- 关键修改开始 --- */
 .menu-options button, 
 .menu-options .button-like {
   width: 100%; /* 确保它们都想填满父容器 */
   padding: 10px 15px; /* 统一内边距 */
   border: 1px solid transparent; /* 统一边框，即使 router-link 默认可能没有 */
   box-sizing: border-box; /* 这是关键！让 width 包含 padding 和 border */
   text-align: center; /* 确保文本居中，对于 <a> 标签可能需要 */
   text-decoration: none; /* 移除 <a> 标签的下划线 */
   color: inherit; /* 让 <a> 标签继承父元素的颜色，如果需要 */
   background-color: #f0f0f0; /* 示例背景色，可以替换成你的按钮样式 */
   cursor: pointer; /* 确保它们都有指针手势 */
   display: block; /* 或者 inline-block，确保宽度生效并能设置内外边距 */
   /* 如果是 button 元素，可能还需要重置一些默认外观 */
   -webkit-appearance: none;
   -moz-appearance: none;
   appearance: none;
   font-family: inherit; /* 继承字体 */
   font-size: inherit; /* 继承字号 */
   line-height: inherit; /* 继承行高，有助于垂直对齐 */
 }
 
 .menu-options button:disabled {
   opacity: 0.5;
   cursor: not-allowed;
 }
 
 .menu-options .button-like:hover,
 .menu-options button:not(:disabled):hover {
   background-color: #e0e0e0; /* 示例悬停效果 */
 }
 /* --- 关键修改结束 --- */
 
 .slot-item {
   display: flex;
   justify-content: space-between;
   align-items: center;
   padding: 8px;
   border-bottom: 1px solid #555;
 }
 .slot-item:last-child {
   border-bottom: none;
 }
 ul {
   list-style-type: none;
   padding: 0;
 }
 </style>