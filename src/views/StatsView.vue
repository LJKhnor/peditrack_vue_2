<template>
  <div class="stats">
    <h1>Statistiques</h1>

    <p v-if="loading" class="stats-status">Chargement des statistiques…</p>

    <p v-else-if="activityError" class="stats-status stats-error" role="alert">
      {{ activityError }}
    </p>
    <section v-else-if="activity" class="stats-section" aria-labelledby="activity-title">
      <h2 id="activity-title">Activité</h2>

      <div class="tiles">
        <div class="tile">
          <span class="tile-label">Soins ce mois-ci</span>
          <span class="tile-value">{{ summary.thisMonth }}</span>
          <span class="tile-detail">
            {{ capitalize(lastMonthName) }} : {{ summary.lastMonth }} ·
            {{ sameMonthLastYearName }} : {{ summary.sameMonthLastYear }}
          </span>
        </div>
        <div class="tile">
          <span class="tile-label">Soins depuis le 1er janvier</span>
          <span class="tile-value">{{ summary.yearToDate }}</span>
          <span class="tile-detail">
            Même période {{ today.getFullYear() - 1 }} : {{ summary.lastYearToDate }}
            <template v-if="yearEvolution"> ({{ yearEvolution }})</template>
          </span>
        </div>
        <div class="tile">
          <span class="tile-label">Nouveaux patients ce mois-ci</span>
          <span class="tile-value">{{ newPatients.thisMonth }}</span>
          <span class="tile-detail">
            {{ capitalize(lastMonthName) }} : {{ newPatients.lastMonth }} · Depuis le 1er janvier :
            {{ newPatients.yearToDate }}
          </span>
        </div>
      </div>

      <article class="card">
        <header class="card-header">
          <h3>Soins</h3>
          <SegmentedControl v-model="careView" :options="careViews" label="Période des soins" />
        </header>
        <p class="card-subtitle">
          {{
            careView === 'month'
              ? '12 derniers mois, comparés aux mêmes mois un an plus tôt'
              : '12 dernières semaines (du lundi au dimanche)'
          }}
        </p>
        <ColumnChart
          v-if="careView === 'month'"
          :columns="monthlyCares"
          series-name="Soins"
          previous-name="Un an plus tôt"
          period-name="Mois"
        />
        <ColumnChart v-else :columns="weeklyCares" series-name="Soins" period-name="Semaine" />
      </article>

      <div class="cards-row">
        <article class="card">
          <h3>Nouveaux patients</h3>
          <p class="card-subtitle">12 derniers mois, comptés au mois de leur premier soin</p>
          <ColumnChart
            :columns="monthlyNewPatients"
            series-name="Nouveaux patients"
            period-name="Mois"
          />
        </article>

        <article class="card">
          <h3>Jours les plus chargés</h3>
          <p class="card-subtitle">Soins des 12 derniers mois par jour de la semaine</p>
          <ColumnChart :columns="weekdayCares" series-name="Soins" period-name="Jour" />
        </article>
      </div>
    </section>

    <template v-if="!loading">
      <p v-if="patientsError" class="stats-status stats-error" role="alert">
        {{ patientsError }}
      </p>
      <FollowUpSection v-else :patients="patients" :today="today" />
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import ColumnChart from '@/components/stats/ColumnChart.vue'
import FollowUpSection from '@/components/stats/FollowUpSection.vue'
import SegmentedControl from '@/components/stats/SegmentedControl.vue'
import { getPatientSummaries, type PatientSummary } from '@/services/PatientService'
import { getActivityStats, type ActivityStats } from '@/services/StatsService'
import {
  activitySummary,
  monthName,
  monthlyColumns,
  weekdayColumns,
  weeklyColumns
} from '@/utils/stats'

const today = new Date()
const activity = ref<ActivityStats | null>(null)
// Liste des patients (GET /patients/summary) : dernier soin, rythme habituel, alertes, téléphones
const patients = ref<PatientSummary[]>([])
const loading = ref(true)
const activityError = ref('')
const patientsError = ref('')
const careView = ref<'month' | 'week'>('month')
const careViews = [
  { value: 'month' as const, label: 'Par mois' },
  { value: 'week' as const, label: 'Par semaine' }
]

// Chaque section s'affiche même si l'autre requête échoue
onMounted(async () => {
  const [activityResult, patientsResult] = await Promise.allSettled([
    getActivityStats(),
    getPatientSummaries()
  ])
  if (activityResult.status === 'fulfilled') activity.value = activityResult.value
  else activityError.value = "Impossible de charger l'activité. Réessayez dans quelques instants."
  if (patientsResult.status === 'fulfilled') patients.value = patientsResult.value
  else {
    patientsError.value =
      'Impossible de charger les patients à relancer. Réessayez dans quelques instants.'
  }
  loading.value = false
})

const cares = computed(() => activity.value?.cares ?? [])
const summary = computed(() => activitySummary(cares.value, today))
const newPatients = computed(() => activitySummary(activity.value?.newPatients ?? [], today))
const monthlyCares = computed(() => monthlyColumns(cares.value, today))
const weeklyCares = computed(() => weeklyColumns(cares.value, today))
const weekdayCares = computed(() => weekdayColumns(cares.value, today))
const monthlyNewPatients = computed(() => monthlyColumns(activity.value?.newPatients ?? [], today))

const lastMonthName = monthName(new Date(today.getFullYear(), today.getMonth() - 1, 1)).split(
  ' '
)[0]
const sameMonthLastYearName = capitalize(
  monthName(new Date(today.getFullYear() - 1, today.getMonth(), 1))
)

// Évolution par rapport à la même période l'an dernier (rien sans soin l'an dernier)
const yearEvolution = computed(() => {
  const { yearToDate, lastYearToDate } = summary.value
  if (!lastYearToDate) return ''
  const evolution = Math.round(((yearToDate - lastYearToDate) / lastYearToDate) * 100)
  return `${evolution > 0 ? '+' : ''}${evolution} %`
})

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1)
}
</script>

<style scoped>
.stats {
  width: 100%;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

h1 {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-heading);
}

h2 {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-heading);
}

h3 {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-heading);
}

.stats-status {
  color: var(--color-text-secondary);
}

.stats-error {
  color: #b91c1c;
}

.stats-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.tiles {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
}

.tile,
.card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 10px;
  box-shadow: 0 1px 3px var(--color-shadow);
}

.tile {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 1rem 1.25rem;
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

.tile-detail {
  font-size: 0.8125rem;
  color: var(--color-text-secondary);
}

.card {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 1rem 1.25rem 1.25rem;
  min-width: 0;
}

.card-header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.card-subtitle {
  font-size: 0.8125rem;
  color: var(--color-text-secondary);
  margin-bottom: 0.5rem;
}

.cards-row {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

@media (max-width: 900px) {
  .cards-row {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .tiles {
    grid-template-columns: 1fr;
  }
}
</style>
