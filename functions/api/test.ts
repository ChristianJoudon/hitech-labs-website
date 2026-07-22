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
    expect(upstreamUrl.searchParams.get('format')).toBe('schedule')
    expect(upstreamUrl.searchParams.get('secret')).toBe('test-secret')
  })

  it('expands the year schedule with Hawaii timestamps and blocked events', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify({
          ok: true,
          availabilitySchedule: {
            todayKey: '2026-07-22',
            daysForward: 5,
            openMinute: 540,
            closeMinute: 1020,
            slotStepMinutes: 30,
            durationMinutes: 30,
            earliestStartMs: Date.parse('2026-07-22T08:00:00-10:00'),
            weekdays: [1, 2, 3, 4, 5],
            busy: [
              [
                Date.parse('2026-07-22T09:30:00-10:00'),
                Date.parse('2026-07-22T10:00:00-10:00')
              ]
            ]
          }
        })
      )
    )

    const response = await onRequestGet({
      env: environment,
      request: new Request(
        'https://www.hitechlabskauai.com/api/calendar-availability?serviceId=tech-check'
      )
    })

    expect(response.status).toBe(200)
    const body = await response.json()
    expect(body.availability).toHaveLength(3)
    expect(body.availability.map((day) => day.date)).toEqual([
      '2026-07-22',
      '2026-07-23',
      '2026-07-24'
    ])
    expect(body.availability[0].slots).toHaveLength(16)
    expect(body.availability[0].slots.slice(0, 2)).toEqual([
      {
        id: '2026-07-22-540',
        timeLabel: '9:00 AM',
        available: true,
        startsAt: '2026-07-22T19:00:00.000Z',
        endsAt: '2026-07-22T19:30:00.000Z'
      },
      {
        id: '2026-07-22-570',
        timeLabel: '9:30 AM',
        available: false,
        label: 'Booked',
        startsAt: '2026-07-22T19:30:00.000Z',
        endsAt: '2026-07-22T20:00:00.000Z'
      }
    ])
  })

  it('keeps the rolling year on weekdays and ends at offset 364', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify({
          ok: true,
          availabilitySchedule: {
            todayKey: '2026-07-22',
            daysForward: 365,
            openMinute: 540,
            closeMinute: 1020,
            slotStepMinutes: 30,
            durationMinutes: 30,
            earliestStartMs: Date.parse('2026-07-22T08:00:00-10:00'),
            weekdays: [1, 2, 3, 4, 5],
            busy: []
          }
        })
      )
    )

    const response = await onRequestGet({
      env: environment,
      request: new Request(
        'https://www.hitechlabskauai.com/api/calendar-availability?serviceId=tech-check'
      )
    })

    expect(response.status).toBe(200)
    const body = await response.json()
    expect(body.availability).toHaveLength(261)
    expect(body.availability[0].date).toBe('2026-07-22')
    expect(body.availability.at(-1).date).toBe('2027-07-21')
    expect(
      body.availability.every((day) => {
        const weekday = new Date(`${day.date}T12:00:00Z`).getUTCDay()
        return weekday >= 1 && weekday <= 5
      })
    ).toBe(true)
  })

  it('fails closed when the calendar backend sends a malformed busy interval', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify({
          ok: true,
          availabilitySchedule: {
            todayKey: '2026-07-22',
            daysForward: 5,
            openMinute: 540,
            closeMinute: 1020,
            slotStepMinutes: 30,
            durationMinutes: 30,
            earliestStartMs: Date.parse('2026-07-22T08:00:00-10:00'),
            weekdays: [1, 2, 3, 4, 5],
            busy: [[Date.parse('2026-07-22T09:30:00-10:00')]]
          }
        })
      )
    )

    const response = await onRequestGet({
      env: environment,
      request: new Request(
        'https://www.hitechlabskauai.com/api/calendar-availability?serviceId=tech-check'
      )
    })

    expect(response.status).toBe(503)
    expect(await response.json()).toEqual({
      error:
        'The booking calendar is temporarily unavailable. Please try again.'
    })
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
