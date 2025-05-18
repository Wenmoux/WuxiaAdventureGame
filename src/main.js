// src/main.js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
// 从 gameStore.js 中导入 GAME_SAVE_KEY 和 useGameStore
import { useGameStore, GAME_SAVE_KEY } from './stores/gameStore'; 
import './assets/styles/global.css' // Import global styles
const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// 在挂载应用前，确保 gameStore 被初始化
const gameStore = useGameStore(); // 这会触发 store 的 setup 函数和 initializeStore()

// 现在 GAME_SAVE_KEY 已定义
if (!localStorage.getItem(GAME_SAVE_KEY) && router.currentRoute.value.path.startsWith('/game')) {
  // 如果没有存档且用户直接访问游戏页面，可能需要引导到首页
  // router.push('/'); // 取消注释此行如果需要
  console.log("No save data found, and user is on a game page. Consider redirecting to home.");
}

app.mount('#app')

