<template>
  <div class="appointment">
    <h1 class="color-theme">Rendez-vous</h1>
    <!--pre id="content" style="white-space: pre-wrap"></pre-->
    <!-- cette ligne ⬆️ permet de montrer les events éventuellement pour le debug-->

    <!--Add buttons to initiate auth sequence and sign out-->
    <button class="btn" id="authorize_button" @click="handleAuthClick">Authoriser</button>
    <button class="btn" id="signout_button" @click="handleSignoutClick">Se déconnecter</button>
    <vue-cal
      class="color-theme"
      id="calendarEvents"
      active-view="week"
      events-count-on-year-view
      locale="fr"
      todayButton="true"
      small="true"
      :events="eventsVueCal"
      :disable-views="['years']"
      :time-from="8 * 60"
      :time-to="19 * 60"
      :snap-to-time="15"
      :editable-events="{ title: true, drag: false, resize: true, delete: true, create: true }"
      @event-drag-create="createEvent('event-create', $event)"
      @event-title-change="updateEvent('event-update', $event)"
      @event-duration-change="updateEvent('event-update', $event)"
      @event-delete="deleteEvent('event-delete', $event)"
      @event-click="onEventClick"
    ></vue-cal>
    <VueModale
      v-bind:revele="showDialog"
      v-bind:toggleModale="onEventClick"
      v-bind:contents="content"
    ></VueModale>
  </div>
</template>

<script>
import { onMounted, ref, watch } from 'vue'
import { gapi } from 'gapi-script'
import VueCal from 'vue-cal'
import 'vue-cal/dist/vuecal.css'
import VueModale from '@/components/Modale.vue'

