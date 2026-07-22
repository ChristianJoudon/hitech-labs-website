var HITECH_TIME_ZONE = 'Pacific/Honolulu'
var HITECH_WEEKDAY_OPEN_MINUTE = 17 * 60
var HITECH_WEEKDAY_CLOSE_MINUTE = 20 * 60
var HITECH_WEEKEND_OPEN_MINUTE = 9 * 60
var HITECH_WEEKEND_CLOSE_MINUTE = 17 * 60
var HITECH_SLOT_STEP_MINUTES = 30
var HITECH_DAYS_FORWARD = 365
var HITECH_MINIMUM_LEAD_MINUTES = 120
var HITECH_WEEKLY_WINDOWS = [
  {
    weekdays: [1, 2, 3, 4, 5],
    openMinute: HITECH_WEEKDAY_OPEN_MINUTE,
    closeMinute: HITECH_WEEKDAY_CLOSE_MINUTE
  },
  {
    weekdays: [0, 6],
    openMinute: HITECH_WEEKEND_OPEN_MINUTE,
    closeMinute: HITECH_WEEKEND_CLOSE_MINUTE
  }
]

var HITECH_SERVICES = {
  'tech-check': {
    name: 'Free 30-Min Tech Check',
    durationMinutes: 30
  },
  'website-seo': {
    name: 'Website & SEO Consult',
    durationMinutes: 45
  },
  'automation-ai': {
    name: 'Automation & AI Consult',
    durationMinutes: 45
  },
  'onsite-visit': {
    name: 'On-Site Tech Visit - Kauai',
    durationMinutes: 60
  }
}

function doGet(event) {
  try {
    assertSecret_(event && event.parameter && event.parameter.secret)

    var action = (event.parameter.action || 'availability').toLowerCase()
    if (action === 'health') {
      return jsonOutput_({ ok: true, calendarConnected: true })
    }

    if (action !== 'availability') {
      throw publicError_('Unsupported calendar action.', 400)
    }

    var service = getService_(event.parameter.serviceId)
    if (event.parameter.format === 'schedule') {
      return jsonOutput_({
        ok: true,
        availabilitySchedule: buildAvailabilitySchedule_(service)
      })
    }

    return jsonOutput_({
      ok: true,
      availability: buildAvailability_(service)
    })
  } catch (error) {
    console.error(error)
    return errorOutput_(error)
  }
}

function doPost(event) {
  try {
    var payload = JSON.parse(
      event && event.postData && event.postData.contents
        ? event.postData.contents
        : '{}'
    )

    assertSecret_(payload.secret)
    if (payload.action !== 'booking') {
      throw publicError_('Unsupported calendar action.', 400)
    }

    var booking = createBooking_(payload)
    return jsonOutput_({ ok: true, booking: booking })
  } catch (error) {
    console.error(error)
    return errorOutput_(error)
  }
}

