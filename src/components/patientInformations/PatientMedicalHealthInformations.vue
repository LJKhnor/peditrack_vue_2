<template>
  <div class="medical-infos">
    <div class="info-block">
      <p>Groupe</p>
      <select
        name="select-group"
        class="info-block-input"
        type="text"
        id="groupType"
        v-model="formData.groupType"
      >
        <option></option>
        <option v-for="group in groups" :value="group" :key="group">{{ group }}</option>
      </select>
    </div>
    <div class="info-block">
      <p>Diabète</p>
      <select
        name="select-group"
        class="info-block-input"
        type="text"
        id="diabeteType"
        v-model="formData.diabeteType"
      >
        <option></option>
        <option v-for="diabeteType in diabeteTypes" :value="diabeteType" :key="diabeteType">
          {{ diabeteType }}
        </option>
      </select>
    </div>
    <div class="info-block">
      <p>Problèmes cardiaques</p>
      <label class="switch">
        <input
          class="info-block-input"
          type="checkbox"
          id="isWithHeartDisorder"
          v-model="formData.withHeartDisorder"
        />
        <span class="slider round"></span>
      </label>
    </div>
    <div class="info-block">
      <p>Trouble de la coagulation</p>
      <label class="switch">
        <input
          class="info-block-input"
          type="checkbox"
          id="isWithBleedingDisorder"
          v-model="formData.withBleedingDisorder"
        />
        <span class="slider round"></span>
      </label>
    </div>
    <div class="info-block">
      <p>Trouble de la thyroide</p>
      <label class="switch">
        <input
          class="info-block-input"
          type="checkbox"
          id="isWithThyroidDisorder"
          v-model="formData.withThyroideDisorder"
        />
        <span class="slider round"></span>
      </label>
    </div>
    <div class="info-block">
      <p>Prothèse hanche</p>
      <div class="sides">
        <label class="side">
          <span>Gauche</span>
          <span class="switch">
            <input
              class="info-block-input"
              type="checkbox"
              id="hasLeftHipProsthesis"
              v-model="formData.hasLeftHipProsthesis"
            />
            <span class="slider round"></span>
          </span>
        </label>
        <label class="side">
          <span>Droite</span>
          <span class="switch">
            <input
              class="info-block-input"
              type="checkbox"
              id="hasRightHipProsthesis"
              v-model="formData.hasRightHipProsthesis"
            />
            <span class="slider round"></span>
          </span>
        </label>
        <!-- Fiche antérieure à la distinction gauche / droite : la prothèse est connue, pas le côté -->
        <label
          v-if="
            formData.hasHipProsthesis &&
            !formData.hasLeftHipProsthesis &&
            !formData.hasRightHipProsthesis
          "
          class="side unknown-side"
        >
          <span>Côté non précisé</span>
          <span class="switch">
            <input
              class="info-block-input"
              type="checkbox"
              id="hasHipProsthesis"
              v-model="formData.hasHipProsthesis"
            />
            <span class="slider round"></span>
          </span>
        </label>
      </div>
    </div>
    <div class="info-block">
      <p>Prothèse genou</p>
      <div class="sides">
        <label class="side">
          <span>Gauche</span>
          <span class="switch">
            <input
              class="info-block-input"
              type="checkbox"
              id="hasLeftKneeProsthesis"
              v-model="formData.hasLeftKneeProsthesis"
            />
            <span class="slider round"></span>
          </span>
        </label>
        <label class="side">
          <span>Droite</span>
          <span class="switch">
            <input
              class="info-block-input"
              type="checkbox"
              id="hasRightKneeProsthesis"
              v-model="formData.hasRightKneeProsthesis"
            />
            <span class="slider round"></span>
          </span>
        </label>
        <label
          v-if="
            formData.hasKneeProsthesis &&
            !formData.hasLeftKneeProsthesis &&
            !formData.hasRightKneeProsthesis
          "
          class="side unknown-side"
        >
          <span>Côté non précisé</span>
          <span class="switch">
            <input
              class="info-block-input"
              type="checkbox"
              id="hasKneeProsthesis"
              v-model="formData.hasKneeProsthesis"
            />
            <span class="slider round"></span>
          </span>
        </label>
      </div>
    </div>
    <div class="info-block">
      <p>Maladies</p>
      <label class="switch">
        <input
          class="info-block-input"
          type="checkbox"
          id="hasRecentDiseases"
          v-model="formData.hasRecentDiseases"
        />
        <span class="slider round"></span>
      </label>
    </div>
    <div class="info-block">
      <p>Opérations</p>
      <label class="switch">
        <input
          class="info-block-input"
          type="checkbox"
          id="hasRecentOperation"
          v-model="formData.hasRecentOperations"
        />
        <span class="slider round"></span>
      </label>
    </div>
    <div class="info-block">
      <p>Allergies</p>
      <input class="info-block-input" type="text" id="allergies" v-model="formData.allergies" />
    </div>
    <div class="info-block">
      <p>Médicaments</p>
      <input class="info-block-input" type="text" id="drugs" v-model="formData.drugs" />
    </div>
  </div>
</template>

<script>
import { DIABETE_TYPES, GROUP_TYPES } from '@/constants/patientOptions'

export default {
  name: 'PatientMedicalHealthInformations',
  props: ['formData'],
  components: {},
  setup() {
    return { groups: GROUP_TYPES, diabeteTypes: DIABETE_TYPES }
  }
}
</script>

<style scoped>
.info-block-input-checkbox {
  width: 50%;
}
.info-block-input-checkbox-label {
  margin-right: 16px;
}
.sides {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 24px;
}
.side {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}
.unknown-side {
  color: var(--color-text-secondary);
  font-style: italic;
}
/* The switch - the box around the slider */
.switch {
  position: relative;
  display: inline-block;
  width: 52px;
  height: 26px;
}

/* Hide default HTML checkbox */
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

/* The slider */
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--color-border-hover);
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

.slider:before {
  position: absolute;
  content: '';
  height: 18px;
  width: 18px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

input:checked + .slider {
  background-color: var(--color-theme);
}

input:focus + .slider {
  box-shadow: 0 0 1px var(--color-theme);
}

input:checked + .slider:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(26px);
}

/* Rounded sliders */
.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}
</style>
