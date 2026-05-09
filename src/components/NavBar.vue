<template>
  <div class="navbar">
    <div class="navbar-brand">
      <span class="navbar-title">{{ msg }}</span>
    </div>

    <nav class="navbar-nav" v-if="isLogIn">
      <RouterLink to="/">Accueil</RouterLink>
      <RouterLink to="/appointment">Rendez-vous</RouterLink>
      <RouterLink to="/patient">Patients</RouterLink>
      <RouterLink to="/map">Carte</RouterLink>
      <RouterLink to="/data">Données</RouterLink>
    </nav>

    <div class="navbar-user" v-if="isLogIn">
      <span class="navbar-username">{{ username }}</span>
      <RouterLink to="/update" class="navbar-icon-btn" title="Préférences">
        <MdiComponent v-bind:mdiValue="cogIcon" />
      </RouterLink>
      <button class="navbar-logout-btn" @click="logout">Déconnexion</button>
    </div>
    <div class="navbar-auth" v-else>
      <RouterLink to="/login">Connexion</RouterLink>
      <RouterLink to="/register" class="btn">Créer un compte</RouterLink>
    </div>
  </div>
</template>

<script>
import router from '@/router'
import { ref } from 'vue'
import AuthService from '@/services/AuthService.ts'
import MdiComponent from '@/components/icons/MdiComponent.vue'
import { mdiCog } from '@mdi/js'
import { RouterLink } from 'vue-router'
export default {
  name: 'NavBar',
  components: { MdiComponent },
  props: ['msg'],
  setup() {
    let username = ref('')
    let cogIcon = mdiCog
    const isLogIn = ref(false)

    const user = AuthService.getCurrentUser()
    if (AuthService.isCurrentUserConnected() && user) {
      username.value = user.username
      isLogIn.value = true
    }
    async function logout() {
      AuthService.logout()
      await router.push('/login')
      isLogIn.value = false
    }

    return { isLogIn, username, cogIcon, logout }
  }
}
</script>

<style scoped>
.navbar {
  display: flex;
  align-items: center;
  padding: 0 1.5rem;
  height: 60px;
  gap: 1.5rem;
}

.navbar-brand {
  flex-shrink: 0;
}

.navbar-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--color-theme);
  letter-spacing: -0.01em;
}

.navbar-nav {
  display: flex;
  gap: 0.125rem;
  flex: 1;
  justify-content: center;
}

.navbar-nav a {
  padding: 0.375rem 0.75rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-secondary);
  transition: color 0.2s, background 0.2s;
}

.navbar-nav a:hover,
.navbar-nav a.router-link-active {
  color: var(--color-theme);
  background: var(--color-theme-light);
}

.navbar-user {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  flex-shrink: 0;
}

.navbar-username {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-secondary);
}

.navbar-icon-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.35rem;
  border-radius: 6px;
  color: var(--color-text-secondary);
  transition: color 0.2s, background 0.2s;
}

.navbar-icon-btn:hover {
  color: var(--color-theme);
  background: var(--color-theme-light);
}

.navbar-logout-btn {
  background: none;
  border: 1px solid var(--color-border);
  color: var(--color-text-secondary);
  padding: 0.35rem 0.75rem;
  border-radius: 6px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: border-color 0.2s, color 0.2s, background 0.2s;
}

.navbar-logout-btn:hover {
  border-color: var(--color-theme);
  color: var(--color-theme);
  background: var(--color-theme-light);
}

.navbar-auth {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-shrink: 0;
}
</style>
