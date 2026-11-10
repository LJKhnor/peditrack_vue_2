<template>
  <figure class="chart">
    <ul v-if="hasPrevious" class="chart-legend">
      <li><span class="swatch swatch-current"></span>{{ seriesName }}</li>
      <li><span class="swatch swatch-previous"></span>{{ previousName }}</li>
    </ul>

    <div class="chart-plot" :style="{ '--columns': columns.length }">
      <div class="chart-grid" aria-hidden="true">
        <span
          v-for="tick in ticks"
          :key="tick"
          class="grid-line"
          :style="{ bottom: percent(tick) }"
        >
          <span class="grid-label">{{ tick }}</span>
        </span>
      </div>

      <div class="chart-columns">
        <div
          v-for="column in columns"
          :key="column.key"
          class="chart-slot"
          tabindex="0"
          :aria-label="describe(column)"
          @mouseenter="active = column.key"
          @mouseleave="active = null"
          @focus="active = column.key"
          @blur="active = null"
        >
          <div class="chart-bars">
            <span
              v-if="hasPrevious"
              class="bar bar-previous"
              :style="{ height: percent(column.previous ?? 0) }"
            ></span>
            <span class="bar bar-current" :style="{ height: percent(column.value) }">
              <span v-if="column.key === labelled" class="bar-value">{{ column.value }}</span>
            </span>
          </div>
          <span class="chart-label" aria-hidden="true">{{ column.label }}</span>

          <div v-if="active === column.key" class="chart-tooltip" role="presentation">
            <strong>{{ column.title }}</strong>
            <span
              ><span class="swatch swatch-current"></span>{{ seriesName }} :
              {{ column.value }}</span
            >
            <span v-if="hasPrevious">
              <span class="swatch swatch-previous"></span>{{ previousName }} : {{ column.previous }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <details class="chart-table">
      <summary>Voir les chiffres</summary>
      <table>
        <thead>
          <tr>
            <th scope="col">{{ periodName }}</th>
            <th scope="col">{{ seriesName }}</th>
            <th v-if="hasPrevious" scope="col">{{ previousName }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="column in columns" :key="column.key">
            <th scope="row">{{ column.title }}</th>
            <td>{{ column.value }}</td>
            <td v-if="hasPrevious">{{ column.previous }}</td>
          </tr>
        </tbody>
      </table>
    </details>
  </figure>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Column } from '@/utils/stats'

const props = defineProps<{
  columns: Column[]
  seriesName: string
  // Série de comparaison (valeur `previous` des colonnes), affichée si un nom est donné
  previousName?: string
  periodName: string
}>()

const active = ref<string | null>(null)
const hasPrevious = computed(() => Boolean(props.previousName))

// Maximum de l'axe arrondi à une valeur ronde (1, 2, 5 × 10ⁿ), au moins 4 pour avoir des graduations entières
const axisMax = computed(() => {
  const values = props.columns.flatMap((column) =>
    hasPrevious.value ? [column.value, column.previous ?? 0] : [column.value]
  )
  const max = Math.max(4, ...values)
  const magnitude = 10 ** Math.floor(Math.log10(max))
  const step = [1, 2, 5, 10].find((factor) => factor * magnitude >= max) ?? 10
  return step * magnitude
})

const ticks = computed(() => [0, axisMax.value / 2, axisMax.value])

const percent = (value: number) => `${(value / axisMax.value) * 100}%`

// Seule la valeur la plus haute est écrite sur sa colonne ; les autres sont dans l'infobulle et le tableau
const labelled = computed(() => {
  const max = Math.max(0, ...props.columns.map((column) => column.value))
  if (max === 0) return null
  return [...props.columns].reverse().find((column) => column.value === max)?.key ?? null
})

const describe = (column: Column) =>
  `${column.title} : ${props.seriesName} ${column.value}` +
  (hasPrevious.value ? `, ${props.previousName} ${column.previous}` : '')
</script>

<style scoped>
.chart {
  --series-current: var(--color-series-current);
  --series-previous: var(--color-series-previous);
  --grid: var(--color-border);
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  min-width: 0;
}

.chart-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  list-style: none;
  padding: 0;
  font-size: 0.8125rem;
  color: var(--color-text-secondary);
}

.chart-legend li {
  display: flex;
  align-items: center;
  gap: 0.375rem;
}

.swatch {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 3px;
  margin-right: 0.375rem;
  flex: none;
}

.chart-legend .swatch {
  margin-right: 0;
}

.swatch-current {
  background: var(--series-current);
}

.swatch-previous {
  background: var(--series-previous);
}

/* Zone de tracé : 180px de barres, axe à gauche, libellés en dessous */
.chart-plot {
  position: relative;
  height: 210px;
  padding-left: 2rem;
}

.chart-grid {
  position: absolute;
  inset: 0 0 30px 2rem;
}

.grid-line {
  position: absolute;
  left: 0;
  right: 0;
  border-top: 1px solid var(--grid);
}

.grid-label {
  position: absolute;
  right: calc(100% + 0.5rem);
  transform: translateY(-50%);
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  font-variant-numeric: tabular-nums;
}

.chart-columns {
  position: relative;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(var(--columns), minmax(0, 1fr));
}

.chart-slot {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  outline: none;
  border-radius: 6px;
}

.chart-slot:hover,
.chart-slot:focus-visible {
  background: var(--color-background-soft);
}

.chart-slot:focus-visible {
  box-shadow: 0 0 0 2px var(--color-theme);
}

.chart-bars {
  flex: 1;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: 2px;
}

.bar {
  position: relative;
  width: min(24px, 40%);
  border-radius: 4px 4px 0 0;
  transition: height 0.3s;
}

.bar-current {
  background: var(--series-current);
}

.bar-previous {
  background: var(--series-previous);
}

.bar-value {
  position: absolute;
  bottom: calc(100% + 2px);
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-text);
  font-variant-numeric: tabular-nums;
}

.chart-label {
  height: 30px;
  line-height: 30px;
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  white-space: nowrap;
}

.chart-tooltip {
  position: absolute;
  bottom: calc(100% - 20px);
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  padding: 0.5rem 0.75rem;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  box-shadow: 0 4px 12px var(--color-shadow);
  font-size: 0.8125rem;
  color: var(--color-text);
  white-space: nowrap;
  pointer-events: none;
}

.chart-slot:first-child .chart-tooltip {
  left: 0;
  transform: none;
}

.chart-slot:last-child .chart-tooltip {
  left: auto;
  right: 0;
  transform: none;
}

.chart-tooltip strong {
  font-weight: 600;
  color: var(--color-heading);
}

.chart-table summary {
  cursor: pointer;
  font-size: 0.8125rem;
  color: var(--color-text-secondary);
}

.chart-table table {
  margin-top: 0.5rem;
  border-collapse: collapse;
  font-size: 0.8125rem;
}

.chart-table th,
.chart-table td {
  padding: 0.25rem 0.75rem 0.25rem 0;
  text-align: left;
  border-bottom: 1px solid var(--color-border);
}

.chart-table td {
  text-align: right;
  font-variant-numeric: tabular-nums;
}

.chart-table thead th {
  font-weight: 600;
  color: var(--color-heading);
}

/* Sur mobile, un libellé sur deux quand les colonnes sont nombreuses */
@media (max-width: 640px) {
  .chart-columns:has(> .chart-slot:nth-child(9)) .chart-slot:nth-child(even) .chart-label {
    visibility: hidden;
  }
}
</style>
