<template>
  <svg-icon class="mdi-component" type="mdi" :path="mdiValue"></svg-icon>
</template>

<script>
import SvgIcon from '@jamescoyle/vue-icon'
export default {
  name: 'mdi-component',
  components: {
    SvgIcon
  },
  props: ['mdiValue'],
  data() {
    return {}
  }
}
</script>

<style>
.mdi-component {
  width: 24px; /* Ajuste la taille de l'icône */
  height: 24px;
  fill: currentColor; /* Utilise la couleur du texte */
}
</style>
