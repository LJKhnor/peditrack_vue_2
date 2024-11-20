<template>
  <h3>Edition</h3>
  <form>
    <div>
      <!--<input type="combobox" id="mySearch" name="searchName" placeholder="patient" />-->
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
    <div class="main-container record">
      <div class="container patient-infos">
        <h2 class="h2-patient">Informations personnelles</h2>
        <PatientPersonalInformations v-bind:formData="formData" @update:formData="formData" />
      </div>
      <div class="container patient-infos">
        <h2 class="h2-patient">Informations médicales</h2>
        <PatientMedicalHealthInformations v-bind:formData="formData" @update:formData="formData" />
        <hr />
        <PatientMedicalTypeInformations v-bind:formData="formData" @update:formData="formData" />
      </div>
      <div class="container patient-infos">
        <h2 class="h2-patient">Soins Prodigués</h2>
        <CareProvided v-bind:formData="formData" @update:formData="formData" />
      </div>
    </div>
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
import axios from 'axios'
import CareProvided from './patientInformations/PatientCareProvidedInformations.vue'
import PatientPersonalInformations from './patientInformations/PatientPersonalInformations.vue'
import PatientMedicalHealthInformations from './patientInformations/PatientMedicalHealthInformations.vue'
import PatientMedicalTypeInformations from './patientInformations/PatientMedicalTypeInformations.vue'

export default {
  name: 'EditPatientRecord',
  components: {
    PatientPersonalInformations,
    PatientMedicalHealthInformations,
    PatientMedicalTypeInformations,
    CareProvided
  },
  props: [],
  setup(props, { emit }) {
    let formData = ref({})
    let patients = ref([])
    const urlGetAllPatient = 'http://localhost:8085/patients'
    const urlPostPatient = 'http://localhost:8085/patients'
    const optionsGet = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'http://localhost:5173' // Allow requests from your Vue.js frontend
        // Add any other headers if needed
      }
    }
    onMounted(() => {
      getAllPatient()
    })

    async function getAllPatient() {
      const response = await axios.get(urlGetAllPatient, optionsGet)
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

      const response = await axios.get(url, optionsGet)
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
          'Access-Control-Allow-Origin': 'http://localhost:5173' // Allow requests from your Vue.js frontend
          // Add any other headers if needed
        }
      }
      try {
        const response = await axios.put(`${urlPostPatient}/${patientId}`, patientData, options)
        emit('closePanel')
        // console.log(response)
        console.log(typeof patientData)
        console.log(patientData)
      } catch (error) {
        console.error('There was an error!', error.response ? error.response.data : error.message)
      }
    }

    return { formData, patients, handleSelectionChange, updatePatient }
  }
}
</script>

<style>
@media (max-width: 480px) {
  .patient-infos {
    width: 90vw; /* Sur petits écrans, prend 90% de la largeur du viewport */
    padding: 0.5rem; /* Réduit le padding sur les petits écrans */
  }
}
</style>
