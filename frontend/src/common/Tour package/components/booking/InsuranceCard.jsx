import { Shield, Check, Plus } from 'lucide-react'

export default function InsuranceCard({ isSelected, onToggle, price = 149 }) {
  return (
    <div 
      className="bg-white border border-gray-200 rounded-2xl p-6 mb-6"
      style={{ fontFamily: '"Quicksand", sans-serif' }}
    >
      <div className="flex items-center justify-between gap-4 flex-wrap sm:flex-nowrap">
        <div className="flex items-start gap-3.5 flex-1 min-w-0">
          <div className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center shrink-0">
            <Shield size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base font-bold text-gray-900">Travel Insurance</h2>
              <span className="text-xs font-bold bg-green-100 text-green-800 px-2.5 py-0.5 rounded-full">
                Recommended
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              ₹5L coverage · Trip cancellation · Medical emergency · Baggage loss
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 ml-14 sm:ml-0 w-full sm:w-auto justify-end">
          <span className="text-sm font-bold text-gray-900">
            <span style={{ fontFamily: '"JetBrains Mono", monospace' }}>₹{price}</span>
            <span className="text-xs font-normal text-gray-500">/person</span>
          </span>
          <button
            type="button"
            onClick={onToggle}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
              isSelected
                ? 'bg-red-500 text-white shadow-sm'
                : 'bg-white border border-red-500 text-red-500 hover:bg-red-50'
            }`}
          >
            {isSelected ? (
              <>
                <Check size={13} strokeWidth={3} /> Added
              </>
            ) : (
              <>
                <Plus size={13} strokeWidth={3} /> Add
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
