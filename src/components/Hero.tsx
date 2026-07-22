import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform
} from 'framer-motion'

export default function Hero() {
  const reduce = useReducedMotion()
  const { scrollY } = useScroll()
  // Gentle downward drift of the fern as you scroll - disabled for reduced-motion
  const fernY = useTransform(scrollY, [0, 600], [0, reduce ? 0 : 90])

  return (
    <section id="home" className="section-shell scroll-mt-28">
      <motion.div
        style={{ y: fernY }}
        aria-hidden="true"
        className="pointer-events-none absolute -top-4 right-[-22rem] w-[52rem] max-w-none opacity-100 sm:-right-72 sm:w-[64rem] md:-top-8 md:right-0 md:w-[82rem] md:max-w-[72vw]"
      >
        <img
          src={`${
            import.meta.env.BASE_URL
          }assets/brand/palm-hero.png?v=20260721-restored`}
          alt=""
          width="1672"
          height="941"
          decoding="async"
          className="fern-float w-full opacity-100"
        />
      </motion.div>

      <div className="container-shell relative flex min-h-[86vh] items-center pb-16 pt-36 md:min-h-[82vh] md:py-28">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
          className="max-w-3xl"
        >
          <span className="eyebrow eyebrow-line">
            Princeville, Kauaʻi · On-island IT
          </span>

          <h1 className="display-title mt-6">
            Kauaʻi web design and small-business tech.
          </h1>

          <p className="mt-7 max-w-xl text-lg leading-8 text-body md:text-[1.32rem] md:leading-9">
            Modern websites, software, automation, and practical support so you
            can spend more time running your business.
          </p>

          <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <a
              href="#book"
              className="btn-pill-solid md:px-7 md:py-3.5 md:text-base"
            >
              Book Your Free 30-min Tech Check
            </a>
            <a href="#services" className="btn-ghost md:text-base">
              Explore services →
            </a>
          </div>

          <p className="mono-detail mt-8 text-[0.72rem] uppercase tracking-[0.18em] text-sage">
            Free 30-minute tech check · No pressure · No obligation
          </p>
        </motion.div>
      </div>
    </section>
  )
}
