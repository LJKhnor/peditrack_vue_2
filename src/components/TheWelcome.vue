<script setup lang="ts">
import { mdiDoctor, mdiNotebook, mdiMap } from '@mdi/js'
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
  <WelcomeItem class="welcome-item">
    <template #icon>
      <MdiComponent v-bind:mdiValue="notebook" />
    </template>
    <template #heading>Rendez-vous</template>
    Gérer vos rendez-vous.
  </WelcomeItem>

  <WelcomeItem>
    <template #icon>
      <MdiComponent v-bind:mdiValue="doctorIcon" />
    </template>
    <template #heading>Patient</template>
    Gérer la fiche patient.
  </WelcomeItem>
  <WelcomeItem>
    <template #icon>
      <MdiComponent v-bind:mdiValue="mapIcon" />
    </template>
    <template #heading>Map</template>
    Voir sur la carte la localisation de vos patients.
  </WelcomeItem>

  <!-- <WelcomeItem>
    <template #icon>
      <CommunityIcon />
    </template>
    <template #heading>Données</template>
    Gérer les données de vos patients.
  </WelcomeItem>

  <WelcomeItem>
    <template #icon>
      <SupportIcon />
    </template>
    <template #heading>Map</template>
    Visualiser vos données sur une carte.
  </WelcomeItem> -->
</template>

<style></style>
