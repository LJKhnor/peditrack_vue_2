const StorageService = {
  setItem(key, value) {
    // Stocke l'objet après l'avoir converti en JSON
    localStorage.setItem(key, JSON.stringify(value))
  },

  getItem(key) {
    // Récupère et parse le JSON en objet
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : null // Retourne `null` si la clé n'existe pas
  },

  removeItem(key) {
    // Supprime l'élément du localStorage
    localStorage.removeItem(key)
  }
}

export default StorageService
