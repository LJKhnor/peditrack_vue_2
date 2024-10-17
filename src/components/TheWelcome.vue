<script setup lang="ts">
import WelcomeItem from './WelcomeItem.vue'
import DocumentationIcon from './icons/IconDocumentation.vue'
import ToolingIcon from './icons/IconTooling.vue'
import CommunityIcon from './icons/IconCommunity.vue'
import SupportIcon from './icons/IconSupport.vue'
</script>

<template>
  <WelcomeItem class="welcome-item">
    <template #icon>
      <DocumentationIcon />
    </template>
    <template #heading>Rendez-vous</template>
    Gérer vos rendez-vous.
  </WelcomeItem>

  <WelcomeItem>
    <template #icon>
      <ToolingIcon />
    </template>
    <template #heading>Patient</template>
    Gérer la fiche patient.
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
