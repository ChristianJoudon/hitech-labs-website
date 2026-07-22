import { motion } from 'framer-motion'
import { CalendarDaysIcon } from '@heroicons/react/24/outline'
import BookingWidget from './BookingWidget'

/* Stable module-level config reference (never recreated across renders). */
const bookingConfig = {
  businessName: 'HiTech Labs',
  headerTitle: 'HiTech Labs',
  description:
    'Request a free consult and choose a time that works. We’ll confirm the appointment by email or text.',
  location: 'Princeville, Kauaʻi, HI',
  services: [
    {
      id: 'tech-check',
      name: 'Free 30-Min Tech Check',
      description:
        'A quick, no-pressure look at your tools, site, and workflows, plus one or two quick wins you can act on right away.',
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
      name: 'On-Site Tech Visit - Kauaʻi',
      description:
        'Hands-on help at your location on the North Shore for devices, networks, point-of-sale systems, and whatever is feeling stuck.',
      durationMinutes: 60,
      depositAmountCents: 0
    }
  ],
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
  // Availability and reservations pass through same-origin Cloudflare
  // functions. Google credentials remain server-side and never reach visitors.
  api: {
    headers: { Accept: 'application/json' },
    availabilityUrl: '/api/calendar-availability',
    bookingUrl: '/api/calendar-bookings'
  },
  termsTitle: 'HiTech Labs - What to expect',
  termsText: `Booking a consult with HiTech Labs

Thanks for booking a consult. Here’s what to expect and a couple of small things to keep in mind.

Your consult is a friendly, no-obligation conversation. We’ll look at what is feeling slow, messy, or overdue and suggest the cleanest next step. There is no hard sell.

We serve Princeville, Hanalei, Kīlauea, and the North Shore of Kauaʻi. On-site visits are for that area; other consults happen by phone or video.

Please give us a heads-up if you need to cancel or reschedule so we can offer the time to someone else. If something comes up on our end, we’ll reach out to find a new time that works.

We’ll use the email and phone number you provide only to confirm and prepare for your appointment.

The times shown are appointment requests, not guaranteed real-time availability. By continuing, you confirm the details above are correct and that you would like us to reach out to confirm your appointment.`,
  confirmationMessage:
    'Your appointment request is in. We’ll email or text to confirm the time. Mahalo!'
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
            Request a time
          </span>
          <h2 className="sub-title mt-5">Request your free consult</h2>
          <p className="body-copy mt-4">
            Choose a consult and request a convenient time. We’ll confirm the
            appointment by email or text.
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
