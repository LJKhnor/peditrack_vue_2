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
            v-model="form.postalcode"
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
import AuthService from '@/services/AuthService.js'
import apiClient from '../axios'
import { ref } from 'vue'
import { onMounted } from 'vue'
export default {
  name: 'UpdateUserVue',
  setup() {
    let formData = ref({})
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
    const urlGetUserInfo = '/users/info'
    const optionsGet = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'http://localhost:5173', // Allow requests from your Vue.js frontend
        // Add any other headers if needed
        Authorization: 'Bearer ' + AuthService.getCurrentToken()
      }
    }
    const optionPut = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'http://localhost:5173', // Allow requests from your Vue.js frontend
        // Add any other headers if needed
        Authorization: 'Bearer ' + AuthService.getCurrentToken()
      }
    }
    async function fetchUserInfos() {
      await apiClient.get(urlGetUserInfo, optionsGet).then((response) => {
        form.value.username = response.data.name
      })
    }
    async function updateUser() {
      await apiClient.put('/users/update', formData, optionPut).then((response) => {
        console.log(response)
      })
    }
    return { form, formData, updateUser }
  }
}
</script>
<style>
.edit-user-page {
  width: 100%;
  max-width: 400px;
  background: var(--color-background);
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  margin: 12vh auto;
}
.edit-user-page-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  box-shadow: 0 2px 6px var(--color-theme);
  padding: 20px;
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
.update-user-form {
}
</style>
