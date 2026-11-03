<template>
  <div class="data">
    <div class="data-header">
      <h1>Données patients</h1>
      <RouterLink :to="CREATE_PATIENT_ROUTE" class="btn">+ Nouveau patient</RouterLink>
    </div>

    <div class="data-toolbar">
      <input
        v-model="search"
        type="search"
        class="search-input"
        placeholder="Rechercher : nom, prénom, téléphone, email…"
        aria-label="Rechercher un patient"
      />
      <div class="filters" role="group" aria-label="Filtres">
        <button
          v-for="option in FILTERS"
          :key="option.value"
          type="button"
          class="filter-chip"
          :class="{ active: filter === option.value }"
          :aria-pressed="filter === option.value"
          @click="filter = option.value"
        >
          {{ option.label }}
        </button>
      </div>
    </div>

    <p v-if="loadError" class="load-error">Impossible de charger la liste des patients.</p>

    <template v-else>
      <div class="data-summary">
        <span class="patient-count">
          {{ countLabel }}
          <template v-if="isFiltered && !loading"> sur {{ patients.length }}</template>
        </span>
        <span v-if="recordsPending > 0" class="records-hint">
          Chargement des dossiers médicaux… {{ recordsTotal - recordsPending }}/{{ recordsTotal }}
        </span>
        <span v-else-if="recordsFailed > 0" class="records-hint records-hint-error">
          {{ recordsFailed }} dossier(s) n'ont pas pu être chargés : leurs alertes ne sont pas
          affichées.
        </span>
      </div>

      <div v-if="loading" class="empty-state">Chargement des patients…</div>

      <div v-else-if="visibleRows.length === 0" class="empty-state">
        <p v-if="patients.length === 0">Aucun patient enregistré pour l'instant.</p>
        <p v-else>Aucun patient ne correspond à votre recherche.</p>
        <p class="empty-actions">
          <RouterLink :to="CREATE_PATIENT_ROUTE">Créer un patient</RouterLink>
          <template v-if="isFiltered">
            ·
            <a href="#" @click.prevent="resetFilters">Effacer les filtres</a>
          </template>
        </p>
      </div>

      <div v-else class="table-wrapper">
        <table class="patients-table">
          <thead>
            <tr>
              <th v-for="column in COLUMNS" :key="column.label" scope="col">
                <button
                  v-if="column.sort"
                  type="button"
                  class="sort-btn"
                  :class="{ active: sortKey === column.sort }"
                  :aria-sort="ariaSort(column.sort)"
                  @click="toggleSort(column.sort)"
                >
                  {{ column.label }}
                  <span class="sort-arrow" aria-hidden="true">{{ sortArrow(column.sort) }}</span>
                </button>
                <template v-else>{{ column.label }}</template>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="row in visibleRows"
              :key="row.patient.id"
              @click="openDetail(row.patient.id)"
            >
              <td class="cell-patient">
                <div class="patient-cell">
                  <span class="avatar" aria-hidden="true">{{ initials(row.patient) }}</span>
                  <span class="patient-identity">
                    <span class="patient-name">
                      {{ row.patient.name }} {{ row.patient.firstname }}
                    </span>
                    <span v-if="row.patient.email" class="patient-email">
                      {{ row.patient.email }}
                    </span>
                  </span>
                </div>
              </td>
              <td data-label="Âge">{{ row.age === null ? '—' : `${row.age} ans` }}</td>
              <td data-label="Téléphone">{{ row.patient.phoneNum || '—' }}</td>
              <td data-label="Dernière visite">
                {{ row.lastVisit === undefined ? pendingMark(row) : formatDate(row.lastVisit) }}
              </td>
              <!-- RDV-DESACTIVE : colonne « Prochain RDV » -->
              <!-- <td data-label="Prochain RDV">{{ formatDate(nextAppointment(row.patient)) }}</td> -->
              <td data-label="Alertes" class="cell-alerts">
                <template v-if="row.alerts === undefined">{{ pendingMark(row) }}</template>
                <template v-else-if="row.alerts.length === 0">—</template>
                <span v-else class="alert-list">
                  <span v-for="alert in row.alerts" :key="alert.key" class="alert-badge">
                    ⚠ {{ alert.label }}
                  </span>
                </span>
              </td>
              <td class="cell-actions">
                <!-- Boutons visibles quand il y a la place, sinon remplacés par le rouage -->
                <div class="row-actions">
                  <button type="button" class="row-btn" @click.stop="openDetail(row.patient.id)">
                    Fiche
                  </button>
                  <!-- RDV-DESACTIVE : modale RDV pré-remplie avec ce patient -->
                  <!-- <button type="button" class="row-btn" @click.stop="openAppointment(row.patient.id)">
                    Nouveau RDV
                  </button> -->
                  <button type="button" class="row-btn" @click.stop="openEdit(row.patient.id)">
                    Modifier
                  </button>
                  <button
                    type="button"
                    class="row-btn row-btn-danger"
                    @click.stop="askDelete(row.patient.id)"
                  >
                    Supprimer
                  </button>
                </div>
                <button
                  type="button"
                  class="row-btn row-menu-btn"
                  aria-haspopup="menu"
                  :aria-expanded="menu?.id === row.patient.id"
                  :aria-label="`Actions pour ${row.patient.firstname} ${row.patient.name}`"
                  @click.stop="toggleMenu(row.patient.id, $event)"
                >
                  ⚙
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>

    <p v-if="actionError" class="load-error">{{ actionError }}</p>

    <!-- Menu du rouage, hors du tableau pour ne pas être coupé par son défilement -->
    <Teleport to="body">
      <div v-if="menu" class="row-menu" role="menu" :style="menu.style" @click.stop>
        <button type="button" role="menuitem" @click="runMenuAction(openDetail)">Fiche</button>
        <!-- RDV-DESACTIVE : modale RDV pré-remplie avec ce patient -->
        <!-- <button type="button" role="menuitem" @click="runMenuAction(openAppointment)">
          Nouveau RDV
        </button> -->
        <button type="button" role="menuitem" @click="runMenuAction(openEdit)">Modifier</button>
        <button
          type="button"
          role="menuitem"
          class="row-menu-danger"
          @click="runMenuAction(askDelete)"
        >
          Supprimer
        </button>
      </div>
    </Teleport>

    <PatientDetail
      v-if="modal?.kind === 'detail'"
      :record="records[modal.id] ?? null"
      :loading="detailLoading"
      :error="detailError"
      @close="modal = null"
    />

    <PatientForm
      v-if="modal?.kind === 'edit' && editedPatient"
      :patient="editedPatient"
      :patients="patients"
      @close="modal = null"
      @saved="onSaved"
    />

    <BaseModal v-if="modal?.kind === 'delete'" title="Supprimer le patient" @close="closeDelete">
      <p v-if="deleteError" class="load-error delete-error">{{ deleteError }}</p>
      <p>
        Supprimer <strong>{{ patientName(modal.id) }}</strong> ? Le patient n'apparaîtra plus dans
        l'application ; son dossier et son historique de soins sont conservés en base, comme l'exige
        l'obligation légale de conservation.
      </p>
      <template #footer>
        <button type="button" class="row-btn" :disabled="deleting" @click="closeDelete">
          Annuler
        </button>
        <button
          type="button"
          class="btn btn-danger"
          :disabled="deleting"
          @click="confirmDelete(modal.id)"
        >
          {{ deleting ? 'Suppression…' : 'Supprimer' }}
        </button>
      </template>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import BaseModal from '@/components/patients/BaseModal.vue'
