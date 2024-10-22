<template>
  <div class="care-provided">
    <div class="info-block">
      <p>Date</p>
      <input class="info-block-input" type="date" id="date" v-model="formData.date" />
    </div>
    <div class="info-block">
      <p>Soins</p>
      <input class="info-block-input" type="text" id="care" v-model="formData.care" />
    </div>
    <div class="info-block">
      <p>Produits utilisés</p>
      <input
        class="info-block-input"
        type="text"
        id="used-product"
        v-model="formData.usedProducts"
      />
    </div>
    <div class="info-block">
      <p>Matériels utilisés</p>
      <input class="info-block-input" type="text" id="used-stuff" v-model="formData.usedTools" />
    </div>
    <div class="info-block">
      <p>Blessures possibles</p>
      <input
        class="info-block-input"
        type="text"
        id="possible-wounds"
        v-model="formData.possibleWounds"
      />
    </div>
    <div class="info-block">
      <p>Conseils données</p>
      <input class="info-block-input" type="text" id="advices" v-model="formData.advice" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'CareProvided',
  component: {},
  props: ['formData'],
  setup() {
    return {}
  }
}
</script>

<style></style>
