<template>
  <div id="app-container">
    <header class="app-header">
      <h1>江湖宝鉴</h1>
      <nav class="main-nav">
        <router-link to="/">首页</router-link>
        <router-link to="/game" v-if="gameStore.currentNodeId !== 'start' || gameInProgress">进行中</router-link>
        <router-link to="/gallery">图鉴</router-link>
        <router-link to="/achievements">成就</router-link>
        <router-link to="/settings">设置</router-link>
      </nav>
    </header>
    <main class="app-main-content">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    <footer class="app-footer">
      <p>&copy; {{ new Date().getFullYear() }} 互动文字游戏</p>
    </footer>
  </div>
</template>

<script setup>
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { useGameStore } from '@/stores/gameStore';
import { computed } from 'vue';

const gameStore = useGameStore();
const route = useRoute();

// A simple way to check if a game is considered "in progress"
// This could be more sophisticated, e.g., checking if currentNodeId is not an initial/menu node
const gameInProgress = computed(() => gameStore.currentNodeId && gameStore.currentNodeId !== 'start');

</script>

<style scoped>

#app-container {
  display: flex;
  flex-direction: column;
  /* 确保 App.vue 的根元素或其直接子元素填满 #app */
  /* #app 在 global.css 中应有 min-height: 100vh 或 height: 100vh */
  height: 100%; /* 或者 min-height: 100% 如果 #app 有固定高度 */
  background: url('/src/assets/images/background_scroll.jpg') no-repeat center center;
  background-size: cover;
  border: 2px solid #a07c5b;
  box-shadow: inset 0 0 15px rgba(0,0,0,0.5);
}

.app-main-content {
  flex-grow: 1; /* 让主内容区占据剩余空间 */
  overflow-y: auto; /* 如果App.vue的结构导致这里需要滚动，则保留，否则可以尝试hidden */
  /* 关键: 如果 router-view 的直接子元素 (如 GameView.vue 的根 div) 需要撑满此区域，
     那么 .app-main-content 自身也需要一个明确的 flex 布局或高度。
     通常 flex-grow: 1 配合父容器的 flex 布局是足够的。
  */
  display: flex; /* 新增：让 router-view 能够撑满 */
  flex-direction: column; /* 新增 */
}
.app-header {
  background-color: rgba(40, 30, 20, 0.85); /* Dark wood color, semi-transparent */
  padding: 10px 20px;
  text-align: center;
  border-bottom: 2px solid #a07c5b; /* Ornate border */
}

.app-header h1 {
  margin: 0;
  color: #e6D1B1; /* Parchment color */
  font-family: 'KaiTi', 'STKaiti', '华文楷体', serif; /* Chinese calligraphy-like font */
  font-size: 2em;
}

.main-nav {
  margin-top: 10px;
}

.main-nav a {
  margin: 0 10px;
  color: #c0a080; /* Bronze color */
  text-decoration: none;
  font-weight: bold;
  padding: 5px 10px;
  border-radius: 4px;
  transition: background-color 0.3s, color 0.3s;
}

.main-nav a:hover,
.main-nav a.router-link-exact-active {
  color: #FFF;
  background-color: #7a5c3f; /* Darker bronze */
}


.app-footer {
  background-color: rgba(40, 30, 20, 0.85);
  padding: 8px;
  text-align: center;
  font-size: 0.8em;
  color: #b09070;
  border-top: 1px solid #a07c5b;
}

/* Page transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>