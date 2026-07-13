export default function Footer() {
  return (
    <footer className="section-shell border-t border-bordersoft bg-paper py-14">
      <img
        src="/assets/brand/palm-frond.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 hidden w-[44rem] max-w-[42vw] opacity-90 md:block"
      />
      <img
        src="/assets/brand/palm-frond.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-0 hidden w-[44rem] max-w-[42vw] -scale-x-100 opacity-90 md:block"
      />

      <div className="container-shell relative">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <a href="#home" className="inline-flex flex-col leading-none">
              <span className="font-wordmark text-[1.55rem] leading-none tracking-[-0.02em] text-inkdeep">
                HiTech Labs
              </span>
              <span className="mono-detail mt-2 text-[0.66rem] uppercase tracking-[0.26em] text-sage">
                Small Business Systems &amp; Support
              </span>
            </a>
          </div>

          <div className="mono-detail text-sm leading-7 text-body md:text-right">
            <div>
              <a
                href="tel:808-639-8697"
                className="underline decoration-clay/40 underline-offset-4 transition hover:text-inkdeep"
              >
                808-639-8697
              </a>
            </div>
            <div>
              <a
                href="mailto:info@hitechlabs.com"
                className="underline decoration-clay/40 underline-offset-4 transition hover:text-inkdeep"
              >
                info@hitechlabs.com
              </a>
            </div>
            <div>Princeville, Kauaʻi</div>
          </div>
        </div>

        <div className="section-divider mt-10" />
        <div className="mt-5 text-xs text-body">
          <p>© 2025 HiTech Labs · Calm systems for busy businesses.</p>
        </div>
      </div>
    </footer>
  )
}
