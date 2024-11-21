import axios from 'axios'
import StorageService from './StorageService'

const API_URL = 'http://localhost:8085/api/auth/'

class AuthService {
  isLogin = false
  login(form) {
    const user = {
      username: form.username,
      password: form.password
    }
    return axios
      .post(API_URL + 'signin', { username: user.username, password: user.password })
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
