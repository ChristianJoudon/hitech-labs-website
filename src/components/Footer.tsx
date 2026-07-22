export default function Footer() {
  return (
    <footer className="section-shell border-t border-bordersoft bg-paper py-14">
      <img
        src={`${import.meta.env.BASE_URL}assets/brand/palm-frond.png`}
        alt=""
        aria-hidden="true"
        width="728"
        height="182"
        loading="lazy"
        decoding="async"
        className="pointer-events-none absolute left-0 top-0 w-[36rem] max-w-[66vw] opacity-70 md:w-[44rem] md:max-w-[42vw] md:opacity-90"
      />
      <img
        src={`${import.meta.env.BASE_URL}assets/brand/palm-frond.png`}
        alt=""
        aria-hidden="true"
        width="728"
        height="182"
        loading="lazy"
        decoding="async"
        className="pointer-events-none absolute right-0 top-0 w-[36rem] max-w-[66vw] -scale-x-100 opacity-70 md:w-[44rem] md:max-w-[42vw] md:opacity-90"
      />

      <div className="container-shell relative">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <a href="#home" className="inline-flex flex-col leading-none">
              <span className="font-heading text-[2.3rem] leading-none tracking-[-0.045em] text-inkdeep">
                HiTech <span className="font-normal text-ink/85">Labs</span>
              </span>
              <span className="mono-detail mt-2 text-[0.66rem] uppercase tracking-[0.26em] text-sage">
                Small Business Systems &amp; Support
              </span>
            </a>
            <p className="mt-4 max-w-md text-sm leading-6 text-body">
              Websites, software, automation, and practical technology support
              for small businesses on Kauaʻi.
            </p>
          </div>

          <div className="mono-detail text-sm leading-7 text-body md:text-right">
            <div>
              <a
                href="tel:+18086398697"
                className="underline decoration-clay/40 underline-offset-4 transition hover:text-inkdeep"
              >
                808-639-8697
              </a>
            </div>
            <div>
              <a
                href="mailto:info@hitechlabskauai.com"
                className="underline decoration-clay/40 underline-offset-4 transition hover:text-inkdeep"
              >
                info@hitechlabskauai.com
              </a>
            </div>
            <div>Princeville, Kauaʻi</div>
          </div>
        </div>

        <div className="section-divider mt-10" />
        <div className="mt-5 flex flex-col gap-4 text-xs text-body sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 HiTech Labs</p>
          <nav aria-label="Footer" className="flex flex-wrap gap-x-5 gap-y-2">
            <a
              href="https://www.linkedin.com/company/125253898/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-link"
            >
              LinkedIn
            </a>
            <a href="/privacy/" className="text-link">
              Privacy
            </a>
            <a href="/terms/" className="text-link">
              Website terms
            </a>
          </nav>
        </div>
      </div>
    </footer>
  )
}
