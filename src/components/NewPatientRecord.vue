<template>
  <h3>Création</h3>
  <form id="creation-form">
    <div class="main-container record">
      <div class="container patient-infos">
        <h2>Informations personnelles</h2>
        <PatientPersonalInformations v-bind:formData="formData" @update:formData="formData" />
      </div>
      <div class="container patient-infos">
        <h2>Informations médicales</h2>
        <PatientMedicalHealthInformations v-bind:formData="formData" @update:formData="formData" />
        <hr />
        <PatientMedicalTypeInformations v-bind:formData="formData" @update:formData="formData" />
      </div>
      <div class="container patient-infos">
        <h2>Soins Prodigués</h2>
        <CareProvided v-bind:formData="formData" @update:formData="formData" />
      </div>
    </div>
    <div class="patient-record-validation">
      <input
        type="submit"
        class="btn patient-record-validation"
        value="Valider"
        @click.prevent="createPatient"
      />
    </div>
  </form>
</template>

<script>
import { ref, onMounted, watch } from 'vue'
import CareProvided from './patientInformations/PatientCareProvidedInformations.vue'
import PatientPersonalInformations from './patientInformations/PatientPersonalInformations.vue'
import PatientMedicalHealthInformations from './patientInformations/PatientMedicalHealthInformations.vue'
import PatientMedicalTypeInformations from './patientInformations/PatientMedicalTypeInformations.vue'
import axios from 'axios'

export default {
  name: 'NewPatientRecord',
  components: {
    PatientPersonalInformations,
    PatientMedicalHealthInformations,
    PatientMedicalTypeInformations,
    CareProvided
  },
  props: [],
  emits: ['closePanel'],
  setup(props, { emit }) {
    let formData = ref({})

    async function createPatient() {
      // Créer un nouveau patient
      console.log('Creating new patient with data:', formData)
      let isOkToContinue = handleFormMissingData()
      if (isOkToContinue) {
        const urlCreationPAtient = 'http://localhost:8085/patients'
        const patientData = { ...formData.value, birthdate: new Date(formData.value.birthdate) }
        const options = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': 'http://localhost:5173'
          }
        }
        try {
          await axios.post(urlCreationPAtient, patientData, options)
          emit('closePanel')
        } catch (error) {
          console.error('There was an error!', error.response ? error.response.data : error.message)
        }
      } else {
        alert('Il est nécessaire de remplir le nom et le prénom du patient')
      }
    }
    function handleFormMissingData() {
      let nameInput = document.getElementById('name')
      let nameInputParent = nameInput.parentNode.firstChild

      let firstnameInput = document.getElementById('firstname')

      let isValidNameForm = false
      let isValidFirstnameForm = false

      if (nameInput.value === '') {
        nameInput.classList.add('missing')
        nameInputParent.innerText += ' *'
      } else {
        nameInput.classList.remove('missing')
        isValidNameForm = true
      }
      if (firstnameInput.value === '') {
        firstnameInput.classList.add('missing')
        nameInputParent.innerText += ' *'
      } else {
        firstnameInput.classList.remove('missing')
        isValidFirstnameForm = true
      }
      return isValidNameForm && isValidFirstnameForm
    }
    return { createPatient, formData }
  }
}
</script>

<style>
.main-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.container {
  position: relative;
  border: 2px solid white;
  align-items: center;
  margin: 4px;
  border-radius: 12px;
  height: 100%;
}
h2 {
  color: black;
}
.patient-infos {
  width: 80vw;
  max-width: 70vw;
  min-width: 50vw;
  padding: 1rem; /* Un padding fluide basé sur la taille de la police */
}
.info-block {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 5%;
  place-content: center;
  justify-content: space-between;
}
.missing {
  border-color: red;
}
@media (max-width: 480px) {
  .patient-infos {
    width: 90vw; /* Sur petits écrans, prend 90% de la largeur du viewport */
    padding: 0.5rem; /* Réduit le padding sur les petits écrans */
  }
}
</style>
