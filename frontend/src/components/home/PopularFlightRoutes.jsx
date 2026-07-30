import { Link } from 'react-router-dom'
import flights from '../../data/flights'
import { ChevronRight } from 'lucide-react'

// Custom stacked route arrows matching Figma / Frame 7566.svg
function RouteArrowIcon({ className }) {
  return (
    <svg className={className} viewBox="40 3 21 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M47.6665 6.5H47.1665V7.5H47.6665V7V6.5ZM60.6867 7.35355C60.882 7.15829 60.882 6.84171 60.6867 6.64645L57.5047 3.46447C57.3095 3.2692 56.9929 3.2692 56.7976 3.46447C56.6024 3.65973 56.6024 3.97631 56.7976 4.17157L59.6261 7L56.7976 9.82843C56.6024 10.0237 56.6024 10.3403 56.7976 10.5355C56.9929 10.7308 57.3095 10.7308 57.5047 10.5355L60.6867 7.35355ZM47.6665 7V7.5H60.3332V7V6.5H47.6665V7Z" fill="currentColor"/>
      <path d="M53.6665 14.5H54.1665V15.5H53.6665V15V14.5ZM40.6463 15.3536C40.451 15.1583 40.451 14.8417 40.6463 14.6464L43.8283 11.4645C44.0235 11.2692 44.3401 11.2692 44.5354 11.4645C44.7306 11.6597 44.7306 11.9763 44.5354 12.1716L41.7069 15L44.5354 17.8284C44.7306 18.0237 44.7306 18.3403 44.5354 18.5355C44.3401 18.7308 44.0235 18.7308 43.8283 18.5355L40.6463 15.3536ZM53.6665 15V15.5H40.9998V15V14.5H53.6665V15Z" fill="currentColor"/>
    </svg>
  )
}

export default function PopularFlightRoutes() {
  return (
    <section className="py-12 bg-white w-full">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
        <div className="flex justify-between items-end mb-8 font-satoshi">
          <div>
            <h2 className="text-[34px] font-extrabold text-gray-900 mb-1 tracking-tight">Popular Flight Routes</h2>
            <p className="text-gray-500 text-[15px] font-medium">Best fares across 500+ airlines</p>
          </div>
          <Link to="/flights" className="text-gray-500 text-sm font-semibold flex items-center hover:text-[#ef3535] no-underline">
            View All Routes <ChevronRight size={16} className="ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {flights.map((flight) => (
            <div
              key={flight.id}
              className="flex rounded-2xl border border-gray-200/80 shadow-sm hover:shadow-md transition-shadow cursor-pointer bg-white overflow-hidden h-[114px] relative"
            >
              {/* Image Left */}
              <div className="w-[140px] sm:w-[160px] md:w-[173px] h-full flex-shrink-0 overflow-hidden bg-gray-100">
                <img
                  src={flight.image}
                  alt={`${flight.fromCode} to ${flight.toCode}`}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Content Right */}
              <div className="flex-grow p-4 flex flex-col justify-between h-full relative font-satoshi">
                {/* Top line with codes and badge */}
                <div className="flex justify-between items-start font-satoshi">
                  <div className="flex items-center gap-2.5 font-satoshi font-medium text-[20px] text-[#1A1A1A] leading-[25.719px]">
                    <span>{flight.fromCode}</span>
                    <RouteArrowIcon className="w-[18px] h-[14px] text-black flex-shrink-0" />
                    <span>{flight.toCode}</span>
                  </div>
                  
                  {flight.badge && (
                    <span className="bg-[#fdecea] text-[#ef3535] text-[13px] font-satoshi font-normal px-3.5 py-1.5 rounded-full leading-none flex-shrink-0">
                      {flight.badge}
                    </span>
                  )}
                </div>

                {/* Price and starting label */}
                <div className="flex flex-col mt-auto font-satoshi leading-none">
                  <span className="text-[20px] font-satoshi font-bold text-[#1A1A1A] leading-[25.719px]">
                    ₹{flight.price.toLocaleString()}
                  </span>
                  <span className="text-[#6B6B6B] text-[12px] font-satoshi font-normal leading-none mt-2">
                    Starting from
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

