<script>
import { onMounted, ref, watch } from 'vue'
import { gapi } from 'gapi-script'
import VueCal from 'vue-cal'
import 'vue-cal/dist/vuecal.css'

export default {
  name: 'GoogleCalendar',
  components: {
    VueCal
  },
  setup() {
    const CLIENT_ID = '518378740822-k41s9sjqojak05ttc7orpdskpbafmi1p.apps.googleusercontent.com'
    const API_KEY = 'AIzaSyBu_rCoaIMF9HhSPeizb-fsQJ-rDRfxplc'
    const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest']
    const SCOPES = 'https://www.googleapis.com/auth/calendar'
    const CALENDAR_LINK =
      'https://calendar.google.com/calendar/u/0?cid=a2hub3JsZWpldW5lQGdtYWlsLmNvbQ'

    let tokenClient
    let gapiInited = false
    let gisInited = false

    let events = ref([])
    let eventsToDisplay = ref([])
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
          title: newVal[i].summary
        })
      }
    })
    watch(eventsVueCal, (newVal, oldVal) => {
      if (newVal != oldVal) {
        console.log('eventsVueCal updated')
      }
    })

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
        document.getElementById('content').innerText = ''
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
          maxResults: 10,
          orderBy: 'startTime'
        }
        response = await gapi.client.calendar.events.list(request)
      } catch (err) {
        document.getElementById('content').innerText = err.message
        return
      }

      events.value = response.result.items
      if (!events.value || events.value.length == 0) {
        document.getElementById('content').innerText = 'No events found.'
        return
      }
      // Flatten to string to display
      const output = events.value.reduce(
        (str, event) => `${str}${event.summary} (${event.start.dateTime || event.start.date})\n`,
        'Events:\n'
      )
      // document.getElementById('content').innerText = output
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
    function createEvent() {
      console.log('event created dabord')
    }
    function logEvents(str, event) {
      console.log(event)
    }
    function updateEvent(str, event) {
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
    }
    function deleteEvent(str, event) {
      console.log(event)
      gapi.client.calendar.events
        .delete({
          eventId: event.id,
          calendarId: 'primary'
        })
        .execute()
    }

    return {
      handleAuthClick,
      handleSignoutClick,
      eventsVueCal,
      vueCalformattedDate,
      createEvent,
      logEvents,
      updateEvent,
      deleteEvent
    }
  }
}
</script>

<template>
  <div class="appointment">
    <h1>Rendez-vous</h1>
    <!--pre id="content" style="white-space: pre-wrap"></pre-->
    <!-- cette ligne ⬆️ permet de montrer les events éventuellement pour le debug-->

    <!--Add buttons to initiate auth sequence and sign out-->
    <button class="btn" id="authorize_button" @click="handleAuthClick">Authoriser</button>
    <button class="btn" id="signout_button" @click="handleSignoutClick">Se déconnecter</button>
    <vue-cal
      class="green"
      id="calendarEvents"
      :events="eventsVueCal"
      active-view="week"
      events-count-on-year-view
      :disable-views="['years']"
      :time-from="8 * 60"
      :time-to="19 * 60"
      :snap-to-time="15"
      :editable-events="{ title: true, drag: false, resize: true, delete: true, create: true }"
      @event-title-change="updateEvent('event-update', $event)"
      @event-duration-change="updateEvent('event-update', $event)"
      @event-delete="deleteEvent('event-delete', $event)"
    ></vue-cal>
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
#calendarEvents {
  display: flex;
  height: 600px;
}
.appointment {
  text-align: center;
}
.vuecal__now-line {
  color: #06c;
}
.vuecal__title-bar {
  background-color: currentColor;
}
.btn {
  background-color: lightgreen;
  color: black;
}
</style>
