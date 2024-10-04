<template>
  <form>
    <div class="main-container record">
      <div class="container patient-infos">
        <h2>Informations personnelles</h2>
        <PatientPersonalInformations></PatientPersonalInformations>
      </div>
      <div class="container patient-infos">
        <h2>Informations médicales</h2>
        <PatientMedicalHealthInformations></PatientMedicalHealthInformations>
        <hr />
        <PatientMedicalTypeInformations></PatientMedicalTypeInformations>
      </div>
      <div class="container patient-infos">
        <h2>Soins Prodigués</h2>
        <CareProvided></CareProvided>
      </div>
    </div>
    <div class="patient-record-validation">
      <input type="submit" class="btn patient-record-validation" value="Valider" />
    </div>
  </form>
</template>

<script>
import CareProvided from './patientInformations/PatientCareProvidedInformations.vue'
import PatientMedicalHealthInformations from './patientInformations/PatientMedicalHealthInformations.vue'
import PatientPersonalInformations from './patientInformations/PatientPersonalInformations.vue'
import PatientMedicalTypeInformations from './patientInformations/PatientMedicalTypeInformations.vue'

export default {
  name: 'PatientRecord',
  components: {
    PatientPersonalInformations,
    PatientMedicalHealthInformations,
    PatientMedicalTypeInformations,
    CareProvided
  },
  props: {},
  setup() {
    return {}
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
  width: 50%;
}
.info-block {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 5%;
  place-content: center;
  justify-content: space-between;
}
</style>
