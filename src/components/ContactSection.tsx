import { useForm, ValidationError } from '@formspree/react'
import { motion } from 'framer-motion'
import {
  CheckCircleIcon,
  EnvelopeIcon,
  MapPinIcon,
  PencilSquareIcon,
  UserIcon
} from '@heroicons/react/24/outline'

export default function ContactSection() {
  const [state, handleSubmit] = useForm('manjdpkp')

  if (state.succeeded) {
    return (
      <section
        id="contact"
        className="section-shell scroll-mt-28 py-24 md:py-32"
      >
        <div className="container-shell">
          <div className="panel-glass mx-auto max-w-2xl p-10 text-center">
            <CheckCircleIcon
              className="mx-auto size-12 text-terminal"
              aria-hidden="true"
            />
            <h2 className="sub-title mt-5">Mahalo</h2>
            <p className="body-copy mt-4">
              Your message is in. We will reply by email or phone as soon as we
              can.
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <motion.section
      id="contact"
      className="section-shell scroll-mt-28 py-24 md:py-32"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
    >
      <div className="container-shell">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">Let&apos;s talk</span>
          <h2 className="sub-title mt-5">Contact HiTech Labs</h2>
          <p className="body-copy mt-4">
            Tell us what is feeling messy, slow, or overdue. We will help you
            identify the cleanest next step.
          </p>
        </div>

        <div className="panel-glass relative mx-auto mt-10 max-w-2xl overflow-hidden p-7 md:p-10">
          <div className="relative">
            <p className="mb-7 text-center text-sm leading-6 text-body md:text-base">
              Prefer your phone?{' '}
              <a href="tel:+18086398697" className="text-link">
                Call 808-639-8697
              </a>{' '}
              or{' '}
              <a href="sms:+18086398697" className="text-link">
                send a text
              </a>
              .
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <input
                type="hidden"
                name="_subject"
                value="New website message from hitechlabskauai.com"
              />
              <input
                type="hidden"
                name="request_type"
                value="General website message"
              />

              <div className="form-honeypot" aria-hidden="true">
                <label htmlFor="contact-company-website">Company website</label>
                <input
                  id="contact-company-website"
                  type="text"
                  name="_gotcha"
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              <label className="form-field">
                <span className="form-label">Name</span>
                <span className="field-shell">
                  <UserIcon
                    className="size-5 shrink-0 text-clay"
                    aria-hidden="true"
                  />
                  <input
                    type="text"
                    name="name"
                    required
                    autoComplete="name"
                    className="w-full bg-transparent text-[0.98rem] text-inkdeep outline-none"
                  />
                </span>
              </label>
              <ValidationError
                prefix="Name"
                field="name"
                errors={state.errors}
              />

              <label className="form-field">
                <span className="form-label">Email</span>
                <span className="field-shell">
                  <EnvelopeIcon
                    className="size-5 shrink-0 text-clay"
                    aria-hidden="true"
                  />
                  <input
                    type="email"
                    name="email"
                    required
                    autoComplete="email"
                    className="w-full bg-transparent text-[0.98rem] text-inkdeep outline-none"
                  />
                </span>
              </label>
              <ValidationError
                prefix="Email"
                field="email"
                errors={state.errors}
              />

              <label className="form-field">
                <span className="form-label">How can we help?</span>
                <span className="field-shell items-start">
                  <PencilSquareIcon
                    className="mt-1 size-5 shrink-0 text-clay"
                    aria-hidden="true"
                  />
                  <textarea
                    name="message"
                    required
                    rows={5}
                    className="w-full resize-y bg-transparent text-[0.98rem] text-inkdeep outline-none"
                  />
                </span>
              </label>
              <ValidationError
                prefix="Message"
                field="message"
                errors={state.errors}
              />
              <ValidationError
                prefix="There was a problem sending your message"
                errors={state.errors}
              />

              <p className="text-sm leading-6 text-body">
                By submitting, you agree that HiTech Labs may use these details
                to respond to your request. Read our{' '}
                <a href="/privacy/" className="text-link">
                  privacy notice
                </a>
                .
              </p>

              <button
                type="submit"
                disabled={state.submitting}
                className="btn-pill-solid w-full disabled:cursor-wait disabled:opacity-60"
              >
                {state.submitting ? 'Sending message...' : 'Send message'}
              </button>
            </form>

            <div className="mt-7 flex items-center justify-center gap-2 text-sm text-inkdeep">
              <MapPinIcon className="size-4 text-clay" aria-hidden="true" />
              <a
                href="https://maps.google.com/?q=Princeville%2C+HI"
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-bordersoft underline-offset-4"
              >
                Serving Princeville, Hanalei, Kīlauea, and Kauaʻi North Shore
              </a>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  )
}
