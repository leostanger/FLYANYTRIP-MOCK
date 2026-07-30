import { Star, Quote } from 'lucide-react'
import testimonials from '../../data/testimonials'

export default function Testimonials() {
  return (
    <section className="py-16 bg-white w-full">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
        <div className="mb-10 font-satoshi">
          <h2 className="text-[34px] font-extrabold text-[#1a1a1a] tracking-tight leading-tight">Customer Testimonials</h2>
          <p className="text-[#888] text-[15px] font-normal mt-1">Best rates at 50,000+ properties across India</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 font-satoshi">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] flex flex-col h-full relative group hover:shadow-xl transition-shadow font-satoshi"
            >
              <div className="absolute top-6 right-6 text-gray-200 group-hover:text-[#ef3535]/10 transition-colors">
                <Quote size={40} strokeWidth={1} />
              </div>

              <div className="flex items-center gap-1 mb-4 relative z-10">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'
                    }`}
                  />
                ))}
              </div>

              <p className="text-[14px] text-gray-600 leading-relaxed mb-8 flex-1 relative z-10 line-clamp-4">
                {testimonial.text}
              </p>
              
              <div className="flex items-center gap-3 mt-auto relative z-10 pt-4 border-t border-gray-100">
                <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 shadow-sm border border-gray-150 bg-gray-50">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-[14px] text-gray-900 leading-none mb-1">{testimonial.name}</h4>
                  <p className="text-[12px] text-gray-500">{testimonial.time}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
