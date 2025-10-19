<template>
  <div class="register-page">
    <div class="register-container">
      <h2 class="h2-register">Créer un compte</h2>
      <form class="register-form" @submit.prevent="register">
        <div class="form-group">
          <!-- <label for="username">Nom d'utilisateur</label> -->
          <input
            class="input-register"
            type="text"
            id="username"
            v-model="form.username"
            placeholder="Entrez votre nom d'utilisateur"
            required
          />
        </div>
        <div class="form-group">
          <!-- <label for="mail">Email</label> -->
          <input
            class="input-register"
            type="email"
            id="mail"
            v-model="form.mail"
            placeholder="Entrez votre adresse email"
            required
          />
        </div>
        <div class="form-group">
          <!-- <label for="password">Mot de passe</label> -->
          <input
            class="input-register"
            type="password"
            id="password"
            v-model="form.password"
            placeholder="Créez un mot de passe"
            required
          />
        </div>
        <div class="form-group">
          <!-- <label for="confirm-password">Confirmer le mot de passe</label> -->
          <input
            class="input-register"
            type="password"
            id="confirm-password"
            v-model="form.confirmPassword"
            placeholder="Confirmez votre mot de passe"
            required
          />
        </div>
        <div class="form-group">
          <!-- <label>Code d'activation</label> -->
          <input
            type="text"
            class="input-register"
            v-model="form.registrationKey"
            placeholder="Entrez le code d'activation de votre licence"
            required
          />
        </div>
        <div class="register-btn">
          <button type="submit" class="btn">S'inscrire</button>
        </div>
      </form>
      <p v-if="showError" id="error">{{ this.message }}</p>
      <p class="redirect-login">Déjà inscrit ? <a href="/login">Connectez-vous ici</a>.</p>
      <p class="">
        Pas encore de clé ? Faites-en la demande via<a
          href="mailto:joachim.lejeune.dev@gmail.com?subject=Demande%20de%20clé%20d'activation pour Pedimed."
          >mail</a
        >.
      </p>
    </div>
  </div>
</template>

<script>
import router from '@/router'
import { ref } from 'vue'
import apiClient from '../axios'
export default {
  setup() {
    let form = {
      username: '',
      mail: '',
      password: '',
      confirmPassword: '',
      registrationKey: ''
    }
    let message = ''
    let showError = ref(false)
    async function register() {
      if (this.form.password !== this.form.confirmPassword) {
        alert('Les mots de passe ne correspondent pas !')
        return
      }

      // Appeler une API pour envoyer les données utilisateur
      const urlRegister = '/users/register'
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': 'http://localhost:5173'
        }
      }
      try {
        const response = await apiClient.post(
          urlRegister,
          {
            username: this.form.username,
            mail: this.form.mail,
            password: this.form.password,
            // developper l'utilisation du code d'activation
            registrationKey: this.form.registrationKey
          },
          options
        )
        console.log('apiClient respone : ', response)
        router.push('/login')
      } catch (error) {
        showError.value = true
        this.message = error.response.data
        console.error('Register failed : ', error)
      }
    }
    return {
      form,
      message,
      register
    }
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
  background-color: var(--color-background);
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  margin: 0;
} */
/* .register-btn {
  text-align: center;
} */
/* .register-page {
  width: 100%;
  max-width: 400px;
  background: var(--color-background);
  border-radius: 2em;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  margin: 12vh auto;
} */

.register-container {
  width: 100%;
  max-width: 400px;
  background: var(--color-background);
  border-radius: 2em;
  box-shadow: 0 2px 6px var(--color-theme);
  padding: 2em;
  margin: 5vh 0;
}
.register-form div {
  display: flex;
  flex-direction: column;
  gap: 1vh;
}
.input-register[type='text'],
.input-register[type='password'],
.input-register[type='email'] {
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
.register-btn {
  align-items: center;
}
/* .h2-register {
  text-align: center;
  font-size: 1.5em;
  color: var(--color-text);
} */

/* .form-group {
  display: flex;
  flex-direction: column;
  margin: 1em 0;
} */

/* label {
  font-size: 0.9rem;
  color: var(--color-text);
} */

/* .input-register {
  padding: 10px;
  border: 1px solid var(--color-border);
  border-radius: 2em;
  font-size: 1.05rem;
  outline: none;
  transition: border-color 0.3s ease-in-out;
} */

/* .input-register:focus {
  border-color: var(--color-theme);
} */

/* .btn:hover {
  background-color: var(--color-theme);
} */

/* .redirect-login {
  text-align: center;
  font-size: 0.9rem;
} */

/* .redirect-login a {
  color: var(--color-theme);
  text-decoration: none;
} */

/* .redirect-login a:hover {
  text-decoration: underline;
} */
</style>
