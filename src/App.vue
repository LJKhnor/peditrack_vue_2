<template>
  <header>
    <NavBar class="pedimed" msg="PediMed" />
    <nav class="navbar navbar-expand navbar-light fixed-top">
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/appointment">Rendez-vous</RouterLink>
      <RouterLink to="/patient">Patient</RouterLink>
      <!-- <RouterLink to="/data">Données</RouterLink> -->
      <!-- <RouterLink to="/map">Map</RouterLink> -->
    </nav>
  </header>
  <main>
    <div class="content">
      <RouterView />
    </div>
  </main>

  <footer class="footer">
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
nav {
  display: flex;
  justify-content: center;
}

nav a {
  margin: 0 15px;
}

/* .footer {
  align-content: flex-end;
  height: 50%;
  text-align: center;
  padding: 10px;
} */
.footer {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  background-color: var(--color-background);
  color: var(--color-text);
  text-align: center;
}
@media (min-width: 1024px) {
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
}
</style>
