<template>
  <!-- Contenu de l'onglet « Profil clinique » de StatsView, qui en porte le titre -->
  <div class="stats-section">
    <p class="section-intro">
      Calculé sur la dernière fiche de chaque patient, c'est-à-dire son état actuel ({{
        clinical.patients
      }}
      patient{{ clinical.patients > 1 ? 's' : '' }}).
    </p>

    <div class="tiles">
      <StatTile label="Patients diabétiques" :value="diabetics">
        {{ share(diabetics, clinical.patients) }} des patients · type 1 :
        {{ clinical.diabetesType1 }} · type 2 : {{ clinical.diabetesType2 }}
      </StatTile>
      <StatTile label="Trouble de la coagulation" :value="clinical.bleedingDisorder">
        {{ share(clinical.bleedingDisorder, clinical.patients) }} des patients
      </StatTile>
      <StatTile label="Problèmes cardiaques" :value="clinical.heartDisorder">
        {{ share(clinical.heartDisorder, clinical.patients) }} des patients
      </StatTile>
    </div>

    <div class="cards-row">
      <StatCard title="Diabétiques par groupe" :subtitle="`${diabetics} patients diabétiques`">
        <BarList
          v-if="diabetics"
          :items="groupItems"
          :total="diabetics"
          label="Patients diabétiques par groupe"
        />
        <p v-else class="card-empty">Aucun patient diabétique.</p>
      </StatCard>

      <StatCard title="Remarques" subtitle="Patients concernés, des plus fréquentes aux plus rares">
        <BarList
          v-if="remarkItems.length"
          :items="remarkItems"
          :total="clinical.patients"
          label="Patients par remarque"
        />
        <p v-else class="card-empty">Aucune remarque encodée.</p>
      </StatCard>
    </div>

    <div class="cards-row">
      <StatCard
        title="Affections unguéales"
        subtitle="Patients concernés (un pied ou les deux), puis par pied"
      >
        <BarList
          v-if="nailItems.length"
          :items="nailItems"
          :total="clinical.patients"
          label="Patients par affection unguéale"
        />
        <p v-else class="card-empty">Aucune affection unguéale encodée.</p>
      </StatCard>

      <StatCard
        title="Déformations du pied"
        subtitle="Patients concernés (un pied ou les deux), puis par pied"
      >
        <BarList
          v-if="deformityItems.length"
          :items="deformityItems"
          :total="clinical.patients"
          label="Patients par déformation du pied"
        />
        <p v-else class="card-empty">Aucune déformation encodée.</p>
      </StatCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import BarList from '@/components/stats/BarList.vue'
import StatCard from '@/components/stats/StatCard.vue'
import StatTile from '@/components/stats/StatTile.vue'
import type { ClinicalStats } from '@/services/StatsService'
import { diabeticGroupItems, footConditionItems, labelCountItems, share } from '@/utils/stats'

const props = defineProps<{ clinical: ClinicalStats }>()

const diabetics = computed(() => props.clinical.diabetesType1 + props.clinical.diabetesType2)
const groupItems = computed(() => diabeticGroupItems(props.clinical.diabeticsByGroup))
const remarkItems = computed(() => labelCountItems(props.clinical.remarks))
const nailItems = computed(() => footConditionItems(props.clinical.nailConditions))
const deformityItems = computed(() => footConditionItems(props.clinical.footDeformities))
</script>

<style scoped>
.stats-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.section-intro,
.card-empty {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
}

.tiles {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
}

.cards-row {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

@media (max-width: 900px) {
  .cards-row {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .tiles {
    grid-template-columns: 1fr;
  }
}
</style>
