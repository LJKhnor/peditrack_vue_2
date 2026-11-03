<template>
  <div class="register-page">
    <div class="register-container">
      <h2>Créer un compte</h2>
      <form class="register-form" @submit.prevent="register">
        <div class="form-group">
          <input
            class="input-register"
            type="text"
            id="username"
            v-model="form.username"
            placeholder="Nom d'utilisateur"
            required
          />
        </div>
        <div class="form-group">
          <input
            class="input-register"
            type="email"
            id="mail"
            v-model="form.mail"
            placeholder="Adresse email"
            required
          />
        </div>
        <div class="form-group">
          <input
            class="input-register"
            type="password"
            id="password"
            v-model="form.password"
            placeholder="Mot de passe"
            required
          />
        </div>
        <div class="form-group">
          <input
            class="input-register"
            type="password"
            id="confirm-password"
            v-model="form.confirmPassword"
            placeholder="Confirmer le mot de passe"
            required
          />
        </div>
        <div class="form-group">
          <input
            type="text"
            class="input-register"
            v-model="form.registrationKey"
            placeholder="Code d'activation de la licence"
            required
          />
        </div>
        <div class="register-btn">
          <button type="submit" class="btn" :disabled="isLoading">
            {{ isLoading ? 'Inscription en cours...' : "S'inscrire" }}
          </button>
        </div>
      </form>
      <p v-if="showError" class="register-error">{{ message }}</p>
      <p class="register-footer">Déjà inscrit ? <a href="/login">Connectez-vous ici</a>.</p>
      <p class="register-footer">
        Pas encore de clé ? Faites-en la demande par
        <a
          href="mailto:joachim.lejeune.dev@gmail.com?subject=Demande%20de%20clé%20d'activation pour Pedimed."
          >mail</a
        >.
      </p>
      <p class="register-footer">Découvrez notre <a href="/pricing">offre tarifaire</a>.</p>
    </div>
  </div>
</template>

<script>
import router from '@/router'
import { ref, reactive } from 'vue'
import apiClient from '../axios'
import { errorStatus, fieldErrors } from '@/services/apiError'
export default {
  setup() {
    const form = reactive({
      username: '',
      mail: '',
      password: '',
      confirmPassword: '',
      registrationKey: ''
    })
    const message = ref('')
    const showError = ref(false)
    const isLoading = ref(false)

    // Messages des champs refusés par la validation du backend (400 avec `errors`)
    const FIELD_MESSAGES = {
      username: "Le nom d'utilisateur est obligatoire.",
      mail: "L'adresse email est invalide.",
      password:
        'Le mot de passe doit contenir au moins 8 caractères, dont une majuscule, une minuscule, ' +
        'un chiffre et un caractère spécial (@#$%^&+=!*()_-).',
      registrationKey: "La clé d'activation est obligatoire."
    }

    // Les erreurs sont des ProblemDetail dont le `detail` est en anglais : on traduit le statut
    function resolveErrorMessage(error) {
      const status = errorStatus(error)
      if (status === undefined)
        return 'Impossible de contacter le serveur. Vérifiez votre connexion.'

      if (status === 409) return "Ce nom d'utilisateur ou cette adresse email est déjà utilisé."
      if (status === 400) {
        const fields = Object.keys(fieldErrors(error))
        if (fields.length > 0) {
          return fields
            .map((field) => FIELD_MESSAGES[field] ?? 'Les informations saisies sont invalides.')
            .join(' ')
        }
        // 400 sans erreur de champ : clé d'activation au mauvais format ou refusée
        return "Clé d'activation invalide, déjà utilisée ou expirée."
      }
      return 'Une erreur est survenue. Veuillez réessayer.'
    }

    async function register() {
      showError.value = false
      message.value = ''

      if (form.password !== form.confirmPassword) {
        showError.value = true
        message.value = 'Les mots de passe ne correspondent pas.'
        return
      }

      isLoading.value = true
      try {
        await apiClient.post('/users/register', {
          username: form.username,
          mail: form.mail,
          password: form.password,
          registrationKey: form.registrationKey
        })
        router.push('/login')
      } catch (error) {
        showError.value = true
        message.value = resolveErrorMessage(error)
        console.error('Register failed:', error.message, errorStatus(error))
      } finally {
        isLoading.value = false
      }
    }

    return { form, message, showError, isLoading, register }
  }
}
</script>

<style scoped>
.register-page {
  display: flex;
  justify-content: center;
}

.register-container {
  width: 100%;
  max-width: 420px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 10px;
  box-shadow: 0 2px 12px var(--color-shadow);
  padding: 2rem;
  margin: 2rem 0;
}

h2 {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-heading);
  margin-bottom: 1.5rem;
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.input-register {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  font-size: 0.875rem;
  background: var(--color-background);
  color: var(--color-text);
  transition: border-color 0.2s;
}

.input-register:focus {
  outline: none;
  border-color: var(--color-theme);
}

.register-btn {
  margin-top: 0.5rem;
}

.register-error {
  color: #dc2626;
  font-size: 0.875rem;
  margin-top: 0.75rem;
  text-align: center;
}

.register-footer {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  margin-top: 0.75rem;
  text-align: center;
}
</style>
