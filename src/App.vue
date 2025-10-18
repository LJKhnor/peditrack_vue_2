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
    <small
      >Conformément au règlement général relatif à la protection des données (RGPD du 25/05/2018),
      les données personnelles des patients ne sont jamais communiquées à des tiers</small
    >
  </footer>
</template>

<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import NavBar from './components/NavBar.vue'
</script>

<style scoped>
/* nav {
  display: flex;
  justify-content: center;
} */

/* nav a {
  margin: 0 15px;
} */

/* .footer {
  align-content: flex-end;
  height: 50%;
  text-align: center;
  padding: 10px;
} */

/* @media (min-width: 1024px) {
  html,
  body {
    margin: 0;
    padding: 0;
    height: 100%;
  }
  body {
    display: flex;
    flex-direction: column;
  }
  .footer {
    text-align: center;
    padding: 10px;
  }
} */
</style>
