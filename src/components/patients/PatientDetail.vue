<template>
  <BaseModal :title="title" size="large" @close="emit('close')">
    <template #header>
      <div class="detail-header">
        <span class="detail-avatar" aria-hidden="true">{{ patient ? initials(patient) : '' }}</span>
        <div class="detail-identity">
          <h2>{{ title }}</h2>
          <p v-if="patient" class="detail-meta">
            {{ ageLabel }}
            <template v-if="patient.birthdate">
              · né(e) le {{ formatDate(patient.birthdate) }}</template
            >
          </p>
        </div>
        <div v-if="patient" class="detail-actions">
          <!-- Encodage du soin sur la page Patients, avec ce patient déjà sélectionné -->
          <RouterLink
            :to="{ name: 'patient', query: { mode: 'soin', patientId: patient.id } }"
            class="header-btn"
          >
            <MdiComponent :mdiValue="mdiPlus" />
            Nouveau soin
          </RouterLink>
          <!-- RDV-DESACTIVE : à réactiver avec la prise de rendez-vous -->
          <!-- <button type="button" class="header-btn" @click="emit('newAppointment')">
            Nouveau RDV
          </button> -->
        </div>
      </div>
    </template>

    <div v-if="loading" class="detail-empty">Chargement…</div>
    <div v-else-if="error || !record" class="detail-empty">
      Impossible de charger le dossier du patient.
    </div>

    <template v-else>
      <div v-if="alerts.length" class="detail-alerts">
        <span v-for="alert in alerts" :key="alert.key" class="alert-badge"
          >⚠ {{ alert.label }}</span
        >
      </div>

      <div class="detail-tabs" role="tablist">
        <button
          v-for="tab in tabs"
          :key="tab.value"
          type="button"
          role="tab"
          :aria-selected="activeTab === tab.value"
          :class="{ active: activeTab === tab.value }"
          @click="activeTab = tab.value"
        >
          {{ tab.label }}
        </button>
      </div>

      <div v-if="activeTab === 'medical'">
        <div v-if="health" class="health-layout">
          <div class="health-grid">
            <div v-for="field in healthFields" :key="field.label" class="health-card">
              <span class="health-label">{{ field.label }}</span>
              <span class="health-value">{{ field.value }}</span>
            </div>
          </div>
          <CareTimeline class="health-timeline" :history="careHistory" />
        </div>
        <div v-else class="detail-empty">Aucune donnée de santé disponible pour ce patient.</div>
      </div>

      <div v-else-if="activeTab === 'contact'" class="health-grid">
        <div v-for="field in contactFields" :key="field.label" class="health-card">
          <span class="health-label">{{ field.label }}</span>
          <span class="health-value">{{ field.value }}</span>
        </div>
      </div>

      <!-- RDV-DESACTIVE : onglet Rendez-vous (à venir et passés : date, heure, type, statut) -->
      <!-- <div v-else-if="activeTab === 'appointments'">
        <p v-if="appointments.length === 0" class="detail-empty">Aucun rendez-vous.</p>
        <table v-else class="appointments-table">
          <thead>
            <tr><th>Date</th><th>Heure</th><th>Type</th><th>Statut</th></tr>
          </thead>
          <tbody>
            <tr v-for="appointment in appointments" :key="appointment.id">
              <td>{{ formatDate(appointment.start) }}</td>
              <td>{{ appointment.time }}</td>
              <td>{{ appointment.type }}</td>
              <td>{{ appointment.status }}</td>
            </tr>
          </tbody>
        </table>
      </div> -->
    </template>

    <template #footer>
      <button type="button" class="btn" @click="emit('close')">Fermer</button>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { mdiPlus } from '@mdi/js'
import BaseModal from './BaseModal.vue'
import MdiComponent from '@/components/icons/MdiComponent.vue'
import CareTimeline from '@/components/CareTimeline.vue'
import type { PatientRecord } from '@/services/PatientService'
import { computeAge, formatDate, fullName, initials, patientAlerts } from '@/utils/patient'

const props = defineProps<{ record: PatientRecord | null; loading?: boolean; error?: boolean }>()

const emit = defineEmits<{ close: [] }>()

const tabs = [
  { value: 'medical', label: 'Dossier médical' },
  { value: 'contact', label: 'Coordonnées' }
  // RDV-DESACTIVE : { value: 'appointments', label: 'Rendez-vous' }
]
const activeTab = ref('medical')

const patient = computed(() => props.record?.patientDto ?? null)
const health = computed(() => props.record?.healthDto ?? null)
const alerts = computed(() => patientAlerts(health.value))

const title = computed(() => (patient.value ? fullName(patient.value) : 'Dossier patient'))

const ageLabel = computed(() => {
  const age = computeAge(patient.value?.birthdate)
  return age === null ? 'Âge inconnu' : `${age} ans`
})

// Historique des soins : `healthHistory` est fourni par l'API (GET /patients/{id}).
// S'il est absent, on affiche au moins le dernier soin (healthDto).
const careHistory = computed(() => {
  const record = props.record
  if (!record) return []
  if (Array.isArray(record.healthHistory)) return record.healthHistory
  return record.healthDto ? [record.healthDto] : []
})

function displayContent(value: string | null | undefined, fallback = '—') {
  return value == null || value === '' ? fallback : value
}

function yesNo(value: boolean | undefined) {
  return value ? '✅' : '❌'
}

function diabeteLabel(type: number | undefined) {
  if (type == null) return 'Non renseigné'
  if (type === 0) return 'Non'
  return 'Oui, type ' + type
}

