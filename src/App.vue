<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <header>
    <div class="logo-and-title">
      <img
        alt="Vue logo"
        class="logo"
        src="@/assets/logo_pedicure_val.png"
        width="125"
        height="125"
      />
      <HelloWorld class="helloworld" msg="Peditrack" />
    </div>

    <div class="nav-bar">
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/appointment">Rendez-vous</RouterLink>
        <RouterLink to="/patient">Patient</RouterLink>
        <RouterLink to="/data">Données</RouterLink>
        <RouterLink to="/map">Map</RouterLink>
      </nav>
    </div>
  </header>
  <RouterView />
  <footer>
    <small
      >Conformément au règlement général relatif à la protection des données (RGPD du 25/05/2018),
      les données personnelles des patients ne sont jamais communiquées à des tiers</small
    >
  </footer>
</template>

<style scoped>
header {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}

.logo-and-title {
  display: flex;
  align-items: center; /* Aligne le logo et HelloWorld verticalement */
  justify-content: center; /* Centre horizontalement le logo et HelloWorld */
}
.logo {
  margin-right: 10px; /* Un petit espace entre le logo et le texte */
}

nav {
  display: flex;
  justify-content: center;
}
nav-bar {
  margin-top: 20px;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  margin: 0 15px;
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
