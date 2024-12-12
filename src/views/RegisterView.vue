<template>
  <div class="register-page">
    <div class="register-container">
      <h2 class="h2-register">Créer un compte</h2>
      <form @submit.prevent="register">
        <div class="form-group">
          <label for="username">Nom d'utilisateur</label>
          <input
            class="input-register"
            type="text"
            id="username"
            v-model="form.username"
            placeholder="Entrez votre nom d'utilisateur"
          />
        </div>
        <div class="form-group">
          <label for="mail">Email</label>
          <input
            class="input-register"
            type="email"
            id="mail"
            v-model="form.mail"
            placeholder="Entrez votre adresse email"
          />
        </div>
        <div class="form-group">
          <label for="password">Mot de passe</label>
          <input
            class="input-register"
            type="password"
            id="password"
            v-model="form.password"
            placeholder="Créez un mot de passe"
          />
        </div>
        <div class="form-group">
          <label for="confirm-password">Confirmer le mot de passe</label>
          <input
            class="input-register"
            type="password"
            id="confirm-password"
            v-model="form.confirmPassword"
            placeholder="Confirmez votre mot de passe"
          />
        </div>
        <button type="submit" class="btn register-btn">S'inscrire</button>
      </form>
      <p class="redirect-login">Déjà inscrit ? <a href="/login">Connectez-vous ici</a>.</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import router from '@/router'
import apiClient from '../axios'
export default {
  setup() {
    let form = {
      username: '',
      mail: '',
      password: '',
      confirmPassword: ''
    }
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
            password: this.form.password
          },
          options
        )
        console.log('apiClient repsone : ', response)
        router.push('/login')
      } catch (error) {
        console.error('Register failed : ', error)
      }
      console.log("Données d'inscription :", this.form)
    }
    return {
      form,
      register
    }
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

.register-page {
  width: 100%;
  max-width: 400px;
  background: var(--color-background);
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  margin: 12vh auto;
}

.register-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  box-shadow: 0 2px 6px var(--color-theme);
  padding: 20px;
}

.h2-register {
  text-align: center;
  font-size: 1.5rem;
  color: var(--color-text);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

label {
  font-size: 0.9rem;
  color: var(--color-text);
}

.input-register {
  padding: 10px;
  border: 1px solid var(--color-border);
  border-radius: 5px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.3s ease-in-out;
}

.input-register:focus {
  border-color: var(--color-theme);
}

.btn:hover {
  background-color: var(--color-theme);
}

.redirect-login {
  text-align: center;
  font-size: 0.9rem;
}

.redirect-login a {
  color: var(--color-theme);
  text-decoration: none;
}

.redirect-login a:hover {
  text-decoration: underline;
}
</style>