const healthFields = computed(() => {
  const h = health.value
  if (!h) return []
  return [
    { label: 'Diabète', value: diabeteLabel(h.diabeteType) },
    { label: 'Groupe', value: h.groupType ? `Groupe ${h.groupType}` : '—' },
    { label: 'Allergies', value: displayContent(h.allergies) },
    { label: 'Médicaments', value: displayContent(h.drugs) },
    { label: 'Problèmes sanguins', value: yesNo(h.withBleedingDisorder) },
    { label: 'Problèmes cardiaques', value: yesNo(h.withHeartDisorder) },
    { label: 'Problèmes thyroïdiens', value: yesNo(h.withThyroideDisorder) },
    { label: 'Prothèse de hanche', value: yesNo(h.hasHipProsthesis) },
    { label: 'Prothèse de genoux', value: yesNo(h.hasKneeProsthesis) },
    { label: 'Maladies récentes', value: yesNo(h.hasRecentDiseases) },
    { label: 'Opérations récentes', value: yesNo(h.hasRecentOperations) },
    { label: 'Conseils', value: displayContent(h.advice) },
    { label: 'Type circulatoire', value: displayContent(h.circulationType) },
    { label: 'Type dermatose', value: displayContent(h.dermatosisType) },
    { label: 'Type déformation du pied', value: displayContent(h.footDeformityType) },
    { label: 'Type pied', value: displayContent(h.footType) },
    { label: "Type d'ongle", value: displayContent(h.nailConditionType) },
    { label: 'Blessures possibles', value: displayContent(h.possibleWounds) },
    { label: 'Type de remarques', value: displayContent(h.remarkType) },
    { label: 'Type de peau', value: displayContent(h.skinType) },
    { label: 'Type de sueur', value: displayContent(h.sweatType) }
  ]
})

const contactFields = computed(() => {
  const p = patient.value
  if (!p) return []
  return [
    { label: 'Téléphone', value: displayContent(p.phoneNum) },
    { label: 'Email', value: displayContent(p.email) },
    { label: 'Adresse', value: displayContent(p.address) },
    { label: 'Mutualité', value: displayContent(p.mutual) },
    { label: 'Médecin traitant', value: displayContent(p.doctor) },
    { label: 'Conseillé par', value: displayContent(p.referenceBy) },
    { label: 'Personne de contact', value: displayContent(p.personOfContact) },
    { label: 'Téléphone du contact', value: displayContent(p.personOfContactPhoneNumber) },
    { label: 'Commentaires', value: displayContent(p.comments) }
  ]
})
</script>

<style scoped>
.detail-header {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.75rem 1rem;
}

.detail-avatar {
  flex: none;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.875rem;
}

.detail-identity {
  flex: 1;
  min-width: 10rem;
}

.detail-identity h2 {
  margin: 0;
  font-size: 1.0625rem;
  font-weight: 700;
}

.detail-meta {
  font-size: 0.8125rem;
  opacity: 0.85;
}

.detail-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

/* Bouton plein (couleurs de la surface) : contrasté sur le bandeau vert en thème clair
   comme en thème sombre, où le bandeau devient vert clair */
.header-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.45rem 1rem 0.45rem 0.75rem;
  border-radius: 6px;
  border: none;
  background: var(--color-surface);
  color: var(--color-heading);
  font-size: 0.875rem;
  font-weight: 600;
  text-decoration: none;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition:
    background 0.2s,
    box-shadow 0.2s;
}

/* lien : on neutralise la couleur de survol globale des liens */
.header-btn:hover {
  background: var(--color-background-soft);
  color: var(--color-heading);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
}

.header-btn .mdi-component {
  width: 18px;
  height: 18px;
}

.detail-empty {
  text-align: center;
  color: var(--color-text-secondary);
  padding: 2.5rem 0;
  font-style: italic;
}

.detail-alerts {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.alert-badge {
  padding: 0.2rem 0.625rem;
  border-radius: 999px;
  background: rgba(217, 119, 6, 0.12);
  border: 1px solid rgba(217, 119, 6, 0.5);
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--color-text);
}

.detail-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 0.75rem;
  margin-bottom: 1.25rem;
}

.detail-tabs button {
  padding: 0.4rem 1rem;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  transition:
    color 0.2s,
    background 0.2s,
    border-color 0.2s;
}

.detail-tabs button:hover {
  color: var(--color-theme);
  border-color: var(--color-theme);
  background: var(--color-theme-light);
}

.detail-tabs button.active {
  background: var(--color-theme);
  border-color: var(--color-theme);
  color: #fff;
}

/* ── Dossier médical : infos à gauche, timeline à droite ── */
.health-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
  gap: 1.5rem;
  align-items: start;
}

.health-timeline {
  position: sticky;
  top: 0;
  padding-left: 1.5rem;
  border-left: 1px solid var(--color-border);
}

.health-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.875rem;
}

.health-card {
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 0.875rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0;
}

.health-label {
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.health-value {
  font-size: 0.9375rem;
  color: var(--color-text);
  font-weight: 500;
  overflow-wrap: anywhere;
}

@media (max-width: 900px) {
  .health-layout {
    grid-template-columns: 1fr;
  }

  .health-timeline {
    position: static;
    padding-left: 0;
    padding-top: 1.5rem;
    border-left: none;
    border-top: 1px solid var(--color-border);
  }
}

@media (max-width: 560px) {
  .health-grid {
    grid-template-columns: 1fr;
  }
}
</style>
