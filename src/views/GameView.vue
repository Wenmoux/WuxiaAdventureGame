<template>
    <div class="game-view">
      <div class="game-layout">
        <!-- 左侧面板: 角色状态 & 包裹 -->
        <div class="left-panel styled-scrollbar">
          <!-- 角色属性 -->
          <div class="panel-section player-stats-section">
            <h3 class="panel-title"><i class="icon-user"></i><span>角色状态</span></h3>
            <div class="stats-list">
              <div v-for="(value, key) in gameStore.playerStats" :key="key" class="stat-item">
                <span class="stat-name">{{ key }}:</span>
                <span class="stat-value">{{ value }}</span>
                <div v-if="isStatWithMax(key)" class="stat-progress-bar-container">
                  <div class="stat-progress-bar" :style="{ width: getStatPercentage(key) + '%' }" :class="getStatBarClass(key)"></div>
                </div>
              </div>
            </div>
          </div>
  
          <!-- 包裹 - 网格图标布局 -->
          <div class="panel-section inventory-section">
            <h3 class="panel-title"><i class="icon-bag"></i><span>包裹</span></h3>
            
            <div v-if="gameStore.inventory.length > 0">
           
   
                <div class="item-grid">
                  <div
                    v-for="item in gameStore.inventory"
                    :key="item.id"
                    class="item-icon-container"
                    :class="{ 'equipped-item-glow': isEquipped(item) }"
                    @mouseenter="showItemTooltip(item, $event)"
                    @mouseleave="hideItemTooltip"
                    @click="handleItemClick(item, $event)"
                    @contextmenu.prevent="showItemContextMenu(item, $event)"
                  >
                    <img v-if="item.image" :src="item.image" :alt="item.name" class="item-grid-icon"/>
                    <span v-else class="item-grid-placeholder">{{ item.name.charAt(0) }}</span>
                    <span v-if="isEquipped(item)" class="equipped-marker">E</span>
                  </div>
         
              </div>
              
              <!-- 悬浮物品详情 Tooltip -->
              <div v-if="tooltip.visible" class="item-tooltip" :style="tooltip.style">
                  <h4>{{ tooltip.item.name }} <span class="item-type-chip">{{ tooltip.item.type }}</span></h4>
                  <p>{{ tooltip.item.description }}</p>
                  <div v-if="tooltip.item.damageBonus">武力加成: +{{ tooltip.item.damageBonus }}</div>
                  <div v-if="tooltip.item.defenseBonus">防御加成: +{{ tooltip.item.defenseBonus }}</div>
                  <div v-if="tooltip.item.effects && tooltip.item.effects.length > 0">
                      效果:
                      <ul> <li v-for="(effect, i) in tooltip.item.effects" :key="i"> {{ effect.stat || '未知' }} {{ effect.value > 0 ? '+' : '' }}{{ effect.value }} </li> </ul>
                  </div>
                  <div v-if="tooltip.item.skillId && gameStore.skillsData[tooltip.item.skillId]"> 可习得: {{ gameStore.skillsData[tooltip.item.skillId].name }} </div>
              </div>
  
              <!-- 物品上下文菜单 -->
              <div v-if="contextMenu.visible" class="item-context-menu" :style="contextMenu.style" @mouseleave="hideItemContextMenu">
                  <ul>
                      <li @click="viewItemDetails(contextMenu.item)">详情</li>
                      <li v-if="contextMenu.item.type === '消耗品'" @click="useContextItem">使用</li>
                      <li v-if="contextMenu.item.type === '武器' || contextMenu.item.type === '防具'">
                          <span v-if="isEquipped(contextMenu.item)" @click="unequipContextItem">卸下</span>
                          <span v-else @click="equipContextItem">装备</span>
                      </li>
                      <li v-if="contextMenu.item.type === '武学秘籍' && !gameStore.learnedSkills.has(contextMenu.item.skillId)" @click="learnSkillContextItem">学习</li>
                  </ul>
              </div>
            </div>
            <p v-else class="empty-text">空空如也...</p>
          </div>
  
          <!-- 已学技能 -->
          <div class="panel-section skills-section" v-if="gameStore.learnedSkills.size > 0">
            <h3 class="panel-title"><i class="icon-skill"></i><span>已学技能</span></h3>
            <ul class="skill-list">
              <li v-for="skillId in Array.from(gameStore.learnedSkills)" :key="skillId" :title="gameStore.skillsData[skillId]?.description" class="list-item skill-item">
                <span class="skill-name">{{ gameStore.skillsData[skillId]?.name || skillId }}</span>
              </li>
            </ul>
          </div>
  
          <!-- 人物好感 -->
          <div class="panel-section affection-section" v-if="Object.keys(filteredCharacterAffection).length > 0">
            <h3 class="panel-title"><i class="icon-heart"></i><span>人物好感</span></h3>
            <ul class="affection-list">
              <li v-for="(affection, charId) in filteredCharacterAffection" :key="charId" class="list-item affection-item">
                <span class="char-avatar">{{ getCharacterDisplayName(charId).charAt(0) }}</span>
                <div class="affection-details">
                  <span class="char-name">{{ getCharacterDisplayName(charId) }}</span>
                  <div class="affection-bar-container">
                      <div class="affection-bar" :style="{ width: getAffectionPercentage(affection) + '%' }" :class="getAffectionClass(affection)"></div>
                  </div>
                  <span class="affection-level">{{ getAffectionLevelText(affection) }} ({{ affection }})</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
  
        <!-- 中间面板 -->
        <div class="center-panel scrollable-content styled-scrollbar" ref="storyArea">
          <div v-if="gameStore.currentNode" class="story-content-wrapper">
            <h2 class="node-title">{{ gameStore.currentNode.title }}</h2>
            <img v-if="gameStore.currentNode.image" :src="gameStore.currentNode.image" alt="场景图片" class="scene-image"/>
            <div class="story-text" v-html="gameStore.currentNode.text"></div>
            <div v-if="!gameStore.isGameOver && gameStore.currentNode.choices && gameStore.currentNode.choices.length > 0" class="choices-container">
              <h3 class="choices-title">你的选择:</h3>
              <div class="choices-grid">
                <button v-for="(choice, index) in gameStore.currentNode.choices" :key="index" @click="handleChoice(choice)" :disabled="gameStore.isChoiceDisabled(choice)" :title="gameStore.getChoiceDisabledReason(choice) || choice.description || ''" class="choice-button" :class="{ 'disabled-choice': gameStore.isChoiceDisabled(choice) }">
                  <span class="choice-text">{{ choice.text }}</span>
                  <small v-if="gameStore.isChoiceDisabled(choice)" class="choice-tooltip-inline">{{ gameStore.getChoiceDisabledReason(choice) }}</small>
                </button>
              </div>
            </div>
            <div v-else-if="!gameStore.isGameOver && (!gameStore.currentNode.choices || gameStore.currentNode.choices.length === 0) && !gameStore.currentNode.isEnding" class="waiting-container">
              <p class="waiting-text">剧情正在发展...</p>
            </div>
            <div v-if="gameStore.isGameOver && gameStore.currentNode?.isEnding" class="ending-message">
              <h3 class="ending-title">{{ gameStore.currentNode.endingTitle || '游戏结束' }}</h3>
              <img v-if="gameStore.currentNode.cg" :src="gameStore.currentNode.cg" alt="结局CG" class="ending-cg"/>
              <p class="ending-text">你的旅程到此结束。</p>
              <button @click="goHome" class="action-button home-button">返回首页</button>
            </div>
            <div v-else-if="gameStore.isGameOver && gameStore.playerStats.体力 <= 0 && !gameStore.currentNode?.isEnding" class="ending-message">
              <h3 class="ending-title death-title">力竭而亡</h3>
              <p class="ending-text">你的体力耗尽，倒在了路上...</p>
              <button @click="goHome" class="action-button home-button">返回首页</button>
            </div>
          </div>
          <div v-else class="loading-container">
            <p>加载中或等待游戏开始...</p>
          </div>
        </div>
  
        <!-- 右侧面板 -->
        <div class="right-panel styled-scrollbar"> 
          <h3 class="panel-title"><i class="icon-scroll"></i><span>江湖日志</span></h3>
          <ul ref="logListElement" class="log-list-container"> 
            <li v-for="(log, index) in gameStore.storyLog" :key="index" :class="`log-entry log-${log.type}`">
              <span class="log-timestamp">[{{ log.timestamp }}]</span>
              <span class="log-text-content">{{ log.text }}</span> {/* 使用 span 包裹文本内容 */}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, watch, nextTick, onMounted, computed, reactive, onUnmounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { useGameStore } from '@/stores/gameStore';
  import { storyData } from '@/gameData/story'; // 确保导入 storyData 以便在 onMounted 中检查
  
  const gameStore = useGameStore();
  const router = useRouter();
  const storyArea = ref(null);
  const logListElement = ref(null);
  
  const tooltip = reactive({ visible: false, item: null, style: {} });
  const contextMenu = reactive({ visible: false, item: null, style: {} });
  
  // --- 属性进度条 ---
  const statMaxValues = {体力: 100, 当前内力: 100}; // 可根据游戏设计调整
  function isStatWithMax(statKey) { return statMaxValues.hasOwnProperty(statKey) || statKey === '当前内力'; }
  function getStatPercentage(statKey) {
    const currentValue = gameStore.playerStats[statKey];
    let maxValue;
    if (statKey === '当前内力') maxValue = gameStore.playerStats.内力上限 > 0 ? gameStore.playerStats.内力上限 : 1; // 防止除以0
    else maxValue = statMaxValues[statKey] || 100; // 默认最大值100
    return Math.max(0, Math.min((currentValue / maxValue) * 100, 100));
  }
  function getStatBarClass(statKey) {
    if (statKey === '体力') return 'health-bar';
    if (statKey === '当前内力') return 'mana-bar';
    return 'generic-bar';
  }
  
  // --- 物品分类与交互 ---
  const categorizedInventory = computed(() => {
    const categories = { '武器': [], '防具': [], '消耗品': [], '武学秘籍': [], '关键物品': [], '普通物品': [] };
    gameStore.inventory.forEach(item => { (categories[item.type] || categories['普通物品']).push(item); });
    return Object.fromEntries(Object.entries(categories).filter(([_, v]) => v.length > 0));
  });
  function getCategoryDisplayName(categoryKey) {
    const names = { '武器': '神兵利器', '防具': '护身宝甲', '消耗品': '丹药符篆', '武学秘籍': '武功秘籍', '关键物品': '江湖信物', '普通物品': '杂项物品' };
    return names[categoryKey] || categoryKey;
  }
  function isEquipped(item) {
    if (!item) return false;
    return (item.type === '武器' && gameStore.equippedWeapon?.id === item.id) ||
           (item.type === '防具' && gameStore.equippedArmor?.id === item.id);
  }
  
  function showItemTooltip(item, event) {
    if (contextMenu.visible) hideItemContextMenu();
    tooltip.item = item;
    tooltip.visible = true;
    const rect = event.currentTarget.getBoundingClientRect();
    const panelRect = event.currentTarget.closest('.left-panel').getBoundingClientRect();
    
    let top = rect.bottom - panelRect.top + 8; // 在物品下方显示
    let left = rect.left - panelRect.left + rect.width / 2; // 在物品下方居中
  
    const tooltipElement = document.querySelector('.item-tooltip'); // 获取tooltip元素以估算尺寸
    const tooltipWidth = tooltipElement?.offsetWidth || 240; // 默认240px
    const tooltipHeight = tooltipElement?.offsetHeight || 180; // 默认180px
  
    // 边界检测
    if (left + tooltipWidth / 2 > panelRect.width) { // 如果右侧超出
      left = panelRect.width - tooltipWidth / 2 - 5;
    }
    if (left - tooltipWidth / 2 < 0) { // 如果左侧超出
      left = tooltipWidth / 2 + 5;
    }
    if (top + tooltipHeight > panelRect.height) { // 如果下方超出，尝试在上方显示
      top = rect.top - panelRect.top - tooltipHeight - 8;
    }
    top = Math.max(0, top); // 防止顶部超出
  
    tooltip.style = { top: `${top}px`, left: `${left}px`, transform: 'translateX(-50%)' };
  }
  function hideItemTooltip() {
    setTimeout(() => {
      const tooltipEl = document.querySelector('.item-tooltip');
      if (tooltipEl && !tooltipEl.matches(':hover')) { // 仅当鼠标不在tooltip上时隐藏
        tooltip.visible = false;
        tooltip.item = null;
      }
    }, 150); // 稍作延迟，允许鼠标移入tooltip
  }
  
  function showItemContextMenu(item, event) {
    hideItemTooltip();
    contextMenu.item = item;
    contextMenu.visible = true;
    const panelRect = event.currentTarget.closest('.left-panel').getBoundingClientRect();
    let top = event.clientY - panelRect.top;
    let left = event.clientX - panelRect.left;
  
    const menuElement = document.querySelector('.item-context-menu');
    const menuWidth = menuElement?.offsetWidth || 150;
    const menuHeight = menuElement?.offsetHeight || 120;
  
    if (left + menuWidth > panelRect.width) left = panelRect.width - menuWidth - 5;
    if (top + menuHeight > panelRect.height) top = panelRect.height - menuHeight - 5;
    left = Math.max(0, left);
    top = Math.max(0, top);
  
    contextMenu.style = { top: `${top}px`, left: `${left}px` };
    event.preventDefault();
  }
  function hideItemContextMenu() {
    contextMenu.visible = false;
    contextMenu.item = null;
  }
  function handleClickOutsideContextMenu(event) {
      const menuElement = document.querySelector('.item-context-menu');
      const iconContainer = event.target.closest('.item-icon-container');
      if (menuElement && !menuElement.contains(event.target) && !iconContainer) {
          hideItemContextMenu();
      }
  }
  
  function viewItemDetails(item) { if (!item) item = contextMenu.item; gameStore.addLogMessage(`查看: ${item.name}`, 'event'); hideItemContextMenu(); }
  function useContextItem() { if (contextMenu.item) gameStore.useConsumableItem(contextMenu.item.id); hideItemContextMenu(); }
  function equipContextItem() { if (contextMenu.item) gameStore.equipItem(contextMenu.item.id); hideItemContextMenu(); }
  function unequipContextItem() { if (contextMenu.item) gameStore.unequipItem(contextMenu.item.type); hideItemContextMenu(); }
  function learnSkillContextItem() { if (contextMenu.item) gameStore.learnSkillFromBook(contextMenu.item.id); hideItemContextMenu(); }
  function handleItemClick(item, event) {
      if (event.button === 0) { // 左键
          hideItemTooltip(); hideItemContextMenu();
          // 左键点击优先执行主要操作
          if (item.type === '消耗品') gameStore.useConsumableItem(item.id);
          else if (item.type === '武器' || item.type === '防具') {
              if (isEquipped(item)) gameStore.unequipItem(item.type);
              else gameStore.equipItem(item.id);
          } else if (item.type === '武学秘籍' && !gameStore.learnedSkills.has(item.skillId)) gameStore.learnSkillFromBook(item.id);
          else { // 对于其他物品或已学习的秘籍，左键点击可以视为打开上下文菜单（如果需要更复杂操作）或直接查看详情
              showItemContextMenu(item, event); // 或者直接调用 viewItemDetails(item);
          }
      }
  }
  
  // --- 好感度 ---
  const filteredCharacterAffection = computed(() => {
    const filtered = {};
    for (const charId in gameStore.characterAffection) {
      if (gameStore.characterAffection[charId] !== 0 || gameStore.storyFlags[`met_${charId}`]) {
        filtered[charId] = gameStore.characterAffection[charId];
      }
    }
    return filtered;
  });
  function getCharacterDisplayName(charId) { const names = {'su_qingsxue': '苏晴雪'}; return names[charId] || charId; }
  function getAffectionPercentage(affection) { const norm = Math.max(-100, Math.min(affection, 100)); return ((norm + 100) / 200) * 100; }
  function getAffectionClass(affection) {
    if (affection >= 70) return 'affection-revered'; if (affection >= 40) return 'affection-friendly';
    if (affection >= 10) return 'affection-neutral'; if (affection > -30) return 'affection-unfriendly';
    return 'affection-hostile';
  }
  function getAffectionLevelText(affection) {
    if (affection >= 70) return '生死相托'; if (affection >= 40) return '肝胆相照';
    if (affection >= 10) return '点头之交'; if (affection > -30) return '冷若冰霜';
    return '势不两立';
  }
  
  // --- 核心交互 ---
  function handleChoice(choice) { gameStore.makeChoice(choice); }
  function goHome() { router.push('/'); gameStore.resetGame(true); }
  
  // --- Watchers & Lifecycle ---
  watch(() => gameStore.currentNodeId, async (newNodeId, oldNodeId) => {
    if (newNodeId !== oldNodeId) { // 只有当节点ID实际改变时才滚动
      await nextTick();
      if (storyArea.value) storyArea.value.scrollTop = storyArea.value.scrollHeight;
    }
  }, { deep: true });
  
  watch(() => gameStore.storyLog.length, async () => {
    await nextTick();
    if (logListElement.value) logListElement.value.scrollTop = logListElement.value.scrollHeight;
  });
  
  onMounted(async () => {
    // gameStore.autoLoadGame() 已在 App.vue 中调用
    // 确保DOM更新后滚动条到底部
    await nextTick(); 
    if (gameStore.currentNodeId && storyData[gameStore.currentNodeId]) { // 检查currentNodeId是否有效
      if (storyArea.value) storyArea.value.scrollTop = storyArea.value.scrollHeight;
      if (logListElement.value) logListElement.value.scrollTop = logListElement.value.scrollHeight;
    } else {
      // 如果 autoLoadGame 之后 currentNodeId 仍然无效，可能需要处理
      // 但通常 autoLoadGame 会设置一个有效的初始节点或重置
      console.warn("GameView onMounted: currentNodeId is invalid after store autoLoad. This might indicate an issue with save data or initial node setup.");
      // 确保 gameStore.autoLoadGame() 在 App.vue 中被调用，并且如果加载失败会重置到 'start'
      // 如果这里仍然有问题，可能需要 router.push('/')，但这应该由 autoLoadGame 的逻辑覆盖
    }
    document.addEventListener('click', handleClickOutsideContextMenu, true);
  });
  
  onUnmounted(() => {
      document.removeEventListener('click', handleClickOutsideContextMenu, true);
  });
  
  </script>
  
  <style scoped>
  /* --- 通用滚动条样式 --- */
  .styled-scrollbar::-webkit-scrollbar { width: 8px; }
  .styled-scrollbar::-webkit-scrollbar-track { background: rgba(0, 0, 0, 0.1); border-radius: 4px; }
  .styled-scrollbar::-webkit-scrollbar-thumb { background: #a07c5b; border-radius: 4px; }
  .styled-scrollbar::-webkit-scrollbar-thumb:hover { background: #8c6f52; }
  
  /* --- 基础图标 --- */
  .icon-user::before { content: "👤"; margin-right: 8px; font-size: 1.1em; }
  .icon-bag::before { content: "🎒"; margin-right: 8px; font-size: 1.1em; }
  .icon-scroll::before { content: "📜"; margin-right: 8px; font-size: 1.1em; }
  .icon-skill::before { content: "🌟"; margin-right: 8px; font-size: 1.1em; }
  .icon-heart::before { content: "❤️"; margin-right: 8px; font-size: 1.1em; }
  
  .game-view { display: flex; flex-direction: column; height: 100vh; overflow: hidden; background-color: #f0e6d2; font-family: 'Noto Serif SC', 'KaiTi', serif; }
  .game-layout { display: flex; flex-grow: 1; overflow: hidden; box-shadow: 0 0 20px rgba(0,0,0,0.3); }
  
  /* --- 左侧面板 --- */
  .left-panel { width: 280px; padding: 20px; background-color: rgba(50, 40, 30, 0.85); border-right: 2px solid #8c6f52; display: flex; flex-direction: column; overflow-y: auto; color: #e0c9a6; }
  .panel-section { margin-bottom: 20px; }
  .panel-title { color: #f0e6d2; border-bottom: 1px solid #a07c5b; padding-bottom: 8px; margin-bottom: 12px; font-size: 1.2em; display: flex; align-items: center; font-weight: 500; }
  .panel-title span { margin-left: 5px; }
  .empty-text { color: #a08c76; font-style: italic; text-align: center; padding: 10px 0; }
  
  /* 玩家属性进度条 */
  .player-stats-section .stats-list { display: flex; flex-direction: column; gap: 6px; }
  .stat-item { display: flex; align-items: center; flex-wrap: wrap; font-size: 0.9em; }
  .stat-name { color: #d0b896; width: 65px; flex-shrink: 0; }
  .stat-value { color: #f0e6d2; font-weight: bold; margin-left: 5px; }
  .stat-progress-bar-container { width: calc(100% - 75px); height: 8px; background-color: rgba(0,0,0,0.3); border-radius: 4px; margin-top: 3px; overflow: hidden; margin-left: 70px; }
  .stat-progress-bar { height: 100%; border-radius: 4px; transition: width 0.3s ease-in-out; }
  .health-bar { background-color: #c0392b; }
  .mana-bar { background-color: #2980b9; }
  .generic-bar { background-color: #f1c40f; }
  
  /* 包裹 - 网格图标布局 */
  .inventory-category { margin-bottom: 15px; }
  .category-title { font-size: 1em; color: #c0a886; margin-bottom: 10px; padding-bottom: 5px; border-bottom: 1px solid rgba(160, 124, 91, 0.3); font-weight: 500; }
  .item-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(48px, 1fr));
    gap: 8px;
  }
  .item-icon-container {
    position: relative;
    width: 48px;
    height: 48px;
    background-color: rgba(0,0,0,0.2);
    border: 1px solid #7a5c3b;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: transform 0.1s ease-out, box-shadow 0.2s;
  }
  .item-icon-container:hover {
    transform: scale(1.05);
    border-color: #a07c5b;
    box-shadow: 0 0 8px rgba(200, 160, 120, 0.5);
  }
  .item-grid-icon { max-width: 80%; max-height: 80%; object-fit: contain; }
  .item-grid-placeholder { font-size: 1.5em; color: #d0b896; font-weight: bold; }
  .equipped-marker {
      position: absolute; top: -2px; right: -2px; background-color: #27ae60;
      color: white; font-size: 0.7em; width: 14px; height: 14px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center; font-weight: bold;
      border: 1px solid rgba(255,255,255,0.5); line-height: 1; /* 确保文字垂直居中 */
  }
  .equipped-item-glow { box-shadow: 0 0 10px 2px #f1c40f; border-color: #f1c40f; }
  
  /* 物品悬浮提示 (Tooltip) */
  .item-tooltip {
    position: fixed; background-color: rgba(30, 20, 10, 0.97); border: 1px solid #b08c6a;
    color: #e0c9a6; padding: 12px 15px; border-radius: 6px; box-shadow: 0 5px 15px rgba(0,0,0,0.6);
    z-index: 1000; width: 240px; font-size: 0.9em; pointer-events: none; opacity: 1; /* 由JS的display控制 */
  }
  .item-tooltip h4 { margin-top: 0; margin-bottom: 8px; color: #f0e6d2; font-size: 1.15em; border-bottom: 1px solid #a07c5b; padding-bottom: 6px; display: flex; justify-content: space-between; align-items: center; }
  .item-type-chip { font-size: 0.8em; background-color: rgba(160, 124, 91, 0.7); padding: 2px 6px; border-radius: 3px; font-weight: normal; }
  .item-tooltip p { margin-bottom: 8px; line-height: 1.5; }
  .item-tooltip ul { list-style-type: none; padding-left: 0; margin-top: 5px; }
  .item-tooltip ul li { margin-bottom: 3px; padding-left: 10px; position:relative; }
  .item-tooltip ul li::before { content:"-"; position:absolute; left: 0; }
  
  /* 物品上下文菜单 */
  .item-context-menu {
    position: fixed; background-color: #4a3b2a; border: 1px solid #7a5c3b;
    border-radius: 5px; box-shadow: 0 3px 10px rgba(0,0,0,0.4); z-index: 1001;
    padding: 5px 0; min-width: 120px;
  }
  .item-context-menu ul { list-style: none; padding: 0; margin: 0; }
  .item-context-menu li {
    padding: 8px 15px; color: #e0c9a6; cursor: pointer; font-size: 0.9em;
    transition: background-color 0.15s; margin-bottom: 0;
  }
  .item-context-menu li:hover { background-color: #604028; color: #fff; }
  
  /* 已学技能 */
  .skill-list { list-style-type: none; padding: 0; font-size: 0.95em; }
  .list-item.skill-item { padding: 6px 5px; border-bottom: 1px dashed rgba(160, 124, 91, 0.5); color: #d0b896; line-height: 1.6; }
  .list-item.skill-item:last-child { border-bottom: none; }
  .skill-name { font-weight: 500; color: #e0c9a6; }
  
  /* 好感度UI */
  .affection-section .list-item { align-items: flex-start; padding: 10px 0; }
  .char-avatar { width: 36px; height: 36px; border-radius: 50%; background-color: #a07c5b; color: #f0e6d2; display: flex; align-items: center; justify-content: center; font-size: 1.2em; font-weight: bold; margin-right: 12px; flex-shrink: 0; border: 1px solid #c0a886; }
  .affection-details { flex-grow: 1; display: flex; flex-direction: column; }
  .affection-details .char-name { font-size: 1em; margin-bottom: 4px; color: #e0c9a6; font-weight: 500; }
  .affection-bar-container { width: 100%; height: 8px; background-color: rgba(0,0,0,0.3); border-radius: 4px; margin-bottom: 4px; overflow: hidden; }
  .affection-bar { height: 100%; border-radius: 4px; transition: width 0.3s ease-in-out, background-color 0.3s ease-in-out; }
  .affection-revered { background-color: #27ae60; } .affection-friendly { background-color: #2980b9; }
  .affection-neutral { background-color: #f1c40f; } .affection-unfriendly { background-color: #e67e22; }
  .affection-hostile { background-color: #c0392b; }
  .affection-level { font-size: 0.8em; color: #b0a080; font-style: italic; }
  
  /* 中间面板 */
  .center-panel { flex-grow: 1; background: url('/src/assets/images/paper_texture_light.jpg') repeat; color: #3a2d1a; border-left: 3px double #a07c5b; border-right: 3px double #a07c5b; box-shadow: inset 0 0 15px rgba(0,0,0,0.35); }
  .center-panel.scrollable-content { overflow-y: auto; padding: 25px 30px; }
  .story-content-wrapper { max-width: 800px; margin: 0 auto; }
  .node-title { color: #5a3d1a; text-align: center; font-size: 2em; border-bottom: 2px solid #8c6f52; margin-bottom: 20px; padding-bottom: 15px; font-weight: bold; letter-spacing: 1px; }
  .scene-image { max-width: 100%; max-height: 250px; border-radius: 6px; margin: 0 auto 25px auto; display: block; border: 3px solid #b08c6a; box-shadow: 0 4px 8px rgba(0,0,0,0.2); }
  .story-text { line-height: 1.8; margin-bottom: 30px; font-size: 1.15em; text-align: justify; color: #4a3b2a; }
  .story-text :deep(p) { margin-bottom: 1em; }
  .choices-container { margin-top: 30px; padding-top: 20px; border-top: 1px dashed #a07c5b; }
  .choices-title { color: #5a3d1a; margin-bottom: 15px; font-size: 1.3em; text-align: center; font-weight: 500; }
  .choices-grid { display: flex; flex-direction: column; gap: 10px; }
  .choice-button { display: block; width: 100%; margin: 0 auto 10px auto; padding: 12px 20px; background-color: #d8c0a0; color: #4a2d0f; border: 1px solid #b08c6a; border-radius: 5px; cursor: pointer; font-size: 1.05em; text-align: left; transition: all 0.25s ease-in-out; box-shadow: 0 2px 4px rgba(0,0,0,0.1); position: relative; }
  .choice-button:hover:not(:disabled) { background-color: #c8b090; border-color: #9a7c5a; box-shadow: 0 3px 6px rgba(0,0,0,0.15); transform: translateY(-1px); }
  .choice-button:active:not(:disabled) { transform: translateY(0px); box-shadow: 0 1px 2px rgba(0,0,0,0.1); }
  .choice-button.disabled-choice { background-color: #c0b0a0; color: #8a7c68; cursor: not-allowed; opacity: 0.6; box-shadow: none; transform: none; }
  .choice-text { display: block; }
  .choice-tooltip-inline { display: block; font-size: 0.8em; color: #7f6040; margin-top: 4px; font-style: italic; }
  .waiting-container { text-align: center; padding: 30px 0; }
  .waiting-text { color: #777; font-style: italic; font-size: 1.1em; }
  .ending-message { text-align: center; margin-top: 40px; padding: 30px; background-color: rgba(200, 180, 160, 0.3); border-radius: 8px; }
  .ending-title { color: #6b0000; font-size: 1.8em; margin-bottom: 15px; }
  .death-title { color: #444; }
  .ending-cg { max-width: 90%; max-height: 300px; border-radius: 6px; margin: 20px auto; display: block; border: 2px solid #a07c5b; box-shadow: 0 5px 15px rgba(0,0,0,0.25); }
  .ending-text { font-size: 1.1em; color: #4a3b2a; margin-bottom: 25px; }
  .action-button { padding: 10px 25px; background-color: #a07c5b; color: #f0e6d2; border: none; border-radius: 5px; cursor: pointer; font-size: 1.1em; transition: background-color 0.2s; box-shadow: 0 2px 5px rgba(0,0,0,0.2); }
  .action-button:hover { background-color: #8c6f52; }
  .home-button { margin-top: 10px; }
  .loading-container { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; font-size: 1.2em; color: #777; }
  
  /* 右侧面板 */
  .right-panel { width: 280px; padding: 20px; background-color: rgba(50, 40, 30, 0.85); border-left: 2px solid #8c6f52; display: flex; flex-direction: column; overflow: hidden; }
  .right-panel .panel-title { color: #f0e6d2; border-bottom: 1px solid #a07c5b; padding-bottom: 8px; margin-bottom: 12px; font-size: 1.2em; display: flex; align-items: center; font-weight: 500; }
  .right-panel .panel-title span { margin-left: 5px; }
  .right-panel .log-list-container { list-style-type: none; padding: 0; margin: 0; font-size: 0.9em; flex-grow: 1; overflow-y: auto; }
  .right-panel .log-entry { padding: 5px 2px; border-bottom: 1px dotted rgba(160, 124, 91, 0.4); line-height: 1.5; color: #c0a886; transition: background-color 0.2s; }
  .right-panel .log-entry:hover { background-color: rgba(255,255,255,0.03); }
  .right-panel .log-entry:last-child { border-bottom: none; }
  .right-panel .log-timestamp { color: #8a7c68; font-size: 0.85em; margin-right: 8px; user-select: none; }
  .right-panel .log-text-content { word-break: break-word; } /* 包裹日志文本 */
  .right-panel .log-story { color: #e0d0b0; } .right-panel .log-choice { color: #87CEFA; font-style: italic; }
  .right-panel .log-event { color: #ffd78c; } .right-panel .log-reward { color: #90EE90; font-weight: 500; }
  .right-panel .log-penalty { color: #FFA07A; font-weight: 500; }
  
  </style>