<script>
import { ref } from 'vue'
import 'ag-grid-community/styles/ag-grid.css' // Mandatory CSS required by the Data Grid
import 'ag-grid-community/styles/ag-theme-quartz.css' // Optional Theme applied to the Data Grid
import { AgGridVue } from 'ag-grid-vue3' // Vue Data Grid Component
export default {
  components: {},
  setup() {
    let isNewPatient = false
    function onClickNewPatient() {
      isNewPatient = !isNewPatient
      document.getElementsByClassName('btn').console.log(isNewPatient)
    }
    return { onClickNewPatient }
  }
}
</script>
<template>
  <div class="patient">
    <h1>Patient</h1>
    <template v-if="!isNewPatient">
      <button class="btn" @click="onClickNewPatient">Ajouter</button>
    </template>
    <template v-else>
      <button>NOpe</button>
    </template>
  </div>
</template>

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
