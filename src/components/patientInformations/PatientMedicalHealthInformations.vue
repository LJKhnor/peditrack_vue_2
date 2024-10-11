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
      <div class="info-block-input-checkbox">
        <template v-for="diabeteType in diabeteTypes" :key="diabeteType">
          <input
            class=""
            type="radio"
            id="diabetes"
            name="diabetes"
            v-model="formData.diabeteType"
          />
          <label class="info-block-input-checkbox-label" for="diabetes">{{ diabeteType }}</label>
        </template>
      </div>
    </div>
    <div class="info-block">
      <p>Problèmes cardiaques</p>
      <input
        class="info-block-input"
        type="text"
        id="hearth-diseases"
        v-model="formData.heartDisease"
      />
    </div>
    <div class="info-block">
      <p>Trouble de la coagulation</p>
      <input
        class="info-block-input"
        type="text"
        id="bleeding-disorder"
        v-model="formData.bleedingDisorder"
      />
    </div>
    <div class="info-block">
      <p>Trouble de la thyroide</p>
      <input
        class="info-block-input"
        type="text"
        id="thyroide-disorder"
        v-model="formData.thyroideDisorder"
      />
    </div>
    <div class="info-block">
      <p>Prothèse genou / hanche</p>
      <input class="info-block-input" type="text" id="prosthesis" v-model="formData.prosthesis" />
    </div>
    <div class="info-block">
      <p>Maladies</p>
      <input class="info-block-input" type="text" id="diseases" v-model="formData.diseases" />
    </div>
    <div class="info-block">
      <p>Opérations</p>
      <input class="info-block-input" type="text" id="operation" v-model="formData.operation" />
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
</style>
