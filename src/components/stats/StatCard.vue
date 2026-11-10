<template>
  <article class="card">
    <header class="card-header">
      <h3>{{ title }}</h3>
      <slot name="actions" />
    </header>
    <p v-if="subtitle" class="card-subtitle">{{ subtitle }}</p>
    <slot />
  </article>
</template>

<script setup lang="ts">
defineProps<{ title: string; subtitle?: string }>()
</script>

<style scoped>
.card {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0;
  padding: 1rem 1.25rem 1.25rem;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 10px;
  box-shadow: 0 1px 3px var(--color-shadow);
}

.card-header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

h3 {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-heading);
}

.card-subtitle {
  font-size: 0.8125rem;
  color: var(--color-text-secondary);
  margin-bottom: 0.5rem;
}
</style>