import PatientDetail from '@/components/patients/PatientDetail.vue'
import PatientForm from '@/components/patients/PatientForm.vue'
import {
  deletePatient,
  getPatientRecord,
  getPatients,
  type Patient,
  type PatientRecord
} from '@/services/PatientService'
import {
  computeAge,
  formatDate,
  fullName,
  initials,
  lastVisit,
  matchesSearch,
  patientAlerts,
  type AlertKey,
  type PatientAlert
} from '@/utils/patient'

type FilterKey = 'all' | 'alerts' | AlertKey // RDV-DESACTIVE : | 'noAppointment'
type SortKey = 'name' | 'age' | 'lastVisit' // RDV-DESACTIVE : | 'nextAppointment'
type Modal =
  | { kind: 'detail'; id: number }
  | { kind: 'edit'; id: number }
  | { kind: 'delete'; id: number }

// La création d'un patient se fait sur la page Patients (formulaire de création ouvert)
const CREATE_PATIENT_ROUTE = { name: 'patient', query: { mode: 'creation' } }

interface Row {
  patient: Patient
  age: number | null
  failed: boolean
  // undefined tant que le dossier médical n'est pas chargé
  lastVisit: string | null | undefined
  alerts: PatientAlert[] | undefined
}

const FILTERS: { value: FilterKey; label: string }[] = [
  { value: 'all', label: 'Tous' },
  // Masqué pour le moment : { value: 'alerts', label: '⚠ Alertes' },
  { value: 'diabetes', label: 'Diabète' },
  { value: 'bleeding', label: 'Troubles de la coagulation' }
  // RDV-DESACTIVE : { value: 'noAppointment', label: 'Sans RDV planifié' }
]

