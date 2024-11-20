export function isAuthenticated() {
  const token = localStorage.getItem('token')
  if (!token) return false

  // Optionnel : Vérifie si le token est valide (par expiration ou en appelant une API backend)
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    const isExpired = payload.exp * 1000 < Date.now()
    return !isExpired
  } catch (e) {
    return false
  }
}
