<script setup lang="ts">
import { mdiDoctor, mdiNotebook, mdiMap, mdiDatabaseArrowDown } from '@mdi/js'
import WelcomeItem from './WelcomeItem.vue'
import DocumentationIcon from './icons/IconDocumentation.vue'
import ToolingIcon from './icons/IconTooling.vue'
import MdiComponent from '@/components/icons/MdiComponent.vue'
// import CommunityIcon from './icons/IconCommunity.vue'
// import SupportIcon from './icons/IconSupport.vue'
let notebook = mdiNotebook
let doctorIcon = mdiDoctor
let mapIcon = mdiMap
</script>

<template>
  <div class="welcome-container">
    <WelcomeItem class="welcome-item">
      <template #icon>
        <MdiComponent v-bind:mdiValue="notebook" />
      </template>
      <template #heading>Rendez-vous</template>
      Gérer vos rendez-vous.
    </WelcomeItem>

    <WelcomeItem class="welcome-item">
      <template #icon>
        <MdiComponent v-bind:mdiValue="doctorIcon" />
      </template>
      <template #heading>Patient</template>
      Gérer la fiche patient.
    </WelcomeItem>
    <WelcomeItem class="welcome-item">
      <template #icon>
        <MdiComponent v-bind:mdiValue="mapIcon" />
      </template>
      <template #heading>Map</template>
      Voir sur la carte la localisation de vos patients.
    </WelcomeItem>

    <WelcomeItem class="welcome-item">
      <template #icon>
        <MdiComponent v-bind:mdiValue="mdiDatabaseArrowDown" />
      </template>
      <template #heading>Données</template>
      Gérer les données de vos patients.
    </WelcomeItem>
  </div>
</template>

<style>
.welcome-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  margin: 20vh 0;
}
.welcome-item {
  flex: 1 1 200px;
  max-width: 300px;
}
</style>
