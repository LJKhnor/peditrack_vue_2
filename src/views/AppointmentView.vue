<script>
import { onMounted, ref } from 'vue'
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
    const SCOPES = 'https://www.googleapis.com/auth/calendar.readonly'
    const CALENDAR_LINK =
      'https://calendar.google.com/calendar/u/0?cid=a2hub3JsZWpldW5lQGdtYWlsLmNvbQ'

    let tokenClient
    let gapiInited = false
    let gisInited = false

    // Initialiser Google API au montage du composant
    onMounted(() => {
      gapi.load('client', initializeGapiClient)
      gapi.load('https://accounts.google.com/gsi/client', gisLoaded)
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
        callback: handleAuthResponse
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

      const events = response.result.items
      if (!events || events.length == 0) {
        document.getElementById('content').innerText = 'No events found.'
        return
      }
      // Flatten to string to display
      const output = events.reduce(
        (str, event) => `${str}${event.summary} (${event.start.dateTime || event.start.date})\n`,
        'Events:\n'
      )
      document.getElementById('content').innerText = output
    }
    function handleAuthResponse(response) {
      if (response.error) {
        console.error('Error:', response.error)
        return
      }
      console.log('Access token:', response.access_token)
    }
    return {
      handleAuthClick,
      handleSignoutClick
    }
  }
}
</script>

<template>
  <div class="appointment">
    <h1>Rendez-vous</h1>
    <!--Add buttons to initiate auth sequence and sign out-->
    <button id="authorize_button" @click="handleAuthClick">Authoriser</button>
    <button id="signout_button" @click="handleSignoutClick">Se déconnecter</button>
    <vue-cal
      class="green"
      id="calendarEvents"
      :events="events"
      active-view="week"
      events-count-on-year-view
      :disable-views="['years']"
      :time-from="8 * 60"
      :time-to="19 * 60"
      :editable-events="{ title: true, drag: false, resize: true, delete: true, create: true }"
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
</style>
