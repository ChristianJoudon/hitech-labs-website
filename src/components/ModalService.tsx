import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import type { Service } from './types'
import { XMarkIcon } from '@heroicons/react/24/outline'

type Props = { service: Service; open: boolean; onClose: () => void }

export default function ModalService({ service, open, onClose }: Props) {
  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-[60]" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-[rgba(66,75,69,0.12)] backdrop-blur-[6px]" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto px-4 py-10">
          <div className="flex min-h-full items-center justify-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-3 scale-[0.985]"
              enterTo="opacity-100 translate-y-0 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 scale-100"
              leaveTo="opacity-0 translate-y-2 scale-[0.99]"
            >
              <Dialog.Panel className="panel-glass relative w-full max-w-[44rem] overflow-hidden p-7 md:p-10">
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close service details"
                  className="absolute right-4 top-4 inline-flex size-10 items-center justify-center rounded-full border border-bordersoft bg-white text-inkdeep shadow-card transition hover:bg-paper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/50 focus-visible:ring-offset-2"
                >
                  <XMarkIcon className="size-5" />
                </button>

                <div className="relative">
                  {service.icon && (
                    <div className="mb-5 flex size-11 items-center justify-center text-clay">
                      {service.icon}
                    </div>
                  )}

                  <Dialog.Title className="service-modal-title max-w-[29rem] text-[2.2rem] md:text-[2.85rem]">
                    {service.title}
                  </Dialog.Title>

                  <p className="mt-5 text-[1.02rem] leading-7 text-body">
                    {service.why}
                  </p>

                  <ul className="mt-5 space-y-3 text-[0.98rem] leading-7 text-body">
                    {service.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-start gap-3">
                        <span className="mt-2 inline-block size-1.5 rounded-full bg-clay" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>

                  <p className="mt-6 max-w-[38rem] text-[0.98rem] leading-7 text-body">
                    {service.overview}
                  </p>

                  <div className="mono-detail mt-7 inline-flex rounded-full border border-clay/25 bg-clay/10 px-4 py-2 text-sm font-medium text-claydeep">
                    {service.price}
                  </div>

                  <div className="mt-8">
                    <a
                      href="#contact"
                      onClick={onClose}
                      className="btn-pill-solid"
                    >
                      Start a Conversation
                    </a>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
