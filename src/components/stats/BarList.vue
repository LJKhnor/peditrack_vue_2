<template>
  <!-- Classement en barres horizontales : le libellé, la barre, puis le nombre et la part du total -->
  <ol class="bar-list" :aria-label="label">
    <li v-for="item in items" :key="item.key" class="bar-row">
      <span class="bar-label">
        {{ item.label }}
        <span v-if="item.detail" class="bar-detail">{{ item.detail }}</span>
      </span>
      <span class="bar-track" aria-hidden="true">
        <span class="bar" :style="{ width: `${(item.value / max) * 100}%` }"></span>
      </span>
      <span class="bar-value">
        {{ item.value }} <span class="bar-share">({{ share(item.value, total) }})</span>
      </span>
    </li>
  </ol>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { share, type RankedItem } from '@/utils/stats'

const props = defineProps<{
  items: RankedItem[]
  // Total des parts (nombre de patients), pour les pourcentages
  total: number
  label: string
}>()

const max = computed(() => Math.max(1, ...props.items.map((item) => item.value)))
</script>

<style scoped>
/* Précision sous le libellé (répartition pied gauche / pied droit) */
.bar-detail {
  display: block;
  font-size: 0.75rem;
  color: var(--color-text-secondary);
}

.bar-list {
  --series-current: var(--color-series-current);
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: minmax(6rem, max-content) minmax(4rem, 1fr) max-content;
  gap: 0.5rem 0.75rem;
  align-items: center;
}

.bar-row {
  display: contents;
}

.bar-label {
  max-width: 14rem;
  font-size: 0.875rem;
  line-height: 1.3;
  color: var(--color-text);
  overflow-wrap: anywhere;
}

.bar-track {
  height: 12px;
}

.bar {
  display: block;
  height: 100%;
  min-width: 2px;
  border-radius: 0 4px 4px 0;
  background: var(--series-current);
}

.bar-value {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text);
  font-variant-numeric: tabular-nums;
  text-align: right;
}

.bar-share {
  font-weight: normal;
  color: var(--color-text-secondary);
}

@media (max-width: 640px) {
  .bar-label {
    max-width: 9rem;
  }
}
</style>
