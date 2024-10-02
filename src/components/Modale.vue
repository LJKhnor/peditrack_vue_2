<template>
  <div
    class="block-modal"
    v-if="revele && (contents.description != null || contents.location != null)"
  >
    <div class="overlay" v-on:click="toggleModale"></div>
    <div class="modale card">
      <div class="btn-modal btn btn-danger" v-on:click="toggleModale">X</div>
      <h2>Description</h2>
      <p>{{ contents.description != null ? contents.description : 'Aucune description' }}</p>
      <h2>Lieu</h2>
      <p>{{ contents.location != null ? contents.location : 'Aucun lieu' }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VueModale',
  props: ['revele', 'toggleModale', 'contents']
}
</script>

<style>
.block-modal {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}
.overlay {
  background: rgba(124, 124, 124, 0.5);
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
.modale {
  background: #f1f1f1;
  color: #333;
  padding: 50px;
  position: fixed;
}
.btn-modal {
  position: absolute;
  width: 20px;
  top: 10px;
  right: 10px;
}
</style>
