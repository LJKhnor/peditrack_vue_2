<template>
  <div class="tile">
    <span class="tile-label">{{ label }}</span>
    <span class="tile-value" :class="{ 'tile-value-text': text }">{{ value }}</span>
    <span v-if="$slots.default" class="tile-detail"><slot /></span>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string
  value: string | number
  // Valeur textuelle (un nom) plutôt qu'un chiffre : police plus petite, retour à la ligne permis
  text?: boolean
}>()
</script>

<style scoped>
.tile {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0;
  padding: 1rem 1.25rem;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 10px;
  box-shadow: 0 1px 3px var(--color-shadow);
}

.tile-label {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
}

.tile-value {
  font-size: 2rem;
  font-weight: 600;
  line-height: 1.2;
  color: var(--color-heading);
  font-variant-numeric: tabular-nums;
}

.tile-value-text {
  font-size: 1.25rem;
  line-height: 1.3;
  overflow-wrap: anywhere;
}

.tile-detail {
  font-size: 0.8125rem;
  color: var(--color-text-secondary);
}
</style>
