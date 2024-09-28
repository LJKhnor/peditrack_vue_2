<script>
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { LMap, LTileLayer, LMarker, LTooltip, LIcon, LCircle } from '@vue-leaflet/vue-leaflet'

export default {
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LTooltip,
    LIcon,
    LCircle
  },
  iconUrl() {
    return `https://placekitten.com/${this.iconWidth}/${this.iconHeight}`
  },
  iconSize() {
    return [this.iconWidth, this.iconHeight]
  },
  data() {
    return {
      zoom: 13,
      iconWidth: 25,
      iconHeight: 40
    }
  }
}
</script>
<template>
  <div class="map">
    <h1>Carte</h1>
    <div style="height: 600px; width: 800px">
      <l-map ref="map" v-model:zoom="zoom" :center="[50.4526514, 4.8884249]">
        <l-tile-layer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          layer-type="base"
          name="OpenStreetMap"
        ></l-tile-layer>
        <l-marker id="house" :lat-lng="[50.4526514, 4.8884249]"></l-marker>
        <l-circle
          :lat-lng="[50.4526514, 4.8884249]"
          :radius="5000"
          :color="'green'"
          :fill="false"
          opacity="0.5"
        ></l-circle>
        <l-circle
          :lat-lng="[50.4526514, 4.8884249]"
          :radius="10000"
          :color="'yellow'"
          :fill="false"
          opacity="0.7"
        ></l-circle>
        <l-circle
          :lat-lng="[50.4526514, 4.8884249]"
          :radius="15000"
          :color="'red'"
          :fill="false"
          opacity="0.5"
        ></l-circle>
      </l-map>
    </div>
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
.map {
  text-align: -webkit-center;
}
</style>
