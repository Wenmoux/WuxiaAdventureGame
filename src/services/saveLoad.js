import { useGameStore } from '@/stores/gameStore';

const SAVE_SLOT_KEY_PREFIX = 'jianghuBaaojianSave_';

export function saveGame(slotName = 'default') {
  const gameStore = useGameStore();
  try {
    const saveData = gameStore.getSaveData();
    localStorage.setItem(SAVE_SLOT_KEY_PREFIX + slotName, JSON.stringify(saveData));
    gameStore.addLogMessage(`游戏已保存至槽位: ${slotName}`, 'event');
    return true;
  } catch (error) {
    console.error("Error saving game:", error);
    gameStore.addLogMessage('保存游戏失败!', 'penalty');
    return false;
  }
}

export function loadGame(slotName = 'default') {
  const gameStore = useGameStore();
  try {
    const savedDataString = localStorage.getItem(SAVE_SLOT_KEY_PREFIX + slotName);
    if (savedDataString) {
      const parsedData = JSON.parse(savedDataString);
      return gameStore.loadSaveData(parsedData); // Let store handle actual loading
    } else {
      gameStore.addLogMessage(`未找到槽位 ${slotName} 的存档。`, 'event');
      return false;
    }
  } catch (error) {
    console.error("Error loading game:", error);
    gameStore.addLogMessage('加载游戏失败!', 'penalty');
    return false;
  }
}

export function listSaveSlots() {
    const slots = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith(SAVE_SLOT_KEY_PREFIX)) {
            slots.push(key.substring(SAVE_SLOT_KEY_PREFIX.length));
        }
    }
    return slots;
}

export function deleteSaveSlot(slotName) {
    localStorage.removeItem(SAVE_SLOT_KEY_PREFIX + slotName);
    const gameStore = useGameStore();
    gameStore.addLogMessage(`存档槽位 ${slotName} 已删除。`, 'event');
}

export function exportSaveData(slotName = 'default') {
  const savedDataString = localStorage.getItem(SAVE_SLOT_KEY_PREFIX + slotName);
  if (savedDataString) {
    const blob = new Blob([savedDataString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `jianghu_save_${slotName}_${new Date().toISOString().slice(0,10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    const gameStore = useGameStore();
    gameStore.addLogMessage('存档已导出。', 'event');
  } else {
    alert('No save data found in selected slot to export.');
  }
}

export function importSaveData(file, slotName = 'default') {
  return new Promise((resolve, reject) => {
    const gameStore = useGameStore();
    if (!file) {
      gameStore.addLogMessage('未选择导入文件。', 'penalty');
      reject('No file selected');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedString = e.target.result;
        // Basic validation (is it JSON?)
        JSON.parse(importedString); 
        localStorage.setItem(SAVE_SLOT_KEY_PREFIX + slotName, importedString);
        gameStore.addLogMessage(`存档已导入至槽位 ${slotName}。请手动加载该存档。`, 'event');
        resolve(true);
      } catch (error) {
        console.error("Error importing save data:", error);
        gameStore.addLogMessage('导入存档失败: 文件格式无效。', 'penalty');
        reject(error);
      }
    };
    reader.onerror = (error) => {
        gameStore.addLogMessage('读取导入文件失败。', 'penalty');
        reject(error);
    }
    reader.readAsText(file);
  });
}