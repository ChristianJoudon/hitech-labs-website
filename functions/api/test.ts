import { afterEach, describe, expect, it, vi } from 'vitest'
import { onRequestGet } from './calendar-availability.js'
import { onRequestPost } from './calendar-bookings.js'

const environment = {
  GOOGLE_CALENDAR_BACKEND_URL: 'https://example.com/calendar-backend',
  GOOGLE_CALENDAR_BACKEND_SECRET: 'test-secret'
}

const correctedWeeklyWindows = [
  {
    weekdays: [1, 2, 3, 4, 5],
    openMinute: 1020,
    closeMinute: 1200
  },
  {
    weekdays: [0, 6],
    openMinute: 540,
    closeMinute: 1020
  }
]

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

  it('uses evening weekday hours and daytime weekend hours for the rolling year', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify({
          ok: true,
          availabilitySchedule: {
            todayKey: '2026-07-22',
            daysForward: 365,
            weeklyWindows: correctedWeeklyWindows,
            slotStepMinutes: 30,
            durationMinutes: 30,
            earliestStartMs: Date.parse('2026-07-22T08:00:00-10:00'),
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
    expect(body.availability).toHaveLength(365)
    expect(body.availability[0].date).toBe('2026-07-22')
    expect(body.availability.at(-1).date).toBe('2027-07-21')
    expect(body.availability[0].slots).toHaveLength(6)
    expect(body.availability[0].slots[0].timeLabel).toBe('5:00 PM')
    expect(body.availability[0].slots.at(-1).timeLabel).toBe('7:30 PM')

    const saturday = body.availability.find((day) => day.date === '2026-07-25')
    expect(saturday.slots).toHaveLength(16)
    expect(saturday.slots[0].timeLabel).toBe('9:00 AM')
    expect(saturday.slots.at(-1).timeLabel).toBe('4:30 PM')

    const sunday = body.availability.find((day) => day.date === '2026-07-26')
    expect(sunday.slots).toHaveLength(16)
    expect(sunday.slots[0].timeLabel).toBe('9:00 AM')
    expect(sunday.slots.at(-1).timeLabel).toBe('4:30 PM')
  })

  it('honors evening lead time and busy-event boundaries', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify({
          ok: true,
          availabilitySchedule: {
            todayKey: '2026-07-24',
            daysForward: 4,
            weeklyWindows: correctedWeeklyWindows,
            slotStepMinutes: 30,
            durationMinutes: 30,
            earliestStartMs: Date.parse('2026-07-24T17:15:00-10:00'),
            busy: [
              [
                Date.parse('2026-07-24T17:30:00-10:00'),
                Date.parse('2026-07-24T18:00:00-10:00')
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
    expect(body.availability.map((day) => day.date)).toEqual([
      '2026-07-24',
      '2026-07-25',
      '2026-07-26',
      '2026-07-27'
    ])
    expect(body.availability[0].slots[0]).toMatchObject({
      timeLabel: '5:30 PM',
      available: false,
      label: 'Booked'
    })
    expect(body.availability[0].slots[1]).toMatchObject({
      timeLabel: '6:00 PM',
      available: true
    })
  })

  it('uses the correct last start for longer services', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify({
          ok: true,
          availabilitySchedule: {
            todayKey: '2026-07-24',
            daysForward: 3,
            weeklyWindows: correctedWeeklyWindows,
            slotStepMinutes: 30,
            durationMinutes: 45,
            earliestStartMs: Date.parse('2026-07-24T08:00:00-10:00'),
            busy: []
          }
        })
      )
    )

    const response = await onRequestGet({
      env: environment,
      request: new Request(
        'https://www.hitechlabskauai.com/api/calendar-availability?serviceId=website-seo'
      )
    })

    expect(response.status).toBe(200)
    const body = await response.json()
    expect(body.availability[0].slots.at(-1).timeLabel).toBe('7:00 PM')
    expect(body.availability[1].slots.at(-1).timeLabel).toBe('4:00 PM')
    expect(body.availability[2].slots.at(-1).timeLabel).toBe('4:00 PM')
  })

  it('fails closed when weekly windows assign the same day twice', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify({
          ok: true,
          availabilitySchedule: {
            todayKey: '2026-07-24',
            daysForward: 3,
            weeklyWindows: [
              correctedWeeklyWindows[0],
              { weekdays: [5, 6], openMinute: 540, closeMinute: 1020 }
            ],
            slotStepMinutes: 30,
            durationMinutes: 30,
            earliestStartMs: Date.parse('2026-07-24T08:00:00-10:00'),
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

    expect(response.status).toBe(503)
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
