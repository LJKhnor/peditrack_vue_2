<template>
  <header>
    <nav class="navbar navbar-expand navbar-light fixed-top">
      <NavBar class="pedimed" msg="PediMed" />
    </nav>
  </header>
  <main>
    <div class="content">
      <RouterView />
    </div>
  </main>

  <footer>
    <!-- <small
      >Conformément au règlement général relatif à la protection des données (RGPD du 25/05/2018),
      les données personnelles des patients ne sont jamais communiquées à des tiers</small
    > -->
    <p>
      <small><a href="/term_and_condition">Conditions générales</a></small>
      <small><a href="/privacy_policy">Politique de confidentialité</a></small>
    </p>
    <small>© 2024 PediMed. Tous droits réservés.</small>
  </footer>
</template>

<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import NavBar from './components/NavBar.vue'
</script>

<style scoped></style>
