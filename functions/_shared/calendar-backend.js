const JSON_HEADERS = {
  'Cache-Control': 'no-store',
  'Content-Type': 'application/json; charset=utf-8',
  'X-Content-Type-Options': 'nosniff'
}

export function jsonResponse(payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: JSON_HEADERS
  })
}

export function calendarConfig(env) {
  const url = env.GOOGLE_CALENDAR_BACKEND_URL
  const secret = env.GOOGLE_CALENDAR_BACKEND_SECRET

  if (!url || !secret) {
    throw new Error('The Google Calendar backend is not configured.')
  }

  return { url, secret }
}

export async function readCalendarResponse(response) {
  const text = await response.text()
  let payload

  try {
    payload = text ? JSON.parse(text) : {}
  } catch {
    throw new Error('The Google Calendar backend returned invalid JSON.')
  }

  if (!response.ok || payload.ok === false) {
    const error = new Error(
      payload.error || 'The Google Calendar backend request failed.'
    )
    error.status = Number(payload.status) || response.status || 502
    throw error
  }

  return payload
}

export function errorResponse(error) {
  console.error(error)
  const status = Number(error && error.status)
  const safeStatus = status >= 400 && status <= 599 ? status : 503
  const message =
    safeStatus < 500 && error instanceof Error
      ? error.message
      : 'The booking calendar is temporarily unavailable. Please try again.'

  return jsonResponse({ error: message }, safeStatus)
}
