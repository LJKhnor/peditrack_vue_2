<template>
  <div class="medical-infos">
    <div class="info-block">
      <p>Peau</p>
      <template v-for="skinType in skinTypes" :key="skinType">
        <input type="radio" id="skin-{{skinType}}" name="skin" />
        <label for="skin-{{skinType}}">{{ skinType }}</label>
      </template>
    </div>
    <div class="info-block">
      <p>Pieds</p>
    </div>
    <div class="info-block">
      <p>Transpiration</p>
    </div>
    <div class="info-block">
      <p>Remarques</p>
    </div>
    <div class="info-block">
      <p>Circulation</p>
    </div>
    <div class="info-block">
      <p>Dermatoses</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PatientMedicalTypeInformations',
  props: {},
  components: {},
  setup() {
    let skinTypes = ['Normale', 'Pale', 'Cyanosée', 'Sèche', 'Grasse']
    return { skinTypes }
  }
}
</script>

<style></style>
