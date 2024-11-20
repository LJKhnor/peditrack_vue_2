<template>
  <div class="login">
    <div clas="container-form">
      <form class="login-form">
        <div>
          <label for="username">Nom d'utilisateur :</label>
          <input class="input-login" type="text" name="username" v-model="form.username" />
        </div>
        <div>
          <label for="password">Mot de passe:</label>
          <input class="input-login" type="password" name="password" v-model="form.password" />
        </div>
        <input
          type="submit"
          class="btn login-connection"
          value="Se connecter"
          @click.prevent="login"
        />
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
  setup() {
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
          showError.value = true
          this.message = 'Invalid username or password'
          console.error(error)
        })
    }

    return { form, showError, login }
  }
}
</script>
<style>
/* Global Reset */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
body {
  font-family: 'Arial', sans-serif;
  background-color: var(--color-background);
  /* display: flex;
  justify-content: center;
  align-items: center; */
  height: 100vh;
  margin: 0;
}
.login {
  width: 100%;
  max-width: 400px;
  background: var(--color-background);
  border-radius: 8px;
  box-shadow: 0 2px 6px var(--color-theme);
  padding: 20px;
  margin: 25vh auto;
}

.container-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.login-form div {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

label {
  font-size: 0.9rem;
  color: var(--color-text);
}

.input-login[type='text'],
.input-login[type='password'] {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
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
