<template>
  <!-- <div class="greetings">
    <h1 class="color-theme">{{ msg }}</h1>
  </div> -->
  <div class="container-nav">
    <h1 class="container-nav-title color-theme">{{ msg }}</h1>
    <div class="routerlink">
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/appointment">Rendez-vous</RouterLink>
      <RouterLink to="/patient">Patient</RouterLink>
      <!-- <RouterLink to="/map">Map</RouterLink> -->
      <!-- <RouterLink to="/data">Données</RouterLink> -->
    </div>

    <div id="nav">
      <span class="span-logout" v-if="isLogIn">
        <p class="username">{{ username }}</p>
        |
        <a @click="logout">Logout</a>
        <router-link to="/update">
          <MdiComponent v-bind:mdiValue="cogIcon" />
        </router-link>
      </span>
      <span class="span-login" v-else>
        <router-link to="/login">Login</router-link> |
        <router-link to="/register">Register</router-link>
      </span>
    </div>
  </div>
</template>

<script>
import router from '@/router'
import { ref, watch } from 'vue'
import AuthService from '@/services/AuthService.js'
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

    if (AuthService.isCurrentUserConnected()) {
      username.value = AuthService.getCurrentUser().username
      isLogIn.value = true
    }

    async function logout() {
      console.log('logout')
      AuthService.logout()
      await router.push('/login')
      isLogIn.value = false
    }

    return { isLogIn, username, cogIcon, logout }
  }
}
</script>

<style scoped>
.container-nav {
  display: flex;
}
.container-nav-title {
  flex: 1;
}
h1 {
  /* font-weight: 500;
  font-size: 2.6rem;
  position: relative;
  top: -10px; */
}

h3 {
  font-size: 1.2rem;
}
.span-logout {
  /* display: flex;
  width: 115%;
  justify-content: space-between;
  align-items: center;
  padding: 4px; */
}
.span-login {
  /* display: flex;
  width: 115%;
  justify-content: space-between;
  align-items: center;
  padding: 8px; */
}
.greetings h1,
.greetings h3 {
  /* text-align: center; */
}
.routerlink{
/* margin: 0 6vw; */
}
#nav a {
  font-weight: bold;
}
a:hover {
  cursor: pointer;
}
#nav a.router-link-exact-active {
  color: var(--color-text);
}
.username {
  font-size: larger;
}
@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>
