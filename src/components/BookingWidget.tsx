import { useEffect, useRef, useState } from 'react'

/**
 * Mounts the self-contained Chime booking widget (an IIFE bundle that ships its
 * own React + fully style-scoped CSS under `.chime-widget`) into this React 18
 * site. Using the embed bundle instead of importing the source keeps the two
 * React versions and Tailwind pipelines completely isolated.
 *
 * Assets live in `public/chime/` and are referenced through Vite's BASE_URL so
 * the paths resolve both in local dev (`/`) and on GitHub Pages
 * (`/hitech-labs-website/`). The bundle + theme are loaded lazily the first
 * time a widget scrolls near the viewport, so they never weigh down first paint.
 */

type ChimeMountHandle = { unmount: () => void }

declare global {
  interface Window {
    ChimeWidget?: {
      mount: (el: HTMLElement, config?: unknown) => ChimeMountHandle
      autoMount: () => number
    }
    CHIME_WIDGET_CONFIG?: unknown
  }
}

const BASE = import.meta.env.BASE_URL
const WIDGET_CSS = `${BASE}chime/chime-widget.css`
const THEME_CSS = `${BASE}chime/chime-hitech-theme.css`
const WIDGET_JS = `${BASE}chime/chime-widget.js`

// Load the stylesheet + script exactly once for the whole page, no matter how
// many BookingWidget instances mount.
let assetsPromise: Promise<void> | null = null

function ensureStylesheet(href: string, id: string) {
  if (document.getElementById(id)) return
  const link = document.createElement('link')
  link.id = id
  link.rel = 'stylesheet'
  link.href = href
  document.head.appendChild(link)
}

function ensureAssets(): Promise<void> {
  if (assetsPromise) return assetsPromise

  // Widget base styles first, then the HiTech token/theme override on top.
  ensureStylesheet(WIDGET_CSS, 'chime-widget-css')
  ensureStylesheet(THEME_CSS, 'chime-hitech-theme-css')

  assetsPromise = new Promise<void>((resolve, reject) => {
    if (window.ChimeWidget) {
      resolve()
      return
    }
    const script = document.createElement('script')
    script.id = 'chime-widget-js'
    script.src = WIDGET_JS
    script.async = true
    script.onload = () => resolve()
    script.onerror = () =>
      reject(new Error('Failed to load the Chime booking widget.'))
    document.body.appendChild(script)
  })

  return assetsPromise
}

export default function BookingWidget({ config }: { config: unknown }) {
  const hostRef = useRef<HTMLDivElement | null>(null)
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>(
    'idle'
  )
  const [visible, setVisible] = useState(false)

  // Defer asset loading until the widget is close to the viewport.
  useEffect(() => {
    const node = hostRef.current
    if (!node || visible) return
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true)
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: '400px 0px' }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [visible])

  useEffect(() => {
    if (!visible) return
    let handle: ChimeMountHandle | null = null
    let cancelled = false

    setStatus('loading')
    ensureAssets()
      .then(() => {
        if (cancelled || !hostRef.current || !window.ChimeWidget) return
        handle = window.ChimeWidget.mount(hostRef.current, config)
        setStatus('ready')
      })
      .catch((error) => {
        if (cancelled) return
        console.error(error)
        setStatus('error')
      })

    return () => {
      cancelled = true
      handle?.unmount()
    }
  }, [visible, config])

  return (
    <div className="chime-embed">
      <div ref={hostRef} className="chime-embed__host" />
      {status === 'loading' && (
        <p className="chime-embed__status" role="status">
          Loading the booking calendar…
        </p>
      )}
      {status === 'error' && (
        <p
          className="chime-embed__status chime-embed__status--error"
          role="alert"
        >
          The booking calendar couldn’t load. Please text us at{' '}
          <a href="tel:+18086398697">808-639-8697</a> and we’ll get you
          scheduled.
        </p>
      )}
    </div>
  )
}
