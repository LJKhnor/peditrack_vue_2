<template>
  <div>
    <div class="tabs">
      <button
        type="button"
        v-for="tab in tabs"
        :key="tab.value"
        @click="$emit('update:activeTab', tab.value)"
        :class="{ active: activeTab === tab.value }"
      >
        {{ tab.name }}
      </button>
    </div>
    <div class="tab-content">
      <slot></slot>
    </div>
    <!-- Navigation automatique -->
    <!-- <div class="tab-navigation">
      <button type="button" @click="prevTab" :disabled="activeIndex === 0">Précédent</button>
      <button type="button" @click="nextTab" :disabled="activeIndex === tabs.length - 1">
        Suivant
      </button>
    </div> -->
  </div>
</template>

<script>
import { computed } from 'vue'

export default {
  props: {
    activeTab: String
  },
  emits: ['update:activeTab'],
  data() {
    return {
      tabs: [
        { name: 'Informations personnelles', value: 'personal' },
        { name: 'Informations médicales', value: 'medical' },
        { name: 'Informations médicales (suite)', value: 'type' },
        { name: 'Soins Prodigués', value: 'care' }
      ]
    }
  },
  computed: {
    activeIndex() {
      return this.tabs.findIndex((tab) => tab.value === this.activeTab)
    }
  },
  methods: {
    nextTab() {
      if (this.activeIndex < this.tabs.length - 1) {
        console.log('tab suivant')
        this.$emit('update:activeTab', this.tabs[this.activeIndex + 1].value)
      }
    },
    prevTab() {
      if (this.activeIndex > 0) {
        console.log('tab précédent')
        this.$emit('update:activeTab', this.tabs[this.activeIndex - 1].value)
      }
    }
  }
}
</script>

<style>
.tabs {
  width: 100%;
  margin-top: 4vh;
}
.tabs button {
  margin: 1%;
  padding: 1vw 2vh;
  border: none;
  background: var(--color-theme);
  border-radius: 12px;
  cursor: pointer;
}
.tabs button.active {
  border: 2px solid white;
}
.tab-content {
  margin: 0px 10vw;
}
.tab-navigation {
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
}
</style>
