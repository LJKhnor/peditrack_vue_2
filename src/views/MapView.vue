<template>
  <div class="map">
    <h1>Carte</h1>
    <div id="mapContainer"></div>
    <details v-if="unlocatedPatients.length" class="map-unlocated">
      <summary>
        {{ unlocatedPatients.length }} patient{{ unlocatedPatients.length > 1 ? 's' : '' }} sans
        position sur la carte
      </summary>
      <ul>
        <li v-for="patient in unlocatedPatients" :key="patient.id">
          {{ patient.firstname }} {{ patient.name }} —
          <span class="map-unlocated-reason">
            {{ patient.address ? 'adresse non localisée' : 'aucune adresse' }}
          </span>
        </li>
      </ul>
    </details>
  </div>
</template>

<script>
import { onMounted, onUnmounted, ref } from 'vue'
import apiClient from '../axios'
import AuthService from '../services/AuthService'
import { getPatients } from '../services/PatientService'
import 'leaflet/dist/leaflet.css'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import L from 'leaflet'
import 'leaflet.markercluster'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

const defaultIcon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

const homeIcon = L.divIcon({
  className: 'home-marker',
  html:
    '<div style="width:30px;height:30px;border-radius:50%;background:#2a7d4f;' +
    'border:2px solid #ffffff;box-shadow:0 1px 4px rgba(0,0,0,0.35);' +
    'display:flex;align-items:center;justify-content:center;">' +
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="#ffffff">' +
    '<path d="M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z"/></svg></div>',
  iconSize: [30, 30],
  iconAnchor: [15, 15],
  popupAnchor: [0, -15]
})

// Patient placé au centre de sa localité (adresse exacte introuvable) : marqueur gris distinct,
// pour ne pas le confondre avec une position exacte dans les zones de chalandise
const approximateIcon = L.divIcon({
  className: 'approximate-marker',
  html:
    '<div style="width:18px;height:18px;border-radius:50%;background:#94a3b8;' +
    'border:2px dashed #ffffff;box-shadow:0 1px 4px rgba(0,0,0,0.35);' +
    'display:flex;align-items:center;justify-content:center;color:#ffffff;' +
    'font-weight:700;font-size:12px;line-height:1;">~</div>',
  iconSize: [18, 18],
  iconAnchor: [9, 9],
  popupAnchor: [0, -9]
})

