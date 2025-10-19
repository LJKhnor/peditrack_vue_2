<template>
  <div class="login-container">
    <h2 class="h2-register">Se connecter</h2>
    <div clas="container-form">
      <form class="login-form">
        <div>
          <input
            class="input-login"
            type="text"
            name="username"
            v-model="form.username"
            placeholder="Nom d'utilisateur"
          />
        </div>
        <div>
          <input
            class="input-login"
            type="password"
            name="password"
            v-model="form.password"
            placeholder="Mot de passe"
          />
        </div>
        <div class="login-connection">
          <input type="submit" class="btn" value="Se connecter" @click.prevent="login" />
        </div>
      </form>
      <p v-if="showError" id="error">{{ this.message }}</p>
    </div>
  </div>
</template>

<script>
import router from '@/router'
import { ref } from 'vue'
import AuthService from '@/services/AuthService.js'
export default {
  name: 'LoginVue',
  props: [],
  setup(props, { emit }) {
    let form = {
      username: '',
      password: ''
    }
    let showError = ref(false)

    async function login() {
      // Send login request and handle authentication token
      AuthService.login(this.form)
        .then(() => {
          router.push('/') // Redirige après la connexion
        })
        .catch((error) => {
          if (error.response !== undefined) {
            showError.value = true
            this.message = error.response.data
            console.error(error)
          }
        })
    }

    return { form, showError, login }
  }
}
</script>
<style>
/* Global Reset */
/* * {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
} */
/* body {
  font-family: 'Arial', sans-serif;
  background-color: var(--color-background); */
/* display: flex;
  justify-content: center;
  align-items: center; */
/* height: 100vh;
  margin: 0;
} */
.login-container {
  width: 100%;
  max-width: 400px;
  background: var(--color-background);
  border-radius: 2em;
  box-shadow: 0 2px 6px var(--color-theme);
  padding: 2em;
  margin: 15vh 0;
}

/* .container-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
} */

.login-form div {
  display: flex;
  flex-direction: column;
  gap: 1vh;
}

/* label {
  font-size: 0.9rem;
  color: var(--color-text);
} */
.login-connection {
  align-items: center;
}
.input-login[type='text'],
.input-login[type='password'] {
  padding: 10px;
  margin: 1vh 0;
  /* border: 1px solid #ccc; */
  border-radius: 2em;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.3s ease-in-out;
}

input[type='text']:focus,
input[type='password']:focus {
  border-color: var(--color-theme);
}

.btn:hover {
  background-color: var(--color-theme);
}

#error {
  color: #d9534f;
  font-size: 0.9rem;
  text-align: center;
}
</style>
