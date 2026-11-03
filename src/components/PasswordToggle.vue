<template>
  <!-- Enveloppe un champ mot de passe fourni par le parent (qui garde ses propres styles)
       et ajoute l'œil pour afficher / masquer la saisie :
       <PasswordToggle v-slot="{ type }"><input :type="type" … /></PasswordToggle> -->
  <div class="password-toggle">
    <slot :type="visible ? 'text' : 'password'"></slot>
    <button
      type="button"
      class="password-toggle-btn"
      :aria-label="visible ? 'Masquer le mot de passe' : 'Afficher le mot de passe'"
      :aria-pressed="visible"
      :title="visible ? 'Masquer le mot de passe' : 'Afficher le mot de passe'"
      @click="visible = !visible"
    >
      <MdiComponent :mdiValue="visible ? mdiEyeOff : mdiEye" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { mdiEye, mdiEyeOff } from '@mdi/js'
import MdiComponent from '@/components/icons/MdiComponent.vue'

const visible = ref(false)
</script>

<style scoped>
.password-toggle {
  position: relative;
  width: 100%;
}

/* place pour l'œil à droite du texte saisi */
.password-toggle :slotted(input) {
  padding-right: 2.5rem;
}

.password-toggle-btn {
  position: absolute;
  top: 50%;
  right: 0.375rem;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  padding: 0.25rem;
  border: none;
  border-radius: 4px;
  background: none;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: color 0.2s;
}

.password-toggle-btn:hover,
.password-toggle-btn:focus-visible {
  color: var(--color-theme);
}

.password-toggle-btn .mdi-component {
  width: 20px;
  height: 20px;
}
</style>
