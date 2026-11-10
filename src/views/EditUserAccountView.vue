<template>
  <div class="edit-user-page">
    <div class="edit-user-page-container">
      <h2 class="h2-update-user">Préférence utilisateur</h2>
      <form id="update-user-form" @submit.prevent="updateUser">
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
          <label for="street">Rue</label>
          <input
            class="input-register"
            type="text"
            id="street"
            v-model="form.street"
            placeholder="Entrez votre rue et numéro"
          />
        </div>
        <div class="form-group">
          <label for="postal-code">Code postal</label>
          <input
            class="input-register"
            type="text"
            id="postal-code"
            v-model="form.postalCode"
            placeholder="Entrez votre code postal"
          />
        </div>
        <div class="form-group">
          <label for="city">Ville</label>
          <input
            class="input-register"
            type="text"
            id="city"
            v-model="form.city"
            placeholder="Entrez le nom de votre ville"
          />
        </div>
      </form>
      <input
        type="submit"
        class="btn user-record-validation"
        value="Mettre à jour"
        @click.prevent="updateUser"
      />
      <p v-if="feedback" class="update-feedback" :class="{ 'update-error': isError }" role="status">
        {{ feedback }}
      </p>
      <div class="display-preference">
        <span class="display-preference-label" aria-hidden="true">Affichage</span>
        <SegmentedControl
          v-model="theme"
          :options="themeOptions"
          label="Mode d'affichage"
        />
        <p class="display-preference-hint">
          Appliqué tout de suite, sur cet appareil. « Automatique » suit le réglage de l'appareil.
        </p>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import AuthService from '@/services/AuthService'
import StorageService from '@/services/StorageService'
import apiClient from '../axios'
import { errorStatus } from '@/services/apiError'
import { ref } from 'vue'
import { onMounted } from 'vue'
import { watch } from 'vue'
import SegmentedControl from '@/components/stats/SegmentedControl.vue'
import { getThemePreference, setThemePreference, type ThemePreference } from '@/utils/theme'
export default {
  name: 'UpdateUserVue',
  components: { SegmentedControl },
  setup() {
    const theme = ref<ThemePreference>(getThemePreference())
    const themeOptions: { value: ThemePreference; label: string }[] = [
      { value: 'light', label: 'Jour' },
      { value: 'dark', label: 'Nuit' },
      { value: 'system', label: 'Automatique' }
    ]
    watch(theme, setThemePreference)

    let form = ref({
      username: '',
      street: '',
      postalCode: '',
      city: '',
      theme: ''
    })
    onMounted(() => {
      fetchUserInfos().then(() => {})
    })
    const feedback = ref('')
    const isError = ref(false)
    const urlGetUserInfo = '/users/' + AuthService.getCurrentUserId() + '/info'
    const urlUpdateUser = '/users/' + AuthService.getCurrentUserId()
    async function fetchUserInfos() {
      await apiClient
        .get(urlGetUserInfo)
        .then(
          (response: {
            data: { name: string; street: string; postalCode: string; city: string }
          }) => {
            form.value.username = response.data.name
            form.value.street = response.data.street
            form.value.postalCode = response.data.postalCode
            form.value.city = response.data.city
          }
        )
    }
    async function updateUser() {
      feedback.value = ''
      try {
        // PUT /users/{id} : l'API attend la ville sous le nom `locality`
        await apiClient.put(urlUpdateUser, {
          username: form.value.username,
          street: form.value.street,
          postalCode: form.value.postalCode,
          locality: form.value.city
        })
      } catch (error) {
        console.error('Update user failed:', errorStatus(error))
        isError.value = true
        feedback.value = updateErrorMessage(error)
        return
      }
      isError.value = false
      feedback.value = 'Vos préférences ont été enregistrées.'
      await refreshUserPosition()
    }

    function updateErrorMessage(error: unknown) {
      const status = errorStatus(error)
      if (status === undefined)
        return 'Impossible de contacter le serveur. Vérifiez votre connexion.'
      if (status === 401) return 'Votre session a expiré. Reconnectez-vous.'
      return "L'enregistrement a échoué. Veuillez réessayer."
    }

    async function refreshUserPosition() {
      try {
        const info = await apiClient.get(urlGetUserInfo)
        if (info.data.pointX != null && info.data.pointY != null) {
          const currentUser = AuthService.getCurrentUser()
          StorageService.setItem('user', {
            ...currentUser,
            pointX: info.data.pointX,
            pointY: info.data.pointY
          })
        }
      } catch (_) {}
    }
    return { form, updateUser, feedback, isError, theme, themeOptions }
  }
}
</script>
<style scoped>
.update-feedback {
  margin-top: 0.75rem;
  font-size: 0.875rem;
  color: var(--color-theme);
}

.update-feedback.update-error {
  color: #c0392b;
}

.edit-user-page {
  width: 100%;
  max-width: 480px;
}

.edit-user-page-container {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 10px;
  box-shadow: 0 2px 12px var(--color-shadow);
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

h2 {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-heading);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

label {
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--color-text-secondary);
}

.input-register {
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

.user-record-validation {
  align-self: flex-start;
}

.display-preference {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.375rem;
  padding-top: 1.25rem;
  border-top: 1px solid var(--color-border);
}

.display-preference-label {
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--color-text-secondary);
}

.display-preference-hint {
  font-size: 0.75rem;
  color: var(--color-text-secondary);
}
</style>
