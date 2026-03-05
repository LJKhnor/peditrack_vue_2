<template>
  <div class="data">
    <h1 class="color-theme">Données</h1>
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
                    selectedPatientInfo?.healthDto.hasHeartDisorder ? '✅' : '❌'
                  }}</span>
                </div>
                <div class="health-card">
                  <span class="health-label">Problèmes thyroïdiens</span>
                  <span class="health-value">{{
                    selectedPatientInfo?.healthDto.withThyroidDisorder ? '✅' : '❌'
                  }}</span>
                </div>

                <div class="health-card">
                  <span class="health-label">Prothèse de hanche</span>
                  <span class="health-value">{{
                    selectedPatientInfo?.healthDto.hasHipProsthesisType ? '✅' : '❌'
                  }}</span>
                </div>
                <div class="health-card">
                  <span class="health-label">Prothèse de genoux</span>
                  <span class="health-value">{{
                    selectedPatientInfo?.healthDto.hasKneeProsthesisType ? '✅' : '❌'
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
import AuthService from '@/services/AuthService.js'
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
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'http://localhost:5173', // Allow requests from your Vue.js frontend
        // Add any other headers if needed
        Authorization: 'Bearer ' + AuthService.getCurrentToken()
      }
    }

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

      console.log('==============')
      console.log('selectedPatientInfo', selectedPatientInfo.value.healthDto)

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
      const response = await apiClient.get(urlGetAllPatient, options)

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
      const response = await apiClient.get(urlGetAllPatient + `/${patientId}`, options)
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

<style>
.data {
  text-align: center;
  width: 100%;
}
.ag-header {
  background-color: var(--color-theme) !important;
  color: white;
}
.ag-row {
  background-color: var(--color-theme-light) !important;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
  font-size: 18px;
  font-family: Arial, sans-serif;
  text-align: left;
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
  background: #fff;
  border-radius: 12px;
  width: min(680px, 92vw);
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
  overflow: hidden;
  animation: slideIn 0.2s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
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
  padding: 20px 24px;
  background: var(--color-theme, #4caf50);
  color: white;
}
.modal-header h2 {
  margin: 0;
  font-size: 1.1rem;
}
.modal-header span {
  font-weight: 700;
}

.modal-close {
  background: none;
  border: none;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background 0.2s;
}
.modal-close:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* ── Body ── */
.modal-body {
  padding: 24px;
  overflow-y: auto;
  flex: 1;
}

.modal-loading,
.modal-empty {
  text-align: center;
  color: #888;
  padding: 40px 0;
  font-style: italic;
}

/* ── Health grid ── */
.health-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.health-card {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 14px 18px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.health-card.full-width {
  grid-column: 1 / -1;
}

.health-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #6c757d;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.health-value {
  font-size: 1rem;
  color: #212529;
  font-weight: 500;
}

/* ── Footer ── */
.modal-footer {
  padding: 16px 24px;
  border-top: 1px solid #e9ecef;
  display: flex;
  justify-content: flex-end;
}

.btn-close {
  padding: 8px 22px;
  background: var(--color-theme, #4caf50);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.95rem;
  transition: opacity 0.2s;
}
.btn-close:hover {
  opacity: 0.85;
}

th,
td {
  padding: 12px 15px;
  border: 1px solid #ddd;
  color: black;
}

th {
  background-color: #4caf50;
  color: white;
  text-transform: uppercase;
}

tr {
  background-color: #f2f2f2;
  transition: background-color 0.3s ease;
}

tr:hover {
  background-color: #e9f5e9;
}

td {
  background-color: #fff;
}

table thead tr {
  border-bottom: 2px solid #4caf50;
}

@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
/* Optional: Responsive Design */
@media (max-width: 600px) {
  table,
  thead,
  tbody,
  th,
  td,
  tr {
    display: block;
    width: 100%;
  }
  tr {
    margin-bottom: 15px;
  }
  th {
    background-color: #4caf50;
    text-align: center;
  }
}
</style>
