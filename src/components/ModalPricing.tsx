import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'

type Row = { name: string; onetime: string; monthly: string; third: string }
type Section = { title: string; rows: Row[] }

const data: Section[] = [
  {
    title: 'Core Packages',
    rows: [
      {
        name: 'Website & SEO Tune-Up',
        onetime: '$855 to $1,270',
        monthly: '$225',
        third: 'Domain $15/yr • Hosting $10-30/mo'
      },
      {
        name: 'Workflow Automation',
        onetime: '$680 to $1,020',
        monthly: '$200',
        third: 'Zapier $20+/mo'
      },
      {
        name: 'AI & Smart Tools',
        onetime: '$650 to $1,100',
        monthly: '$180',
        third: 'AI usage $0-40/mo'
      },
      {
        name: 'Online Booking Setup',
        onetime: '$935 to $1,450',
        monthly: '$240',
        third: 'FareHarbor 6% • Stripe 2.9% + 30¢'
      },
      {
        name: 'Digital Marketing',
        onetime: '$680 to $1,020',
        monthly: '$210',
        third: 'Mailchimp $0-13/mo'
      },
      {
        name: 'Tech Tune-Up',
        onetime: '$300 to $600',
        monthly: 'n/a',
        third: 'Health check + roadmap'
      }
    ]
  },
  {
    title: 'Add-Ons',
    rows: [
      {
        name: 'Tech Health Check',
        onetime: '$300',
        monthly: 'n/a',
        third: 'n/a'
      },
      {
        name: '2-hr Staff Workshop',
        onetime: '$180',
        monthly: 'n/a',
        third: 'n/a'
      },
      {
        name: 'Seasonal Tune-Up',
        onetime: '$425 to $765',
        monthly: 'n/a',
        third: 'n/a'
      }
    ]
  }
]

export default function ModalPricing({
  open,
  onClose
}: {
  open: boolean
  onClose: () => void
}) {
  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-[70]" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-[rgba(66,75,69,0.14)] backdrop-blur-[6px]" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto px-4 py-10">
          <div className="flex min-h-full items-center justify-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 scale-[0.985]"
              enterTo="opacity-100 translate-y-0 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 scale-100"
              leaveTo="opacity-0 translate-y-2 scale-[0.99]"
            >
              <Dialog.Panel className="panel-glass w-full max-w-5xl overflow-hidden p-6 md:p-8">
                <div className="mb-6 flex items-start justify-between gap-4">
                  <div>
                    <Dialog.Title className="font-heading text-[1.7rem] leading-tight tracking-[-0.04em] text-inkdeep md:text-[2.1rem]">
                      Transparent Pricing
                    </Dialog.Title>
                    <p className="mt-2 text-sm text-body md:text-base">
                      Starter packages, monthly support, and common third-party
                      costs.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close pricing table"
                    className="btn-pill size-11 p-0"
                  >
                    <XMarkIcon className="size-5" />
                  </button>
                </div>

                <div className="overflow-hidden rounded-[22px] border border-bordersoft/90 bg-white/[0.82]">
                  <div
                    className="max-h-[70vh] overflow-auto"
                    tabIndex={0}
                    role="region"
                    aria-label="Pricing table: scroll to see all columns"
                  >
                    <table className="w-full min-w-[760px] text-left text-sm text-body">
                      <thead className="sticky top-0 bg-paper/95 backdrop-blur-sm">
                        <tr className="border-b border-bordersoft/90 text-inkdeep">
                          <th className="px-5 py-4 font-semibold">Service</th>
                          <th className="px-5 py-4 font-semibold">One-time</th>
                          <th className="px-5 py-4 font-semibold">Monthly</th>
                          <th className="px-5 py-4 font-semibold">
                            Third-party
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.map((section) => (
                          <Fragment key={section.title}>
                            <tr className="border-b border-bordersoft/80 bg-paper/70">
                              <td
                                colSpan={4}
                                className="px-5 py-3 font-medium text-inkdeep"
                              >
                                {section.title}
                              </td>
                            </tr>

                            {section.rows.map((row) => (
                              <tr
                                key={row.name}
                                className="border-b border-bordersoft/60 last:border-b-0"
                              >
                                <td className="px-5 py-4 align-top">
                                  {row.name}
                                </td>
                                <td className="px-5 py-4 align-top text-inkdeep">
                                  {row.onetime}
                                </td>
                                <td className="px-5 py-4 align-top text-inkdeep">
                                  {row.monthly}
                                </td>
                                <td className="px-5 py-4 align-top">
                                  {row.third}
                                </td>
                              </tr>
                            ))}
                          </Fragment>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <p className="mt-5 text-right text-xs text-body">
                  Prices exclude Hawaiʻi GET (4.712%). Final scope and pricing
                  are confirmed in a written proposal.
                </p>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
