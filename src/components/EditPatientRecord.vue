<template>
  <h3>Edition</h3>
  <form>
    <div>
      <input type="search" id="mySearch" name="searchName" placeholder="patient" />
    </div>
  </form>
  <form>
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
      <input type="submit" class="btn patient-record-validation" value="Valider" />
    </div>
  </form>
</template>

<script>
import { ref } from 'vue'
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
  props: {},
  setup() {
    let formData = ref({
      name: '',
      firstname: '',
      numTel: '',
      birthdate: '',
      personOfcontact: '',
      personOfcontactNumTel: '',
      referenceBy: '',
      doctor: ''
    })
    return { formData }
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
  background-color: rgba(0, 180, 0, 0.3);
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

  place-content: center;
  justify-content: space-between;
}
@media (max-width: 480px) {
  .patient-infos {
    width: 90vw; /* Sur petits écrans, prend 90% de la largeur du viewport */
    padding: 0.5rem; /* Réduit le padding sur les petits écrans */
  }
}
</style>
