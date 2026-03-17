import StorageService from './StorageService'
import apiClient from '../axios'
import { ref } from 'vue'

// const API_URL = 'http://localhost:8085/api/auth/'
const urlLogin = '/auth/signin'

class AuthService {
  isLogin = false
  login(form: any) {
    const user = {
      username: form.username,
      password: form.password,
      street: form.street,
      postalCode: form.postalCode,
      city: form.city
    }
    return apiClient
      .post(urlLogin, { username: user.username, password: user.password })
      .then((response: any) => {
        if (response.data.token) {
          StorageService.setItem('user', { id: response.data.id, username: user.username })
          StorageService.setItem('token', response.data.token)
        }
        return response.data
      })
  }

  logout() {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  }

  getCurrentUser() {
    const user = localStorage.getItem('user')
    return JSON.parse(user ? user : '')
  }
  getCurrentToken() {
    const token = localStorage.getItem('token')
    return JSON.parse(token ? token : '')
  }
  isCurrentUserConnected() {
    const token = localStorage.getItem('token')
    return token !== null && JSON.parse(token) !== null
  }
  getCurrentUserId() {
    return this.getCurrentUser()?.id
  }
}

export default new AuthService()
