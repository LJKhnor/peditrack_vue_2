<script setup lang="ts">
import { mdiCalendarMonth, mdiAccountGroup, mdiMap, mdiDatabaseArrowDown } from '@mdi/js'
import WelcomeItem from './WelcomeItem.vue'
import MdiComponent from '@/components/icons/MdiComponent.vue'
</script>

<template>
  <div class="features-grid">
    <WelcomeItem to="/appointment">
      <template #icon><MdiComponent :mdiValue="mdiCalendarMonth" /></template>
      <template #heading>Rendez-vous</template>
      Gérez votre agenda et consultez vos prochains rendez-vous.
    </WelcomeItem>

    <WelcomeItem to="/patient">
      <template #icon><MdiComponent :mdiValue="mdiAccountGroup" /></template>
      <template #heading>Patients</template>
      Consultez et mettez à jour les dossiers de vos patients.
    </WelcomeItem>

    <WelcomeItem to="/map">
      <template #icon><MdiComponent :mdiValue="mdiMap" /></template>
      <template #heading>Carte</template>
      Visualisez la localisation géographique de votre patientèle.
    </WelcomeItem>

    <WelcomeItem to="/data">
      <template #icon><MdiComponent :mdiValue="mdiDatabaseArrowDown" /></template>
      <template #heading>Données</template>
      Exportez et gérez les données médicales de vos patients.
    </WelcomeItem>
  </div>
</template>

<style scoped>
.features-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.25rem;
}

@media (max-width: 640px) {
  .features-grid {
    grid-template-columns: 1fr;
  }
}
</style>
