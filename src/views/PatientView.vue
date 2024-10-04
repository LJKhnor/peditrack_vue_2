<template>
  <div class="patient">
    <h1>Patient</h1>
    <template v-if="!isNewPatient">
      <button class="btn" @click="onClickNewPatient">Ajouter un nouveau patient</button>
      <button class="btn">Editer un patient</button>
    </template>
    <template v-else>
      <MdiComponent v-bind:mdiValue="pathArrowLeft" @click="onClickNewPatient" />
      <PatientRecord></PatientRecord>
    </template>
  </div>
</template>

<script>
import { ref } from 'vue'
import PatientRecord from '@/components/NewPatientRecord.vue'
import MdiComponent from '@/components/icons/MdiComponent.vue'
import { mdiArrowLeft } from '@mdi/js'
export default {
  name: 'PatientVue',
  components: { PatientRecord, MdiComponent },
  setup() {
    let isNewPatient = ref(false)
    let pathArrowLeft = mdiArrowLeft
    function onClickNewPatient() {
      isNewPatient.value = !isNewPatient.value
    }
    return { isNewPatient, onClickNewPatient, pathArrowLeft }
  }
}
</script>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
.patient {
  text-align: center;
}
.btn {
  background-color: lightgreen;
  color: black;
}
</style>
