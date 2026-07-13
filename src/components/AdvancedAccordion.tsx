import { Disclosure } from '@headlessui/react'
import { motion, AnimatePresence } from 'framer-motion'
import type { ReactNode } from 'react'
import {
  ChartBarIcon,
  CpuChipIcon,
  SquaresPlusIcon,
  ArrowsRightLeftIcon,
  PuzzlePieceIcon
} from '@heroicons/react/24/outline'

type Solution = {
  title: string
  why: string
  bullets: string[]
  overview: string
  tech: string
  price: string
  icon: ReactNode
}

const solutions: Solution[] = [
  {
    title: 'Data & Analytics',
    why: 'Owners fly blind without live KPIs.',
    bullets: [
      'Cloud warehouse seeded with 12 mo. of data',
      '3 interactive Looker / Power BI dashboards',
      'Monthly forecast worksheet'
    ],
    overview:
      'We centralize sales, bookings, and marketing data, then surface trends you can act on before high season hits.',
    tech: 'BigQuery, dbt, Looker Studio',
    price: 'Starter $2.4k-3.2k • 3-4 weeks',
    icon: <ChartBarIcon />
  },
  {
    title: 'AI-Driven Insights',
    why: 'Seasonality makes staffing and ordering unpredictable.',
    bullets: [
      'Demand-forecast model',
      'ChatGPT FAQ bot for guests',
      'Auto stock-reorder alerts'
    ],
    overview:
      'We apply AI where it actually helps: lighter models, clear outputs, and dashboards your team will really use.',
    tech: 'OpenAI API, Vertex AI, TensorFlow Lite',
    price: 'Pilot $3k-4.5k • 4-6 weeks',
    icon: <CpuChipIcon />
  },
  {
    title: 'CRM / ERP Guidance',
    why: 'Spreadsheets hide revenue leaks and dropped leads.',
    bullets: [
      'HubSpot pipeline & email sequences',
      'Odoo Cloud inventory + billing',
      'Clean data migration & staff training'
    ],
    overview:
      'We prototype in a sandbox, then roll out in phases so adoption sticks and downtime stays near zero.',
    tech: 'HubSpot, Odoo Cloud, Zapier',
    price: 'Starter $2k-3k • 3 weeks',
    icon: <SquaresPlusIcon />
  },
  {
    title: 'Custom Integrations',
    why: 'Double-entering data steals hours every week.',
    bullets: [
      'REST / GraphQL API bridges',
      'Webhook notifications to Slack & SMS',
      'Error monitoring with daily digest'
    ],
    overview:
      'Typical jobs connect POS to accounting or booking to CRM, with careful rollbacks and safeguards built in.',
    tech: 'Node.js, Supabase Edge, Make',
    price: 'Starter $1.6k-2.5k • 2-3 weeks',
    icon: <ArrowsRightLeftIcon />
  },
  {
    title: 'Low-Code Apps',
    why: 'Niche workflows rarely fit off-the-shelf tools.',
    bullets: [
      'Internal portal in Bubble',
      'Barcode inventory tool in Retool',
      'Supabase auth & audit log'
    ],
    overview:
      'From first whiteboard to clickable MVP in days, then refine the workflow with your team in real time.',
    tech: 'Bubble, Retool, Supabase',
    price: 'Starter $2.2k-3k • 3-4 weeks',
    icon: <PuzzlePieceIcon />
  }
]

export default function AdvancedAccordion() {
  return (
    <motion.section
      id="advanced"
      className="section-shell scroll-mt-28 py-24 md:py-32"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
    >
      <div className="container-shell">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">Going further</span>
          <h2 className="sub-title mt-5">Advanced Solutions</h2>
          <p className="body-copy mt-4">
            Higher-leverage systems for businesses that need cleaner data,
            smarter forecasting, and fewer manual workarounds.
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-4xl space-y-4">
          {solutions.map((solution) => (
            <Disclosure key={solution.title}>
              {({ open }) => (
                <div
                  className={`panel-glass overflow-hidden ${
                    open ? '' : 'panel-hover'
                  }`}
                >
                  <Disclosure.Button className="flex w-full items-center justify-between gap-4 p-5 text-left md:px-7">
                    <div className="flex items-center gap-4">
                      <div className="bg-clay/12 flex size-11 shrink-0 items-center justify-center rounded-full text-clay">
                        {solution.icon}
                      </div>
                      <div>
                        <h3 className="accordion-title text-[1.6rem] md:text-[1.9rem]">
                          {solution.title}
                        </h3>
                        <p className="mt-1 text-sm text-body md:text-base">
                          {solution.why}
                        </p>
                      </div>
                    </div>

                    <motion.span
                      animate={{ rotate: open ? 45 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-[2rem] leading-none text-clay"
                    >
                      +
                    </motion.span>
                  </Disclosure.Button>

                  <AnimatePresence initial={false}>
                    {open && (
                      <Disclosure.Panel static>
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden"
                        >
                          <div className="grid gap-6 border-t border-bordersoft/80 px-5 py-6 md:grid-cols-[1.15fr,0.85fr] md:px-7">
                            <div>
                              <ul className="space-y-3 text-[0.98rem] leading-7 text-body">
                                {solution.bullets.map((bullet) => (
                                  <li
                                    key={bullet}
                                    className="flex items-start gap-3"
                                  >
                                    <span className="mt-2 inline-block size-1.5 rounded-full bg-clay" />
                                    <span>{bullet}</span>
                                  </li>
                                ))}
                              </ul>
                              <p className="mt-5 text-[0.98rem] leading-7 text-body">
                                {solution.overview}
                              </p>
                            </div>

                            <div className="rounded-[22px] border border-bordersoft/90 bg-paper/70 p-5 shadow-card">
                              <p className="eyebrow">Tech We Use</p>
                              <p className="mt-2 text-sm leading-7 text-body md:text-base">
                                {solution.tech}
                              </p>

                              <div className="bg-clay/12 mt-5 inline-flex rounded-full px-4 py-2 text-sm font-medium text-inkdeep">
                                {solution.price}
                              </div>

                              <div className="mt-5">
                                <a href="#contact" className="btn-pill">
                                  Book discovery call
                                </a>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      </Disclosure.Panel>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </Disclosure>
          ))}
        </div>
      </div>
    </motion.section>
  )
}
