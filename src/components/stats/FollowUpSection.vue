<template>
  <section class="follow-up" aria-labelledby="follow-up-title">
    <header class="follow-up-header">
      <h2 id="follow-up-title">Patients à relancer</h2>
      <SegmentedControl v-model="view" :options="viewOptions" label="Patients à relancer" />
    </header>
    <p class="follow-up-intro">
      Patients dont le dernier soin date de plus de 1,5 fois leur rythme habituel. Les plus
      récemment en retard sont en premier.
      <template v-if="view === 'risk'">
        À risque : diabète, trouble de la coagulation ou trouble cardiaque.
      </template>
    </p>

    <p v-if="shown.length === 0" class="follow-up-empty">
      {{ view === 'risk' ? 'Aucun patient à risque en retard.' : 'Aucun patient en retard.' }}
    </p>

    <ul v-else class="late-list">
      <li v-for="late in visible" :key="late.patient.id" class="late-item">
        <div class="late-patient">
          <span class="late-name">{{ fullName(late.patient) }}</span>
          <span v-if="alerts(late).length" class="late-alerts">
            <span v-for="alert in alerts(late)" :key="alert.key" class="alert-badge">
              ⚠ {{ alert.label }}
            </span>
          </span>
          <span class="late-meta">
            Dernier soin le {{ formatDate(late.lastCare) }} · rythme habituel :
            {{ formatRhythm(late.interval) }} · attendu depuis
            <strong>{{ formatDuration(late.overdueDays) }}</strong>
          </span>
        </div>

        <div class="late-contact">
          <a v-if="late.patient.phoneNum" :href="telHref(late.patient.phoneNum)" class="phone">
            <MdiComponent :mdiValue="mdiPhone" class="phone-icon" />
            {{ late.patient.phoneNum }}
          </a>
          <span v-else class="no-phone">Pas de téléphone</span>
          <span
            v-if="late.patient.personOfContact || late.patient.personOfContactPhoneNumber"
            class="contact"
          >
            Contact : {{ late.patient.personOfContact || '—' }}
            <a
              v-if="late.patient.personOfContactPhoneNumber"
              :href="telHref(late.patient.personOfContactPhoneNumber)"
              class="contact-phone"
            >
              {{ late.patient.personOfContactPhoneNumber }}
            </a>
          </span>
        </div>
      </li>
    </ul>

    <button
      v-if="shown.length > visible.length"
      type="button"
      class="show-all"
      @click="showAll = true"
    >
      Afficher les {{ shown.length }} patients
    </button>

    <p v-if="unknownCount" class="follow-up-note">
      {{ unknownCount }} patient{{ unknownCount > 1 ? 's n’ont' : ' n’a' }} qu’un seul soin : rythme
      pas encore connu, non repris dans la liste.
    </p>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { mdiPhone } from '@mdi/js'
import MdiComponent from '@/components/icons/MdiComponent.vue'
import SegmentedControl from '@/components/stats/SegmentedControl.vue'
import type { PatientSummary } from '@/services/PatientService'
import { formatDate, fullName, patientAlerts } from '@/utils/patient'
import {
  formatDuration,
  formatRhythm,
  latePatients,
  telHref,
  unknownRhythmCount,
  type LatePatient
} from '@/utils/stats'

const props = defineProps<{ patients: PatientSummary[]; today: Date }>()

// Nombre de patients affichés avant « Afficher les … patients »
const PAGE_SIZE = 20

const view = ref<'all' | 'risk'>('all')
const showAll = ref(false)
watch(view, () => (showAll.value = false))

const late = computed(() => latePatients(props.patients, props.today))
const atRisk = computed(() => late.value.filter((item) => item.atRisk))
const shown = computed(() => (view.value === 'risk' ? atRisk.value : late.value))
const visible = computed(() => (showAll.value ? shown.value : shown.value.slice(0, PAGE_SIZE)))
const unknownCount = computed(() => unknownRhythmCount(props.patients))

const viewOptions = computed(() => [
  { value: 'all' as const, label: `Tous (${late.value.length})` },
  { value: 'risk' as const, label: `À risque (${atRisk.value.length})` }
])

// Alertes de risque seulement (les allergies ne changent rien au suivi)
const alerts = (item: LatePatient) =>
  patientAlerts(item.patient).filter((alert) => alert.key !== 'allergies')
</script>

<style scoped>
.follow-up {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.follow-up-header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

h2 {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-heading);
}

.follow-up-intro,
.follow-up-note,
.follow-up-empty {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
}

.late-list {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 10px;
  box-shadow: 0 1px 3px var(--color-shadow);
}

.late-item {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 0.5rem 1.5rem;
  padding: 0.75rem 1.25rem;
}

.late-item + .late-item {
  border-top: 1px solid var(--color-border);
}

.late-patient {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.25rem 0.5rem;
  min-width: 0;
}

.late-name {
  font-weight: 600;
  color: var(--color-heading);
}

.late-alerts {
  display: inline-flex;
  flex-wrap: wrap;
  gap: 0.25rem;
}

.alert-badge {
  padding: 0.0625rem 0.5rem;
  border-radius: 999px;
  background: rgba(217, 119, 6, 0.12);
  border: 1px solid rgba(217, 119, 6, 0.5);
  font-size: 0.75rem;
  font-weight: 500;
  white-space: nowrap;
}

.late-meta {
  flex-basis: 100%;
  font-size: 0.8125rem;
  color: var(--color-text-secondary);
}

.late-meta strong {
  font-weight: 600;
  color: var(--color-text);
}

.late-contact {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.125rem;
  text-align: right;
}

/* Le téléphone est l'information principale de la ligne : c'est elle qui sert à relancer */
.phone {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  background: var(--color-theme-light);
  color: var(--color-theme);
  font-size: 1rem;
  font-weight: 600;
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
}

.phone:hover {
  color: var(--color-theme-hover);
}

.phone-icon {
  width: 18px;
  height: 18px;
}

.no-phone {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  font-style: italic;
}

.contact {
  font-size: 0.8125rem;
  color: var(--color-text-secondary);
}

.contact-phone {
  font-weight: 600;
  white-space: nowrap;
}

.show-all {
  align-self: flex-start;
  padding: 0.375rem 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-surface);
  color: var(--color-theme);
  font: inherit;
  font-size: 0.875rem;
  cursor: pointer;
}

@media (max-width: 640px) {
  .late-item {
    grid-template-columns: 1fr;
  }

  .late-contact {
    align-items: flex-start;
    text-align: left;
  }
}
</style>
