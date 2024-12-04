<script>
import { onMounted } from 'vue'
import axios from 'axios'
import 'leaflet/dist/leaflet.css'
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
    const urlGetAllPatient = 'http://localhost:8085/patients'
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
      getAllPatient()
    })

    async function getAllPatient() {
      const response = await axios.get(urlGetAllPatient, options)

      console.log(response.data)
      response.data.forEach((element) => {
        rowData.value.push({
          lastName: element.name,
          firstname: element.firstname,
          phoneNum: element.phoneNum,
          birthdate: element.birthdate,
          address: element.address
        })
      })
      console.log('rowData', rowData)
    }
    return { iconUrl, iconSize, zoom, iconWidth, iconHeight }
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