function buildAvailability_(service) {
  var calendar = CalendarApp.getDefaultCalendar()
  var availability = []
  var now = new Date()
  var earliestStart = new Date(
    now.getTime() + HITECH_MINIMUM_LEAD_MINUTES * 60 * 1000
  )
  var todayKey = Utilities.formatDate(now, HITECH_TIME_ZONE, 'yyyy-MM-dd')
  var todayNoon = parseHawaiiIso_(todayKey + 'T12:00:00')
  var rangeStart = parseHawaiiIso_(todayKey + 'T00:00:00')
  var rangeEndNoon = new Date(
    todayNoon.getTime() + HITECH_DAYS_FORWARD * 24 * 60 * 60 * 1000
  )
  var rangeEndKey = Utilities.formatDate(
    rangeEndNoon,
    HITECH_TIME_ZONE,
    'yyyy-MM-dd'
  )
  var rangeEnd = parseHawaiiIso_(rangeEndKey + 'T00:00:00')
  var events = calendar.getEvents(rangeStart, rangeEnd)

  for (var dayOffset = 0; dayOffset < HITECH_DAYS_FORWARD; dayOffset += 1) {
    var dayNoon = new Date(
      todayNoon.getTime() + dayOffset * 24 * 60 * 60 * 1000
    )
    var dateKey = Utilities.formatDate(dayNoon, HITECH_TIME_ZONE, 'yyyy-MM-dd')
    var availabilityWindow = availabilityWindowForDate_(dateKey)

    var slots = []

    for (
      var minute = availabilityWindow.openMinute;
      minute + service.durationMinutes <= availabilityWindow.closeMinute;
      minute += HITECH_SLOT_STEP_MINUTES
    ) {
      var start = parseHawaiiMinute_(dateKey, minute)
      if (start.getTime() < earliestStart.getTime()) continue

      var end = new Date(start.getTime() + service.durationMinutes * 60 * 1000)
      var available = !events.some(function (calendarEvent) {
        return eventsOverlap_(start, end, calendarEvent)
      })

      slots.push({
        id: dateKey + '-' + minute,
        timeLabel: formatTimeLabel_(minute),
        available: available,
        label: available ? undefined : 'Booked',
        startsAt: start.toISOString(),
        endsAt: end.toISOString()
      })
    }

    if (slots.length) {
      availability.push({ date: dateKey, slots: slots })
    }
  }

  return availability
}

function buildAvailabilitySchedule_(service) {
  var calendar = CalendarApp.getDefaultCalendar()
  var now = new Date()
  var todayKey = Utilities.formatDate(now, HITECH_TIME_ZONE, 'yyyy-MM-dd')
  var todayNoon = parseHawaiiIso_(todayKey + 'T12:00:00')
  var rangeStart = parseHawaiiIso_(todayKey + 'T00:00:00')
  var rangeEndNoon = new Date(
    todayNoon.getTime() + HITECH_DAYS_FORWARD * 24 * 60 * 60 * 1000
  )
  var rangeEndKey = Utilities.formatDate(
    rangeEndNoon,
    HITECH_TIME_ZONE,
    'yyyy-MM-dd'
  )
  var rangeEnd = parseHawaiiIso_(rangeEndKey + 'T00:00:00')
  var events = calendar.getEvents(rangeStart, rangeEnd)

  return {
    todayKey: todayKey,
    daysForward: HITECH_DAYS_FORWARD,
    weeklyWindows: HITECH_WEEKLY_WINDOWS,
    slotStepMinutes: HITECH_SLOT_STEP_MINUTES,
    durationMinutes: service.durationMinutes,
    earliestStartMs: now.getTime() + HITECH_MINIMUM_LEAD_MINUTES * 60 * 1000,
    busy: events.map(function (calendarEvent) {
      return [
        calendarEvent.getStartTime().getTime(),
        calendarEvent.getEndTime().getTime()
      ]
    })
  }
}

function createBooking_(payload) {
  var service = getService_(payload.serviceId)
  var customer = normalizeCustomer_(payload.customer)
  var start = parseBookingStart_(payload.date, payload.timeLabel)
  var end = new Date(start.getTime() + service.durationMinutes * 60 * 1000)

  validateBookingWindow_(start, end)

  var lock = LockService.getScriptLock()
  lock.waitLock(10000)

  try {
    enforceRateLimit_(payload.clientIp || 'unknown')

    var calendar = CalendarApp.getDefaultCalendar()
    var conflicts = calendar.getEvents(start, end)
    var existing = findMatchingBooking_(conflicts, customer.email, service.name)

    if (existing) {
      return bookingResponse_(existing)
    }

    if (conflicts.length) {
      throw publicError_(
        'That time was just booked. Please return to the calendar and choose another opening.',
        409
      )
    }

    var title = 'HiTech Labs: ' + service.name + ' with ' + customer.name
    var description = [
      'Website booking from hitechlabskauai.com',
      '',
      'Customer: ' + customer.name,
      'Booking email: ' + customer.email,
      'Phone: ' + (customer.phone || 'Not provided'),
      'Business: ' + (customer.business || 'Not provided'),
      '',
      'Notes:',
      customer.notes || 'None provided'
    ].join('\n')

    var calendarEvent = calendar.createEvent(title, start, end, {
      description: description,
      location: 'Princeville, Kauai, HI',
      guests: customer.email,
      sendInvites: true
    })

    return bookingResponse_(calendarEvent)
  } finally {
    lock.releaseLock()
  }
}

