import { MapPin } from 'lucide-react'

export default function PackageSummaryBar({ pkg, departureDate, price }) {
  return (
    <div 
      className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 mb-6 flex items-center justify-between gap-4 flex-wrap shadow-2xs"
      style={{ fontFamily: '"Quicksand", sans-serif' }}
    >
      <div className="flex items-center gap-4 min-w-0">
        <img src={pkg.image} alt={pkg.title} className="w-[84px] h-[64px] rounded-2xl object-cover shrink-0" />
        <div className="min-w-0">
          <h2 className="font-bold text-gray-900 text-lg leading-tight">{pkg.title}</h2>
          <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
            <MapPin size={13} className="text-gray-400 shrink-0" />
            <span className="truncate">{pkg.location || 'Delhi → Agra → Jaipur'}</span>
          </p>
          <div className="flex gap-2 mt-2">
            <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded-md">{pkg.duration || '5N/6D'}</span>
            <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded-md">Package</span>
          </div>
        </div>
      </div>
      <div className="text-right shrink-0">
        <p className="text-xs text-gray-400 font-medium">Departing</p>
        <p className="text-sm font-bold text-gray-900 mt-0.5">{departureDate}</p>
        <p className="text-xl font-bold text-gray-900 mt-1">₹{price.toLocaleString('en-IN')}<span className="text-xs font-normal text-gray-500">/person</span></p>
      </div>
    </div>
  )
}
