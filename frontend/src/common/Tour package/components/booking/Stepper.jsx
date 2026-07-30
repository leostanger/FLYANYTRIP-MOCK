import { User, Star, Shield, Check } from 'lucide-react'

export default function Stepper({ current }) {
  const steps = [
    { label: 'Fill Your Info', icon: <User size={16} /> },
    { label: 'Personalize Trip', icon: <Star size={16} /> },
    { label: 'Finalize Payment', icon: <Shield size={16} /> },
  ]
  return (
    <div className="bg-white border border-gray-200 rounded-2xl px-6 py-4 my-5 shadow-sm">
      <div className="flex items-center justify-between max-w-2xl mx-auto">
        {steps.map((step, i) => {
          const isActive = i === current
          const isDone = i < current
          return (
            <div key={i} className="flex items-center flex-1 last:flex-initial">
              <div className="flex flex-col items-center gap-1.5 shrink-0">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                  isDone
                    ? 'bg-green-500 border-green-500 text-white shadow-md shadow-green-100'
                    : isActive
                    ? 'bg-red-500 border-red-500 text-white shadow-md shadow-red-100'
                    : 'bg-white border-gray-300 text-gray-400'
                }`}>
                  {isDone ? <Check size={18} strokeWidth={2.5} /> : step.icon}
                </div>
                <span className={`text-xs font-bold whitespace-nowrap ${
                  isActive ? 'text-red-500' : isDone ? 'text-green-500' : 'text-gray-400 font-medium'
                }`}>
                  {step.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-3 sm:mx-6 mb-5 ${i < current ? 'bg-green-500' : 'bg-gray-200'}`} />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
