import { Headset, ShieldCheck, TrendingUp, Clock, Star } from 'lucide-react'

const FEATURES = [
  { Icon: Headset, text: '24/7 Customer Support' },
  { Icon: ShieldCheck, text: '100% Secure Payments' },
  { Icon: TrendingUp, text: 'Best Price Guarantee' },
  { Icon: Clock, text: 'Instant Confirmation' },
  { Icon: Star, text: '5M+ Happy Travellers' },
]

export default function FeatureStrip() {
  return (
    <div
      className="relative z-10 bg-[#ef3535] flex items-center justify-center px-10 py-3"
      id="feature-strip"
    >
      <div className="flex flex-wrap justify-center max-w-[1400px] mx-auto w-full">
        {FEATURES.map(({ Icon, text }, i) => (
          <div
            key={text}
            className={`flex items-center gap-2 px-6 py-1 text-white text-[13px] font-medium whitespace-nowrap ${
              i > 0 ? 'border-l border-white/20' : ''
            }`}
          >
            <Icon className="w-[18px] h-[18px]" />
            <span>{text}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
