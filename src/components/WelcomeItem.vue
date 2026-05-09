<script setup lang="ts">
defineProps<{ to: string }>()
</script>

<template>
  <RouterLink :to="to" class="feature-card">
    <div class="feature-icon">
      <slot name="icon"></slot>
    </div>
    <h3 class="feature-title">
      <slot name="heading"></slot>
    </h3>
    <p class="feature-desc">
      <slot></slot>
    </p>
  </RouterLink>
</template>

<style scoped>
.feature-card {
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
  padding: 1.5rem;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 10px;
  text-decoration: none;
  color: var(--color-text);
  transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
}

.feature-card:hover {
  border-color: var(--color-theme);
  box-shadow: 0 4px 16px var(--color-shadow);
  transform: translateY(-2px);
  color: var(--color-text);
}

.feature-icon {
  width: 44px;
  height: 44px;
  background: var(--color-theme-light);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-theme);
  flex-shrink: 0;
}

.feature-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-heading);
}

.feature-desc {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  line-height: 1.55;
}
</style>
