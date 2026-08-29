<template>
  <h3>Nouveau soin</h3>
  <form>
    <div class="patient-search-select">
      <input
        type="text"
        class="select-block-input"
        id="patient-search"
        placeholder="Rechercher un patient..."
        autocomplete="off"
        v-model="searchQuery"
        @focus="showDropdown = true"
        @input="showDropdown = true"
        @blur="onSearchBlur"
      />
      <ul v-if="showDropdown && filteredPatients.length" class="patient-dropdown">
        <li
          v-for="patient in filteredPatients"
          :key="patient.id"
          @mousedown.prevent="selectPatient(patient)"
        >
          {{ patient.name }}
        </li>
      </ul>
    </div>
  </form>
  <form id="update-form">
    <Tabs :activeTab="activeTab" @update:activeTab="activeTab = $event">
      <Tab name="Informations personnelles" value="personal" :activeTab="activeTab">
        <div class="container patient-infos">
          <h2 class="h2-patient">Informations personnelles</h2>
          <PatientPersonalInformations v-bind:formData="formData" @update:formData="formData" />
        </div>
      </Tab>
      <Tab name="Informations médicales" value="medical" :activeTab="activeTab">
        <div class="container patient-infos">
          <h2 class="h2-patient">Informations médicales</h2>
          <PatientMedicalHealthInformations
            v-bind:formData="formData"
            @update:formData="formData"
          />
        </div>
      </Tab>
      <Tab name="Informations médicales (suite)" value="type" :activeTab="activeTab">
        <div class="container patient-infos">
          <h2 class="h2-patient">Informations médicales (suites)</h2>
          <PatientMedicalTypeInformations v-bind:formData="formData" @update:formData="formData" />
        </div>
      </Tab>
      <Tab name="Soins Prodigués" value="care" :activeTab="activeTab">
        <div class="container patient-infos">
          <h2 class="h2-patient">Soins Prodigués</h2>
          <CareProvided v-bind:formData="formData" @update:formData="formData" />
        </div>
      </Tab>
    </Tabs>
    <div class="patient-record-validation">
      <input
        type="submit"
        class="btn patient-record-validation"
        value="Valider"
        @click.prevent="updatePatient"
      />
    </div>
  </form>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import Tabs from '@/components/Tabs.vue'
import Tab from '@/components/Tab.vue'
import CareProvided from './patientInformations/PatientCareProvidedInformations.vue'
import PatientPersonalInformations from './patientInformations/PatientPersonalInformations.vue'
import PatientMedicalHealthInformations from './patientInformations/PatientMedicalHealthInformations.vue'
import PatientMedicalTypeInformations from './patientInformations/PatientMedicalTypeInformations.vue'
import apiClient from '../axios'

export default {
  name: 'EditPatientRecord',
  components: {
    Tabs,
    Tab,
    PatientPersonalInformations,
    PatientMedicalHealthInformations,
    PatientMedicalTypeInformations,
    CareProvided
  },
  props: [],
  setup(props, { emit }) {
    const activeTab = ref('personal')
    let formData = ref({})
    let patients = ref([])
    const searchQuery = ref('')
    const showDropdown = ref(false)
    const selectedPatientId = ref(null)
    const urlGetAllPatient = '/patients'
    const urlPostPatient = '/patients'
    onMounted(() => {
      getAllPatient()
    })

    const filteredPatients = computed(() => {
      const query = searchQuery.value.trim().toLowerCase()
      if (!query) return patients.value
      return patients.value.filter((patient) => patient.name.toLowerCase().includes(query))
    })

    async function getAllPatient() {
      const response = await apiClient.get(urlGetAllPatient)
      response.data.forEach((element) => {
        patients.value.push({
          id: element.id,
          name: element.name + ' ' + element.firstname
        })
      })
    }

    function onSearchBlur() {
      showDropdown.value = false
    }

    async function selectPatient(patient) {
      selectedPatientId.value = patient.id
      searchQuery.value = patient.name
      showDropdown.value = false

      const url = `${urlPostPatient}/${patient.id}`
      const response = await apiClient.get(url)
      let previousPatientInfos = response.data.patientDto
      let previousHealthInfos = response.data.healthDto

      formData.value = {
        ...previousPatientInfos,
        ...previousHealthInfos,
        birthdate: new Date(previousPatientInfos.birthdate).toISOString().slice(0, 10),
        date: new Date(previousHealthInfos.careDate).toISOString().slice(0, 10)
      }
    }

    async function updatePatient() {
      const patientId = selectedPatientId.value
      const patientData = Object.fromEntries(
        Object.entries(formData.value)
          .filter(([key, value]) => value !== null)
          .map(([key, value]) => {
            // Vérifier si la valeur est une chaîne de caractères qui semble être une date
            if (typeof value === 'string' && !isNaN(Date.parse(value))) {
              return [key, new Date(value)] // Convertir en objet Date
            }
            return [key, value] // Sinon, laisser la valeur telle quelle
          })
      )
      try {
        const response = await apiClient.put(`${urlPostPatient}/${patientId}`, patientData)
        emit('closePanel')
      } catch (error) {
        console.error('There was an error!', error.response ? error.response.data : error.message)
      }
    }

    return {
      activeTab,
      formData,
      patients,
      searchQuery,
      showDropdown,
      filteredPatients,
      onSearchBlur,
      selectPatient,
      updatePatient
    }
  }
}
</script>

<style scoped>
h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-heading);
  margin-bottom: 1rem;
}

.select-block-input {
  width: 100%;
  max-width: 320px;
  height: 2.25rem;
  border-radius: 6px;
  padding: 0 0.75rem;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-text);
  margin-bottom: 1rem;
}

.patient-search-select {
  position: relative;
  width: 100%;
  max-width: 320px;
}

.patient-dropdown {
  position: absolute;
  top: 2.25rem;
  left: 0;
  right: 0;
  z-index: 10;
  max-height: 220px;
  overflow-y: auto;
  margin: 0;
  padding: 0.25rem 0;
  list-style: none;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: var(--color-surface);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.patient-dropdown li {
  padding: 0.4rem 0.75rem;
  cursor: pointer;
  color: var(--color-text);
}

.patient-dropdown li:hover {
  background: var(--color-border);
}

.patient-record-validation {
  margin-top: 1rem;
}
</style>
