<template>
  <div class="segmented" role="group" :aria-label="label">
    <button
      v-for="option in options"
      :key="option.value"
      type="button"
      :aria-pressed="modelValue === option.value"
      :class="{ active: modelValue === option.value }"
      @click="emit('update:modelValue', option.value)"
    >
      {{ option.label }}
    </button>
  </div>
</template>

<script setup lang="ts" generic="T extends string">
defineProps<{
  modelValue: T
  options: { value: T; label: string }[]
  // Nom du groupe pour les lecteurs d'écran
  label: string
}>()

const emit = defineEmits<{ 'update:modelValue': [value: T] }>()
</script>

<style scoped>
.segmented {
  display: inline-flex;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  overflow: hidden;
}

.segmented button {
  padding: 0.375rem 0.75rem;
  border: none;
  background: var(--color-surface);
  color: var(--color-text);
  font: inherit;
  font-size: 0.8125rem;
  cursor: pointer;
}

.segmented button + button {
  border-left: 1px solid var(--color-border);
}

.segmented button.active {
  background: var(--color-theme-light);
  color: var(--color-theme);
  font-weight: 600;
}

.segmented button:focus-visible {
  outline: 2px solid var(--color-theme);
  outline-offset: -2px;
}
</style>
