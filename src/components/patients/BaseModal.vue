<template>
  <Teleport to="body">
    <div class="modal-overlay" @click.self="emit('close')">
      <div
        class="modal-container"
        :class="`modal-${size}`"
        role="dialog"
        aria-modal="true"
        :aria-label="title"
      >
        <div class="modal-header">
          <div class="modal-heading">
            <slot name="header">
              <h2>{{ title }}</h2>
            </slot>
          </div>
          <button type="button" class="modal-close" aria-label="Fermer" @click="emit('close')">
            ✕
          </button>
        </div>

        <div class="modal-body">
          <slot></slot>
        </div>

        <div v-if="$slots.footer" class="modal-footer">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'

withDefaults(defineProps<{ title?: string; size?: 'medium' | 'large' }>(), {
  title: '',
  size: 'medium'
})

const emit = defineEmits<{ close: [] }>()

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') emit('close')
}

onMounted(() => document.addEventListener('keydown', onKeydown))
onUnmounted(() => document.removeEventListener('keydown', onKeydown))
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(2px);
  padding: 1rem;
}

.modal-container {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 10px;
  width: min(720px, 100%);
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 40px var(--color-shadow);
  overflow: hidden;
  animation: slideIn 0.2s ease;
}

.modal-large {
  width: min(1080px, 100%);
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.125rem 1.5rem;
  background: var(--color-theme);
  color: #fff;
}

.modal-heading {
  flex: 1;
  min-width: 0;
}

.modal-heading :deep(h2) {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
}

.modal-close {
  background: none;
  border: none;
  color: #fff;
  font-size: 1.1rem;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  transition: background 0.2s;
}

.modal-close:hover {
  background: rgba(255, 255, 255, 0.2);
}

.modal-body {
  padding: 1.5rem;
  overflow-y: auto;
  flex: 1;
}

.modal-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--color-border);
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 0.75rem;
}

@media (max-width: 767px) {
  .modal-overlay {
    padding: 0;
  }

  .modal-container {
    width: 100%;
    max-height: 100%;
    height: 100%;
    border-radius: 0;
  }

  .modal-body {
    padding: 1rem;
  }
}
</style>
