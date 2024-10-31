<template>
  <!-- <div class="greetings">
    <h1 class="color-theme">{{ msg }}</h1>
  </div> -->
  <div class="container-nav">
    <h1 class="container-nav-title color-theme">{{ msg }}</h1>
    <div id="nav">
      <span v-if="isLoggedIn">
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
export default {
  name: 'NavBar',
  props: ['msg'],
  setup() {
    let isLogIn = isLoggedIn
    function isLoggedIn() {
      return this.$store.getters.isAuthenticated
    }
    async function logout() {
      await this.$store.dispatch('LogOut')
      this.$router.push('/login')
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
  color: #42b983;
}
@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>
