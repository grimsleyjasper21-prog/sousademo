# Connecting a client's own Google Calendar

Every booking on the site POSTs to one Apps Script URL (set via an
environment variable — see below). Whoever *deployed* that script is
whose calendar the bookings land on. So: **deploy one copy of this
script per client, under the client's own Google account**, and point
that client's website deployment at the resulting URL.

You do not need the client's password or any OAuth setup on your end —
just get them to do steps 1–5 below (or do it yourself while logged
into their Google account, e.g. screen-sharing), then hand you the URL
from step 5.

## Deploy steps (5–10 minutes, per client)

1. On the **client's** Google account, go to [script.google.com](https://script.google.com) → **New project**.
2. Delete the placeholder code and paste in the contents of `Code.gs` from this folder.
3. (Optional but recommended) Change `EXPECTED_TOKEN` at the top to a
   unique string for this client — anything works, it just has to
   match what you put in the website's `CALENDAR_DEMO_TOKEN` env var.
4. Click **Deploy → New deployment**:
   - Type: **Web app**
   - Execute as: **Me** (this is what makes it write to *their* calendar)
   - Who has access: **Anyone**
5. Click **Deploy**, approve the permission prompts (it'll ask to
   manage their Calendar — that's expected), then copy the URL ending
   in `/exec`.
6. Bookings will now appear on that Google account's default calendar
   (whichever calendar the client already uses day-to-day).

## Pointing the website at it

In the site's environment variables (Vercel project → Settings →
Environment Variables, or `.env.local` for local dev), set:

```
NEXT_PUBLIC_CALENDAR_ENDPOINT_URL=<the /exec URL from step 5>
NEXT_PUBLIC_CALENDAR_DEMO_TOKEN=<the token from step 3, if you changed it>
```

Redeploy the site (Vercel does this automatically on env var changes
if you trigger a redeploy). No code changes needed per client — see
`src/lib/calendar.ts`, which reads these two values with the current
GRIMHART demo endpoint as the fallback if they're unset.

## Sanity-checking a deploy

Open the `/exec` URL directly in a browser. You should see:
`{"status":"ok","message":"SOUSA calendar endpoint is live."}` — if
you see a Google sign-in page instead, "Who has access" wasn't set to
**Anyone** in step 4.

## Notes

- Each client's script is fully independent — one client's booking
  traffic never touches another's calendar or script.
- If you want SOUSA (or any client) to see this on their phone
  automatically, it's just their normal Google Calendar app — nothing
  extra to install.
- The demo token is a lightweight shared secret, not real
  authentication. Fine for a small business booking form; if this
  scales up, put real auth in front of the Apps Script.
