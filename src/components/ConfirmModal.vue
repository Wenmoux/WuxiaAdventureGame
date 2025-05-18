<template>
    <transition name="modal-fade">
      <div v-if="show" class="modal-overlay" @click.self="closeModal">
        <div class="modal-content" :class="modalContentClass">
          <h3 v-if="title" class="modal-title">{{ title }}</h3>
          <p v-if="message" class="modal-message">{{ message }}</p>
          <slot></slot> <!-- For custom content -->
          <div class="modal-actions">
            <button v-if="showCancelButton" @click="closeModal" class="cancel-button">{{ cancelText }}</button>
            <button v-if="showConfirmButton" @click="confirmAction" class="confirm-button">{{ confirmText }}</button>
          </div>
        </div>
      </div>
    </transition>
  </template>
  
  <script setup>
  const props = defineProps({
    show: Boolean,
    title: String,
    message: String,
    confirmText: { type: String, default: '确定' },
    cancelText: { type: String, default: '取消' },
    showConfirmButton: { type: Boolean, default: true },
    showCancelButton: { type: Boolean, default: true },
    modalContentClass: { type: String, default: ''} // For custom styling of the content box
  });
  
  const emit = defineEmits(['confirm', 'close']);
  
  function confirmAction() {
    emit('confirm');
  }
  
  function closeModal() {
    emit('close');
  }
  </script>
  
  <style scoped>
  .modal-overlay {
    /* Styles from global.css */
  }
  .modal-content {
    /* Styles from global.css */
    color: #e0e0e0;
  }
  .modal-title {
    margin-top: 0;
    color: #ecf0f1;
    border-bottom: 1px solid #555;
    padding-bottom: 10px;
    margin-bottom: 15px;
  }
  .modal-message {
    margin-bottom: 20px;
    line-height: 1.6;
  }
  .modal-actions {
    text-align: right;
    margin-top: 20px;
  }
  .modal-actions button {
    margin-left: 10px;
  }
  .confirm-button {
    background-color: #27ae60; /* Green */
    border-color: #209050;
  }
  .confirm-button:hover {
    background-color: #2ecc71;
  }
  .cancel-button {
    background-color: #7f8c8d; /* Muted gray */
  }
  .cancel-button:hover {
    background-color: #95a5a6;
  }
  
  .modal-fade-enter-active,
  .modal-fade-leave-active {
    transition: opacity 0.3s ease;
  }
  .modal-fade-enter-from,
  .modal-fade-leave-to {
    opacity: 0;
  }
  </style>