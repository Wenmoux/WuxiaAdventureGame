// src/stores/gameStore.js
import { defineStore } from 'pinia';
import { ref, reactive, computed, watch, toRaw, nextTick } from 'vue'; // 引入 nextTick
import { storyData } from '../gameData/story';
import { achievementsData as initialAchievementsData } from '../gameData/achievements';
import { cgsData as initialCGsData } from '../gameData/cgs';
export const GAME_SAVE_KEY = 'jianghu_game_save'; // 用于游戏存档
const GLOBAL_CG_KEY = 'jianghu_global_cgs';   // 用于全局CG

const IMG_PATH = '/src/assets/images/';

// --- 预定义物品和技能 (与上一版相同) ---
const initialItemsData = {
    'worn_sword': { id: 'worn_sword', name: '磨损的铁剑', description: '一把陪伴你多年的旧剑，剑刃多处缺口。', type: '武器', damageBonus: 1, image: `${IMG_PATH}item_worn_sword.png` },
    'coarse_clothes': { id: 'coarse_clothes', name: '粗布衣衫', description: '普通的粗布衣服，勉强蔽体。', type: '防具', defenseBonus: 1, image: `${IMG_PATH}item_coarse_clothes.png` },
    'dried_rations': { id: 'dried_rations', name: '干粮', description: '几块能充饥的干饼。', type: '消耗品', effects: [{type: 'stat', stat: '体力', value: 3}]},
    'mystic_jade_pendant': { id: 'mystic_jade_pendant', name: '神秘玉佩', description: '一块温润的古玉，似乎蕴含奇异力量。', type: '关键物品', image: `${IMG_PATH}item_jade_pendant.png` },
    'swift_wind_boots_manual': { id: 'swift_wind_boots_manual', name: '《疾风步残页》', description: '记载了一种轻功步法的残缺书页。', type: '武学秘籍', skillId: 'skill_swift_wind_step_basic' },
    'gengu_dan': { id: 'gengu_dan', name: '洗髓丹(仿)', description: '一枚散发异香的丹药，据说能改善根骨（效果微弱）。', type: '消耗品', effects: [{type: 'stat', stat: '根骨', value: 1}, {type: 'stat', stat: '体力上限', value: 2}] },
    'ironwood_staff': { id: 'ironwood_staff', name: '铁木棍', description: '一根沉重的铁木棍，比普通木棍坚硬许多。', type: '武器', damageBonus: 2, image: `${IMG_PATH}item_ironwood_staff.png` },
    'golden_arrow_token': { id: 'golden_arrow_token', name: '金箭令', description: '一枚刻有金色箭矢的令牌，似乎是某个组织的信物。', type: '关键物品' },
    'silk_handkerchief_qin': { id: 'silk_handkerchief_qin', name: '绣花丝帕(琴)', description: '一块淡雅的丝帕，绣着一枝寒梅，散发着淡淡幽香。', type: '关键物品' },
    'qingping_sword_art_vol1': { id: 'qingping_sword_art_vol1', name: '《青萍剑法残卷·壹》', description: '失传已久的青萍剑法上部残篇，剑招灵动迅捷。', type: '武学秘籍', skillId: 'skill_qingping_sword_art_1'},
    'common_ointment': {id: 'common_ointment', name: '普通伤药', description: '止血化瘀的草药膏。', type: '消耗品', effects: [{type: 'stat', stat: '体力', value: 8}]},
    'charcoal_bundle': {id: 'charcoal_bundle', name: '一捆青冈碳', description: '上好的青冈碳。'},
};
export const skillsData = {
    'skill_swift_wind_step_basic': { id: 'skill_swift_wind_step_basic', name: '疾风步(入门)', description: '初步掌握的轻功步法，提升少量敏捷。', type: 'passive', effects_on_learn: [{type: 'stat', stat: '敏捷', value: 2}] },
    'skill_basic_fist': { id: 'skill_basic_fist', name: '基础拳脚', description: '粗浅的拳脚功夫，聊以自保。', type: 'active' },
    'skill_qingping_sword_art_1': { id: 'skill_qingping_sword_art_1', name: '青萍剑法(上)', description: '青萍剑法上卷招式，剑出如风，灵动飘逸。', type: 'active', weapon_type: 'sword', effects_on_learn: [{type: 'stat', stat: '剑法', value: 10}] },
};
// --- 预定义物品和技能结束 ---