function bookingResponse_(calendarEvent) {
  return {
    bookingId: calendarEvent.getId(),
    confirmationMessage:
      'Your appointment is confirmed and a Google Calendar invitation is on its way. Mahalo!'
  }
}

function findMatchingBooking_(events, email, serviceName) {
  var emailMarker = 'Booking email: ' + email
  for (var index = 0; index < events.length; index += 1) {
    var event = events[index]
    if (
      event.getTitle().indexOf(serviceName) !== -1 &&
      event.getDescription().indexOf(emailMarker) !== -1
    ) {
      return event
    }
  }
  return null
}

function normalizeCustomer_(customer) {
  customer = customer || {}
  var name = cleanText_(customer.name, 120)
  var email = cleanText_(customer.email, 200).toLowerCase()

  if (!name) throw publicError_('Please enter your name.', 400)
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw publicError_('Please enter a valid email address.', 400)
  }

  return {
    name: name,
    email: email,
    phone: cleanText_(customer.phone, 60),
    business: cleanText_(customer.business, 160),
    notes: cleanText_(customer.notes, 2000)
  }
}

function cleanText_(value, maximumLength) {
  return String(value || '')
    .replace(/[\u0000-\u001F\u007F]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maximumLength)
}

function validateBookingWindow_(start, end) {
  var now = new Date()
  var earliest = new Date(
    now.getTime() + HITECH_MINIMUM_LEAD_MINUTES * 60 * 1000
  )
  var todayKey = Utilities.formatDate(now, HITECH_TIME_ZONE, 'yyyy-MM-dd')
  var bookingWindowEndNoon = new Date(
    parseHawaiiIso_(todayKey + 'T12:00:00').getTime() +
      HITECH_DAYS_FORWARD * 24 * 60 * 60 * 1000
  )
  var bookingWindowEndKey = Utilities.formatDate(
    bookingWindowEndNoon,
    HITECH_TIME_ZONE,
    'yyyy-MM-dd'
  )
  var bookingWindowEnd = parseHawaiiIso_(bookingWindowEndKey + 'T00:00:00')
  var dateKey = Utilities.formatDate(start, HITECH_TIME_ZONE, 'yyyy-MM-dd')
  var endDateKey = Utilities.formatDate(end, HITECH_TIME_ZONE, 'yyyy-MM-dd')
  var startMinute =
    Number(Utilities.formatDate(start, HITECH_TIME_ZONE, 'H')) * 60 +
    Number(Utilities.formatDate(start, HITECH_TIME_ZONE, 'm'))
  var endMinute =
    Number(Utilities.formatDate(end, HITECH_TIME_ZONE, 'H')) * 60 +
    Number(Utilities.formatDate(end, HITECH_TIME_ZONE, 'm'))
  var availabilityWindow = availabilityWindowForDate_(dateKey)

  if (
    start.getTime() < earliest.getTime() ||
    start.getTime() >= bookingWindowEnd.getTime() ||
    end.getTime() <= start.getTime() ||
    endDateKey !== dateKey ||
    startMinute < availabilityWindow.openMinute ||
    endMinute > availabilityWindow.closeMinute ||
    (startMinute - availabilityWindow.openMinute) % HITECH_SLOT_STEP_MINUTES !==
      0
  ) {
    throw publicError_(
      'That appointment time is outside the booking window.',
      400
    )
  }
}

