<template>
  <div v-if="activeTab === value">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'tabComponent',
  props: {
    name: String,
    value: String,
    activeTab: String
  }
}
</script>
