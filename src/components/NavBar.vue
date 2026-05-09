<template>
  <!-- <div class="greetings">
    <h1 class="color-theme">{{ msg }}</h1>
  </div> -->
  <div class="container-nav">
    <h1 class="container-nav-title color-theme">{{ msg }}</h1>
    <div id="conn-option">
      <div class="user-info logout" v-if="isLogIn">
        <p class="username">
          {{ username }}
          |
          <a @click="logout">Logout</a>
          <router-link to="/update">
            <MdiComponent v-bind:mdiValue="cogIcon" />
          </router-link>
        </p>
      </div>
      <div class="user-info login" v-else>
        <router-link to="/login">Login</router-link> |
        <router-link to="/register">Register</router-link>
      </div>
    </div>
  </div>
  <div>
    <div class="routerlink" v-if="isLogIn">
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/appointment">Rendez-vous</RouterLink>
      <RouterLink to="/patient">Patient</RouterLink>
      <RouterLink to="/map">Map</RouterLink>
      <RouterLink to="/data">Données</RouterLink>
    </div>
  </div>
</template>

<script>
import router from '@/router'
import { ref, watch } from 'vue'
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
.container-nav {
  display: flex;
  width: 100%;
  border: 2px solid var(--color-primary);
  justify-content: space-between;
  align-items: center;
}

.routerlink {
  flex: 1;
  display: flex;
  justify-content: center;
  margin-bottom: 4vh;
}
.routerlink > a {
  text-align: center;
  margin: 0 2vh 0 0;
}
#conn-option {
  font-size: 24px;
}
</style>
