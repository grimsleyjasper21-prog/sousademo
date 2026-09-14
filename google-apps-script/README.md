# Connecting a calendar to a GRIMHART demo

Bookings never leave the browser directly. The flow is:

```
browser → /api/book (this site, server-side) → Apps Script /exec → Google Calendar
browser → /api/availability → Apps Script /exec?action=busy → Google Calendar
```

Whoever *deployed* the Apps Script is whose calendar bookings land on. So:
**deploy one copy of `Code.gs` per client, under the client's own Google
account**, and point that lead at the resulting URL.

While a demo is still a sales demo, leave it pointed at the shared GRIMHART
demo endpoint (the built-in default). Every event carries the lead slug and
the lead's `eventPrefix`, so demo bookings are easy to tell apart.

## Deploy steps (5–10 minutes, per client)

1. On the **client's** Google account, go to [script.google.com](https://script.google.com) → **New project**.
2. Delete the placeholder code and paste in the contents of `Code.gs`.
3. Change `EXPECTED_TOKEN` to something unique for this client, and set
   `TIME_ZONE` if they are not on `Europe/Madrid`.
4. **Deploy → New deployment**:
   - Type: **Web app**
   - Execute as: **Me** (this is what makes it write to *their* calendar)
   - Who has access: **Anyone**
5. **Deploy**, approve the Calendar permission prompt, copy the URL ending in `/exec`.

## Pointing a lead at it

Environment variables are read **server-side only** — none of this reaches the
browser. `<REF>` is the lead's `booking.calendarRef`, upper-cased (e.g. `SOUSA`).

```
CALENDAR_ENDPOINT_URL_<REF>=<the /exec URL from step 5>
CALENDAR_TOKEN_<REF>=<the token from step 3>
```

`CALENDAR_ENDPOINT_URL` / `CALENDAR_TOKEN` without a suffix set the default for
every lead. With nothing set at all, bookings go to the shared GRIMHART demo
calendar.

Then set the lead's `booking.mode` to `"apps-script"` so the site also *reads*
availability from that calendar instead of generating it from opening hours.

## Checking a deploy

- Open the `/exec` URL in a browser → `{"status":"ok","message":"GRIMHART calendar endpoint is live."}`
  (a Google sign-in page instead means step 4's "Who has access" wasn't **Anyone**).
- Add `?action=busy&date=2026-01-15&token=<your token>` → `{"status":"ok","date":...,"busy":[...]}`.

## Notes

- Each client's script is independent — one client's bookings never touch another's calendar.
- Busy ranges come back as local `HH:mm`. Events marked "free" (transparent) don't block a slot; all-day events block the day.
- A script copy deployed before the `busy` action existed still works for bookings: the site falls back to opening-hours availability and says so in the UI.
- The token is a lightweight shared secret, not authentication. Fine for a small-business booking form.
