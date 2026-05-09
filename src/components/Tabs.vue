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
        this.$emit('update:activeTab', this.tabs[this.activeIndex + 1].value)
      }
    },
    prevTab() {
      if (this.activeIndex > 0) {
        this.$emit('update:activeTab', this.tabs[this.activeIndex - 1].value)
      }
    }
  }
}
</script>

<style scoped>
.tabs {
  width: 100%;
  margin-top: 1.5rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 0.75rem;
}

.tabs button {
  padding: 0.4rem 1rem;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  transition: color 0.2s, background 0.2s, border-color 0.2s;
}

.tabs button:hover {
  color: var(--color-theme);
  border-color: var(--color-theme);
  background: var(--color-theme-light);
}

.tabs button.active {
  background: var(--color-theme);
  border-color: var(--color-theme);
  color: #fff;
}

.tab-content {
  margin-top: 1.25rem;
}
</style>
