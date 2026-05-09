<template>
  <div class="data">
    <h1>Données</h1>
    <ag-grid-vue
      :rowData="rowData"
      :columnDefs="columnDefs"
      style="height: 500px"
      class="ag-theme-quartz"
      rowSelection="single"
      animateRows="true"
      :onRowClicked="handleRowClick"
    ></ag-grid-vue>

    <!-- Modale santé patient -->
    <Teleport to="body">
      <div v-if="selectedPatient" class="modal-overlay" @click.self="closeModal">
        <div class="modal-container">
          <!-- Header -->
          <div class="modal-header">
            <h2>
              Dossier de santé —
              <span
                >{{ selectedPatientInfo?.patientDto?.firstname }}
                {{ selectedPatientInfo?.patientDto?.name }}</span
              >
            </h2>
            <button class="modal-close" @click="closeModal">✕</button>
          </div>

          <!-- Contenu -->
          <div class="modal-body">
            <div v-if="loadingHealth" class="modal-loading">Chargement…</div>

            <template v-else-if="selectedPatientInfo?.healthDto">
              <div class="health-grid">
                <div class="health-card">
                  <span class="health-label">Diabete</span>
                  <span class="health-value">{{
                    selectedPatientInfo?.healthDto.diabeteType === 0
                      ? 'Non'
                      : 'Oui, type ' + selectedPatientInfo?.healthDto.diabeteType
                  }}</span>
                </div>
                <div class="health-card">
                  <span class="health-label">Allergies</span>
                  <span class="health-value">{{
                    selectedPatientInfo?.healthDto.allergies ?? 'Aucune renseignée'
                  }}</span>
                </div>
                <div class="health-card">
                  <span class="health-label">Médicaments</span>
                  <span class="health-value">{{
                    selectedPatientInfo?.healthDto.drugs ?? 'Aucun renseigné'
                  }}</span>
                </div>
                <div class="health-card">
                  <span class="health-label">Problèmes sanguins</span>
                  <span class="health-value">{{
                    selectedPatientInfo?.healthDto.withBleedingDisorder ? '✅' : '❌'
                  }}</span>
                </div>
                <div class="health-card">
                  <span class="health-label">Problèmes cardiaques</span>
                  <span class="health-value">{{
                    selectedPatientInfo?.healthDto.withHeartDisorder ? '✅' : '❌'
                  }}</span>
                </div>
                <div class="health-card">
                  <span class="health-label">Problèmes thyroïdiens</span>
                  <span class="health-value">{{
                    selectedPatientInfo?.healthDto.withThyroideDisorder ? '✅' : '❌'
                  }}</span>
                </div>

                <div class="health-card">
                  <span class="health-label">Prothèse de hanche</span>
                  <span class="health-value">{{
                    selectedPatientInfo?.healthDto.hasHipProsthesis ? '✅' : '❌'
                  }}</span>
                </div>
                <div class="health-card">
                  <span class="health-label">Prothèse de genoux</span>
                  <span class="health-value">{{
                    selectedPatientInfo?.healthDto.hasKneeProsthesis ? '✅' : '❌'
                  }}</span>
                </div>
                <div class="health-card">
                  <span class="health-label">Maladies récentes</span>
                  <span class="health-value">{{
                    selectedPatientInfo?.healthDto.hasRecentDiseases ? '✅' : '❌'
                  }}</span>
                </div>
                <div class="health-card">
                  <span class="health-label">Opérations récentes</span>
                  <span class="health-value">{{
                    selectedPatientInfo?.healthDto.hasRecentOperations ? '✅' : '❌'
                  }}</span>
                </div>

                <div class="health-card">
                  <span class="health-label">Conseils</span>
                  <span class="health-value">{{
                    selectedPatientInfo?.healthDto.advice ?? '—'
                  }}</span>
                </div>
                <div class="health-card">
                  <span class="health-label">Type circulatoire</span>
                  <span class="health-value">{{
                    selectedPatientInfo?.healthDto.circulationType === ''
                      ? '—'
                      : selectedPatientInfo?.healthDto.circulationType
                  }}</span>
                </div>
                <div class="health-card">
                  <span class="health-label">Type dermatose</span>
                  <span class="health-value">{{
                    selectedPatientInfo?.healthDto.dermatosisType === ''
                      ? '—'
                      : selectedPatientInfo?.healthDto.dermatosisType
                  }}</span>
                </div>
                <div class="health-card">
                  <span class="health-label">Type déformation du pied</span>
                  <span class="health-value">{{
                    selectedPatientInfo?.healthDto.footDeformityType === ''
                      ? '—'
                      : selectedPatientInfo?.healthDto.footDeformityType
                  }}</span>
                </div>
                <div class="health-card">
                  <span class="health-label">Type pied</span>
                  <span class="health-value">{{
                    selectedPatientInfo?.healthDto.footType === ''
                      ? '—'
                      : selectedPatientInfo?.healthDto.footType
                  }}</span>
                </div>
                <div class="health-card">
                  <span class="health-label">Type groupe</span>
                  <span class="health-value">{{
                    selectedPatientInfo?.healthDto.groupType === ''
                      ? '—'
                      : selectedPatientInfo?.healthDto.groupType
                  }}</span>
                </div>

                <div class="health-card">
                  <span class="health-label">Type d'ongle</span>
                  <span class="health-value">{{
                    selectedPatientInfo?.healthDto.nailConditionType === ''
                      ? '—'
                      : selectedPatientInfo?.healthDto.nailConditionType
                  }}</span>
                </div>
                <div class="health-card">
                  <span class="health-label">Blessures possibles</span>
                  <span class="health-value">{{
                    selectedPatientInfo?.healthDto.possibleWounds === null
                      ? '—'
                      : selectedPatientInfo?.healthDto.possibleWounds
                  }}</span>
                </div>
                <div class="health-card">
                  <span class="health-label">Type de remarques</span>
                  <span class="health-value">{{
                    selectedPatientInfo?.healthDto.remarkType === ''
                      ? '—'
                      : selectedPatientInfo?.healthDto.remarkType
                  }}</span>
                </div>
                <div class="health-card">
                  <span class="health-label">Type de peau</span>
                  <span class="health-value">{{
                    selectedPatientInfo?.healthDto.skinType === ''
                      ? '—'
                      : selectedPatientInfo?.healthDto.skinType
                  }}</span>
                </div>
                <div class="health-card">
                  <span class="health-label">Type de sueur</span>
                  <span class="health-value">{{
                    selectedPatientInfo?.healthDto.sweatType === ''
                      ? '—'
                      : selectedPatientInfo?.healthDto.sweatType
                  }}</span>
                </div>
              </div>
            </template>

            <div v-else class="modal-empty">Aucune donnée de santé disponible pour ce patient.</div>
          </div>

          <!-- Footer -->
          <div class="modal-footer">
            <button class="btn-close" @click="closeModal">Fermer</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue'
