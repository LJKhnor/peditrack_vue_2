<template>
  <!-- Contenu de l'onglet « Patientèle » de StatsView, qui en porte le titre -->
  <div class="stats-section">
    <div class="tiles">
      <StatTile label="Patients" :value="patients.length">
        {{ activeCount }} vu{{ activeCount > 1 ? 's' : '' }} ces 12 derniers mois
      </StatTile>
      <StatTile label="Âge moyen" :value="ages.average === null ? '—' : `${ages.average} ans`">
        <template v-if="ages.youngest !== null">
          De {{ ages.youngest }} à {{ ages.oldest }} ans
        </template>
      </StatTile>
      <StatTile
        :label="
          topDoctors.length > 1 ? 'Médecins les plus référencés' : 'Médecin le plus référencé'
        "
        :value="topDoctorsLabel"
        text
      >
        <template v-if="topDoctors.length">
          {{ topDoctors[0].value }} patient{{ topDoctors[0].value > 1 ? 's' : '' }} ({{
            share(topDoctors[0].value, patients.length)
          }})
          {{ topDoctors.length > 1 ? 'chacun' : '' }}
        </template>
      </StatTile>
    </div>

    <div class="cards-row">
      <StatCard title="Tranches d'âge" :subtitle="`${patients.length} patients`">
        <ColumnChart :columns="ages.columns" series-name="Patients" period-name="Âge" />
        <p v-if="ages.unknown" class="card-note">
          {{ ages.unknown }} patient{{ ages.unknown > 1 ? 's' : '' }} sans date de naissance
        </p>
      </StatCard>

      <StatCard title="Mutualités" :subtitle="`${patients.length} patients`">
        <BarList :items="mutuals.items" :total="patients.length" label="Patients par mutualité" />
        <p v-if="mutuals.missing" class="card-note">
          Mutualité non renseignée : {{ mutuals.missing }} patient{{
            mutuals.missing > 1 ? 's' : ''
          }}
        </p>
      </StatCard>
    </div>

    <StatCard
      title="Médecins traitants"
      :subtitle="`Les ${visibleDoctors.length} médecins qui suivent le plus de patients`"
    >
      <BarList
        :items="visibleDoctors"
        :total="patients.length"
        label="Patients par médecin traitant"
      />
      <p v-if="otherDoctors.count || doctors.missing" class="card-note">
        <template v-if="otherDoctors.count">
          Et {{ otherDoctors.count }} autre{{ otherDoctors.count > 1 ? 's' : '' }} médecin{{
            otherDoctors.count > 1 ? 's' : ''
          }}
          ({{ otherDoctors.patients }} patient{{ otherDoctors.patients > 1 ? 's' : '' }}).
        </template>
        <template v-if="doctors.missing">
          Médecin non renseigné : {{ doctors.missing }} patient{{ doctors.missing > 1 ? 's' : '' }}.
        </template>
      </p>
    </StatCard>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import BarList from '@/components/stats/BarList.vue'
import ColumnChart from '@/components/stats/ColumnChart.vue'
import StatCard from '@/components/stats/StatCard.vue'
import StatTile from '@/components/stats/StatTile.vue'
import type { PatientSummary } from '@/services/PatientService'
import { ageDistribution, daysBetween, doctorKey, leaders, ranking, share } from '@/utils/stats'

const props = defineProps<{ patients: PatientSummary[]; today: Date }>()

// Nombre de médecins affichés dans le classement
const DOCTORS_SHOWN = 5

const ages = computed(() => ageDistribution(props.patients, props.today))
const mutuals = computed(() => ranking(props.patients.map((patient) => patient.mutual)))
const doctors = computed(() =>
  ranking(
    props.patients.map((patient) => patient.doctor),
    doctorKey
  )
)
const topDoctors = computed(() => leaders(doctors.value.items))
// Ex aequo : jusqu'à 3 noms, au-delà seulement leur nombre
const topDoctorsLabel = computed(() => {
  const names = topDoctors.value.map((doctor) => doctor.label)
  if (names.length === 0) return '—'
  return names.length > 3 ? `${names.length} médecins ex aequo` : names.join(', ')
})
const visibleDoctors = computed(() => doctors.value.items.slice(0, DOCTORS_SHOWN))
const otherDoctors = computed(() => {
  const others = doctors.value.items.slice(DOCTORS_SHOWN)
  return { count: others.length, patients: others.reduce((sum, item) => sum + item.value, 0) }
})

// Patients dont le dernier soin date de moins d'un an
const activeCount = computed(
  () =>
    props.patients.filter(
      (patient) => patient.lastVisit && daysBetween(new Date(patient.lastVisit), props.today) < 365
    ).length
)
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

.card-note {
  margin-top: 0.75rem;
  font-size: 0.8125rem;
  color: var(--color-text-secondary);
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
