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
      <p v-if="showError" id="error">{{ message }}</p>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import AuthService from '@/services/AuthService.ts'
import { errorStatus } from '@/services/apiError'
export default {
  name: 'LoginVue',
  props: [],
  setup(props, { emit }) {
    const router = useRouter()
    let form = {
      username: '',
      password: ''
    }
    let showError = ref(false)
    let message = ref('')

    async function login() {
      // Send login request and handle authentication token
      AuthService.login(form)
        .then(() => {
          router.push('/').then(() => {
            window.location.reload()
          })
        })
        .catch((error) => {
          showError.value = true
          message.value = loginErrorMessage(error)
          console.error('Login failed:', error.message, errorStatus(error))
        })
    }

    // Les erreurs sont des ProblemDetail dont le `detail` est en anglais : on traduit le statut
    function loginErrorMessage(error) {
      const status = errorStatus(error)
      if (status === undefined)
        return 'Impossible de contacter le serveur. Vérifiez votre connexion.'
      if (status === 401) return "Nom d'utilisateur ou mot de passe incorrect."
      if (status === 429)
        return 'Trop de tentatives. Veuillez patienter quelques minutes avant de réessayer.'
      return 'Une erreur est survenue. Veuillez réessayer.'
    }

    return { form, showError, message, login }
  }
}
</script>
<style scoped>
.login-container {
  width: 100%;
  max-width: 400px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 10px;
  box-shadow: 0 2px 12px var(--color-shadow);
  padding: 2rem;
  margin: 3rem 0;
}

h2 {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-heading);
  margin-bottom: 1.5rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
}

.login-form div {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.input-login {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  font-size: 0.875rem;
  background: var(--color-background);
  color: var(--color-text);
  transition: border-color 0.2s;
}

.input-login:focus {
  outline: none;
  border-color: var(--color-theme);
}

.login-connection {
  margin-top: 0.5rem;
}

#error {
  color: #dc2626;
  font-size: 0.875rem;
  margin-top: 0.75rem;
  text-align: center;
}
</style>
