<template>
  <!-- Contenu de l'onglet « Activité » de StatsView, qui en porte le titre -->
  <div class="stats-section">
    <div class="tiles">
      <StatTile label="Soins ce mois-ci" :value="summary.thisMonth">
        {{ lastMonthName }} : {{ summary.lastMonth }} · {{ sameMonthLastYearName }} :
        {{ summary.sameMonthLastYear }}
      </StatTile>
      <StatTile label="Soins depuis le 1er janvier" :value="summary.yearToDate">
        Même période {{ today.getFullYear() - 1 }} : {{ summary.lastYearToDate }}
        <template v-if="yearEvolution"> ({{ yearEvolution }})</template>
      </StatTile>
      <StatTile label="Nouveaux patients ce mois-ci" :value="newPatients.thisMonth">
        {{ lastMonthName }} : {{ newPatients.lastMonth }} · Depuis le 1er janvier :
        {{ newPatients.yearToDate }}
      </StatTile>
    </div>

    <StatCard
      title="Soins"
      :subtitle="
        careView === 'month'
          ? '12 derniers mois, comparés aux mêmes mois un an plus tôt'
          : '12 dernières semaines (du lundi au dimanche)'
      "
    >
      <template #actions>
        <SegmentedControl v-model="careView" :options="careViews" label="Période des soins" />
      </template>
      <ColumnChart
        v-if="careView === 'month'"
        :columns="monthlyCares"
        series-name="Soins"
        previous-name="Un an plus tôt"
        period-name="Mois"
      />
      <ColumnChart v-else :columns="weeklyCares" series-name="Soins" period-name="Semaine" />
    </StatCard>

    <div class="cards-row">
      <StatCard
        title="Nouveaux patients"
        subtitle="12 derniers mois, comptés au mois de leur premier soin"
      >
        <ColumnChart
          :columns="monthlyNewPatients"
          series-name="Nouveaux patients"
          period-name="Mois"
        />
      </StatCard>

      <StatCard
        title="Jours les plus chargés"
        subtitle="Soins des 12 derniers mois par jour de la semaine"
      >
        <ColumnChart :columns="weekdayCares" series-name="Soins" period-name="Jour" />
      </StatCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import ColumnChart from '@/components/stats/ColumnChart.vue'
import SegmentedControl from '@/components/stats/SegmentedControl.vue'
import StatCard from '@/components/stats/StatCard.vue'
import StatTile from '@/components/stats/StatTile.vue'
import type { ActivityStats } from '@/services/StatsService'
import {
  activitySummary,
  capitalize,
  monthName,
  monthlyColumns,
  weekdayColumns,
  weeklyColumns
} from '@/utils/stats'

const props = defineProps<{ activity: ActivityStats; today: Date }>()

const careView = ref<'month' | 'week'>('month')
const careViews = [
  { value: 'month' as const, label: 'Par mois' },
  { value: 'week' as const, label: 'Par semaine' }
]

const cares = computed(() => props.activity.cares)
const summary = computed(() => activitySummary(cares.value, props.today))
const newPatients = computed(() => activitySummary(props.activity.newPatients, props.today))
const monthlyCares = computed(() => monthlyColumns(cares.value, props.today))
const weeklyCares = computed(() => weeklyColumns(cares.value, props.today))
const weekdayCares = computed(() => weekdayColumns(cares.value, props.today))
const monthlyNewPatients = computed(() => monthlyColumns(props.activity.newPatients, props.today))

const lastMonthName = computed(() => {
  const month = new Date(props.today.getFullYear(), props.today.getMonth() - 1, 1)
  return capitalize(monthName(month).split(' ')[0])
})
const sameMonthLastYearName = computed(() =>
  capitalize(monthName(new Date(props.today.getFullYear() - 1, props.today.getMonth(), 1)))
)

// Évolution par rapport à la même période l'an dernier (rien sans soin l'an dernier)
const yearEvolution = computed(() => {
  const { yearToDate, lastYearToDate } = summary.value
  if (!lastYearToDate) return ''
  const evolution = Math.round(((yearToDate - lastYearToDate) / lastYearToDate) * 100)
  return `${evolution > 0 ? '+' : ''}${evolution} %`
})
</script>

<style scoped>
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
