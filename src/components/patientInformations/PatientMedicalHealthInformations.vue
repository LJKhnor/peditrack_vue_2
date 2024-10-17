<template>
  <div class="medical-infos">
    <div class="info-block">
      <p>Groupe</p>
      <select
        name="select-group"
        class="info-block-input"
        type="text"
        id="group"
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
        id="group"
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
          id="hearth-diseases"
          v-model="formData.heartDisease"
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
          id="bleeding-disorder"
          v-model="formData.bleedingDisorder"
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
          id="thyroide-disorder"
          v-model="formData.thyroideDisorder"
        />
        <span class="slider round"></span>
      </label>
    </div>
    <div class="info-block">
      <p>Prothèse genou / hanche</p>
      <label class="switch">
        <input
          class="info-block-input"
          type="checkbox"
          id="prosthesis"
          v-model="formData.prosthesis"
        />
        <span class="slider round"></span>
      </label>
    </div>
    <div class="info-block">
      <p>Maladies</p>
      <label class="switch">
        <input class="info-block-input" type="checkbox" id="diseases" v-model="formData.diseases" />
        <span class="slider round"></span>
      </label>
    </div>
    <div class="info-block">
      <p>Opérations</p>
      <label class="switch">
        <input
          class="info-block-input"
          type="checkbox"
          id="operation"
          v-model="formData.operation"
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
.info-block-input {
  width: 50%;
  border-radius: 12px;
}
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
