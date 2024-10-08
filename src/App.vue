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
        width="75"
        height="75"
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
  <div class="content">
    <RouterView />
  </div>

  <footer class="footer">
    <small
      >Conformément au règlement général relatif à la protection des données (RGPD du 25/05/2018),
      les données personnelles des patients ne sont jamais communiquées à des tiers</small
    >
  </footer>
</template>

<style scoped>
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
.content {
  flex: 1; /* Cela permet à la section de contenu de prendre tout l'espace disponible */
}
.footer {
  background-color: #333;
  color: white;
  text-align: center;
  padding: 10px;
}
@media (min-width: 1024px) {
  html,
  body {
    margin: 0;
    padding: 0;
    height: 100%; /* Pour s'assurer que le body couvre toute la hauteur de la fenêtre */
  }
  body {
    display: flex;
    flex-direction: column;
  }

  .content {
    flex: 1; /* Cela permet à la section de contenu de prendre tout l'espace disponible */
  }
  .footer {
    background-color: #333;
    color: white;
    text-align: center;
    padding: 10px;
  }
}
</style>
