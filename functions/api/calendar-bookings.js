import {
  calendarConfig,
  errorResponse,
  jsonResponse,
  readCalendarResponse
} from '../_shared/calendar-backend.js'

function sameOriginRequest(request) {
  const origin = request.headers.get('Origin')
  if (!origin) return true

  try {
    return new URL(origin).hostname === new URL(request.url).hostname
  } catch {
    return false
  }
}

export async function onRequestPost(context) {
  try {
    if (!sameOriginRequest(context.request)) {
      return jsonResponse(
        { error: 'Booking requests must come from this site.' },
        403
      )
    }

    const contentLength = Number(
      context.request.headers.get('Content-Length') || 0
    )
    if (contentLength > 20_000) {
      return jsonResponse({ error: 'The booking request is too large.' }, 413)
    }

    const rawBody = await context.request.text()
    if (rawBody.length > 20_000) {
      return jsonResponse({ error: 'The booking request is too large.' }, 413)
    }

    const body = JSON.parse(rawBody)
    const { url, secret } = calendarConfig(context.env)
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...body,
        action: 'booking',
        clientIp: context.request.headers.get('CF-Connecting-IP') || 'unknown',
        secret
      }),
      redirect: 'follow'
    })
    const payload = await readCalendarResponse(response)

    return jsonResponse({ booking: payload.booking || {} })
  } catch (error) {
    if (error instanceof SyntaxError) {
      return jsonResponse({ error: 'The booking request is invalid.' }, 400)
    }
    return errorResponse(error)
  }
}
