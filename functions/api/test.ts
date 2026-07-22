import { afterEach, describe, expect, it, vi } from 'vitest'
import { onRequestGet } from './calendar-availability.js'
import { onRequestPost } from './calendar-bookings.js'

const environment = {
  GOOGLE_CALENDAR_BACKEND_URL: 'https://example.com/calendar-backend',
  GOOGLE_CALENDAR_BACKEND_SECRET: 'test-secret'
}

afterEach(() => {
  vi.restoreAllMocks()
})

describe('calendar availability function', () => {
  it('returns the live slots from the protected calendar backend', async () => {
    const slots = [
      {
        date: '2026-07-22',
        slots: [{ id: 'slot-1', timeLabel: '9:00 AM', available: true }]
      }
    ]
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(
        new Response(JSON.stringify({ ok: true, availability: slots }))
      )

    const response = await onRequestGet({
      env: environment,
      request: new Request(
        'https://www.hitechlabskauai.com/api/calendar-availability?serviceId=tech-check'
      )
    })

    expect(response.status).toBe(200)
    expect(await response.json()).toEqual({ availability: slots })
    expect(fetchMock).toHaveBeenCalledOnce()

    const upstreamUrl = new URL(String(fetchMock.mock.calls[0][0]))
    expect(upstreamUrl.searchParams.get('serviceId')).toBe('tech-check')
    expect(upstreamUrl.searchParams.get('secret')).toBe('test-secret')
  })

  it('rejects an invalid service before calling the backend', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch')
    const response = await onRequestGet({
      env: environment,
      request: new Request(
        'https://www.hitechlabskauai.com/api/calendar-availability?serviceId=../bad'
      )
    })

    expect(response.status).toBe(400)
    expect(fetchMock).not.toHaveBeenCalled()
  })
})

describe('calendar booking function', () => {
  it('forwards a same-origin booking without exposing the backend secret', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify({
          ok: true,
          booking: {
            bookingId: 'calendar-event-id',
            confirmationMessage: 'Confirmed'
          }
        })
      )
    )
    const request = new Request(
      'https://www.hitechlabskauai.com/api/calendar-bookings',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Origin: 'https://www.hitechlabskauai.com'
        },
        body: JSON.stringify({
          serviceId: 'tech-check',
          date: '2026-07-22',
          timeLabel: '9:00 AM',
          customer: { name: 'Test Guest', email: 'guest@example.com' }
        })
      }
    )

    const response = await onRequestPost({ env: environment, request })
    const responseBody = await response.json()

    expect(response.status).toBe(200)
    expect(responseBody).toEqual({
      booking: {
        bookingId: 'calendar-event-id',
        confirmationMessage: 'Confirmed'
      }
    })

    const upstreamRequest = fetchMock.mock.calls[0][1]
    const upstreamBody = JSON.parse(String(upstreamRequest?.body))
    expect(upstreamBody.secret).toBe('test-secret')
    expect(JSON.stringify(responseBody)).not.toContain('test-secret')
  })

  it('rejects cross-origin booking attempts', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch')
    const request = {
      headers: new Headers({ Origin: 'https://malicious.example' }),
      json: async () => ({}),
      url: 'https://www.hitechlabskauai.com/api/calendar-bookings'
    }

    const response = await onRequestPost({ env: environment, request })

    expect(response.status).toBe(403)
    expect(fetchMock).not.toHaveBeenCalled()
  })
})
