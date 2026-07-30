import { Link } from 'react-router-dom'
import destinations from '../../data/destinations'
import { ChevronRight } from 'lucide-react'

export default function PopularDestinations() {
  const row1 = destinations.slice(0, 3);
  const row2 = destinations.slice(3, 6);

  // Layout weights (ratios) from Figma:
  // Row 1: 264px, 553px, 548px
  // Row 2: 553px, 548px, 264px
  const row1Weights = ['lg:flex-[264]', 'lg:flex-[553]', 'lg:flex-[548]'];
  const row2Weights = ['lg:flex-[553]', 'lg:flex-[548]', 'lg:flex-[264]'];

  const renderCard = (dest, weightClass) => (
    <div
      key={dest.id}
      className={`relative rounded-2xl overflow-hidden h-[293px] group cursor-pointer shadow-sm w-full ${weightClass}`}
    >
      <img
        src={dest.image}
        alt={dest.name}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent"></div>
      
      {/* Category Tag */}
      <div className="absolute top-4 right-4 bg-[#fdecea] text-[#ef3535] text-[13px] font-satoshi font-normal px-3.5 py-1.5 rounded-full leading-none shadow-sm">
        {dest.tag}
      </div>

      {/* Content */}
      <div className="absolute inset-x-0 bottom-0 p-6 pr-16 text-white font-satoshi">
        <h3 className="font-satoshi font-semibold text-white text-[24px] leading-normal mb-0.5 tracking-tight">{dest.name}</h3>
        <div className="flex flex-col mt-1">
          <span className="font-satoshi font-semibold text-white text-[18px] leading-normal">₹{dest.price.toLocaleString()}</span>
          <span className="font-satoshi font-normal text-gray-300 text-[12px] leading-none mt-1">{dest.duration}</span>
        </div>
      </div>

      {/* Vertically Centered Chevron on Right Edge */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 text-white opacity-95 group-hover:opacity-100 group-hover:translate-x-1.5 transition-all duration-300">
        <ChevronRight size={26} strokeWidth={2.5} />
      </div>
    </div>
  );

  return (
    <section className="py-12 bg-white w-full">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
        <div className="flex justify-between items-end mb-8 font-satoshi">
          <div>
            <h2 className="text-[34px] font-extrabold text-gray-900 mb-1 tracking-tight">Popular Destinations</h2>
            <p className="text-gray-500 text-[15px] font-medium">Curated holiday packages with flights + hotels</p>
          </div>
          <Link to="/packages" className="text-gray-500 text-sm font-semibold flex items-center hover:text-[#ef3535] no-underline">
            View All Packages <ChevronRight size={16} className="ml-1" />
          </Link>
        </div>

        {/* Row 1 */}
        <div className="flex flex-col lg:flex-row gap-[15px] mb-[15px]">
          {row1.map((dest, idx) => renderCard(dest, row1Weights[idx]))}
        </div>

        {/* Row 2 */}
        <div className="flex flex-col lg:flex-row gap-[15px]">
          {row2.map((dest, idx) => renderCard(dest, row2Weights[idx]))}
        </div>
      </div>
    </section>
  )
}
