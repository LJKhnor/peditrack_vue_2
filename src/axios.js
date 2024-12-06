import axios from 'axios'

// Définir la base URL en fonction de l'environnement
const apiClient = axios.create({
  baseURL:
    import.meta.env.MODE === 'production'
      ? import.meta.env.VITE_API_BASE_URL_PROD
      : import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

export default apiClient
