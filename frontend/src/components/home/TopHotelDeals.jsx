import { Link } from 'react-router-dom'
import HotelCard from '../hotels/HotelCard'
import hotels from '../../data/hotels'
import { ChevronRight } from 'lucide-react'

export default function TopHotelDeals() {
  return (
    <section className="py-12 bg-white w-full">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
        <div className="flex justify-between items-end mb-8 font-satoshi">
          <div>
            <h2 className="text-[34px] font-extrabold text-gray-900 mb-1 tracking-tight">Top Hotel Deals</h2>
            <p className="text-gray-500 text-[15px] font-medium">Best rates at 50,000+ properties across India</p>
          </div>
          <Link to="/hotels" className="text-gray-500 text-sm font-semibold flex items-center hover:text-[#ef3535] no-underline">
            View All Hotels <ChevronRight size={16} className="ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {hotels.slice(0, 4).map((hotel) => (
            <HotelCard key={hotel.id} hotel={hotel} />
          ))}
        </div>
      </div>
    </section>
  )
}