export const useGameStore = defineStore('game', () => {
  // --- 响应式状态 ---
  const playerStats = reactive({
    体力: 20, 体力上限: 20, 武力: 5, 防御: 0, 敏捷: 5, 口才: 3,
    悟性: 5, 剑法: 0, 内力上限: 0, 当前内力: 0, 声望: 0,
    金钱: 20, 勇气: 0, 根骨: 7
  });
  const inventory = ref([]);
  const storyFlags = reactive({});
  const currentNodeId = ref('start'); // 默认是start，会被自动加载覆盖
  const storyLog = ref([]);
  
  // 全局CG，从localStorage加载
  const unlockedCGs = ref(new Set(JSON.parse(localStorage.getItem(GLOBAL_CG_KEY) || '[]')));
  
  const unlockedAchievements = ref(new Set()); // 成就通常与存档绑定
  const learnedSkills = ref(new Set());
  const characterAffection = reactive({ su_qingsxue: 0 });
  const equippedWeapon = ref(null);
  const equippedArmor = ref(null);

  // --- 计算属性 (与上一版相同) ---
  const currentNode = computed(() => {
    if (!currentNodeId.value || !storyData[currentNodeId.value]) {
      return null;
    }
    let node = storyData[currentNodeId.value];
    // 处理 refNodeId，实现节点引用
    if (node && node.refNodeId && storyData[node.refNodeId]) {
      // 合并或覆盖，这里简单地直接使用被引用的节点
      // 如果需要合并属性，逻辑会更复杂
      // 例如，可以保留原节点的 id、title（如果需要显示不同的标题），但使用引用节点的 text 和 choices
      // 为了简单起见，我们先直接返回引用节点，这意味着 title 等也会被覆盖
      // 如果希望保留原节点的 title 等，可以这样：
      // return { ...storyData[node.refNodeId], id: node.id, title: node.title || storyData[node.refNodeId].title };
      // 但最直接的是，如果 refNodeId 存在，就完全用 refNodeId 的内容
      node = storyData[node.refNodeId];
    }
    return node || null;
  });

  const isGameOver = computed(() => { /* ... */ return currentNode.value?.isEnding || playerStats.体力 <= 0;});
  const achievements = computed(() => Object.values(initialAchievementsData).map(ach => ({ ...ach, unlocked: unlockedAchievements.value.has(ach.id) })));
  const cgs = computed(() => Object.values(initialCGsData).map(cg => ({ ...cg, unlocked: unlockedCGs.value.has(cg.id) })));


  // --- 辅助函数 (addLogMessage, checkAndUnlockAchievement 与上一版相同) ---
  function addLogMessage(message, type = 'event') { /* ... */ storyLog.value.push({ type, text: message, timestamp: new Date().toLocaleTimeString() }); if (storyLog.value.length > 200) storyLog.value.shift(); }
  function checkAndUnlockAchievement(achievementId) { /* ... */ if (initialAchievementsData[achievementId] && !unlockedAchievements.value.has(achievementId)) { unlockedAchievements.value.add(achievementId); addLogMessage(`成就解锁: ${initialAchievementsData[achievementId].name}`, 'reward'); } }
  
  // 修改 checkAndUnlockCG 以保存到全局CG的localStorage
  function checkAndUnlockCG(cgId) {
    if (initialCGsData[cgId] && !unlockedCGs.value.has(cgId)) {
      unlockedCGs.value.add(cgId);
      localStorage.setItem(GLOBAL_CG_KEY, JSON.stringify(Array.from(unlockedCGs.value)));
      addLogMessage(`图鉴解锁: ${initialCGsData[cgId].name}`, 'reward');
    }
  }

  // --- applyEffect (与上一版相同，确保体力上限和内力上限逻辑正确) ---
  function applyEffect(effect, source = 'unknown') {
    if (!effect) return;
    switch (effect.type) {
      case 'stat':
        if (playerStats.hasOwnProperty(effect.stat)) {
          playerStats[effect.stat] += effect.value;
          if (effect.stat === '体力' && playerStats.体力 > playerStats.体力上限) playerStats.体力 = playerStats.体力上限;
          if (effect.stat === '当前内力' && playerStats.当前内力 > playerStats.内力上限) playerStats.当前内力 = playerStats.内力上限;
          if (playerStats.体力 < 0) playerStats.体力 = 0; // 体力不为负
          if (playerStats.当前内力 < 0) playerStats.当前内力 = 0; // 内力不为负

          addLogMessage(`${effect.stat} ${effect.value > 0 ? '+' : ''}${effect.value} (当前: ${playerStats[effect.stat]})`, effect.value > 0 ? 'reward' : 'penalty');
          if (effect.stat === '体力' && playerStats.体力 <= 0) addLogMessage('你的体力耗尽了...', 'penalty');
        } else console.warn(`[applyEffect from ${source}] 未知的属性: ${effect.stat}`);
        break;
      case 'item':
        if (effect.action === 'add') {
          const itemData = effect.item || initialItemsData[effect.itemId];
          if (itemData) {
            if (!inventory.value.some(invItem => invItem.id === itemData.id)) { // 简单处理，不考虑堆叠
                inventory.value.push({...itemData});
                addLogMessage(`获得物品: ${itemData.name}`, 'reward');
            } else addLogMessage(`你已经拥有 ${itemData.name}。`, 'event');
          } else console.warn(`[applyEffect from ${source}] 添加物品失败: ID ${effect.itemId}`);
        } else if (effect.action === 'remove') {
          const index = inventory.value.findIndex(i => i.id === effect.itemId);
          if (index > -1) {
            const removedItem = inventory.value.splice(index, 1)[0];
            addLogMessage(`失去物品: ${removedItem.name}`, 'penalty');
          } else addLogMessage(`你没有物品 ${effect.itemId} 可供移除。`, 'event');
        }
        break;
      case 'flag':
        storyFlags[effect.flag] = effect.value;
        addLogMessage(`事件标记: ${effect.flag} 设置为 ${effect.value}`, 'event');
        break;
      case 'log':
        addLogMessage(effect.message, effect.logType || 'event');
        break;
      case 'cg': checkAndUnlockCG(effect.cgId); break;
      case 'achievement': checkAndUnlockAchievement(effect.achievementId); break;
      case 'skill_unlock':
        if (skillsData[effect.skillId] && !learnedSkills.value.has(effect.skillId)) {
          learnedSkills.value.add(effect.skillId);
          const skill = skillsData[effect.skillId];
          addLogMessage(`习得技能: ${skill.name}`, 'reward');
          if (skill.effects_on_learn) skill.effects_on_learn.forEach(learnEffect => applyEffect(learnEffect, `skill_learn_${skill.id}`));
        } else if (learnedSkills.value.has(effect.skillId)) {
            addLogMessage(`你已经学会了 ${skillsData[effect.skillId].name}。`, 'event');
        } else console.warn(`[applyEffect from ${source}] 尝试解锁未知技能ID: ${effect.skillId}`);
        break;
      case 'characterAffection':
        if (characterAffection.hasOwnProperty(effect.character)) {
          characterAffection[effect.character] += effect.value;
          const charDisplayName = effect.character === 'su_qingsxue' ? '苏晴雪' : effect.character;
          addLogMessage(`${charDisplayName}好感度 ${effect.value > 0 ? '+' : ''}${effect.value} (当前: ${characterAffection[effect.character]})`, effect.value > 0 ? 'reward' : 'penalty');
        } else console.warn(`[applyEffect from ${source}] 未知角色好感度变更: ${effect.character}`);
        break;
      default: console.warn(`[applyEffect from ${source}] 未知的效果类型: ${effect.type}`);
    }
  }

  // --- 物品交互 Actions (useConsumableItem, equipItem, unequipItem, learnSkillFromBook 与上一版相同) ---
  function useConsumableItem(itemId) { /* ... */ 
    const itemIndex = inventory.value.findIndex(i => i.id === itemId);
    if (itemIndex === -1) { addLogMessage(`你没有 ${initialItemsData[itemId]?.name || itemId} 可供使用。`, 'penalty'); return; }
    const item = inventory.value[itemIndex];
    if (item.type !== '消耗品' || !item.effects) { addLogMessage(`${item.name} 不是可使用的消耗品。`, 'event'); return; }
    addLogMessage(`你使用了 ${item.name}。`, 'event');
    item.effects.forEach(effect => applyEffect(effect, `use_item_${itemId}`));
    inventory.value.splice(itemIndex, 1);
  }
  function equipItem(itemId) { /* ... */ 
    const item = inventory.value.find(i => i.id === itemId);
    if (!item) { addLogMessage(`包裹中没有 ${initialItemsData[itemId]?.name || itemId}。`, 'penalty'); return; }
    if (item.type === '武器') {
      if (equippedWeapon.value && equippedWeapon.value.id === itemId) { addLogMessage(`你已经装备着 ${item.name}。`, 'event'); return; }
      if (equippedWeapon.value) unequipItem('武器');
      equippedWeapon.value = { ...item };
      if (item.damageBonus) playerStats.武力 += item.damageBonus;
      addLogMessage(`你装备了 ${item.name} (武力+${item.damageBonus || 0})。`, 'reward');
    } else if (item.type === '防具') {
      if (equippedArmor.value && equippedArmor.value.id === itemId) { addLogMessage(`你已经穿戴着 ${item.name}。`, 'event'); return; }
      if (equippedArmor.value) unequipItem('防具');
      equippedArmor.value = { ...item };
      if (item.defenseBonus) playerStats.防御 += item.defenseBonus;
      addLogMessage(`你穿戴了 ${item.name} (防御+${item.defenseBonus || 0})。`, 'reward');
    } else addLogMessage(`${item.name} 不是可装备的物品。`, 'event');
  }
  function unequipItem(itemType) { /* ... */ 
    if (itemType === '武器' && equippedWeapon.value) {
      const item = equippedWeapon.value;
      if (item.damageBonus) playerStats.武力 -= item.damageBonus;
      addLogMessage(`你卸下了 ${item.name}。`, 'event');
      equippedWeapon.value = null;
    } else if (itemType === '防具' && equippedArmor.value) {
      const item = equippedArmor.value;
      if (item.defenseBonus) playerStats.防御 -= item.defenseBonus;
      addLogMessage(`你卸下了 ${item.name}。`, 'event');
      equippedArmor.value = null;
    } else addLogMessage(`你没有装备该类型的物品。`, 'event');
  }
  function learnSkillFromBook(itemId) { /* ... */ 
    const item = inventory.value.find(i => i.id === itemId);
    if (!item || item.type !== '武学秘籍' || !item.skillId) { addLogMessage('无法从此物品学习技能。', 'penalty'); return; }
    if (learnedSkills.value.has(item.skillId)) { addLogMessage(`你已经掌握了 ${skillsData[item.skillId]?.name || item.skillId}。`, 'event'); return; }
    applyEffect({ type: 'skill_unlock', skillId: item.skillId }, `learn_from_book_${itemId}`);
  }

  // --- 核心游戏逻辑 (watch currentNodeId, processSkillCheck, makeChoice, getChoiceDisabledReason, isChoiceDisabled 与上一版相同) ---
  watch(currentNodeId, (newNodeId, oldNodeId) => {
    if (newNodeId === 'temp_placeholder_for_load' || newNodeId === 'temp_placeholder_for_reset' || newNodeId === 'temp_placeholder_for_init_watch') return; // 加载存档或重置时的临时跳过

    const node = storyData[newNodeId];
    if (!node) {
      console.error(`错误：在 storyData 中找不到节点ID "${newNodeId}"。`);
      addLogMessage(`错误：剧情节点 "${newNodeId}" 未找到。`, 'penalty');
      if (oldNodeId && storyData[oldNodeId] && oldNodeId !== 'temp_placeholder_for_load' && oldNodeId !== 'temp_placeholder_for_reset' && oldNodeId !== 'temp_placeholder_for_init_watch') {
        currentNodeId.value = oldNodeId; // 尝试回退
      } else {
        currentNodeId.value = 'start'; // 实在不行回初始
      }
      return;
    }
    if (node.text) addLogMessage(`[${node.title || '剧情'}] ${node.text}`, 'story');
    if (node.effects) node.effects.forEach(effect => applyEffect(effect, `node_${newNodeId}`));
    if (node.skillCheck && !node.choices && !node.isEnding) { processSkillCheck(node.skillCheck); return; }
    if (!node.choices && !node.isEnding && node.nextNodeId && !node.skillCheck) {
      if (storyData[node.nextNodeId]) { currentNodeId.value = node.nextNodeId; return; }
      else { console.warn(`节点 ${newNodeId} 的 nextNodeId "${node.nextNodeId}" 无效。`); addLogMessage(`错误：剧情无法继续，目标节点 "${node.nextNodeId}" 未定义。`, 'penalty');}
    }
    if (node.isEnding) {
      addLogMessage(`结局达成: ${node.endingTitle || '未知结局'}`, 'event');
      if (node.cg) { const cgEntry = Object.values(initialCGsData).find(cg => cg.path === node.cg || cg.id === node.cg); if (cgEntry) checkAndUnlockCG(cgEntry.id); }
      if (node.achievementId) checkAndUnlockAchievement(node.achievementId);
    }
    if (playerStats.体力 <= 0 && !node.isEnding) addLogMessage("你因体力不支而倒下...", 'penalty');
  }, { immediate: false }); // 改为 immediate: false，因为初始化时会尝试自动加载

  function processSkillCheck(skillCheckConfig) { /* ... (与上一版相同) ... */ 
    const { stat, target, successNodeId, failureNodeId, rollType = '1d10', successParams } = skillCheckConfig;
    let roll = rollType === '1d10' ? Math.floor(Math.random() * 10) + 1 : (Math.floor(Math.random() * 6) + 1) + (Math.floor(Math.random() * 6) + 1);
    const playerStatValue = playerStats[stat] || 0;
    let bonusValue = 0;
    if (successParams && successParams.statBonus && playerStats[successParams.statBonus]) {
        bonusValue = Math.floor(playerStats[successParams.statBonus] * (successParams.bonusMultiplier || 1));
    }
    const totalValue = playerStatValue + roll + bonusValue;
    let logMsg = `进行 ${stat} 检定: 基础 ${playerStatValue}`;
    if (bonusValue > 0 && successParams.statBonus) logMsg += ` + ${successParams.statBonus}加成 ${bonusValue}`;
    logMsg += ` + 投掷(${rollType}) ${roll} = ${totalValue} (目标: ${target})`;
    addLogMessage(logMsg, 'event');
    if (totalValue >= target) {
      addLogMessage('检定成功!', 'reward');
      if (storyData[successNodeId]) currentNodeId.value = successNodeId;
      else console.error(`SkillCheck 成功节点ID "${successNodeId}" 未找到!`);
    } else {
      addLogMessage('检定失败。', 'penalty');
      if (storyData[failureNodeId]) currentNodeId.value = failureNodeId;
      else console.error(`SkillCheck 失败节点ID "${failureNodeId}" 未找到!`);
    }
  }
  function makeChoice(choice) { /* ... (与上一版相同) ... */ 
    if (isGameOver.value && !(currentNode.value?.isEnding && choice.text.includes("返回首页"))) { addLogMessage("游戏已结束。", "event"); return; }
    if (isChoiceDisabled(choice)) { addLogMessage(`条件不足: ${getChoiceDisabledReason(choice)}`, 'penalty'); return; }
    addLogMessage(`你选择了: ${choice.text}`, 'choice');
    if (choice.effects) choice.effects.forEach(effect => applyEffect(effect, `choice_on_node_${currentNodeId.value}`));
    if (playerStats.体力 <= 0 && !currentNode.value?.isEnding) { addLogMessage("你因体力不支而无法继续...", 'penalty'); return; }
    if (choice.nextNodeId) {
      if (storyData[choice.nextNodeId]) currentNodeId.value = choice.nextNodeId;
      else console.error(`选项 "${choice.text}" 指向的 nextNodeId "${choice.nextNodeId}" 未找到!`);
    } else if (!currentNode.value?.isEnding) { console.warn(`选项 "${choice.text}" 没有 nextNodeId`); addLogMessage(`此路不通...`, 'event'); }
  }
  function getChoiceDisabledReason(choice) { /* ... (与上一版相同) ... */ 
    if (!choice.conditions) return null;
    for (const condition of choice.conditions) {
      if (condition.type === 'stat') {
        const statValue = playerStats[condition.stat];
        if (statValue === undefined || (condition.min !== undefined && statValue < condition.min)) return `需要 ${condition.stat} ≥ ${condition.min}`;
        if (condition.max !== undefined && statValue > condition.max) return `需要 ${condition.stat} ≤ ${condition.max}`;
      }
      if (condition.type === 'item') {
        const hasItem = inventory.value.some(item => item.id === condition.itemId);
        const itemName = initialItemsData[condition.itemId]?.name || condition.itemId;
        if ((condition.check === 'has' || condition.check === undefined) && !hasItem) return `需要物品: ${itemName}`;
        if (condition.check === 'not_has' && hasItem) return `不能拥有物品: ${itemName}`;
      }
      if (condition.type === 'flag') {
          if (storyFlags[condition.flag] !== condition.value && !(storyFlags[condition.flag] === undefined && condition.value === false)) { // 如果flag未定义，且期望值为false，则条件满足
            return `需要事件 ${condition.flag} 为 ${condition.value}`;
          }
      }
      if (condition.type === 'skill_learned') {
        const skillName = skillsData[condition.skillId]?.name || condition.skillId;
        if ((condition.check === 'has' || condition.check === undefined) && !learnedSkills.value.has(condition.skillId)) return `需要技能: ${skillName}`;
        if (condition.check === 'not_has' && learnedSkills.value.has(condition.skillId)) return `不能拥有技能: ${skillName}`;
      }
      if (condition.type === 'affection_check') {
        const charDisplayName = condition.character === 'su_qingsxue' ? '苏晴雪' : condition.character;
        const affectionValue = characterAffection[condition.character];
        if (affectionValue === undefined || (condition.min !== undefined && affectionValue < condition.min)) return `需要 ${charDisplayName} 好感度 ≥ ${condition.min}`;
        if (condition.max !== undefined && affectionValue > condition.max) return `需要 ${charDisplayName} 好感度 ≤ ${condition.max}`;
      }
    }
    return null;
  }
  function isChoiceDisabled(choice) { return !!getChoiceDisabledReason(choice); }
  

  // --- 存档、读档、重置 ---
  function resetGame(isInitialLoad = false) { // 新增 isInitialLoad 参数
    Object.assign(playerStats, {
        体力: 20, 体力上限: 20, 武力: 5, 防御: 0, 敏捷: 5, 口才: 3,
        悟性: 5, 剑法: 0, 内力上限: 0, 当前内力: 0, 声望: 0,
        金钱: 20, 勇气: 0, 根骨: 7
    });
    inventory.value = [];
    for (const key in storyFlags) delete storyFlags[key];
    if (!isInitialLoad) storyLog.value = []; // 初始加载时不清除日志，除非是手动重置
    
    unlockedAchievements.value.clear();
    learnedSkills.value.clear();
    for (const key in characterAffection) characterAffection[key] = 0;
    equippedWeapon.value = null;
    equippedArmor.value = null;
    
    const oldNodeId = currentNodeId.value;
    currentNodeId.value = 'temp_placeholder_for_reset'; // 临时值
    
    // 使用 Promise 确保 nextTick 完成
    return new Promise((resolve) => {
        nextTick(() => {
            currentNodeId.value = 'start';
            if (!isInitialLoad) {
                addLogMessage('游戏已重置，新的旅程开始了。', 'event');
            }
            // 如果旧节点不是临时节点，且新节点是 start，则触发 start 节点效果
            if (oldNodeId !== 'temp_placeholder_for_reset' && currentNodeId.value === 'start') {
                const startNode = storyData['start'];
                if (startNode) {
                    if (startNode.text && !isInitialLoad) addLogMessage(`[${startNode.title || '剧情'}] ${startNode.text}`, 'story');
                    if (startNode.effects) startNode.effects.forEach(effect => applyEffect(effect, `node_start_on_reset`));
                }
            }
            resolve();
        });
    });
  }

  function getSaveData() {
    return {
      playerStats: toRaw(playerStats),
      inventory: toRaw(inventory.value),
      storyFlags: toRaw(storyFlags),
      currentNodeId: currentNodeId.value,
      storyLog: storyLog.value.slice(-100),
      unlockedAchievements: Array.from(unlockedAchievements.value),
      learnedSkills: Array.from(learnedSkills.value),
      characterAffection: toRaw(characterAffection),
      equippedWeapon: equippedWeapon.value ? toRaw(equippedWeapon.value) : null,
      equippedArmor: equippedArmor.value ? toRaw(equippedArmor.value) : null,
      version: '1.0.0'
    };
  }

  function loadSaveData(data, fromAutoLoad = false) {
    return new Promise(async (resolve, reject) => {
        if (!data) {
          if (!fromAutoLoad) addLogMessage('存档数据为空。', 'penalty');
          reject(new Error('No data to load'));
          return;
        }
        try {
          if (data.version !== '1.0.0' && !fromAutoLoad) {
              addLogMessage('存档版本不兼容。', 'penalty');
          }

          Object.assign(playerStats, data.playerStats);
          inventory.value = data.inventory || [];
          for (const key in storyFlags) delete storyFlags[key];
          Object.assign(storyFlags, data.storyFlags || {});
          
          if (!fromAutoLoad || (storyLog.value.length === 0 && data.storyLog?.length > 0)) {
              storyLog.value = data.storyLog || [];
          }
          
          unlockedAchievements.value = new Set(data.unlockedAchievements || []);
          learnedSkills.value = new Set(data.learnedSkills || []);
          for (const key in characterAffection) delete characterAffection[key];
          Object.assign(characterAffection, data.characterAffection || {});
          equippedWeapon.value = data.equippedWeapon || null;
          equippedArmor.value = data.equippedArmor || null;
          
          if (data.currentNodeId && storyData[data.currentNodeId]) {
            currentNodeId.value = 'temp_placeholder_for_load';
            await nextTick(); // 等待临时值被处理
            currentNodeId.value = data.currentNodeId;
            if (!fromAutoLoad) addLogMessage('游戏已从存档加载。', 'event');
            // 触发当前节点的文本和效果（如果需要，但通常存档已包含状态）
            // const node = storyData[data.currentNodeId];
            // if (node && node.text && !fromAutoLoad) addLogMessage(`[${node.title || '剧情'}] ${node.text}`, 'story');
          } else {
            if (!fromAutoLoad) addLogMessage('存档中的剧情节点无效。', 'penalty');
            await resetGame(fromAutoLoad);
            reject(new Error('Invalid node ID in save data'));
            return;
          }
          resolve(true);
        } catch (error) {
          console.error("加载存档数据失败:", error);
          if (!fromAutoLoad) addLogMessage('加载存档失败！', 'penalty');
          await resetGame(fromAutoLoad);
          reject(error);
        }
    });
  }

  let autoSaveTimeout = null;
  function scheduleAutoSave() {
    if (autoSaveTimeout) clearTimeout(autoSaveTimeout);
    autoSaveTimeout = setTimeout(() => {
      try {
        // 确保不是临时节点时才保存
        if (currentNodeId.value && !currentNodeId.value.startsWith('temp_placeholder')) {
            localStorage.setItem(GAME_SAVE_KEY, JSON.stringify(getSaveData()));
        }
      } catch (error) {
        console.error('Error auto-saving game:', error);
      }
    }, 1000);
  }

  watch([playerStats, inventory, storyFlags, () => currentNodeId.value, learnedSkills, characterAffection, equippedWeapon, equippedArmor], 
    scheduleAutoSave, 
    { deep: true }
  );

  async function initializeStore() {
    const savedGame = localStorage.getItem(GAME_SAVE_KEY);
    if (savedGame) {
      try {
        const parsedData = JSON.parse(savedGame);
        await loadSaveData(parsedData, true);
        addLogMessage('已自动加载之前的游戏进度。', 'event');
      } catch (error) {
        console.error('Error parsing saved game data on init:', error);
        localStorage.removeItem(GAME_SAVE_KEY);
        await resetGame(true);
        addLogMessage('存档数据损坏，开始新游戏。', 'event');
      }
    } else {
      await resetGame(true);
      addLogMessage('欢迎来到江湖！开始新的冒险吧。', 'event');
    }
    // 确保 watch(currentNodeId) 在所有状态恢复后再被正确触发一次
    const initialNodeId = currentNodeId.value;
    if (initialNodeId && !initialNodeId.startsWith('temp_placeholder')) {
        currentNodeId.value = 'temp_placeholder_for_init_watch';
        await nextTick();
        currentNodeId.value = initialNodeId;
    }
  }
  
  initializeStore();

  return {
    playerStats, inventory, storyFlags, currentNodeId, currentNode, storyLog,
    unlockedCGs, unlockedAchievements, isGameOver, achievements, cgs,
    learnedSkills, characterAffection, skillsData,
    equippedWeapon, equippedArmor,
    resetGame: () => resetGame(false),
    makeChoice, isChoiceDisabled, getChoiceDisabledReason,
    getSaveData, loadSaveData: (data) => loadSaveData(data, false),
    addLogMessage,
    useConsumableItem, equipItem, unequipItem, learnSkillFromBook,
    checkAndUnlockAchievement, checkAndUnlockCG,
    // 暴露 initializeStore 也许不是必要的，因为它在 store 创建时已运行
    // 但如果 App.vue 需要等待它完成，可以考虑返回一个 Promise
    // initializeStorePromise: initializeStore() // 这会立即执行，不是我们想要的
  }
});