import {
  calendarConfig,
  errorResponse,
  jsonResponse,
  readCalendarResponse
} from '../_shared/calendar-backend.js'

export async function onRequestGet(context) {
  try {
    const { url, secret } = calendarConfig(context.env)
    const requestUrl = new URL(context.request.url)
    const serviceId = requestUrl.searchParams.get('serviceId') || ''

    if (!/^[a-z0-9-]{1,64}$/.test(serviceId)) {
      return jsonResponse(
        { error: 'Please choose a valid appointment type.' },
        400
      )
    }

    const backendUrl = new URL(url)
    backendUrl.searchParams.set('action', 'availability')
    backendUrl.searchParams.set('serviceId', serviceId)
    backendUrl.searchParams.set('secret', secret)

    const response = await fetch(backendUrl.toString(), {
      headers: { Accept: 'application/json' },
      redirect: 'follow'
    })
    const payload = await readCalendarResponse(response)

    return jsonResponse({ availability: payload.availability || [] })
  } catch (error) {
    return errorResponse(error)
  }
}
