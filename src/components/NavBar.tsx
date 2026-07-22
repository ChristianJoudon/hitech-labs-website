import { Disclosure } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { useActiveSection, useScrolled } from '../hooks/useUiChrome'

const navItems = [
  { name: 'Services', href: '#services', id: 'services' },
  { name: 'Advanced Solutions', href: '#advanced', id: 'advanced' },
  { name: 'FAQ', href: '#faq', id: 'faq' },
  { name: 'Book', href: '#book', id: 'book' },
  { name: 'Contact', href: '#contact', id: 'contact' }
]

// Stable reference so the active-section observer isn't torn down every render
const SECTION_IDS = ['home', 'services', 'advanced', 'faq', 'book', 'contact']

function BrandLockup() {
  return (
    <a href="#home" className="group inline-flex flex-col leading-none">
      <span className="font-wordmark text-[1.4rem] leading-none tracking-[-0.02em] text-inkdeep md:text-[1.6rem]">
        HiTech Labs
      </span>
      <span className="mono-detail mt-1.5 whitespace-nowrap text-[0.58rem] uppercase tracking-[0.14em] text-sage md:text-[0.62rem]">
        Small Business Systems &amp; Support
      </span>
    </a>
  )
}

export default function NavBar() {
  const scrolled = useScrolled(24)
  const active = useActiveSection(SECTION_IDS)

  return (
    <Disclosure
      as="nav"
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'border-b border-bordersoft bg-paper/90 backdrop-blur-md'
          : 'border-b border-transparent bg-paper/50 backdrop-blur-sm'
      }`}
    >
      {({ open }) => (
        <>
          <div
            className={`container-shell flex items-center justify-between transition-all duration-500 ${
              scrolled ? 'py-3' : 'py-5'
            }`}
          >
            <BrandLockup />

            <div className="hidden items-center gap-5 md:flex">
              <ul className="flex items-center gap-5 text-[0.8rem] font-medium">
                {navItems.map((item) => {
                  const isActive = active === item.id
                  return (
                    <li key={item.href}>
                      <a
                        href={item.href}
                        className={`relative whitespace-nowrap py-1 transition-colors duration-300 ${
                          isActive
                            ? 'text-inkdeep'
                            : 'text-body hover:text-inkdeep'
                        }`}
                      >
                        {item.name}
                        <span
                          className={`absolute -bottom-0.5 left-0 h-px bg-clay transition-all duration-300 ${
                            isActive ? 'w-full opacity-100' : 'w-0 opacity-0'
                          }`}
                        />
                      </a>
                    </li>
                  )
                })}
              </ul>

              <a
                href="#book"
                className="btn-pill whitespace-nowrap px-4 py-2.5 text-[0.82rem]"
              >
                Free Consult
              </a>
            </div>

            <Disclosure.Button
              aria-label={open ? 'Close menu' : 'Open menu'}
              className="inline-flex rounded-full border border-bordersoft bg-card p-2 text-inkdeep shadow-card md:hidden"
            >
              {open ? (
                <XMarkIcon className="size-5" />
              ) : (
                <Bars3Icon className="size-5" />
              )}
            </Disclosure.Button>
          </div>

          <Disclosure.Panel className="bg-paper/97 border-t border-bordersoft backdrop-blur-md md:hidden">
            <div className="container-shell flex flex-col gap-2.5 py-4">
              {navItems.map((item) => (
                <Disclosure.Button
                  as="a"
                  key={item.href}
                  href={item.href}
                  className="rounded-2xl border border-bordersoft bg-card px-4 py-3 text-sm font-medium text-inkdeep transition hover:border-ink/25"
                >
                  {item.name}
                </Disclosure.Button>
              ))}
              <Disclosure.Button
                as="a"
                href="#book"
                className="btn-pill-solid mt-1"
              >
                Book Your Free 30-min Tech Check
              </Disclosure.Button>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  )
}
