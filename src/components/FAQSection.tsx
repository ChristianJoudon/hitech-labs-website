import { Disclosure } from '@headlessui/react'
import { motion, AnimatePresence } from 'framer-motion'
import type { ReactNode } from 'react'
import {
  WifiIcon,
  GlobeAltIcon,
  ShoppingCartIcon,
  CalendarDaysIcon,
  SparklesIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline'

type FAQ = {
  q: string
  a: string
  icon: ReactNode
}

const faqs: FAQ[] = [
  {
    q: 'Can you help if our Wi-Fi keeps dropping?',
    a: 'Yes. We troubleshoot weak access points, poor mesh placement, Starlink issues, firewall settings, and backup routines so your staff and guests stay reliably connected.',
    icon: <WifiIcon />
  },
  {
    q: 'Do I really need a website tune-up if my site already exists?',
    a: 'Usually, yes. A tune-up improves speed, mobile usability, metadata, and local SEO so more visitors actually find you and fewer leave before the page finishes loading.',
    icon: <GlobeAltIcon />
  },
  {
    q: 'Can you set up inventory or POS for my shop?',
    a: 'Absolutely. We install and configure Square or Shopify, connect accounting, import SKUs, and set up margin or low-stock alerts so you can see what is selling in real time.',
    icon: <ShoppingCartIcon />
  },
  {
    q: 'How do online booking tools help my business?',
    a: 'They replace phone-tag with live availability, automatic reminders, and clean payment flows, which means fewer missed reservations and less time chasing confirmations.',
    icon: <CalendarDaysIcon />
  },
  {
    q: 'Is email, text, social — worth it for a small business?',
    a: 'Yes. We set up the tools once, then automate friendly touchpoints that keep locals and visitors coming back season after season.',
    icon: <SparklesIcon />
  },
  {
    q: 'What is workflow automation and how can it save time?',
    a: 'Zapier flows, Google Apps Scripts, or custom automations move data, send invoices, and trigger alerts automatically so your team can stop copying, pasting, and double-entering.',
    icon: <Cog6ToothIcon />
  }
]

export default function FAQSection() {
  return (
    <motion.section
      id="faq"
      className="section-shell scroll-mt-28 py-24 md:py-32"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
    >
      <div className="container-shell">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow eyebrow-line">Good to know</span>
          <h2 className="sub-title mt-5">Frequently Asked Questions</h2>
          <p className="body-copy mt-4">
            A few quick answers to the most common questions small-business
            owners ask before reaching out.
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-4xl space-y-4">
          {faqs.map((item) => (
            <Disclosure key={item.q}>
              {({ open }) => (
                <div
                  className={`panel-glass overflow-hidden ${
                    open ? '' : 'panel-hover'
                  }`}
                >
                  <Disclosure.Button className="flex w-full items-center justify-between gap-4 p-5 text-left md:px-7">
                    <div className="flex items-start gap-4">
                      <div className="bg-clay/12 mt-1 flex size-10 shrink-0 items-center justify-center rounded-full text-clay">
                        {item.icon}
                      </div>
                      <h3 className="faq-title text-[1.5rem] leading-[1.05] md:text-[1.9rem]">
                        {item.q}
                      </h3>
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
                          <div className="border-t border-bordersoft/80 px-5 py-6 md:px-7">
                            <p className="max-w-3xl text-[0.98rem] leading-7 text-body">
                              {item.a}
                            </p>
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

        <div className="mt-10 text-center">
          <a href="#contact" className="btn-pill">
            Schedule a Free Consult
          </a>
        </div>
      </div>
    </motion.section>
  )
}