function enforceRateLimit_(clientIp) {
  var secret = getSecret_()
  var digest = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    secret + '|' + String(clientIp)
  )
  var key =
    'rate-' +
    Utilities.base64EncodeWebSafe(digest).replace(/=+$/, '').slice(0, 36)
  var cache = CacheService.getScriptCache()
  var count = Number(cache.get(key) || '0')

  if (count >= 3) {
    throw publicError_(
      'Too many booking attempts were received. Please wait an hour or call 808-639-8697.',
      429
    )
  }

  cache.put(key, String(count + 1), 60 * 60)
}

function getService_(serviceId) {
  var service = HITECH_SERVICES[String(serviceId || '')]
  if (!service)
    throw publicError_('Please choose a valid appointment type.', 400)
  return service
}

function parseBookingStart_(dateKey, timeLabel) {
  dateKey = String(dateKey || '')
  var match = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec(
    String(timeLabel || '').trim()
  )
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateKey) || !match) {
    throw publicError_('The appointment time could not be read.', 400)
  }

  var hour12 = Number(match[1])
  var minute = Number(match[2])
  if (hour12 < 1 || hour12 > 12 || minute < 0 || minute > 59) {
    throw publicError_('The appointment time could not be read.', 400)
  }

  var hour = hour12 % 12
  if (match[3].toUpperCase() === 'PM') hour += 12
  var start = parseHawaiiMinute_(dateKey, hour * 60 + minute)
  if (
    isNaN(start.getTime()) ||
    Utilities.formatDate(start, HITECH_TIME_ZONE, 'yyyy-MM-dd') !== dateKey
  ) {
    throw publicError_('The appointment time could not be read.', 400)
  }

  return start
}

function parseHawaiiMinute_(dateKey, minuteOfDay) {
  var hour = Math.floor(minuteOfDay / 60)
  var minute = minuteOfDay % 60
  return parseHawaiiIso_(
    dateKey +
      'T' +
      String(hour).padStart(2, '0') +
      ':' +
      String(minute).padStart(2, '0') +
      ':00'
  )
}

function parseHawaiiIso_(localIso) {
  return new Date(localIso + '-10:00')
}

function hawaiiDayOfWeek_(dateKey) {
  return parseHawaiiIso_(dateKey + 'T12:00:00').getUTCDay()
}

function availabilityWindowForDate_(dateKey) {
  var dayOfWeek = hawaiiDayOfWeek_(dateKey)

  for (var index = 0; index < HITECH_WEEKLY_WINDOWS.length; index += 1) {
    if (HITECH_WEEKLY_WINDOWS[index].weekdays.indexOf(dayOfWeek) !== -1) {
      return HITECH_WEEKLY_WINDOWS[index]
    }
  }

  throw new Error('No availability window is configured for this day.')
}

function eventsOverlap_(start, end, calendarEvent) {
  return (
    calendarEvent.getStartTime().getTime() < end.getTime() &&
    calendarEvent.getEndTime().getTime() > start.getTime()
  )
}

function formatTimeLabel_(minuteOfDay) {
  var hour24 = Math.floor(minuteOfDay / 60)
  var minute = minuteOfDay % 60
  var hour12 = hour24 % 12 || 12
  return (
    hour12 +
    ':' +
    String(minute).padStart(2, '0') +
    ' ' +
    (hour24 < 12 ? 'AM' : 'PM')
  )
}

function findMatchingSecret_(candidate) {
  return candidate && String(candidate) === getSecret_()
}

function assertSecret_(candidate) {
  if (!findMatchingSecret_(candidate)) {
    throw publicError_('Calendar backend authorization failed.', 403)
  }
}

function getSecret_() {
  var secret =
    PropertiesService.getScriptProperties().getProperty('BOOKING_SECRET')
  if (!secret) throw new Error('BOOKING_SECRET is not configured.')
  return secret
}

function publicError_(message, status) {
  var error = new Error(message)
  error.publicStatus = status
  return error
}

function errorOutput_(error) {
  return jsonOutput_({
    ok: false,
    status: error && error.publicStatus ? error.publicStatus : 500,
    error:
      error && error.publicStatus
        ? error.message
        : 'The calendar service is temporarily unavailable.'
  })
}

function jsonOutput_(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON
  )
}