const COLUMNS: { label: string; sort?: SortKey }[] = [
  { label: 'Patient', sort: 'name' },
  { label: 'Âge', sort: 'age' },
  { label: 'Téléphone' },
  { label: 'Dernière visite', sort: 'lastVisit' },
  // RDV-DESACTIVE : { label: 'Prochain RDV', sort: 'nextAppointment' },
  { label: 'Alertes' },
  { label: 'Actions' }
]

// Nombre de dossiers médicaux chargés en parallèle après la liste
const RECORD_CONCURRENCY = 4

const patients = ref<Patient[]>([])
const records = ref<Record<number, PatientRecord>>({})
const loading = ref(true)
const loadError = ref(false)
const recordsTotal = ref(0)
const recordsPending = ref(0)
const recordsFailed = ref(0)
const failedIds = ref<Record<number, true>>({})

const search = ref('')
const filter = ref<FilterKey>('all')
const sortKey = ref<SortKey>('name')
const sortDir = ref<1 | -1>(1)

const modal = ref<Modal | null>(null)
const detailLoading = ref(false)
const detailError = ref(false)
const actionError = ref('')
const deleting = ref(false)
const deleteError = ref('')

// Hauteur approximative du menu du rouage, pour l'ouvrir vers le haut en bas d'écran
const MENU_HEIGHT = 130
const menu = ref<{ id: number; style: Record<string, string> } | null>(null)

let active = true

onMounted(() => {
  loadPatients()
  document.addEventListener('click', closeMenu)
  document.addEventListener('keydown', onKeydown)
  // capture : ferme aussi le menu quand on fait défiler le cadre du tableau
  window.addEventListener('scroll', closeMenu, true)
  window.addEventListener('resize', closeMenu)
})
onUnmounted(() => {
  active = false
  document.removeEventListener('click', closeMenu)
  document.removeEventListener('keydown', onKeydown)
  window.removeEventListener('scroll', closeMenu, true)
  window.removeEventListener('resize', closeMenu)
})

function toggleMenu(id: number, event: MouseEvent) {
  if (menu.value?.id === id) {
    closeMenu()
    return
  }
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
  const openUp = rect.bottom + MENU_HEIGHT > window.innerHeight
  menu.value = {
    id,
    style: {
      right: `${window.innerWidth - rect.right}px`,
      ...(openUp
        ? { bottom: `${window.innerHeight - rect.top + 4}px` }
        : { top: `${rect.bottom + 4}px` })
    }
  }
}

function closeMenu() {
  menu.value = null
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') closeMenu()
}

function runMenuAction(action: (id: number) => unknown) {
  const id = menu.value?.id
  closeMenu()
  if (id !== undefined) action(id)
}

async function loadPatients() {
  try {
    patients.value = await getPatients()
  } catch (error) {
    console.error('Erreur lors de la récupération des patients :', error)
    loadError.value = true
    return
  } finally {
    loading.value = false
  }
  loadRecords(patients.value.map((patient) => patient.id))
}

