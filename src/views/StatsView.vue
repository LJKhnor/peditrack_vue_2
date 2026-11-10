<template>
  <div class="stats">
    <h1>Statistiques</h1>

    <div class="stats-tabs" role="tablist" aria-label="Statistiques">
      <button
        v-for="(tab, index) in tabs"
        :id="`tab-${tab.value}`"
        :key="tab.value"
        :ref="(element) => (tabButtons[index] = element as HTMLButtonElement)"
        type="button"
        role="tab"
        :aria-selected="activeTab === tab.value"
        :aria-controls="`panel-${tab.value}`"
        :tabindex="activeTab === tab.value ? 0 : -1"
        :class="{ active: activeTab === tab.value }"
        @click="selectTab(tab.value)"
        @keydown="onTabKeydown($event, index)"
      >
        {{ tab.label }}
        <span v-if="tab.count !== undefined" class="tab-count">{{ tab.count }}</span>
      </button>
    </div>

    <p v-if="loading" class="stats-status">Chargement des statistiques…</p>

    <template v-else>
      <!-- v-show : chaque onglet garde son état (bascules, « Afficher les … patients ») -->
      <div
        v-for="tab in tabs"
        v-show="activeTab === tab.value"
        :id="`panel-${tab.value}`"
        :key="tab.value"
        role="tabpanel"
        :aria-labelledby="`tab-${tab.value}`"
        tabindex="0"
        class="stats-panel"
      >
        <template v-if="tab.value === 'clinique'">
          <p v-if="clinicalError" class="stats-status stats-error" role="alert">
            {{ clinicalError }}
          </p>
          <ClinicalSection v-else-if="clinical" :clinical="clinical" />
        </template>

        <template v-else-if="tab.value === 'activite'">
          <p v-if="activityError" class="stats-status stats-error" role="alert">
            {{ activityError }}
          </p>
          <ActivitySection v-else-if="activity" :activity="activity" :today="today" />
        </template>

        <template v-else>
          <p v-if="patientsError" class="stats-status stats-error" role="alert">
            {{ patientsError }}
          </p>
          <PatientsSection
            v-else-if="tab.value === 'patientele'"
            :patients="patients"
            :today="today"
          />
          <FollowUpSection v-else :patients="patients" :today="today" />
        </template>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ActivitySection from '@/components/stats/ActivitySection.vue'
import ClinicalSection from '@/components/stats/ClinicalSection.vue'
import FollowUpSection from '@/components/stats/FollowUpSection.vue'
import PatientsSection from '@/components/stats/PatientsSection.vue'
import { getPatientSummaries, type PatientSummary } from '@/services/PatientService'
import {
  getActivityStats,
  getClinicalStats,
  type ActivityStats,
  type ClinicalStats
} from '@/services/StatsService'
import { latePatients } from '@/utils/stats'

type TabValue = 'patientele' | 'activite' | 'relances' | 'clinique'

const route = useRoute()
const router = useRouter()

const today = new Date()
const activity = ref<ActivityStats | null>(null)
const clinical = ref<ClinicalStats | null>(null)
// Liste des patients (GET /patients/summary) : dernier soin, rythme habituel, alertes, téléphones,
// date de naissance, mutualité, médecin
const patients = ref<PatientSummary[]>([])
const loading = ref(true)
const activityError = ref('')
const clinicalError = ref('')
const patientsError = ref('')

const lateCount = computed(() =>
  loading.value || patientsError.value ? undefined : latePatients(patients.value, today).length
)

const tabs = computed<{ value: TabValue; label: string; count?: number }[]>(() => [
  { value: 'patientele', label: 'Patientèle' },
  { value: 'clinique', label: 'Profil clinique' },
  { value: 'activite', label: 'Activité' },
  { value: 'relances', label: 'Patients à relancer', count: lateCount.value }
])

// Onglet actif dans l'URL (?onglet=…) : il est conservé au rechargement de la page
const activeTab = computed<TabValue>(() => {
  const requested = route.query.onglet
  return tabs.value.some((tab) => tab.value === requested) ? (requested as TabValue) : 'patientele'
})

function selectTab(value: TabValue) {
  router.replace({ query: { ...route.query, onglet: value } })
}

// Navigation au clavier entre les onglets (flèches, Début, Fin), comme un onglet natif
const tabButtons = ref<HTMLButtonElement[]>([])
function onTabKeydown(event: KeyboardEvent, index: number) {
  const last = tabs.value.length - 1
  const target = {
    ArrowRight: index === last ? 0 : index + 1,
    ArrowLeft: index === 0 ? last : index - 1,
    Home: 0,
    End: last
  }[event.key]
  if (target === undefined) return
  event.preventDefault()
  selectTab(tabs.value[target].value)
  tabButtons.value[target]?.focus()
}

// Chaque onglet s'affiche même si la requête d'un autre échoue
onMounted(async () => {
  const [activityResult, patientsResult, clinicalResult] = await Promise.allSettled([
    getActivityStats(),
    getPatientSummaries(),
    getClinicalStats()
  ])
  if (activityResult.status === 'fulfilled') activity.value = activityResult.value
  else activityError.value = "Impossible de charger l'activité. Réessayez dans quelques instants."
  if (patientsResult.status === 'fulfilled') patients.value = patientsResult.value
  else {
    patientsError.value = 'Impossible de charger les patients. Réessayez dans quelques instants.'
  }
  if (clinicalResult.status === 'fulfilled') clinical.value = clinicalResult.value
  else {
    clinicalError.value =
      'Impossible de charger le profil clinique. Réessayez dans quelques instants.'
  }
  loading.value = false
})
</script>

<style scoped>
.stats {
  width: 100%;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

h1 {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-heading);
}

/* Même apparence que les onglets du dossier patient (Tabs.vue) */
.stats-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 0.75rem;
}

.stats-tabs button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 1rem;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  border-radius: 6px;
  cursor: pointer;
  font: inherit;
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  transition:
    color 0.2s,
    background 0.2s,
    border-color 0.2s;
}

.stats-tabs button:hover {
  color: var(--color-theme);
  border-color: var(--color-theme);
  background: var(--color-theme-light);
}

.stats-tabs button.active {
  background: var(--color-theme);
  border-color: var(--color-theme);
  color: #fff;
}

.stats-tabs button:focus-visible {
  outline: 2px solid var(--color-theme);
  outline-offset: 2px;
}

.tab-count {
  min-width: 1.5rem;
  padding: 0 0.375rem;
  border-radius: 999px;
  background: var(--color-background-mute);
  color: var(--color-text);
  font-size: 0.75rem;
  font-weight: 600;
  text-align: center;
  font-variant-numeric: tabular-nums;
}

.stats-tabs button.active .tab-count {
  background: rgba(255, 255, 255, 0.25);
  color: #fff;
}

.stats-panel:focus-visible {
  outline: 2px solid var(--color-theme);
  outline-offset: 4px;
  border-radius: 4px;
}

.stats-status {
  color: var(--color-text-secondary);
}

.stats-error {
  color: #b91c1c;
}
</style>
