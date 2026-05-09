<template>
  <header>
    <NavBar msg="PediMed" />
  </header>
  <main>
    <div class="content">
      <RouterView />
    </div>
  </main>
  <footer>
    <p>
      <a href="/term_and_condition">Conditions générales</a>
      <a href="/privacy_policy">Politique de confidentialité</a>
    </p>
    <small>© 2024 PediMed. Tous droits réservés.</small>
  </footer>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import NavBar from './components/NavBar.vue'
</script>

<style scoped></style>
