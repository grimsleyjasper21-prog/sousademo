/**
 * SOUSA booking → Google Calendar.
 *
 * Deploy this UNDER THE CLIENT'S OWN GOOGLE ACCOUNT so bookings land on
 * THEIR calendar, not yours. See google-apps-script/README.md for the
 * step-by-step deploy instructions.
 *
 * CalendarApp.getDefaultCalendar() always resolves to the calendar of
 * whichever Google account this script is deployed/authorized under —
 * that's the whole trick: deploy once per client, no sharing or
 * permission juggling required.
 */

// Change this to any string you like, then set the SAME value as
// CALENDAR_DEMO_TOKEN in the website's environment variables.
var EXPECTED_TOKEN = 'foryou-grimhart-demo-2026';

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
      calendarId: calendar.getId(),
    };
  } catch (err) {
    response = { status: 'error', message: String(err && err.message ? err.message : err) };
  }

  return ContentService
    .createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
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

/** Lets you open the /exec URL directly in a browser to sanity-check the deploy. */
function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', message: 'SOUSA calendar endpoint is live.' }))
    .setMimeType(ContentService.MimeType.JSON);
}
