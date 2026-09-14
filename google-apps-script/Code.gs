/**
 * GRIMHART booking → Google Calendar.
 *
 * Deploy this UNDER THE CLIENT'S OWN GOOGLE ACCOUNT so bookings land on
 * THEIR calendar, not yours. See google-apps-script/README.md for the
 * step-by-step deploy instructions.
 *
 * CalendarApp.getDefaultCalendar() always resolves to the calendar of
 * whichever Google account this script is deployed/authorized under —
 * that's the whole trick: deploy once per client, no sharing or
 * permission juggling required.
 *
 * Two entry points:
 *   POST /exec                    → creates a booking event
 *   GET  /exec?action=busy&date=  → returns that day's busy ranges
 *
 * The website reads the busy ranges so it never offers a time that is
 * already taken on the calendar. An older copy of this script that
 * predates the busy action still works: the site falls back to
 * opening-hours availability.
 */

// Change this to any string you like, then set the SAME value as this
// client's CALENDAR_TOKEN in the website's environment variables.
var EXPECTED_TOKEN = 'foryou-grimhart-demo-2026';

// Timezone used to read and write appointment times.
var TIME_ZONE = 'Europe/Madrid';

function doPost(e) {
  var response;
  try {
    var data = parseBody(e);
    validate(data);

    var start = new Date(data.start || (data.date + 'T' + data.start_time + ':00'));
    var end = new Date(data.end || (data.date + 'T' + data.end_time + ':00'));

    var calendar = CalendarApp.getDefaultCalendar();
    var event = calendar.createEvent(
      data.title || ('Booking — ' + data.customer_name),
      start,
      end,
      { description: data.description || '' }
    );

    response = {
      status: 'ok',
      eventId: event.getId(),
      calendarId: calendar.getId()
    };
  } catch (err) {
    response = { status: 'error', message: String(err && err.message ? err.message : err) };
  }

  return json(response);
}

/**
 * GET /exec                       → health check
 * GET /exec?action=busy&date=...  → { status: 'ok', date: ..., busy: [{start,end}] }
 *
 * Times come back as local HH:mm strings, which is what the website's slot
 * builder works in. All-day events block the whole day.
 */
function doGet(e) {
  var params = (e && e.parameter) || {};

  if (params.action !== 'busy') {
    return json({ status: 'ok', message: 'GRIMHART calendar endpoint is live.' });
  }

  try {
    if (params.token !== EXPECTED_TOKEN) {
      throw new Error('Invalid token');
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(params.date || '')) {
      throw new Error('Missing or invalid date');
    }

    var dayStart = new Date(params.date + 'T00:00:00');
    var dayEnd = new Date(params.date + 'T23:59:59');
    var events = CalendarApp.getDefaultCalendar().getEvents(dayStart, dayEnd);

    var busy = [];
    for (var i = 0; i < events.length; i++) {
      var ev = events[i];
      if (ev.isAllDayEvent()) {
        busy.push({ start: '00:00', end: '23:59' });
        continue;
      }
      // Transparent events ("free") do not block a booking.
      if (ev.getTransparency && ev.getTransparency() === CalendarApp.EventTransparency.TRANSPARENT) {
        continue;
      }
      busy.push({
        start: Utilities.formatDate(ev.getStartTime(), TIME_ZONE, 'HH:mm'),
        end: Utilities.formatDate(ev.getEndTime(), TIME_ZONE, 'HH:mm')
      });
    }

    return json({ status: 'ok', date: params.date, busy: busy });
  } catch (err) {
    return json({ status: 'error', message: String(err && err.message ? err.message : err) });
  }
}

function parseBody(e) {
  if (!e || !e.postData || !e.postData.contents) {
    throw new Error('Empty request body');
  }
  return JSON.parse(e.postData.contents);
}

function validate(data) {
  if (data.token !== EXPECTED_TOKEN) {
    throw new Error('Invalid token');
  }
  var required = ['customer_name', 'date', 'start_time', 'end_time'];
  for (var i = 0; i < required.length; i++) {
    if (!data[required[i]]) {
      throw new Error('Missing required field: ' + required[i]);
    }
  }
}

function json(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
