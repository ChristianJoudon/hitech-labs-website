import { useForm, ValidationError } from '@formspree/react'
import { motion } from 'framer-motion'
import {
  UserIcon,
  EnvelopeIcon,
  PencilSquareIcon,
  MapPinIcon
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
            <h2 className="font-heading text-[2.9rem] leading-none tracking-[-0.04em] text-inkdeep">
              Mahalo
            </h2>
            <p className="mt-4 text-lg text-body">
              Your note is in. We’ll get back to you shortly.
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
          <span className="eyebrow">Let’s talk</span>
          <h2 className="sub-title mt-5">Contact</h2>
          <p className="body-copy mt-4">
            Tell me what is feeling messy, slow, or overdue. We’ll figure out
            the cleanest next step.
          </p>
        </div>

        <div className="panel-glass relative mx-auto mt-10 max-w-2xl overflow-hidden p-7 md:p-10">
          <div className="relative">
            <p className="mb-7 text-center text-base text-body md:text-lg">
              Text us now →
              <a
                href="tel:+18086398697"
                className="mono-detail ml-2 font-medium text-inkdeep underline decoration-clay/50 underline-offset-4"
              >
                808-639-8697
              </a>
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
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

              <motion.div whileHover={{ y: -2 }} className="field-shell">
                <UserIcon
                  className="size-5 shrink-0 text-clay"
                  aria-hidden="true"
                />
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  aria-label="Your name"
                  required
                  className="w-full bg-transparent text-[0.98rem] text-inkdeep outline-none placeholder:text-sage"
                />
              </motion.div>
              <ValidationError
                prefix="Name"
                field="name"
                errors={state.errors}
              />

              <motion.div whileHover={{ y: -2 }} className="field-shell">
                <EnvelopeIcon
                  className="size-5 shrink-0 text-clay"
                  aria-hidden="true"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  aria-label="Your email"
                  required
                  className="w-full bg-transparent text-[0.98rem] text-inkdeep outline-none placeholder:text-sage"
                />
              </motion.div>
              <ValidationError
                prefix="Email"
                field="email"
                errors={state.errors}
              />

              <motion.div
                whileHover={{ y: -2 }}
                className="field-shell items-start"
              >
                <PencilSquareIcon
                  className="mt-1 size-5 shrink-0 text-clay"
                  aria-hidden="true"
                />
                <textarea
                  name="message"
                  placeholder="How can I help?"
                  aria-label="How can I help?"
                  required
                  rows={5}
                  className="w-full resize-none bg-transparent text-[0.98rem] text-inkdeep outline-none placeholder:text-sage"
                />
              </motion.div>
              <ValidationError
                prefix="Message"
                field="message"
                errors={state.errors}
              />

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={state.submitting}
                  className="btn-pill-solid w-full disabled:opacity-60"
                >
                  {state.submitting ? 'Sending…' : 'Send'}
                </button>
              </div>
            </form>

            <div className="mt-7 flex items-center justify-center gap-2 text-sm text-inkdeep">
              <MapPinIcon className="size-4 text-clay" />
              <a
                href="https://maps.google.com/?q=Princeville%2C+HI"
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-bordersoft underline-offset-4"
              >
                Serving Princeville • Hanalei • Kilauea
              </a>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  )
}
