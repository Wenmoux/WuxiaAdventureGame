<template>
    <div class="settings-view p-2 scrollable-content">
      <h2>游戏设置</h2>
  
      <div class="setting-section">
        <h3>存档管理</h3>
        <div class="save-slots">
          <div v-for="slot in saveSlots" :key="slot" class="slot-entry">
            <span>存档槽位: {{ slot }}</span>
            <div class="slot-actions">
              <button @click="handleSaveGame(slot)">保存</button>
              <button @click="handleLoadGame(slot)">读取</button>
              <button @click="handleExportSave(slot)">导出</button>
              <button @click="handleDeleteSave(slot)" class="danger">删除</button>
            </div>
          </div>
          <div class="slot-entry">
            <span>新槽位 (例如: my_adventure)</span>
             <div class="slot-actions">
              <input type="text" v-model="newSlotName" placeholder="输入新槽位名称" />
              <button @click="handleSaveGame(newSlotName)" :disabled="!newSlotName.trim()">保存至新槽位</button>
            </div>
          </div>
        </div>
        
        <div class="import-section">
          <h4>导入存档</h4>
          <input type="file" @change="onFileSelected" accept=".json" ref="fileInput" />
          <input type="text" v-model="importSlotName" placeholder="导入到槽位 (默认: default_import)" />
          <button @click="handleImportSave" :disabled="!selectedFile">导入选中文件</button>
        </div>
      </div>
  
      <div class="setting-section">
        <h3>游戏操作</h3>
        <button @click="showResetConfirm = true" class="danger">清空数据并重来</button>
      </div>
      
      <!-- Placeholder for other settings -->
      <div class="setting-section">
        <h3>其他设置 (占位)</h3>
        <p>文字速度: <input type="range" min="1" max="5" value="3" /></p>
        <p>音效音量: <input type="range" min="0" max="100" value="50" /></p>
      </div>
  
      <ConfirmModal
        :show="showResetConfirm"
        title="确认操作"
        message="此操作将清除所有游戏进度、图鉴和成就，无法恢复。确定要重置吗？"
        @confirm="confirmResetGame"
        @close="showResetConfirm = false"
      />
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { useGameStore } from '@/stores/gameStore';
  import { saveGame, loadGame, listSaveSlots, deleteSaveSlot, exportSaveData, importSaveData } from '@/services/saveLoad';
  import ConfirmModal from '@/components/ConfirmModal.vue';
  
  const gameStore = useGameStore();
  const router = useRouter();
  const showResetConfirm = ref(false);
  
  const saveSlots = ref([]);
  const newSlotName = ref('');
  const importSlotName = ref('default_import');
  const selectedFile = ref(null);
  const fileInput = ref(null);
  
  
  function refreshSaveSlots() {
    saveSlots.value = listSaveSlots();
  }
  
  onMounted(refreshSaveSlots);
  
  function confirmResetGame() {
    gameStore.resetGame();
    showResetConfirm.value = false;
    router.push('/'); // Go to home after reset
    gameStore.addLogMessage('所有游戏数据已清空。', 'event');
  }
  
  function handleSaveGame(slot) {
    if (!slot || !slot.trim()) {
      alert("请输入有效的槽位名称。");
      return;
    }
    if (saveGame(slot.trim())) {
      alert(`游戏已保存到槽位: ${slot.trim()}`);
      refreshSaveSlots();
      if (slot.trim() === newSlotName.value.trim()) newSlotName.value = ''; // Clear input if it was new slot
    } else {
      alert('保存失败!');
    }
  }
  
  function handleLoadGame(slot) {
    if (loadGame(slot)) {
      router.push('/game');
    } else {
      alert(`加载槽位 ${slot} 失败或槽位为空。`);
    }
  }
  
  function handleDeleteSave(slot) {
    if (confirm(`确定要删除存档槽位 "${slot}" 吗？此操作无法撤销。`)) {
      deleteSaveSlot(slot);
      alert(`存档槽位 ${slot} 已删除。`);
      refreshSaveSlots();
    }
  }
  
  function handleExportSave(slot) {
    exportSaveData(slot);
  }
  
  function onFileSelected(event) {
    selectedFile.value = event.target.files[0];
  }
  
  async function handleImportSave() {
    if (!selectedFile.value) {
      alert('请先选择一个存档文件。');
      return;
    }
    const slotToImport = importSlotName.value.trim() || 'default_import';
    try {
      await importSaveData(selectedFile.value, slotToImport);
      alert(`存档已成功导入到槽位 "${slotToImport}"。请手动加载该存档。`);
      refreshSaveSlots();
      selectedFile.value = null; // Reset file input
      if (fileInput.value) fileInput.value.value = ''; // Clear displayed file name
    } catch (error) {
      alert('导入存档失败，文件可能已损坏或格式不正确。');
    }
  }
  
  </script>
  
  <style scoped>
  .settings-view {
    background-color: rgba(0,0,0,0.3);
  }
  .setting-section {
    background-color: rgba(60, 50, 40, 0.7);
    padding: 15px;
    margin-bottom: 20px;
    border-radius: 5px;
    border: 1px solid #a07c5b;
  }
  .setting-section h3 {
    margin-top: 0;
    color: #e6D1B1;
    border-bottom: 1px solid #a07c5b;
    padding-bottom: 5px;
  }
  .setting-section h4 {
    color: #d0c0a0;
    margin-top: 15px;
    margin-bottom: 8px;
  }
  button.danger {
    background-color: #c0392b; /* Red for danger */
    border-color: #a03020;
  }
  button.danger:hover {
    background-color: #e74c3c;
  }
  .save-slots .slot-entry {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
    border-bottom: 1px dotted #777;
    color: #d0c0a0;
  }
  .save-slots .slot-entry:last-child {
    border-bottom: none;
  }
  .slot-actions button {
    margin-left: 5px;
    font-size: 0.9em;
    padding: 5px 10px;
  }
  .slot-actions input[type="text"] {
    padding: 6px;
    margin-right: 5px;
    background-color: #4a3b2a;
    border: 1px solid #a07c5b;
    color: #e6D1B1;
    border-radius: 3px;
  }
  .import-section input[type="file"] {
    margin-bottom: 10px;
    display: block;
    color: #d0c0a0;
  }
  .import-section input[type="text"] {
     padding: 6px;
     margin-right: 5px;
     background-color: #4a3b2a;
     border: 1px solid #a07c5b;
     color: #e6D1B1;
     border-radius: 3px;
     margin-bottom: 10px;
  }
  </style>