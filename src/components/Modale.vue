<template>
  <div
    class="modal-block"
    v-if="revele && (contents.description != null || contents.location != null)"
  >
    <div class="modal-overlay" @click="toggleModale"></div>
    <div class="modal-card">
      <div class="modal-header">
        <h3>Détails du rendez-vous</h3>
        <button class="modal-close" @click="toggleModale">✕</button>
      </div>
      <div class="modal-body">
        <p class="modal-label">Description</p>
        <p class="modal-value">{{ contents.description ?? 'Aucune description' }}</p>
        <p class="modal-label">Lieu</p>
        <p class="modal-value">{{ contents.location ?? 'Aucun lieu' }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VueModale',
  props: ['revele', 'toggleModale', 'contents']
}
</script>

<style scoped>
.modal-block {
  position: fixed;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(2px);
}

.modal-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 10px;
  padding: 1.5rem;
  width: min(420px, 90vw);
  box-shadow: 0 8px 32px var(--color-shadow);
  position: relative;
  z-index: 1;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.25rem;
}

.modal-header h3 {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-heading);
}

.modal-close {
  background: none;
  border: none;
  color: var(--color-text-secondary);
  font-size: 1rem;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  transition: color 0.2s, background 0.2s;
}

.modal-close:hover {
  color: var(--color-text);
  background: var(--color-background-soft);
}

.modal-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.25rem;
}

.modal-value {
  font-size: 0.9375rem;
  color: var(--color-text);
  margin-bottom: 1rem;
}
</style>
