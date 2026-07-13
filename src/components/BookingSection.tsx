import { motion } from 'framer-motion'
import { CalendarDaysIcon } from '@heroicons/react/24/outline'
import BookingWidget from './BookingWidget'

/* ------------------------------------------------------------------ *
 * Availability — generated client-side so the widget works on a fully
 * static host (GitHub Pages). Mon–Sat, 9:00 AM–4:30 PM, 30-min slots,
 * for the next four weeks, skipping times already past today.
 * When the Chime API/DB backend is deployed, drop `availability` and set
 * `api.availabilityUrl` instead — the widget will pull live openings.
 * ------------------------------------------------------------------ */
function dateKey(d: Date) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function buildAvailability() {
  const days: Array<{ date: string; slots: Array<Record<string, unknown>> }> =
    []
  const now = new Date()
  const start = new Date(now)
  start.setHours(0, 0, 0, 0)

  for (let i = 0; i < 28; i += 1) {
    const date = new Date(start)
    date.setDate(start.getDate() + i)
    if (date.getDay() === 0) continue // closed Sundays

    const slots: Array<Record<string, unknown>> = []
    for (let h = 9; h < 17; h += 1) {
      for (const m of [0, 30]) {
        const s = new Date(date)
        s.setHours(h, m, 0, 0)
        if (s.getTime() <= now.getTime()) continue // no past times today

        const e = new Date(date)
        e.setHours(h, m + 30, 0, 0)
        const hour12 = h % 12 === 0 ? 12 : h % 12
        const suffix = h < 12 ? 'AM' : 'PM'
        slots.push({
          id: `${dateKey(date)}-${h}${m === 0 ? '00' : '30'}`,
          timeLabel: `${hour12}:${m === 0 ? '00' : '30'} ${suffix}`,
          available: true,
          startsAt: s.toISOString(),
          endsAt: e.toISOString()
        })
      }
    }
    if (slots.length) days.push({ date: dateKey(date), slots })
  }
  return days
}

/* Stable module-level config reference (never recreated across renders). */
const bookingConfig = {
  businessName: 'HiTech Labs',
  headerTitle: 'HiTech Labs',
  description:
    'Pick a free consult, choose a time that works, and we’ll bring clear, local tech help to your small business.',
  location: 'Princeville, Kauaʻi, HI',
  services: [
    {
      id: 'tech-check',
      name: 'Free 30-Min Tech Check',
      description:
        'A quick, no-pressure look at your tools, site, and workflows — plus one or two quick wins you can act on right away.',
      durationMinutes: 30,
      depositAmountCents: 0
    },
    {
      id: 'website-seo',
      name: 'Website & SEO Consult',
      description:
        'Talk through your site’s speed, search visibility, and Google listing, and where a tune-up would move the needle most.',
      durationMinutes: 45,
      depositAmountCents: 0
    },
    {
      id: 'automation-ai',
      name: 'Automation & AI Consult',
      description:
        'Find the copy-and-paste busywork worth automating and the few AI tools that would actually save your team time.',
      durationMinutes: 45,
      depositAmountCents: 0
    },
    {
      id: 'onsite-visit',
      name: 'On-Site Tech Visit — Kauaʻi',
      description:
        'Hands-on help at your location on the North Shore — devices, networks, point-of-sale, and whatever’s feeling stuck.',
      durationMinutes: 60,
      depositAmountCents: 0
    }
  ],
  availability: buildAvailability(),
  // Free consults: no deposit, so the flow skips the payment step cleanly.
  // To take deposits later, give a service a depositAmountCents > 0 and set
  // payment.stripePublishableKey + api.paymentIntentUrl (see the chime server).
  payment: { enabled: false, required: false, currency: 'USD' },
  customerFields: [
    {
      key: 'name',
      label: 'Full name',
      placeholder: 'Jane Kealoha',
      required: true,
      type: 'text'
    },
    {
      key: 'business',
      label: 'Business name',
      placeholder: 'Your business (optional)',
      required: false,
      type: 'text'
    },
    {
      key: 'email',
      label: 'Email',
      placeholder: 'you@business.com',
      required: true,
      type: 'email'
    },
    {
      key: 'phone',
      label: 'Phone / text',
      placeholder: '(808) 555-0142',
      required: false,
      type: 'tel'
    },
    {
      key: 'notes',
      label: 'What would you like help with?',
      placeholder: 'Tell us what’s feeling slow, messy, or overdue…',
      required: false,
      type: 'textarea'
    }
  ],
  // Bookings post to the same Formspree inbox the contact form already uses,
  // so they arrive in the HiTech Labs inbox with no backend required.
  api: {
    headers: { Accept: 'application/json' },
    bookingUrl: 'https://formspree.io/f/manjdpkp'
  },
  termsTitle: 'HiTech Labs — What to expect',
  termsText: `Booking a consult with HiTech Labs

Thanks for booking a consult. Here’s what to expect and a couple of small things to keep in mind.

Your consult is a friendly, no-obligation conversation. We’ll look at what’s feeling slow, messy, or overdue and suggest the cleanest next step — no hard sell.

We serve Princeville, Hanalei, Kīlauea, and the North Shore of Kauaʻi. On-site visits are for that area; other consults happen by phone or video.

Please give us a heads-up if you need to cancel or reschedule so we can offer the time to someone else. If something comes up on our end, we’ll reach out to find a new time that works.

We’ll use the email and phone number you provide only to confirm and prepare for your appointment.

By continuing, you confirm the details above are correct and that you’d like us to reach out to confirm your appointment.`,
  confirmationMessage:
    'You’re on the calendar! We’ll email a confirmation and reach out to lock in the details. Mahalo — talk soon.'
}

export default function BookingSection() {
  return (
    <section id="book" className="section-shell scroll-mt-28 py-24 md:py-32">
      <div className="container-shell">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="eyebrow inline-flex items-center gap-2">
            <CalendarDaysIcon className="size-4 text-clay" aria-hidden="true" />
            Book a time
          </span>
          <h2 className="sub-title mt-5">Book your free consult</h2>
          <p className="body-copy mt-4">
            Real-time availability, right here. Choose a consult, pick a time,
            and add it straight to your calendar — no phone tag required.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
          className="panel-glass mx-auto mt-12 max-w-5xl overflow-hidden p-3 sm:p-4 md:p-6"
        >
          <BookingWidget config={bookingConfig} />
        </motion.div>
      </div>
    </section>
  )
}
