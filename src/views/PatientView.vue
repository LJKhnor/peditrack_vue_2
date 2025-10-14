<template>
  <div class="patient">
    <h1 class="color-theme">Patient</h1>
    <div class="btn-control" :hidden="isNewPatient || isEditPatient">
      <button class="btn" @click="onCreatePatient">Nouveau patient</button>
      <button class="btn" @click="onEditPatient">Encoder le soin</button>
    </div>

    <template v-if="isNewPatient">
      <MdiComponent v-bind:mdiValue="pathArrowLeft" @click="onCreatePatient" />
      <NewPatientRecord @close-panel="onValidatePatientCreation" />
    </template>
    <template v-if="isEditPatient">
      <MdiComponent v-bind:mdiValue="pathArrowLeft" @click="onEditPatient" />
      <EditPatientRecord @close-panel="onValidatePatientUpdate" />
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
    function onValidatePatientCreation() {
      isNewPatient.value = !isNewPatient.value
    }
    function onValidatePatientUpdate() {
      isEditPatient.value = !isEditPatient.value
    }
    async function handleSubmit(formData) {
      // Gérer la soumission du formulaire ici (création ou édition)
      if (isEditPatient.value) {
        // Mettre à jour le patient existant
        console.log('Updating patient with data:', formData)
      }
    }
    return {
      isNewPatient,
      isEditPatient,
      pathArrowLeft,
      currentPatientData,
      onCreatePatient,
      onEditPatient,
      handleSubmit,
      onValidatePatientCreation,
      onValidatePatientUpdate
    }
  }
}
</script>

<style>

.patient {
  display: flex;
  flex-direction: column;
  text-align: center;
}
.h2-patient {
  background-color: var(--color-theme);
  color: black;
  border-radius: 8px;
}
.patient-infos {
  width: 80vw;
  max-width: 70vw;
  min-width: 50vw;
  padding: 1rem;
}

@media (min-width: 1024px) {
  .patient-infos {
    width: 0vw;
    max-width: 70vw;
    min-width: 50vw;
    padding: 1rem;
  }
}
</style>
