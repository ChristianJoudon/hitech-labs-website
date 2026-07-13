import { useState } from 'react'
import { motion } from 'framer-motion'
import type { Service } from './types'
import ModalService from './ModalService'

export default function ServiceCard({
  service,
  index = 0
}: {
  service: Service
  index?: number
}) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <motion.button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{
          duration: 0.6,
          ease: [0.19, 1, 0.22, 1],
          delay: (index % 3) * 0.08
        }}
        className="service-card group"
      >
        {service.icon && (
          <div className="service-card-icon">{service.icon}</div>
        )}

        <h3 className="service-card-title">{service.title}</h3>
        <p className="service-card-copy">{service.tagline}</p>

        <span className="service-card-more">
          view details
          <span className="cursor" aria-hidden="true">
            _
          </span>
        </span>
      </motion.button>

      <ModalService
        service={service}
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  )
}
