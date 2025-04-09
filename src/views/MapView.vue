<template>
  <div class="map">
    <h1>Carte</h1>
    <div id="mapContainer" style="height: 600px; width: 800px">
      <!-- <l-map ref="map" v-model:zoom="zoom" :center="[50.4526514, 4.8884249]">
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
      </l-map> -->
    </div>
  </div>
</template>

<script>
import { onMounted, onUnmounted } from 'vue'
import apiClient from '../axios'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { LMap, LTileLayer, LMarker, LCircle } from '@vue-leaflet/vue-leaflet'

export default {
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LCircle
  },
  setup() {
    let zoom = 13
    let iconWidth = 25
    let iconHeight = 40
    let listPoints = [
      [50.4526514, 4.8884249],
      [50.45, 4.88]
    ]
    const urlGetAllPatientPosition = '/data/map'
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'http://localhost:5173' // Allow requests from your Vue.js frontend
        // Add any other headers if needed
      }
    }
    function iconUrl() {
      return `https://placekitten.com/${this.iconWidth}/${this.iconHeight}`
    }
    function iconSize() {
      return [this.iconWidth, this.iconHeight]
    }
    onMounted(() => {
      // on créé le layer pour acceuillir la map et on lui passe les infos de centrage et de zoom
      let map = L.map('mapContainer').setView([50.4526514, 4.8884249], zoom)
      // on lui passe les tuilles de la map
      L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map)
      let iconStartingPoint = L.icon({
        iconUrl: 'logo_pedicure_val.png'
      })
      let startingPoint = L.marker([50.4526514, 4.8884249], { icon: iconStartingPoint }).addTo(map)

      getAllPatientPositions(map)
    })

    async function getAllPatientPositions(map) {
      createCatchmentArea(map)
      // const response = await apiClient.get(urlGetAllPatient, options)
      // for (const point in listPoints) {
      //   L.marker(listPoints[point]).addTo(map)
      // }
    }
    function createCatchmentArea(map) {
      let circle1 = L.circle([50.4526514, 4.8884249], {
        color: 'green',
        fillOpacity: 0.0,
        radius: 5000
      }).addTo(map)
      let circle2 = L.circle([50.4526514, 4.8884249], {
        color: 'yellow',
        fillOpacity: 0.0,
        radius: 10000
      }).addTo(map)
      let circle3 = L.circle([50.4526514, 4.8884249], {
        color: 'red',
        fillOpacity: 0.0,
        radius: 15000
      }).addTo(map)
    }
    return { iconUrl, iconSize, zoom, iconWidth, iconHeight }
  }
}
</script>

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
