import StorageService from './StorageService'
import apiClient from '../axios'

// const API_URL = 'http://localhost:8085/api/auth/'
const urlLogin = '/auth/signin'

class AuthService {
  isLogin = false
  login(form) {
    const user = {
      username: form.username,
      password: form.password
    }
    return apiClient
      .post(urlLogin, { username: user.username, password: user.password })
      .then((response) => {
        if (response.data.token) {
          StorageService.setItem('user', user)
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
    return JSON.parse(localStorage.getItem('user'))
  }
  getCurrentToken() {
    return JSON.parse(localStorage.getItem('token'))
  }
  isCurrentUserConnected() {
    return JSON.parse(localStorage.getItem('token')) !== null
  }
}

export default new AuthService()
