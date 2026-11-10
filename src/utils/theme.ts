// Mode jour / nuit. « system » suit le réglage de l'appareil (prefers-color-scheme) ;
// « light » et « dark » le forcent via l'attribut data-theme de <html> (voir base.css).
// Le choix est propre à l'appareil : il est gardé dans le localStorage.
export type ThemePreference = 'system' | 'light' | 'dark'

const STORAGE_KEY = 'theme'

function isPreference(value: unknown): value is ThemePreference {
  return value === 'system' || value === 'light' || value === 'dark'
}

export function getThemePreference(): ThemePreference {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return isPreference(stored) ? stored : 'system'
  } catch {
    return 'system'
  }
}

export function applyTheme(preference: ThemePreference) {
  const root = document.documentElement
  if (preference === 'system') delete root.dataset.theme
  else root.dataset.theme = preference
}

export function setThemePreference(preference: ThemePreference) {
  applyTheme(preference)
  try {
    if (preference === 'system') localStorage.removeItem(STORAGE_KEY)
    else localStorage.setItem(STORAGE_KEY, preference)
  } catch {
    // Stockage indisponible (navigation privée…) : le choix vaut pour cette visite
  }
}

export function initTheme() {
  applyTheme(getThemePreference())
}
