<script setup lang="ts">
import TheWelcome from '../components/TheWelcome.vue'
import AuthService from '@/services/AuthService'

const user = AuthService.getCurrentUser()
const username = user?.username ?? ''
const today = new Date().toLocaleDateString('fr-FR', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric'
})
</script>

<template>
  <div class="home">
    <div class="home-greeting" v-if="username">
      <h1>Bonjour, <span class="home-greeting-name">{{ username }}</span></h1>
      <p class="home-greeting-date">{{ today }}</p>
    </div>
    <TheWelcome />
  </div>
</template>

<style scoped>
.home {
  width: 100%;
  max-width: 960px;
}

.home-greeting {
  margin-bottom: 2.5rem;
}

.home-greeting h1 {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--color-heading);
  line-height: 1.2;
}

.home-greeting-name {
  color: var(--color-theme);
}

.home-greeting-date {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  margin-top: 0.25rem;
  text-transform: capitalize;
}
</style>
