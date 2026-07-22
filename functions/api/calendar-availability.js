import {
  calendarConfig,
  errorResponse,
  jsonResponse,
  readCalendarResponse
} from '../_shared/calendar-backend.js'

const SERVICE_DURATIONS = {
  'tech-check': 30,
  'website-seo': 45,
  'automation-ai': 45,
  'onsite-visit': 60
}

function timeLabel(minuteOfDay) {
  const hour24 = Math.floor(minuteOfDay / 60)
  const minute = minuteOfDay % 60
  const hour12 = hour24 % 12 || 12
  return `${hour12}:${String(minute).padStart(2, '0')} ${
    hour24 < 12 ? 'AM' : 'PM'
  }`
}

function hawaiiDate(date, minuteOfDay) {
  const hour = Math.floor(minuteOfDay / 60)
  const minute = minuteOfDay % 60
  return new Date(
    `${date}T${String(hour).padStart(2, '0')}:${String(minute).padStart(
      2,
      '0'
    )}:00-10:00`
  )
}

function validDateKey(date) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false
  return new Date(`${date}T00:00:00Z`).toISOString().slice(0, 10) === date
}

function dateKeyAtOffset(date, offset) {
  const [year, month, day] = date.split('-').map(Number)
  return new Date(Date.UTC(year, month - 1, day + offset))
    .toISOString()
    .slice(0, 10)
}

function dayOfWeek(date) {
  return new Date(`${date}T12:00:00Z`).getUTCDay()
}

function validBusyInterval(interval) {
  return (
    Array.isArray(interval) &&
    interval.length === 2 &&
    Number.isFinite(interval[0]) &&
    Number.isFinite(interval[1]) &&
    interval[1] > interval[0]
  )
}

function validWeeklyWindow(window) {
  return (
    window &&
    typeof window === 'object' &&
    Array.isArray(window.weekdays) &&
    window.weekdays.length > 0 &&
    new Set(window.weekdays).size === window.weekdays.length &&
    window.weekdays.every(
      (weekday) => Number.isInteger(weekday) && weekday >= 0 && weekday <= 6
    ) &&
    Number.isInteger(window.openMinute) &&
    window.openMinute >= 0 &&
    Number.isInteger(window.closeMinute) &&
    window.closeMinute <= 24 * 60 &&
    window.closeMinute > window.openMinute
  )
}

function windowsByWeekday(schedule) {
  const weeklyWindows =
    schedule.weeklyWindows === undefined
      ? [
          {
            weekdays: schedule.weekdays,
            openMinute: schedule.openMinute,
            closeMinute: schedule.closeMinute
          }
        ]
      : schedule.weeklyWindows

  if (
    !Array.isArray(weeklyWindows) ||
    weeklyWindows.length < 1 ||
    weeklyWindows.length > 7 ||
    !weeklyWindows.every(validWeeklyWindow)
  ) {
    return null
  }

  const result = new Map()
  for (const window of weeklyWindows) {
    for (const weekday of window.weekdays) {
      if (result.has(weekday)) return null
      result.set(weekday, {
        openMinute: window.openMinute,
        closeMinute: window.closeMinute
      })
    }
  }

  return result
}

export function expandAvailabilitySchedule(schedule, serviceId) {
  const expectedDuration = SERVICE_DURATIONS[serviceId]
  if (!schedule || typeof schedule !== 'object' || !expectedDuration) {
    throw new Error('The calendar backend returned an invalid schedule.')
  }

  const {
    todayKey,
    daysForward,
    slotStepMinutes,
    durationMinutes,
    earliestStartMs,
    busy
  } = schedule
  const scheduleWindows = windowsByWeekday(schedule)

  if (
    !validDateKey(todayKey) ||
    !Number.isInteger(daysForward) ||
    daysForward < 1 ||
    daysForward > 366 ||
    !scheduleWindows ||
    !Number.isInteger(slotStepMinutes) ||
    slotStepMinutes < 1 ||
    !Number.isInteger(durationMinutes) ||
    durationMinutes !== expectedDuration ||
    !Number.isFinite(earliestStartMs) ||
    ![...scheduleWindows.values()].every(
      (window) => window.closeMinute - window.openMinute >= durationMinutes
    ) ||
    !Array.isArray(busy) ||
    !busy.every(validBusyInterval)
  ) {
    throw new Error('The calendar backend returned an invalid schedule.')
  }

  const availability = []

  for (let offset = 0; offset < daysForward; offset += 1) {
    const date = dateKeyAtOffset(todayKey, offset)
    const window = scheduleWindows.get(dayOfWeek(date))
    if (!window) continue

    const slots = []
    for (
      let minuteOfDay = window.openMinute;
      minuteOfDay + durationMinutes <= window.closeMinute;
      minuteOfDay += slotStepMinutes
    ) {
      const startsAt = hawaiiDate(date, minuteOfDay)
      if (startsAt.getTime() < earliestStartMs) continue

      const endsAt = new Date(startsAt.getTime() + durationMinutes * 60 * 1000)
      const available = !busy.some(
        ([busyStart, busyEnd]) =>
          busyStart < endsAt.getTime() && busyEnd > startsAt.getTime()
      )

      slots.push({
        id: `${date}-${minuteOfDay}`,
        timeLabel: timeLabel(minuteOfDay),
        available,
        ...(available ? {} : { label: 'Booked' }),
        startsAt: startsAt.toISOString(),
        endsAt: endsAt.toISOString()
      })
    }

    if (slots.length) availability.push({ date, slots })
  }

  return availability
}

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
    backendUrl.searchParams.set('format', 'schedule')
    backendUrl.searchParams.set('secret', secret)

    const response = await fetch(backendUrl.toString(), {
      headers: { Accept: 'application/json' },
      redirect: 'follow'
    })
    const payload = await readCalendarResponse(response)

    const availability = payload.availabilitySchedule
      ? expandAvailabilitySchedule(payload.availabilitySchedule, serviceId)
      : payload.availability || []

    return jsonResponse({ availability })
  } catch (error) {
    return errorResponse(error)
  }
}