// La liste de l'API ne contient pas les données de santé : on charge chaque dossier
// en arrière-plan pour afficher alertes et dernière visite.
async function loadRecords(ids: number[]) {
  recordsTotal.value = ids.length
  recordsPending.value = ids.length
  let next = 0
  async function worker() {
    while (active && next < ids.length) {
      const id = ids[next++]
      try {
        records.value[id] = await getPatientRecord(id)
      } catch (error) {
        console.error(`Erreur lors du chargement du dossier ${id} :`, error)
        failedIds.value[id] = true
        recordsFailed.value++
      } finally {
        recordsPending.value--
      }
    }
  }
  await Promise.all(Array.from({ length: Math.min(RECORD_CONCURRENCY, ids.length) }, worker))
}

function historyOf(record: PatientRecord) {
  if (Array.isArray(record.healthHistory)) return record.healthHistory
  return record.healthDto ? [record.healthDto] : []
}

const rows = computed<Row[]>(() =>
  patients.value.map((patient) => {
    const record = records.value[patient.id]
    return {
      patient,
      age: computeAge(patient.birthdate),
      failed: !record && !!failedIds.value[patient.id],
      lastVisit: record ? lastVisit(historyOf(record)) : undefined,
      alerts: record ? patientAlerts(record.healthDto) : undefined
    }
  })
)

// « … » pendant le chargement du dossier, « ? » s'il n'a pas pu être chargé
function pendingMark(row: Row) {
  return row.failed ? '?' : '…'
}

function matchesFilter(row: Row): boolean {
  if (filter.value === 'all') return true
  if (!row.alerts) return false
  if (filter.value === 'alerts') return row.alerts.length > 0
  return row.alerts.some((alert) => alert.key === filter.value)
}

function compareRows(a: Row, b: Row): number {
  if (sortKey.value === 'name') {
    const byName = a.patient.name.localeCompare(b.patient.name, 'fr', { sensitivity: 'base' })
    return (
      byName ||
      (a.patient.firstname ?? '').localeCompare(b.patient.firstname ?? '', 'fr', {
        sensitivity: 'base'
      })
    )
  }
  if (sortKey.value === 'age') return (a.age as number) - (b.age as number)
  return new Date(a.lastVisit as string).getTime() - new Date(b.lastVisit as string).getTime()
}

function sortValue(row: Row) {
  if (sortKey.value === 'age') return row.age
  if (sortKey.value === 'lastVisit') return row.lastVisit
  return row.patient.name
}

const visibleRows = computed(() => {
  const filtered = rows.value.filter(
    (row) => matchesSearch(row.patient, search.value) && matchesFilter(row)
  )
  // Les valeurs inconnues restent en fin de liste quel que soit le sens du tri
  return filtered.sort((a, b) => {
    const aMissing = sortValue(a) == null
    const bMissing = sortValue(b) == null
    if (aMissing || bMissing) return Number(aMissing) - Number(bMissing)
    return compareRows(a, b) * sortDir.value
  })
})

const isFiltered = computed(() => filter.value !== 'all' || search.value.trim() !== '')

const countLabel = computed(() => {
  const count = loading.value ? 0 : visibleRows.value.length
  return `${count} patient${count > 1 ? 's' : ''}`
})

function resetFilters() {
  search.value = ''
  filter.value = 'all'
}

function toggleSort(key: SortKey) {
  if (sortKey.value === key) {
    sortDir.value = sortDir.value === 1 ? -1 : 1
  } else {
    sortKey.value = key
    sortDir.value = 1
  }
}

function sortArrow(key: SortKey) {
  if (sortKey.value !== key) return '↕'
  return sortDir.value === 1 ? '↑' : '↓'
}

function ariaSort(key: SortKey) {
  if (sortKey.value !== key) return 'none'
  return sortDir.value === 1 ? 'ascending' : 'descending'
}

async function fetchRecord(id: number) {
  const record = await getPatientRecord(id)
  records.value[id] = record
  const index = patients.value.findIndex((patient) => patient.id === id)
  if (index === -1) patients.value.push(record.patientDto)
  else patients.value[index] = record.patientDto
  return record
}

async function openDetail(id: number) {
  modal.value = { kind: 'detail', id }
  detailError.value = false
  if (records.value[id]) return
  detailLoading.value = true
  try {
    await fetchRecord(id)
  } catch (error) {
    console.error('Erreur lors de la récupération du dossier patient :', error)
    detailError.value = true
  } finally {
    detailLoading.value = false
  }
}

function patientName(id: number) {
  const patient = patients.value.find((patient) => patient.id === id)
  return patient ? fullName(patient) : 'ce patient'
}

