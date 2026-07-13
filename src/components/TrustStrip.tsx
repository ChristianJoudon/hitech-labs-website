import { motion } from 'framer-motion'

const points = [
  'Locally owned',
  'No lock-in contracts',
  'Clear, upfront pricing'
]

export default function TrustStrip() {
  return (
    <div className="trust-band relative z-10">
      <div className="container-shell">
        <motion.ul
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
          className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 py-5 text-center"
        >
          {points.map((point, index) => (
            <li key={point} className="flex items-center gap-8">
              <span className="trust-item">{point}</span>
              {index < points.length - 1 && (
                <span className="trust-dot hidden sm:block" />
              )}
            </li>
          ))}
        </motion.ul>
      </div>
    </div>
  )
}