// Les popups Leaflet interprètent le HTML : les noms saisis sont échappés
function escapeHtml(value) {
  return String(value).replace(
    /[&<>"']/g,
    (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]
  )
}

export default {
  components: {
    // LMap,
    // LTileLayer,
    // LMarker,
    // LCircle
  },
  setup() {
    let zoom = 13
    let iconWidth = 25
    let iconHeight = 40
    const currentUser = AuthService.getCurrentUser()
    const pedicureStartPoint =
      currentUser?.pointX != null && currentUser?.pointY != null
        ? [currentUser.pointX, currentUser.pointY]
        : [50.4526514, 4.8884249]
    let markers = []
    let points = []
    let patientPositions = []
    const unlocatedPatients = ref([])
    let osm, osmHOT, openTopoMap, map, markersLayer, circlesLayer, layerControl
    const urlGetAllPatientPosition = '/data/map'
    function iconUrl() {
      return ''
    }
    function iconSize() {
      return [this.iconWidth, this.iconHeight]
    }
    onMounted(() => {
      initLayers()
      getAllPatientPositions().then(() => {
        addAllPatientsPositionsToMap()
        if (points.length > 0) map.fitBounds(points)
        findUnlocatedPatients()
      })
    })

    // Patients absents de /data/map (adresse manquante ou pas encore géolocalisée)
    async function findUnlocatedPatients() {
      try {
        const locatedIds = new Set(patientPositions.map((position) => position.id))
        const patients = await getPatients()
        unlocatedPatients.value = patients.filter((patient) => !locatedIds.has(patient.id))
      } catch (error) {
        console.error('Erreur lors de la récupération des patients :', error)
      }
    }

    onUnmounted(() => {
      map?.remove()
    })

    function initLayers() {
      // on lui passe les tuilles de la map
      osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      })
      // on créé le layer pour acceuillir la map et on lui passe les infos de centrage et de zoom

      // osmHOT = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      //   maxZoom: 19,
      //   attribution:
      //     '© OpenStreetMap contributors, Tiles style by Humanitarian OpenStreetMap Team hosted by OpenStreetMap France'
      // })
      // openTopoMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      //   maxZoom: 19,
      //   attribution:
      //     'Map data: © OpenStreetMap contributors, SRTM | Map style: © OpenTopoMap (CC-BY-SA)'
      // })
      let baseMaps = {
        OpenStreetMap: osm
        // 'OpenStreetMap.HOT': osmHOT,
        // OpenTopoMap: openTopoMap
      }
      map = L.map('mapContainer', { layers: [osm] }).setView(pedicureStartPoint, zoom)
      layerControl = L.control.layers(baseMaps).addTo(map)

      createCatchmentArea(map)

      L.marker(pedicureStartPoint, { icon: homeIcon, zIndexOffset: -1000 }).addTo(map)
    }

    function createCatchmentArea() {
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
      layerControl.addOverlay(circlesLayer, 'Zone de chalandise')
    }
    async function getAllPatientPositions() {
      await apiClient.get(urlGetAllPatientPosition).then((result) => {
        let pointsBody = result.data
        for (const key in pointsBody) {
          let value = pointsBody[key]
          if (value.point?.x == null || value.point?.y == null) continue
          // (0, 0) : adresse introuvable enregistrée par l'ancien géocodage. Ignoré pour ne pas
          // décentrer la carte ; le patient apparaît dans la liste « sans position sur la carte »
          if (value.point.x === 0 && value.point.y === 0) continue
          let point = L.latLng(value.point.x, value.point.y)
          points.push(point)
          patientPositions.push({
            id: value.id,
            name: value.name,
            firstName: value.firstName,
            approximate: value.approximate === true,
            point
          })
        }
      })

      return points
    }

    function createClusterIcon(cluster) {
      const count = cluster.getChildCount()
      let color = '#3a9b63'
      if (count >= 50) color = '#1b6b43'
      else if (count >= 10) color = '#2a7d4f'

      return L.divIcon({
        className: 'cluster-marker',
        html:
          `<div style="width:40px;height:40px;border-radius:50%;background:${color};` +
          'border:2px solid #ffffff;box-shadow:0 1px 4px rgba(0,0,0,0.35);' +
          'display:flex;align-items:center;justify-content:center;color:#ffffff;' +
          `font-weight:600;font-size:13px;">${count}</div>`,
        iconSize: L.point(40, 40)
      })
    }

    function addAllPatientsPositionsToMap() {
      for (const key in patientPositions) {
        let patientPosition = patientPositions[key]
        const name = escapeHtml(`${patientPosition.firstName} ${patientPosition.name}`)
        let marker = patientPosition.approximate
          ? L.marker(patientPosition.point, { icon: approximateIcon }).bindPopup(
              `${name}<br><em>Position approximative : adresse introuvable, centre de la localité</em>`
            )
          : L.marker(patientPosition.point, { icon: defaultIcon }).bindPopup(name)
        markers.push(marker)
      }
      markersLayer = L.markerClusterGroup({
        iconCreateFunction: createClusterIcon
      })
      markersLayer.addLayers(markers)
      markersLayer.addTo(map)
      layerControl.addOverlay(markersLayer, 'patients')
    }

    return { iconUrl, iconSize, zoom, iconWidth, iconHeight, unlocatedPatients }
  }
}
</script>

<style scoped>
.map {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

h1 {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-heading);
}

#mapContainer {
  width: 100%;
  height: 600px;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid var(--color-border);
}

.map-unlocated {
  font-size: 0.875rem;
  color: var(--color-text);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-surface);
  padding: 0.75rem 1rem;
}

.map-unlocated summary {
  cursor: pointer;
  font-weight: 500;
}

.map-unlocated ul {
  margin: 0.5rem 0 0;
  padding-left: 1.25rem;
}

.map-unlocated-reason {
  color: var(--color-text-secondary);
  font-style: italic;
}
</style>
