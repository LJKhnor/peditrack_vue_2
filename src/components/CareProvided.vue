<template>
  <div class="care-provided">
    <div class="info-block">
      <p>Date</p>
      <input class="info-block-input" type="text" id="date" />
    </div>
    <div class="info-block">
      <p>Soins</p>
      <input class="info-block-input" type="text" id="care" />
    </div>
    <div class="info-block">
      <p>Produits utilisés</p>
      <input class="info-block-input" type="text" id="used-product" />
    </div>
    <div class="info-block">
      <p>Matériels utilisés</p>
      <input class="info-block-input" type="text" id="used-stuff" />
    </div>
    <div class="info-block">
      <p>Blessures possibles</p>
      <input class="info-block-input" type="text" id="possible-wounds" />
    </div>
    <div class="info-block">
      <p>Conseils données</p>
      <input class="info-block-input" type="text" id="advices" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'CareProvided',
  component: {},
  props: {},
  setup() {
    return {}
  }
}
</script>

<style></style>
