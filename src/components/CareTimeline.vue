<template>
  <section class="care-timeline">
    <h3>Historique des soins</h3>

    <p v-if="entries.length === 0" class="timeline-empty">Aucun soin enregistré.</p>

    <ol v-else class="timeline">
      <li v-for="(entry, index) in entries" :key="index" class="timeline-item">
        <span class="timeline-dot" aria-hidden="true"></span>
        <details class="timeline-content">
          <summary>
            <span class="timeline-date">{{ formatDate(entry.careDate) }}</span>
            <span class="timeline-care">{{ displayContent(entry.care, 'Soin non précisé') }}</span>
          </summary>
          <dl class="timeline-details">
            <dt>Produits utilisés</dt>
            <dd>{{ displayContent(entry.usedProducts) }}</dd>
            <dt>Matériel utilisé</dt>
            <dd>{{ displayContent(entry.usedTools) }}</dd>
            <dt>Blessures possibles</dt>
            <dd>{{ displayContent(entry.possibleWounds) }}</dd>
            <dt>Conseils donnés</dt>
            <dd>{{ displayContent(entry.advice) }}</dd>
          </dl>
        </details>
      </li>
    </ol>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'

export interface CareEntry {
  careDate?: string | number | null
  care?: string | null
  usedProducts?: string | null
  usedTools?: string | null
  possibleWounds?: string | null
  advice?: string | null
}

const props = defineProps<{ history: CareEntry[] }>()

function toTime(value: CareEntry['careDate']): number {
  if (value == null || value === '') return NaN
  return new Date(value).getTime()
}

// On ignore les fiches sans date ni soin (ex. fiche créée à l'inscription du patient),
// puis on trie du plus récent au plus ancien ; les dates inconnues vont en fin de liste.
const entries = computed(() =>
  props.history
    .filter((entry) => !isNaN(toTime(entry.careDate)) || displayContent(entry.care, '') !== '')
    .sort((a, b) => {
      const ta = toTime(a.careDate)
      const tb = toTime(b.careDate)
      if (isNaN(ta)) return 1
      if (isNaN(tb)) return -1
      return tb - ta
    })
)

function formatDate(value: CareEntry['careDate']): string {
  const time = toTime(value)
  if (isNaN(time)) return 'Date inconnue'
  return new Date(time).toLocaleDateString('fr-BE', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })
}

function displayContent(value: string | null | undefined, fallback = '—'): string {
  return value == null || value === '' ? fallback : value
}
</script>

<style scoped>
h3 {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-heading);
  margin-bottom: 0.875rem;
}

.timeline-empty {
  color: var(--color-text-secondary);
  font-style: italic;
  font-size: 0.875rem;
}

.timeline {
  list-style: none;
  margin: 0;
  padding: 0 0 0 1.25rem;
  border-left: 2px solid var(--color-border);
}

.timeline-item {
  position: relative;
  padding-bottom: 0.875rem;
}

.timeline-item:last-child {
  padding-bottom: 0;
}

.timeline-dot {
  position: absolute;
  left: calc(-1.25rem - 6px);
  top: 0.95rem;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--color-theme);
  border: 2px solid var(--color-surface);
}

.timeline-content {
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 0.625rem 1rem;
}

.timeline-content summary {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.25rem 0.75rem;
  cursor: pointer;
}

.timeline-date {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-theme);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.timeline-care {
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--color-text);
}

.timeline-details {
  display: grid;
  grid-template-columns: max-content 1fr;
  gap: 0.375rem 1rem;
  margin: 0.75rem 0 0.25rem;
  font-size: 0.875rem;
}

.timeline-details dt {
  color: var(--color-text-secondary);
  font-weight: 600;
}

.timeline-details dd {
  margin: 0;
  color: var(--color-text);
}

@media (max-width: 767px) {
  .timeline-details {
    grid-template-columns: 1fr;
  }

  .timeline-details dd {
    margin-bottom: 0.375rem;
  }
}
</style>