// La liste contient déjà toutes les informations personnelles : pas besoin du dossier médical
const editedPatient = computed(() => {
  const current = modal.value
  if (current?.kind !== 'edit') return null
  return patients.value.find((patient) => patient.id === current.id) ?? null
})

function openEdit(id: number) {
  actionError.value = ''
  modal.value = { kind: 'edit', id }
}

// Seules les informations personnelles ont changé : on met à jour la liste et la fiche en cache
function onSaved(saved: Patient) {
  modal.value = null
  const index = patients.value.findIndex((patient) => patient.id === saved.id)
  if (index !== -1) patients.value[index] = saved
  const record = records.value[saved.id]
  if (record) record.patientDto = saved
}

function askDelete(id: number) {
  actionError.value = ''
  deleteError.value = ''
  modal.value = { kind: 'delete', id }
}

function closeDelete() {
  if (!deleting.value) modal.value = null
}

async function confirmDelete(id: number) {
  deleting.value = true
  deleteError.value = ''
  try {
    await deletePatient(id)
    patients.value = patients.value.filter((patient) => patient.id !== id)
    delete records.value[id]
    modal.value = null
  } catch (error) {
    console.error('Erreur lors de la suppression du patient :', error)
    deleteError.value = 'La suppression a échoué. Vérifiez votre connexion et réessayez.'
  } finally {
    deleting.value = false
  }
}
</script>

<style scoped>
.data {
  width: 100%;
  min-width: 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.data-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.75rem;
}

h1 {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-heading);
}

.data-toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem 1rem;
}

.search-input {
  flex: 1 1 260px;
  max-width: 420px;
  height: 2.25rem;
  border-radius: 6px;
  padding: 0 0.75rem;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-text);
  font: inherit;
}

.search-input:focus {
  outline: none;
  border-color: var(--color-theme);
  box-shadow: 0 0 0 3px var(--color-theme-light);
}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
}

.filter-chip {
  padding: 0.35rem 0.875rem;
  border-radius: 999px;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-text-secondary);
  font-size: 0.8125rem;
  cursor: pointer;
  transition:
    color 0.2s,
    background 0.2s,
    border-color 0.2s;
}

.filter-chip:hover {
  color: var(--color-theme);
  border-color: var(--color-theme);
}

.filter-chip.active {
  background: var(--color-theme);
  border-color: var(--color-theme);
  color: #fff;
}

.data-summary {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.25rem 1rem;
  font-size: 0.875rem;
}

.patient-count {
  font-weight: 600;
  color: var(--color-heading);
}

.records-hint {
  color: var(--color-text-secondary);
  font-size: 0.8125rem;
}

.records-hint-error {
  color: #b45309;
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: var(--color-text-secondary);
  border: 1px dashed var(--color-border);
  border-radius: 10px;
  background: var(--color-surface);
}

.empty-actions {
  margin-top: 0.5rem;
}

.table-wrapper {
  /* sert de référence à la container query des boutons d'action */
  container-type: inline-size;
  border: 1px solid var(--color-border);
  border-radius: 10px;
  background: var(--color-surface);
  overflow-x: auto;
}

.patients-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

.patients-table th {
  text-align: left;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: #fff;
  background: var(--color-theme);
  padding: 0.625rem 0.875rem;
  white-space: nowrap;
}

.sort-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  background: none;
  border: none;
  padding: 0;
  color: inherit;
  font: inherit;
  text-transform: inherit;
  letter-spacing: inherit;
  cursor: pointer;
}

.sort-arrow {
  opacity: 0.6;
}

.sort-btn.active .sort-arrow {
  opacity: 1;
}

.patients-table td {
  padding: 0.625rem 0.875rem;
  border-top: 1px solid var(--color-border);
  color: var(--color-text);
  vertical-align: middle;
}

.patients-table tbody tr {
  cursor: pointer;
  transition: background 0.15s;
}

.patients-table tbody tr:hover {
  background: var(--color-theme-light);
}

.cell-patient {
  min-width: 14rem;
}

