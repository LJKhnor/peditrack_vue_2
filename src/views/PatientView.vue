<template>
  <div class="patient">
    <h1>Patient</h1>
    <div class="btn-control" :hidden="isNewPatient || isEditPatient">
      <button class="btn" @click="onCreatePatient">Ajouter un nouveau patient</button>
      <button class="btn" @click="onEditPatient">Editer un patient</button>
    </div>

    <template v-if="isNewPatient">
      <MdiComponent v-bind:mdiValue="pathArrowLeft" @click="onCreatePatient" />
      <NewPatientRecord @submit="handleSubmit" />
    </template>
    <template v-if="isEditPatient">
      <MdiComponent v-bind:mdiValue="pathArrowLeft" @click="onEditPatient" />
      <EditPatientRecord :patient-data="currentPatientData" @submit="handleSubmit" />
    </template>
  </div>
</template>

<script>
import { ref } from 'vue'
import NewPatientRecord from '@/components/NewPatientRecord.vue'
import EditPatientRecord from '@/components/EditPatientRecord.vue'
import MdiComponent from '@/components/icons/MdiComponent.vue'
import { mdiArrowLeft } from '@mdi/js'
export default {
  name: 'PatientVue',
  components: { NewPatientRecord, EditPatientRecord, MdiComponent },
  setup() {
    let isNewPatient = ref(false)
    let isEditPatient = ref(false)
    let currentPatientData = ref(null) // Contient les données du patient à éditer
    let pathArrowLeft = mdiArrowLeft
    function onCreatePatient() {
      isNewPatient.value = !isNewPatient.value
    }
    function onEditPatient() {
      isEditPatient.value = !isEditPatient.value
    }
    function handleSubmit(formData) {
      // Gérer la soumission du formulaire ici (création ou édition)
      if (isEditPatient.value) {
        // Mettre à jour le patient existant
        console.log('Updating patient with data:', formData)
      } else {
        // Créer un nouveau patient
        console.log('Creating new patient with data:', formData)
      }
    }
    return {
      isNewPatient,
      isEditPatient,
      pathArrowLeft,
      currentPatientData,
      onCreatePatient,
      onEditPatient,
      handleSubmit
    }
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
  display: flex;
  flex-direction: column;
  text-align: center;
}
.btn {
  background-color: lightgreen;
  color: black;
}
</style>
