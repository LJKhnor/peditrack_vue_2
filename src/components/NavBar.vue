<template>
  <!-- <div class="greetings">
    <h1 class="color-theme">{{ msg }}</h1>
  </div> -->
  <div class="container-nav">
    <h1 class="container-nav-title color-theme">{{ msg }}</h1>
    <div id="nav">
      <span class="span-logout" v-if="isLogIn">
        <p>Pepito</p>
        |
        <a @click="logout">Logout</a>
      </span>
      <span v-else>
        <router-link to="/login">Login</router-link> |
        <router-link to="/register">Register</router-link>
      </span>
    </div>
  </div>
</template>

<script>
import router from '@/router'
import { onMounted, ref, watch } from 'vue'
import AuthService from '@/services/AuthService.js'
export default {
  name: 'NavBar',
  props: ['msg'],
  setup() {
    onMounted(() => {
      isLogIn.value = AuthService.isCurrentUserConnected()
    })
    const isLogIn = ref(false)
    async function logout() {
      console.log('logout')
      isLogIn.value = false
      await router.push('/login')
    }
    return { isLogIn, logout }
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
  font-weight: 500;
  font-size: 2.6rem;
  position: relative;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}
.span-logout {
  display: flex;
  width: 115%;
  justify-content: space-between;
  align-items: center;
  padding: 4px;
}
.greetings h1,
.greetings h3 {
  text-align: center;
}
#nav {
  padding: 0px;
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
@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>
