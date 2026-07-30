import React from 'react'
import { User, Star, Shield, Check } from 'lucide-react'

export default function BookingStepper({ currentStep = 1 }) {
  const steps = [
    { label: 'Fill Your Info',   icon: <User size={16} /> },
    { label: 'Personalize Trip', icon: <Star size={16} /> },
    { label: 'Finalize Payment', icon: <Shield size={16} /> },
  ]

  return (
    <div className="bg-white border border-gray-200 rounded-2xl px-8 sm:px-12 py-7 my-6 shadow-sm">
      <div className="flex items-start justify-between w-full">
        {steps.map((step, i) => {
          const stepNum     = i + 1
          const isCompleted = stepNum < currentStep
          const isActive    = stepNum === currentStep
          const isLast      = i === steps.length - 1

          return (
            <React.Fragment key={i}>
              {/* Step: circle + label stacked */}
              <div className="flex flex-col items-center" style={{ minWidth: 72 }}>
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    isCompleted
                      ? 'bg-emerald-500 text-white shadow-sm'
                      : isActive
                      ? 'bg-red-500 text-white shadow-sm'
                      : 'bg-white border border-[#6B6B6B] text-[#6B6B6B]'
                  }`}
                >
                  {isCompleted ? <Check size={16} strokeWidth={3} /> : step.icon}
                </div>
                <span
                  className={`text-[11px] font-semibold mt-2 whitespace-nowrap text-center leading-tight ${
                    isCompleted
                      ? 'text-emerald-600'
                      : isActive
                      ? 'text-red-500'
                      : 'text-[#6B6B6B]'
                  }`}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector line — vertically centered at 20px (half of w-10 = 40px) */}
              {!isLast && (
                <div className="flex-1 flex items-start" style={{ paddingTop: 19 }}>
                  <div
                    className={`w-full h-[1px] rounded-full transition-colors ${
                      isCompleted ? 'bg-emerald-500' : 'bg-[#D0D0D0]'
                    }`}
                  />
                </div>
              )}
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}
