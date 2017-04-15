/* global gapi, moment */

const API_KEY = 'AIzaSyBYXTZiZYAel3Z1_cw11_s_c88_3pH_ZZ0'
const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest']
const CALENDAR_ID = 'adamvigneaux@gmail.com'

const countdownElement = document.getElementById('countdown')
const countdownTime = document.getElementById('countdown-time')
const loaderElement = document.getElementById('loader')
const yesElement = document.getElementById('yes')
const noElement = document.getElementById('no')
const howLongElement = document.getElementById('how-long')

/* Initialize the API client */
gapi.load('client', () => {
  return gapi.client.init({
    apiKey: API_KEY,
    discoveryDocs: DISCOVERY_DOCS
  })
    .then(getUpcomingEvents)
})

/* Parse events to determine busy status */
const parseEvents = (response) => {
  let isBusy = false
  let howLong

  for (let event of response.result.items) {
    const now = moment()
    const start = moment(event.start.dateTime)
    const end = moment(event.end.dateTime)

    // If event is currently happening, mark as busy and find how long
    // until the event ends, then exit loop
    if (now.isBetween(start, end)) {
      isBusy = true
      howLong = moment.duration(now.diff(end)).humanize()
      break

      // If no event is currently happening, take the first event that starts
      // in the future and find how long until it starts, then exit loop
    } else if (start > now) {
      howLong = moment.duration(now.diff(start)).humanize()
      break
    }
  }

  return setBusy(isBusy, howLong)
}

/* Reset UI and refresh data */
const refreshData = () => {
  loaderElement.classList.remove('hidden')
  countdownElement.classList.add('hidden')
  getUpcomingEvents()
}

/* Start countdown timer until next refresh */
const startCountdown = () => {
  const duration = moment.duration(5, 'minutes')
  const interval = 1000

  setInterval(() => {
    // Decrement countdown and update UI
    if (duration > 0) {
      duration.subtract(1, 'seconds')
      countdownTime.innerHTML = duration.humanize()

      // Refresh data and restart countdown
    } else {
      duration.add(5, 'minutes')
      refreshData()
    }
  }, interval)
}

startCountdown()

/* Update the UI with busy status */
const setBusy = (isBusy, howLong) => {
  // Hide loader
  loaderElement.classList.add('hidden')

  // Show countdown
  countdownElement.classList.remove('hidden')

  yesElement.classList.toggle('hidden', !isBusy)
  noElement.classList.toggle('hidden', isBusy)
  howLongElement.innerHTML = `for ${howLong}`
}

/* Get date 24 hours ago */
const getMinTime = () => {
  return moment().subtract(1, 'days').toISOString()
}

/**
 * Print the summary and start datetime/date of the next ten events in
 * the authorized user's calendar. If no events are found an
 * appropriate message is printed.
 */
function getUpcomingEvents () {
  gapi.client.calendar.events.list({
    calendarId: CALENDAR_ID,
    timeMin: getMinTime(),
    singleEvents: true,
    maxResults: 25,
    orderBy: 'startTime'
  })
    .then(parseEvents)
}