import 'ag-grid-community/styles/ag-grid.css' // Mandatory CSS required by the Data Grid
import 'ag-grid-community/styles/ag-theme-quartz.css' // Optional Theme applied to the Data Grid
import { AgGridVue } from 'ag-grid-vue3' // Vue Data Grid Component
import apiClient from '../axios'
import Modale from '@/components/Modale.vue'

export default {
  components: {
    AgGridVue
  },
  setup() {
    const selectedPatient = ref(false)
    const selectedPatientInfo = ref(null)
    const loadingHealth = ref(false)
    const urlGetAllPatient = '/patients'

    const columnDefs = ref([
      { field: 'lastName', headerName: 'Nom', sortable: true, filter: true },
      { field: 'firstname', headerName: 'Prénom', sortable: true, filter: true },
      { field: 'phoneNum', headerName: 'Téléphone', sortable: true, filter: true },
      { field: 'birthdate', headerName: 'Date de naissance', sortable: true, filter: true },
      { field: 'address', headerName: 'Adresse', sortable: true, filter: true },
      { field: 'Option', headerName: 'Options' }
    ])
    const rowData = ref([])
    onMounted(() => {
      getAllPatient()
    })
    // ---- Handlers ----
    const handleRowClick = async (event) => {
      loadingHealth.value = true
      selectedPatient.value = true
      selectedPatientInfo.value = null
      await getHealthPatient(event.data.id)

      loadingHealth.value = false
    }

    const closeModal = () => {
      selectedPatient.value = false
      selectedPatientInfo.value = null
    }

    // -------------------------------------------------------------------
    // async functions
    // -------------------------------------------------------------------
    async function getAllPatient() {
      const response = await apiClient.get(urlGetAllPatient)

      // console.log(response.data)
      response.data.forEach((element) => {
        rowData.value.push({
          id: element.id,
          lastName: element.name,
          firstname: element.firstname,
          phoneNum: element.phoneNum,
          birthdate: element.birthdate,
          address: element.address
        })
      })
      // console.log('rowData', rowData)
    }

    async function getHealthPatient(patientId) {
      const response = await apiClient.get(urlGetAllPatient + `/${patientId}`)
      selectedPatientInfo.value = response.data
    }

    return {
      rowData,
      columnDefs,
      selectedPatient,
      selectedPatientInfo,
      loadingHealth,
      handleRowClick,
      closeModal
    }
  }
}
</script>

<style scoped>
.data {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

h1 {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-heading);
}

:deep(.ag-header) {
  background-color: var(--color-theme) !important;
  color: #fff;
}

:deep(.ag-row) {
  background-color: var(--color-theme-light) !important;
}

/* ── Overlay ── */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(2px);
}

/* ── Fenêtre ── */
.modal-container {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 10px;
  width: min(680px, 92vw);
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 40px var(--color-shadow);
  overflow: hidden;
  animation: slideIn 0.2s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ── Header ── */
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  background: var(--color-theme);
  color: #fff;
}

.modal-header h2 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
}

.modal-header span {
  font-weight: 700;
}

.modal-close {
  background: none;
  border: none;
  color: #fff;
  font-size: 1.1rem;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  transition: background 0.2s;
}

.modal-close:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* ── Body ── */
.modal-body {
  padding: 1.5rem;
  overflow-y: auto;
  flex: 1;
}

.modal-loading,
.modal-empty {
  text-align: center;
  color: var(--color-text-secondary);
  padding: 2.5rem 0;
  font-style: italic;
}

/* ── Health grid ── */
.health-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
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
}

/* ── Footer ── */
.modal-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--color-border);
  display: flex;
  justify-content: flex-end;
}

.btn-close {
  padding: 0.45rem 1.25rem;
  background: var(--color-theme);
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: background 0.2s;
}

.btn-close:hover {
  background: var(--color-theme-hover);
}
</style>
