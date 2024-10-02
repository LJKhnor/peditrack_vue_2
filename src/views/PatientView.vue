<template>
  <div class="patient">
    <h1>Patient</h1>
    <template v-if="!isNewPatient">
      <button class="btn" @click="onClickNewPatient">Ajouter un nouveau patient</button>
    </template>
    <template v-else>
      <PatientRecord></PatientRecord>
    </template>
  </div>
</template>

<script>
import { ref } from 'vue'
import PatientRecord from '@/components/PatientRecord.vue'
export default {
  name: 'PatientVue',
  components: { PatientRecord },
  setup() {
    let isNewPatient = ref(false)
    function onClickNewPatient() {
      isNewPatient.value = !isNewPatient.value
    }
    return { isNewPatient, onClickNewPatient }
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
