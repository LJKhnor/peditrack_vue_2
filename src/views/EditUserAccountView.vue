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
    </div>
  </div>
</template>
<script lang="ts">
import AuthService from '@/services/AuthService'
import apiClient from '../axios'
import { ref } from 'vue'
import { onMounted } from 'vue'
export default {
  name: 'UpdateUserVue',
  setup() {
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
    let showError = ref(false)
    const urlGetUserInfo = '/users/' + AuthService.getCurrentUserId() + '/info'
    const urlUpdateUser = '/users/' + AuthService.getCurrentUserId() + '/update'
    async function fetchUserInfos() {
      await apiClient.get(urlGetUserInfo).then((response: { data: { name: string; street: string; postalCode: string; city: string } }) => {
        form.value.username = response.data.name
        form.value.street = response.data.street
        form.value.postalCode = response.data.postalCode
        form.value.city = response.data.city
      })
    }
    async function updateUser() {
      await apiClient.post(urlUpdateUser, form.value).then(() => {})
    }
    return { form, updateUser }
  }
}
</script>
<style scoped>
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
</style>
