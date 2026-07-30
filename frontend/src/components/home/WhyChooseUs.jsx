import { Tag, Globe, ShieldCheck, Headset } from 'lucide-react'

const features = [
  {
    icon: Tag,
    title: 'Best Price Guarantee',
    desc: 'We compare 500+ airlines, hotels & travel partners to bring you the lowest fares.',
    bgClass: 'bg-amber-50 text-amber-600 shadow-amber-100/50 group-hover:bg-amber-600',
    borderClass: 'hover:shadow-[0_20px_45px_-12px_rgba(245,158,11,0.15)] hover:border-amber-100/80',
    textHover: 'group-hover:text-amber-600',
  },
  {
    icon: Globe,
    title: 'Complete Travel Platform',
    desc: 'Flights, hotels, trains, cabs and holiday packages - all in one place.',
    bgClass: 'bg-sky-50 text-sky-600 shadow-sky-100/50 group-hover:bg-sky-600',
    borderClass: 'hover:shadow-[0_20px_45px_-12px_rgba(14,165,233,0.15)] hover:border-sky-100/80',
    textHover: 'group-hover:text-sky-600',
  },
  {
    icon: ShieldCheck,
    title: 'Secure & Trusted',
    desc: 'PCI DSS Level 1 certified payments. Your data is 100% safe with us.',
    bgClass: 'bg-emerald-50 text-emerald-600 shadow-emerald-100/50 group-hover:bg-emerald-600',
    borderClass: 'hover:shadow-[0_20px_45px_-12px_rgba(16,185,129,0.15)] hover:border-emerald-100/80',
    textHover: 'group-hover:text-emerald-600',
  },
  {
    icon: Headset,
    title: '24/7 Customer Support',
    desc: 'Our travel experts are available anytime you need us.',
    bgClass: 'bg-purple-50 text-purple-600 shadow-purple-100/50 group-hover:bg-purple-600',
    borderClass: 'hover:shadow-[0_20px_45px_-12px_rgba(139,92,246,0.15)] hover:border-purple-100/80',
    textHover: 'group-hover:text-purple-600',
  },
]

export default function WhyChooseUs() {
  return (
    <section className="py-24 bg-gradient-to-b from-gray-50/50 via-white to-gray-50/50 w-full overflow-hidden relative">
      {/* Premium Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-[0.35] pointer-events-none"></div>

      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 relative z-10 font-satoshi">
        <div className="mb-10">
          <h2 className="text-[34px] font-extrabold text-[#1a1a1a] font-satoshi leading-tight tracking-tight">
            Why Choose FlyAnyTrip?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((item) => (
            <div
              key={item.title}
              className={`bg-white p-8 rounded-3xl border border-gray-150/70 shadow-[0_4px_25px_-5px_rgba(0,0,0,0.03),0_10px_15px_-5px_rgba(0,0,0,0.02)] transition-all duration-500 ease-out flex flex-col items-center text-center group relative overflow-hidden cursor-pointer font-satoshi ${item.borderClass}`}
            >
              {/* Icon Container with rotate on hover */}
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-7 relative z-10 transition-all duration-500 ease-out group-hover:scale-110 group-hover:rotate-6 group-hover:text-white shadow-sm ${item.bgClass}`}>
                <item.icon className="w-8 h-8" strokeWidth={1.5} />
              </div>

              {/* Title & Description */}
              <h3 className={`text-[19px] font-bold text-gray-900 mb-3 tracking-tight transition-colors duration-300 relative z-10 ${item.textHover}`}>
                {item.title}
              </h3>
              
              <p className="text-gray-500 leading-relaxed text-[14px] px-2 relative z-10 group-hover:text-gray-600 transition-colors duration-300">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
