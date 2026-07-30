import { Sparkles, Check, Plus, Luggage, Zap, Wifi } from 'lucide-react'

export const ADDON_OPTIONS = [
  { id: 'bag_15', title: 'Extra Baggage — 15 kg', price: 799, desc: 'Add 1 check-in bag', icon: Luggage },
  { id: 'bag_30', title: 'Extra Baggage — 30 kg', price: 1399, desc: 'Add 2 check-in bags', badge: 'Better value', icon: Luggage },
  { id: 'travel_kit', title: 'Travel Kit', price: 299, desc: 'Board first, best overhead bin space', badge: 'Popular', icon: Zap },
  { id: 'visa_assist', title: 'Visa Assistance', price: 499, desc: 'Stay connected during the flight', icon: Wifi },
]

export default function AddOnServiceCard({ selectedAddOns = [], onToggle }) {
  const selectedIds = new Set(selectedAddOns.map(a => a.id))

  return (
    <div 
      className="bg-white border border-gray-200 rounded-2xl p-6 mb-5"
      style={{ fontFamily: '"Quicksand", sans-serif' }}
    >
      <div className="flex items-center gap-2.5 mb-5">
        <div className="w-5 h-5 flex items-center justify-center shrink-0">
          <Sparkles size={18} className="text-red-500" />
        </div>
        <h2 className="text-base font-bold text-gray-900 flex-1">Add-on Service</h2>
      </div>

      <div className="flex flex-col gap-3">
        {ADDON_OPTIONS.map((item) => {
          const isAdded = selectedIds.has(item.id)
          const IconComponent = item.icon
          return (
            <div key={item.id} className="p-3.5 rounded-xl border border-gray-200 bg-white flex items-center justify-between gap-4 flex-wrap sm:flex-nowrap">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-10 h-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center shrink-0">
                  {IconComponent ? <IconComponent size={18} strokeWidth={2} /> : '+'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-gray-900 text-sm">{item.title}</span>
                    {item.badge && (
                      <span className="text-[11px] font-semibold bg-gray-100 text-gray-500 px-2.5 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0 ml-13 sm:ml-0 w-full sm:w-auto justify-end">
                <span className="text-sm font-semibold text-gray-900" style={{ fontFamily: '"JetBrains Mono", monospace' }}>+₹{item.price}</span>
                <button
                  type="button"
                  onClick={() => onToggle(item)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer ${
                    isAdded
                      ? 'bg-red-500 text-white border border-red-500'
                      : 'bg-red-50 border border-red-200 text-red-500 hover:bg-red-100'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check size={13} strokeWidth={2.5} /> Added
                    </>
                  ) : (
                    <>
                      <Plus size={13} strokeWidth={2.5} /> Add
                    </>
                  )}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
