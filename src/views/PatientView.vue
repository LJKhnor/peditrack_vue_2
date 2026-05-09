<template>
  <div class="patient">
    <h1>Patients</h1>
    <div class="btn-control" v-show="!isNewPatient && !isEditPatient">
      <button class="btn" @click="onCreatePatient">Nouveau patient</button>
      <button class="btn" @click="onEditPatient">Encoder le soin</button>
    </div>

    <template v-if="isNewPatient">
      <button class="back-btn" @click="onCreatePatient">
        <MdiComponent v-bind:mdiValue="pathArrowLeft" />
        Retour
      </button>
      <NewPatientRecord @close-panel="onValidatePatientCreation" />
    </template>
    <template v-if="isEditPatient">
      <button class="back-btn" @click="onEditPatient">
        <MdiComponent v-bind:mdiValue="pathArrowLeft" />
        Retour
      </button>
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

<style scoped>
.patient {
  display: flex;
  flex-direction: column;
  width: 100%;
}

h1 {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-heading);
  margin-bottom: 1.25rem;
}

.btn-control {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  background: none;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  color: var(--color-text-secondary);
  font-size: 0.875rem;
  padding: 0.375rem 0.75rem;
  cursor: pointer;
  margin-bottom: 1.25rem;
  transition: color 0.2s, border-color 0.2s;
}

.back-btn:hover {
  color: var(--color-theme);
  border-color: var(--color-theme);
}
</style>
