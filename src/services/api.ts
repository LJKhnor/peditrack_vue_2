import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8085/'
})

api.interceptors.request.use((config) => {
  const u = localStorage.getItem('user')
  const user = JSON.parse(u ? u : '')
  if (user && user.token) {
    config.headers['Authorization'] = 'Bearer ' + user.token
  }
  return config
})

export default api
