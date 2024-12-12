import axios from 'axios'

// Définir la base URL en fonction de l'environnement
console.debug('You are using', import.meta.env.MODE, 'mode for api')

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

export default apiClient
