import footerLeaf from '../assets/footer-leaf.png'

export default function Footer() {
  return (
    <footer className="section-shell border-t border-bordersoft bg-paper py-14">
      <img
        src={footerLeaf}
        alt=""
        aria-hidden="true"
        width="768"
        height="768"
        loading="lazy"
        decoding="async"
        className="pointer-events-none absolute -bottom-16 -right-10 hidden w-96 max-w-[30vw] opacity-[0.36] md:block"
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