export default {
  name: 'GoogleCalendar',
  components: {
    VueCal,
    VueModale
  },
  setup() {
    const CLIENT_ID = '518378740822-k41s9sjqojak05ttc7orpdskpbafmi1p.apps.googleusercontent.com'
    const API_KEY = 'AIzaSyBu_rCoaIMF9HhSPeizb-fsQJ-rDRfxplc'
    const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest']
    const SCOPES = 'https://www.googleapis.com/auth/calendar'

    let tokenClient
    let gapiInited = false
    let gisInited = false
    let showDialog = ref(false)
    let content = ref('')

    let events = ref([])
    let eventsVueCal = ref(new Array())

    // Initialiser Google API au montage du composant
    onMounted(() => {
      gapi.load('client', initializeGapiClient)
      gapi.load('client', gisLoaded)
    })
    watch(events, (newVal) => {
      eventsVueCal.value = []
      for (let i = 0; i < newVal.length; i++) {
        // console.log(newVal[i].start.dateTime)
        // console.log(vueCalformattedDate(newVal[i].start.dateTime))
        eventsVueCal.value.push({
          id: newVal[i].id,
          start: vueCalformattedDate(newVal[i].start.dateTime),
          end: vueCalformattedDate(newVal[i].end.dateTime),
          title: newVal[i].summary,
          description: newVal[i].description,
          location: newVal[i].location
        })
      }
    })
    /*watch(eventsVueCal, (newVal, oldVal) => {
      if (newVal != oldVal) {
        console.log('eventsVueCal updated', newVal)
      }
    })*/

    /**
     * Callback after the API client is loaded. Loads the
     * discovery doc to initialize the API.
     */
    async function initializeGapiClient() {
      await gapi.client.init({
        apiKey: API_KEY,
        discoveryDocs: DISCOVERY_DOCS
      })
      gapiInited = true
      maybeEnableButtons()
    }

    /**
     * Callback after Google Identity Services are loaded.
     */
    function gisLoaded() {
      tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: 'handleAuthResponse'
      })
      gisInited = true
      maybeEnableButtons()
    }

    /**
     * Enables user interaction after all libraries are loaded.
     */
    function maybeEnableButtons() {
      if (gapiInited && gisInited) {
        document.getElementById('authorize_button').style.visibility = 'visible'
      }
    }

    /**
     *  Sign in the user upon button click.
     */
    function handleAuthClick() {
      tokenClient.callback = async (resp) => {
        if (resp.error !== undefined) {
          throw resp
        }
        document.getElementById('signout_button').style.visibility = 'visible'
        document.getElementById('authorize_button').innerText = 'Refresh'
        await listUpcomingEvents()
      }

      if (gapi.client.getToken() === null) {
        // Prompt the user to select a Google Account and ask for consent to share their data
        // when establishing a new session.
        tokenClient.requestAccessToken({ prompt: 'consent' })
      } else {
        // Skip display of account chooser and consent dialog for an existing session.
        tokenClient.requestAccessToken({ prompt: '' })
      }
    }

    /**
     *  Sign out the user upon button click.
     */
    function handleSignoutClick() {
      const token = gapi.client.getToken()
      if (token !== null) {
        google.accounts.oauth2.revoke(token.access_token)
        gapi.client.setToken('')
        // document.getElementById('content').innerText = ''
        document.getElementById('authorize_button').innerText = 'Authorize'
        document.getElementById('signout_button').style.visibility = 'hidden'
      }
    }

    /**
     * Print the summary and start datetime/date of the next ten events in
     * the authorized user's calendar. If no events are found an
     * appropriate message is printed.
     */
    async function listUpcomingEvents() {
      let response
      try {
        const request = {
          calendarId: 'primary',
          timeMin: new Date().toISOString(),
          showDeleted: false,
          singleEvents: true,
          maxResults: 250,
          orderBy: 'startTime'
        }
        response = await gapi.client.calendar.events.list(request)
      } catch (err) {
        document.getElementById('content').innerText = err.message
        return
      }

      events.value = response.result.items
      /**if (!events.value || events.value.length == 0) {
        document.getElementById('content').innerText = 'No events found.'
        return
      }*/

      /**
       * // Flatten to string to display
      const output = events.value.reduce(
        (str, event) => `${str}${event.summary} (${event.start.dateTime || event.start.date})\n`,
        'Events:\n'
      )
      // document.getElementById('content').innerText = output
       */
    }

    function vueCalformattedDate(str) {
      // Convertir la chaîne en un objet Date
      const dateObj = new Date(str)

      // Extraire les parties de la date
      const year = dateObj.getFullYear()
      const month = String(dateObj.getMonth() + 1).padStart(2, '0') // Mois commence à 0
      const day = String(dateObj.getDate()).padStart(2, '0')
      const hour = String(dateObj.getHours()).padStart(2, '0')
      const minute = String(dateObj.getMinutes()).padStart(2, '0')

      // Formater la date dans le format souhaité
      const formattedDate = `${year}-${month}-${day} ${hour}:${minute}`
      return formattedDate
    }
    function updateEvent(str, event) {
      console.debug('updated')
      try {
        let startDate = event.event.start
        let newEndDate = event.event.end
        let newTitle = event.event.title

        let newEvent = {
          start: { dateTime: startDate },
          end: { dateTime: newEndDate },
          summary: newTitle
        }
        gapi.client.calendar.events
          .update({
            eventId: event.event.id,
            calendarId: 'primary',
            resource: newEvent
          })
          .execute()
      } catch (err) {
        console.log(err)
      }
    }
    function createEvent(str, event) {
      console.debug('creation')
      let startDate = event.start
      let newEndDate = event.end
      let newTitle = event.title

      let newEvent = {
        start: { dateTime: startDate },
        end: { dateTime: newEndDate },
        summary: newTitle
      }
      gapi.client.calendar.events
        .insert({
          calendarId: 'primary',
          resource: newEvent
        })
        .execute((response) => {
          let newEvent = {
            id: response.id,
            start: event.start,
            end: event.end,
            summary: newTitle
          }
          eventsVueCal.value.push(newEvent)
        })
    }
    function deleteEvent(str, event) {
      console.debug('deleted')
      gapi.client.calendar.events
        .delete({
          eventId: event.id,
          calendarId: 'primary'
        })
        .execute()
    }

    function onEventClick(e, event) {
      content.value = { description: e.description, location: e.location }
      showDialog.value = !showDialog.value
    }

    return {
      showDialog,
      content,
      handleAuthClick,
      handleSignoutClick,
      eventsVueCal,
      vueCalformattedDate,
      updateEvent,
      createEvent,
      deleteEvent,
      onEventClick
    }
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
#calendarEvents {
  display: flex;
  height: 600px;
}
.appointment {
  text-align: center;
}
.vuecal__now-line {
  color: var(--color-theme);
}
.vuecal__title-bar {
  background-color: currentColor;
}
</style>
