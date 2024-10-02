<template>
  <div class="main-container record">
    <div class="container patient-infos">
      <h2>Informations personnelles</h2>
      <PatientPersonalInformations></PatientPersonalInformations>
    </div>
    <div class="container patient-health-infos">
      <h2>Informations médicales</h2>
      <PatientMedicalHealthInformations></PatientMedicalHealthInformations>
      <hr />
      <PatientMedicalTypeInformations></PatientMedicalTypeInformations>
    </div>
    <div class="container patient-record-comment">
      <h2>Soins Prodigués</h2>
      <CareProvided></CareProvided>
    </div>
  </div>
  <div class="patient-record-validation">
    <button class="btn patient-record-validation">Validation</button>
  </div>
</template>

<script>
import CareProvided from './CareProvided.vue'
import PatientMedicalHealthInformations from './PatientMedicalHealthInformations.vue'
import PatientPersonalInformations from './PatientPersonalInformations.vue'
import PatientMedicalTypeInformations from './PatientMedicalTypeInformations.vue'

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
  display: inline-flex;
}
.container {
  position: relative;
  border: 2px solid white;
  width: 50%;
  margin: 4px;
  border-radius: 12px;
  height: 100%;
}
.patient-infos {
  flex: 0;
}
.patient-health-infos {
  flex: 1;
}
.patient-record-comment {
  flex: 2;
}
h2 {
  background-color: rgba(0, 180, 0, 0.3);
  color: black;
}
.info-block {
  display: flex;
  margin: 5%;
  place-content: center;
}
.info-block,
p {
  margin-right: 12px;
}
.info-block-input {
  border-radius: 12px;
}
</style>
