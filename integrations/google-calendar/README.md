# HiTech Labs Google Calendar backend

The website keeps its existing Chime booking interface while Google Calendar
provides the actual availability and reservations.

## Production setup

- Apps Script project: `HiTech Labs Booking Calendar Backend`
- Apps Script account: `hitechlabskauai@gmail.com`
- Apps Script property: `BOOKING_SECRET`
- Cloudflare runtime variables:
  - `GOOGLE_CALENDAR_BACKEND_URL`
  - `GOOGLE_CALENDAR_BACKEND_SECRET`

The secret is stored only in Apps Script and Cloudflare. It must never be added
to this repository or to a public Vite environment variable.

## Booking behavior

- Uses the account's primary Google Calendar.
- Offers Monday through Friday from 9:00 AM to 5:00 PM Hawaii time.
- Keeps a rolling one-year booking window available without adding blocker
  events to the calendar.
- Requires two hours of lead time.
- Checks existing calendar events before showing a slot.
- Rechecks availability under a lock before creating an event.
- Adds the customer as a guest and sends a Google Calendar invitation.
- Limits repeated booking attempts from one network address.

If the Apps Script code changes, create a new deployment version while keeping
the existing web app deployment URL. If the secret is rotated, update both the
Apps Script property and the Cloudflare production and preview secrets.
