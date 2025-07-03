<template>
  <h3>Nouveau soin</h3>
  <form>
    <div>
      <select
        name="select-foot"
        class="info-block-input"
        type="text"
        id="patient-select"
        @change="handleSelectionChange"
      >
        <option></option>
        <option v-for="patient in patients" :value="patient.id" :key="patient.id">
          {{ patient.name }}
        </option>
      </select>
    </div>
  </form>
  <form id="update-form">
    <Tabs :activeTab="activeTab" @update:activeTab="activeTab = $event">
      <Tab name="Informations personnelles" value="personal" :activeTab="activeTab">
        <div class="container patient-infos">
          <h2 class="h2-patient">Informations personnelles</h2>
          <PatientPersonalInformations v-bind:formData="formData" @update:formData="formData" />
        </div>
      </Tab>
      <Tab name="Informations médicales" value="medical" :activeTab="activeTab">
        <div class="container patient-infos">
          <h2 class="h2-patient">Informations médicales</h2>
          <PatientMedicalHealthInformations
            v-bind:formData="formData"
            @update:formData="formData"
          />
        </div>
      </Tab>
      <Tab name="Informations médicales (suite)" value="type" :activeTab="activeTab">
        <div class="container patient-infos">
          <h2 class="h2-patient">Informations médicales (suites)</h2>
          <PatientMedicalTypeInformations v-bind:formData="formData" @update:formData="formData" />
        </div>
      </Tab>
      <Tab name="Soins Prodigués" value="care" :activeTab="activeTab">
        <div class="container patient-infos">
          <h2 class="h2-patient">Soins Prodigués</h2>
          <CareProvided v-bind:formData="formData" @update:formData="formData" />
        </div>
      </Tab>
    </Tabs>
    <div class="patient-record-validation">
      <input
        type="submit"
        class="btn patient-record-validation"
        value="Valider"
        @click.prevent="updatePatient"
      />
    </div>
  </form>
</template>

<script>
import { ref, onMounted } from 'vue'
import Tabs from '@/components/Tabs.vue'
import Tab from '@/components/Tab.vue'
import CareProvided from './patientInformations/PatientCareProvidedInformations.vue'
import PatientPersonalInformations from './patientInformations/PatientPersonalInformations.vue'
import PatientMedicalHealthInformations from './patientInformations/PatientMedicalHealthInformations.vue'
import PatientMedicalTypeInformations from './patientInformations/PatientMedicalTypeInformations.vue'
import AuthService from '@/services/AuthService.js'
import apiClient from '../axios'

export default {
  name: 'EditPatientRecord',
  components: {
    Tabs,
    Tab,
    PatientPersonalInformations,
    PatientMedicalHealthInformations,
    PatientMedicalTypeInformations,
    CareProvided
  },
  props: [],
  setup(props, { emit }) {
    const activeTab = ref('personal')
    let formData = ref({})
    let patients = ref([])
    const urlGetAllPatient = '/patients'
    const urlPostPatient = '/patients'
    const optionsGet = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + AuthService.getCurrentToken()
      }
    }
    onMounted(() => {
      getAllPatient()
    })

    async function getAllPatient() {
      const response = await apiClient.get(urlGetAllPatient, optionsGet)
      response.data.forEach((element) => {
        patients.value.push({
          id: element.id,
          name: element.name + ' ' + element.firstname
        })
      })
    }
    async function handleSelectionChange() {
      const selectElement = document.getElementById('patient-select')
      const patientId = selectElement.value
      const url = `${urlPostPatient}/${patientId}`

      const response = await apiClient.get(url, optionsGet)
      let previousPatientInfos = response.data.patientDto
      let previousHealthInfos = response.data.healthDto

      formData.value = {
        ...previousPatientInfos,
        ...previousHealthInfos,
        birthdate: new Date(previousPatientInfos.birthdate).toISOString().slice(0, 10),
        date: new Date(previousHealthInfos.careDate).toISOString().slice(0, 10)
      }
    }

    async function updatePatient() {
      console.log('Update old patient')
      const selectElement = document.getElementById('patient-select')
      const patientId = selectElement.value
      const patientData = Object.fromEntries(
        Object.entries(formData.value)
          .filter(([key, value]) => value !== null)
          .map(([key, value]) => {
            // Vérifier si la valeur est une chaîne de caractères qui semble être une date
            if (typeof value === 'string' && !isNaN(Date.parse(value))) {
              return [key, new Date(value)] // Convertir en objet Date
            }
            return [key, value] // Sinon, laisser la valeur telle quelle
          })
      )
      const options = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + AuthService.getCurrentToken()
        }
      }
      try {
        const response = await apiClient.put(`${urlPostPatient}/${patientId}`, patientData, options)
        emit('closePanel')
      } catch (error) {
        console.error('There was an error!', error.response ? error.response.data : error.message)
      }
    }

    return { activeTab, formData, patients, handleSelectionChange, updatePatient }
  }
}
</script>

<style>
.info-block-input {
  width: 50%;
  border-radius: 12px;
  padding: 0 8px;
}
@media (max-width: 480px) {
  .patient-infos {
    width: 90vw; /* Sur petits écrans, prend 90% de la largeur du viewport */
    padding: 0.5rem; /* Réduit le padding sur les petits écrans */
  }
}
</style>
