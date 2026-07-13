import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  GlobeAltIcon,
  Cog6ToothIcon,
  SparklesIcon,
  CalendarDaysIcon,
  MegaphoneIcon,
  WrenchScrewdriverIcon
} from '@heroicons/react/24/outline'
import type { ReactNode } from 'react'
import ServiceCard from './ServiceCard'
import ModalPricing from './ModalPricing'
import type { Service } from './types'

type ServiceWithIcon = Service & { icon: ReactNode }

const services: ServiceWithIcon[] = [
  {
    id: 'S-1',
    title: 'Website & SEO Tune-Up',
    tagline: 'Be found. Load instantly.',
    why: 'Visitors bail after a slow load and often never come back.',
    bullets: [
      'Mobile-first speed pass (Core Web Vitals)',
      'Keyword, meta & Google Business cleanup',
      'Analytics baseline + local citation pass'
    ],
    overview:
      'We modernize and streamline your site, polish your listings, and benchmark results so you climb search rankings and stay there.',
    price: 'Starter package $855-1.27 k • 1-2 weeks',
    icon: <GlobeAltIcon />
  },
  {
    id: 'S-2',
    title: 'Workflow Automation',
    tagline: 'Click less. Do more.',
    why: 'Small teams lose hours each week to copy-and-paste busywork.',
    bullets: [
      '3-5 Zapier / Make flows',
      'Google Workspace scripts & alerts',
      'ROI dashboard showing hours saved'
    ],
    overview:
      'We map your repetitive tasks, build no-code automations, and surface the payoff in plain language.',
    price: 'Starter package $680-1.02 k • 1 week',
    icon: <Cog6ToothIcon />
  },
  {
    id: 'S-3',
    title: 'AI & Smart Tools',
    tagline: 'Modern tools, less busywork.',
    why: 'AI can quietly handle the repetitive stuff, once it’s set up right for your business.',
    bullets: [
      'Website chat / FAQ assistant',
      'AI drafting for emails, posts & replies',
      'Smart automations & reminders'
    ],
    overview:
      'We add practical AI where it actually saves time. No hype, just a few well-chosen tools that handle the busywork so you don’t have to.',
    price: 'Starter package $650-1.1 k • 1 week',
    icon: <SparklesIcon />
  },
  {
    id: 'S-4',
    title: 'Online Booking Setup',
    tagline: 'Book anytime, anywhere.',
    why: 'Phone-tag costs tours and rentals dozens of bookings a month.',
    bullets: [
      'FareHarbor / Acuity configuration',
      'Calendar & payment sync (Stripe / Square)',
      'Auto reminders + review requests'
    ],
    overview:
      'Guests see real-time availability and pay in seconds; you wake up to confirmed reservations instead of missed calls.',
    price: 'Starter package $935-1.45 k • 1-2 weeks',
    icon: <CalendarDaysIcon />
  },
  {
    id: 'S-5',
    title: 'Digital Marketing',
    tagline: 'Turn visitors into regulars.',
    why: 'Most visitors never return unless you keep the conversation going.',
    bullets: [
      'Email list & branded template',
      '30-day social scheduler setup',
      'SMS specials & drip campaigns'
    ],
    overview:
      'From first follow to repeat booking, we automate friendly touchpoints that bring fans back season after season.',
    price: 'Starter package $680-1.02 k • 1 week',
    icon: <MegaphoneIcon />
  },
  {
    id: 'S-6',
    title: 'Tech Tune-Up',
    tagline: 'Modernize what you’ve got.',
    why: 'Most small businesses are one good cleanup away from running way smoother.',
    bullets: [
      'Audit of your tools, apps & subscriptions',
      'Cut duplicate or legacy software you’re overpaying for',
      'A plain-English roadmap to modernize'
    ],
    overview:
      'We map everything you’re running, trim what’s redundant, and hand you a clear plan, plus a few quick wins, to modernize without the overwhelm.',
    price: 'Health check $300 • roadmap from $600',
    icon: <WrenchScrewdriverIcon />
  }
]

export default function ServicesSection() {
  const [showPricing, setShowPricing] = useState(false)

  return (
    <>
      <section
        id="services"
        className="section-shell scroll-mt-28 py-24 md:py-32"
      >
        <div className="container-shell relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
            className="mx-auto max-w-2xl text-center"
          >
            <span className="eyebrow">What we do</span>
            <h2 className="sub-title mt-5">Core Services</h2>
            <p className="body-copy mt-4">
              Software, automation, and a little marketing to modernize your
              small business. Pick one, or let’s tune up the whole system
              together.
            </p>
          </motion.div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => (
              <ServiceCard key={service.id} service={service} index={index} />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
            className="panel-glass mx-auto mt-16 flex max-w-3xl flex-col items-center gap-6 px-8 py-10 text-center md:flex-row md:justify-between md:text-left"
          >
            <div>
              <span className="eyebrow">Pricing</span>
              <h3 className="sub-title mt-3 text-[2.1rem] md:text-[2.6rem]">
                Transparent pricing, no surprises
              </h3>
              <p className="mono-detail mt-3 text-[0.78rem] uppercase tracking-[0.16em] text-sage">
                Flat pre-tax packages · Hawaiʻi GET shown separately
              </p>
            </div>
            <button
              onClick={() => setShowPricing(true)}
              className="btn-pill-solid shrink-0"
            >
              View Pricing Table
            </button>
          </motion.div>
        </div>
      </section>

      <ModalPricing open={showPricing} onClose={() => setShowPricing(false)} />
    </>
  )
}
