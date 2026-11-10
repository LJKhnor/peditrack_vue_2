<script setup lang="ts">
import { mdiLightbulbOnOutline } from '@mdi/js'
import TheWelcome from '../components/TheWelcome.vue'
import MdiComponent from '@/components/icons/MdiComponent.vue'
import AuthService from '@/services/AuthService'

const user = AuthService.getCurrentUser()
const username = user?.username ?? ''
const today = new Date().toLocaleDateString('fr-FR', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric'
})

const SUGGESTION_EMAIL = 'lejeune.joachim.dev@gmail.com'
const suggestionBody = [
  'Bonjour,',
  '',
  'Voici ma suggestion pour améliorer PediMed :',
  '',
  '',
  ...(username ? ['', `Compte : ${username}`] : [])
].join('\n')
const suggestionHref = `mailto:${SUGGESTION_EMAIL}?subject=${encodeURIComponent(
  'Suggestion PediMed'
)}&body=${encodeURIComponent(suggestionBody)}`
</script>

<template>
  <div class="home">
    <div class="home-greeting" v-if="username">
      <h1>
        Bonjour, <span class="home-greeting-name">{{ username }}</span>
      </h1>
      <p class="home-greeting-date">{{ today }}</p>
    </div>
    <TheWelcome />

    <section class="home-suggestion" aria-labelledby="home-suggestion-title">
      <div class="home-suggestion-icon">
        <MdiComponent :mdiValue="mdiLightbulbOnOutline" />
      </div>
      <div class="home-suggestion-text">
        <h2 id="home-suggestion-title">Une idée pour améliorer PediMed ?</h2>
        <p>
          Une fonctionnalité qui vous manque, quelque chose de peu pratique ? Envoyez-moi votre
          suggestion par e-mail, je la lirai avec attention.
        </p>
      </div>
      <a class="home-suggestion-btn" :href="suggestionHref">Envoyer une suggestion</a>
    </section>
  </div>
</template>

<style scoped>
.home {
  width: 100%;
  max-width: 960px;
}

.home-greeting {
  margin-bottom: 2.5rem;
}

.home-greeting h1 {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--color-heading);
  line-height: 1.2;
}

.home-greeting-name {
  color: var(--color-theme);
}

.home-greeting-date {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  margin-top: 0.25rem;
  text-transform: capitalize;
}

.home-suggestion {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 1.25rem;
  padding: 1.25rem 1.5rem;
  background: var(--color-surface);
  border: 1px dashed var(--color-border-hover);
  border-radius: 10px;
}

.home-suggestion-icon {
  width: 44px;
  height: 44px;
  background: var(--color-theme-light);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-theme);
  flex-shrink: 0;
}

.home-suggestion-text {
  flex: 1;
  min-width: 0;
}

.home-suggestion-text h2 {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-heading);
}

.home-suggestion-text p {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  line-height: 1.55;
  margin-top: 0.25rem;
}

.home-suggestion-btn {
  flex-shrink: 0;
  padding: 0.5rem 1rem;
  border: 1px solid var(--color-theme);
  color: var(--color-theme);
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  text-decoration: none;
  white-space: nowrap;
  transition: background 0.2s;
}

.home-suggestion-btn:hover,
.home-suggestion-btn:focus-visible {
  background: var(--color-theme-light);
  color: var(--color-theme);
}

@media (max-width: 640px) {
  .home-suggestion {
    flex-wrap: wrap;
  }

  .home-suggestion-text {
    flex-basis: calc(100% - 44px - 1rem);
  }

  .home-suggestion-btn {
    width: 100%;
    text-align: center;
  }
}
</style>
