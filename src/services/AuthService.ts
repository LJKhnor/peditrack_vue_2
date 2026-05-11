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
      .then(async (response: any) => {
        if (response.data.token) {
          const userId = response.data.id
          StorageService.setItem('token', response.data.token)

          const userObj: any = { id: userId, username: user.username }
          try {
            const info = await apiClient.get(`/users/${userId}/info`)
            if (info.data.pointX != null && info.data.pointY != null) {
              userObj.pointX = info.data.pointX
              userObj.pointY = info.data.pointY
            }
          } catch (_) {}

          StorageService.setItem('user', userObj)
        }
        return response.data
      })
  }

  logout() {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  }

  getCurrentUser() {
    try {
      const user = localStorage.getItem('user')
      return user ? JSON.parse(user) : null
    } catch {
      localStorage.removeItem('user')
      return null
    }
  }
  getCurrentToken() {
    try {
      const token = localStorage.getItem('token')
      return token ? JSON.parse(token) : null
    } catch {
      localStorage.removeItem('token')
      return null
    }
  }
  isCurrentUserConnected() {
    return this.getCurrentToken() !== null
  }
  getCurrentUserId() {
    return this.getCurrentUser()?.id
  }
}

export default new AuthService()
