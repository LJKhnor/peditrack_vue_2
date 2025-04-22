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
import AuthService from '@/services/AuthService.js'

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
    const pedicureStartPoint = [50.4526514, 4.8884249]
    let markers = []
    let points = []
    let osm, osmHOT, openTopoMap, map, markersLayer, circlesLayer, layerControl
    const urlGetAllPatientPosition = '/data/map'
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'http://localhost:5173', // Allow requests from your Vue.js frontend
        // Add any other headers if needed
        Authorization: 'Bearer ' + AuthService.getCurrentToken()
      }
    }
    function iconUrl() {
      return `https://placekitten.com/${this.iconWidth}/${this.iconHeight}`
    }
    function iconSize() {
      return [this.iconWidth, this.iconHeight]
    }
    onMounted(() => {
      initLayers()
      getAllPatientPositions().then(() => {
        addAllPatientsPositionsToMap()
        map.fitBounds(points)
      })
    })

    function initLayers() {
      // on lui passe les tuilles de la map
      osm = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      })
      // on créé le layer pour acceuillir la map et on lui passe les infos de centrage et de zoom

      osmHOT = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution:
          '© OpenStreetMap contributors, Tiles style by Humanitarian OpenStreetMap Team hosted by OpenStreetMap France'
      })
      openTopoMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution:
          'Map data: © OpenStreetMap contributors, SRTM | Map style: © OpenTopoMap (CC-BY-SA)'
      })
      let baseMaps = {
        OpenStreetMap: osm,
        'OpenStreetMap.HOT': osmHOT,
        OpenTopoMap: openTopoMap
      }
      map = L.map('mapContainer', { layers: [osm] }).setView(pedicureStartPoint, zoom)
      layerControl = L.control.layers(baseMaps).addTo(map)

      createCatchmentArea(map)

      L.marker(pedicureStartPoint).addTo(map)
    }

    function createCatchmentArea(map) {
      let circle1 = L.circle(pedicureStartPoint, {
        color: 'green',
        fillOpacity: 0.0,
        radius: 5000
      })
      let circle2 = L.circle(pedicureStartPoint, {
        color: 'yellow',
        fillOpacity: 0.0,
        radius: 10000
      })
      let circle3 = L.circle(pedicureStartPoint, {
        color: 'red',
        fillOpacity: 0.0,
        radius: 15000
      })
      circlesLayer = L.layerGroup([circle1, circle2, circle3])
      layerControl.addOverlay(circlesLayer, 'Zone de chalendise')
    }
    async function getAllPatientPositions() {
      await apiClient.get(urlGetAllPatientPosition, options).then((result) => {
        let pointsBody = result.data
        for (const key in pointsBody) {
          let value = pointsBody[key]
          let point = L.latLng(value.x, value.y)
          points.push(point)
        }
      })

      return points
    }

    function addAllPatientsPositionsToMap() {
      for (const key in points) {
        let marker = L.marker(points[key])
        markers.push(marker)
      }
      markersLayer = L.layerGroup(markers).addTo(map)
      layerControl.addOverlay(markersLayer, 'patients')
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