.patient-cell {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.avatar {
  flex: none;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 50%;
  background: var(--color-theme-light);
  color: var(--color-theme);
  border: 1px solid var(--color-theme);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.8125rem;
}

.patient-identity {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.patient-name {
  font-weight: 600;
  color: var(--color-heading);
}

.patient-email {
  font-size: 0.8125rem;
  color: var(--color-text-secondary);
  overflow-wrap: anywhere;
}

.cell-alerts {
  min-width: 9rem;
}

.alert-badge {
  display: inline-block;
  margin: 0.125rem 0.25rem 0.125rem 0;
  padding: 0.125rem 0.5rem;
  border-radius: 999px;
  background: rgba(217, 119, 6, 0.12);
  border: 1px solid rgba(217, 119, 6, 0.5);
  font-size: 0.75rem;
  font-weight: 500;
  white-space: nowrap;
}

.cell-actions {
  white-space: nowrap;
}

.row-actions {
  display: flex;
  gap: 0.375rem;
}

.row-menu-btn {
  display: none;
  font-size: 1rem;
  line-height: 1;
  padding: 0.35rem 0.55rem;
}

/* Cadre du tableau trop étroit pour les boutons : on passe au rouage */
@container (max-width: 1100px) {
  .row-actions {
    display: none;
  }

  .row-menu-btn {
    display: inline-flex;
  }
}

.row-menu {
  position: fixed;
  z-index: 900;
  min-width: 10rem;
  padding: 0.25rem 0;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-surface);
  box-shadow: 0 6px 20px var(--color-shadow);
  display: flex;
  flex-direction: column;
}

.row-menu button {
  padding: 0.5rem 1rem;
  border: none;
  background: none;
  color: var(--color-text);
  font-size: 0.875rem;
  text-align: left;
  cursor: pointer;
}

.row-menu button:hover {
  background: var(--color-theme-light);
  color: var(--color-theme);
}

.row-menu .row-menu-danger:hover {
  background: rgba(220, 38, 38, 0.08);
  color: #dc2626;
}

.row-btn {
  padding: 0.3rem 0.75rem;
  border-radius: 6px;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-text);
  font-size: 0.8125rem;
  cursor: pointer;
  transition:
    color 0.2s,
    border-color 0.2s;
}

.row-btn:hover {
  color: var(--color-theme);
  border-color: var(--color-theme);
}

.row-btn-danger:hover {
  color: #dc2626;
  border-color: #dc2626;
}

.btn-danger {
  background: #dc2626;
}

.btn-danger:hover {
  background: #b91c1c;
  box-shadow: 0 2px 10px rgba(220, 38, 38, 0.25);
}

.btn-danger:disabled {
  opacity: 0.6;
  cursor: wait;
}

.delete-error {
  margin-bottom: 0.75rem;
}

.row-btn:disabled {
  opacity: 0.6;
  cursor: wait;
}

.load-error {
  color: #c0392b;
  font-size: 0.875rem;
}

/* ── Mobile : chaque patient devient une carte ── */
@media (max-width: 767px) {
  .search-input {
    max-width: none;
  }

  .table-wrapper {
    border: none;
    background: none;
  }

  .patients-table thead {
    display: none;
  }

  .patients-table,
  .patients-table tbody,
  .patients-table tr,
  .patients-table td {
    display: block;
    width: 100%;
  }

  .patients-table tbody tr {
    border: 1px solid var(--color-border);
    border-radius: 10px;
    background: var(--color-surface);
    padding: 0.75rem 1rem;
    margin-bottom: 0.75rem;
  }

  .patients-table td {
    border-top: none;
    padding: 0.25rem 0;
  }

  .patients-table td[data-label] {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
  }

  .patients-table td[data-label]::before {
    content: attr(data-label);
    color: var(--color-text-secondary);
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .patients-table td.cell-patient {
    min-width: 0;
    margin-bottom: 0.25rem;
  }

  .patients-table td.cell-alerts {
    min-width: 0;
  }

  .alert-list {
    text-align: right;
  }

  .patients-table td.cell-actions {
    padding-top: 0.625rem;
  }

  /* Les cartes ont toujours la place pour les boutons */
  .row-actions {
    display: flex;
    gap: 0.5rem;
  }

  .row-menu-btn {
    display: none;
  }

  .row-actions .row-btn {
    flex: 1;
    padding: 0.5rem;
  }
}
</style>
