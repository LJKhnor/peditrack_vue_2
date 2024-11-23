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
      <label class="switch">
        <input
          class="info-block-input"
          type="checkbox"
          id="hasHipProthesis"
          v-model="formData.hasHipProsthesis"
        />
        <span class="slider round"></span>
      </label>
    </div>
    <div class="info-block">
      <p>Prothèse genou</p>
      <label class="switch">
        <input
          class="info-block-input"
          type="checkbox"
          id="hasKneeProthesis"
          v-model="formData.hasKneeProsthesis"
        />
        <span class="slider round"></span>
      </label>
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
export default {
  name: 'PatientMedicalHealthInformations',
  props: ['formData'],
  components: {},
  setup() {
    let groups = [1, 2, 3, 4]
    let diabeteTypes = [1, 2]
    return { groups, diabeteTypes }
  }
}
</script>

<style>
.info-block-input-checkbox {
  width: 50%;
}
.info-block-input-checkbox-label {
  margin-right: 16px;
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
  background-color: #ccc;
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
  background-color: #2196f3;
}

input:focus + .slider {
  box-shadow: 0 0 1px #2196f3;
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
