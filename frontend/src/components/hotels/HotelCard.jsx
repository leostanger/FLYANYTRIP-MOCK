import { MapPin, Star, Heart, Waves, Sparkles, Wifi, GlassWater, Flower2, Palmtree, Dumbbell, Utensils, Tv } from 'lucide-react'

export default function HotelCard({ hotel }) {
  // Mock values to match Figma specifications if not provided in the hotel object
  const originalPrice = hotel.originalPrice || 14000;
  const discountPercent = hotel.discount || 30;
  const taxes = hotel.taxes || 1176;
  const reviewCount = hotel.reviews || "3,120";
  const locationText = hotel.location || "Cavelossim · Goa";
  const starsCount = hotel.stars || 5;

  const getAmenityIcon = (amenity) => {
    const name = amenity.toLowerCase();
    if (name.includes('wifi')) return <Wifi size={11} className="text-[#6B6B6B]" />;
    if (name.includes('pool') || name.includes('swiming') || name.includes('waves')) return <Waves size={11} className="text-[#6B6B6B]" />;
    if (name.includes('spa')) return <Flower2 size={11} className="text-[#6B6B6B]" />;
    if (name.includes('bar')) return <GlassWater size={11} className="text-[#6B6B6B]" />;
    if (name.includes('beach') || name.includes('sun')) return <Palmtree size={11} className="text-[#6B6B6B]" />;
    if (name.includes('gym') || name.includes('dumbbell')) return <Dumbbell size={11} className="text-[#6B6B6B]" />;
    if (name.includes('restaurant') || name.includes('utensils') || name.includes('dining')) return <Utensils size={11} className="text-[#6B6B6B]" />;
    if (name.includes('tv')) return <Tv size={11} className="text-[#6B6B6B]" />;
    return <Sparkles size={11} className="text-[#6B6B6B]" />;
  }

  const formatAmenityLabel = (label) => {
    if (label.toLowerCase() === 'free wifi') return 'WiFi';
    if (label.toLowerCase() === 'swiming pool' || label.toLowerCase() === 'pool') return 'Pool';
    return label;
  }

  return (
    <div className="bg-white rounded-[15px] overflow-hidden border border-[#E2E2E2] shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-[0_15px_35px_-8px_rgba(0,0,0,0.06)] hover:translate-y-[-1px] transition-all duration-300 flex flex-col h-full cursor-pointer relative group font-satoshi">
      {/* Card Image Section */}
      <div className="relative h-[200px] overflow-hidden flex-shrink-0">
        <img
          src={hotel.image}
          alt={hotel.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
        />
        
        {/* Type Badge */}
        <div className="absolute top-4 left-4 bg-[#fdecea] text-[#ef3535] text-[13px] font-satoshi font-normal px-3.5 py-1.5 rounded-full leading-none shadow-sm">
          {hotel.badge || 'Luxury'}
        </div>

        {/* Favorite Heart Button */}
        <button className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/90 backdrop-blur-[2px] flex items-center justify-center border border-[#D0D0D0] hover:bg-white text-gray-600 transition-all active:scale-90 cursor-pointer shadow-sm">
          <Heart size={14} className="fill-none text-[#6B6B6B]" />
        </button>
      </div>
      
      {/* Card Content Section */}
      <div className="p-5 flex flex-col flex-1 justify-between">
        <div>
          {/* Title */}
          <h3 className="text-[17px] font-bold text-[#1A1A1A] leading-tight mb-2 tracking-tight hover:text-[#FE2C1C] transition-colors">{hotel.name}</h3>
          
          {/* Location */}
          <div className="flex items-center text-[#6B6B6B] text-xs font-semibold mb-2">
            <MapPin size={13} className="text-[#6B6B6B] mr-1 flex-shrink-0" />
            <span>{locationText}</span>
          </div>

          {/* Ratings & Reviews */}
          <div className="flex items-center gap-1.5 mb-3">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  size={12} 
                  className={`${i < starsCount ? 'text-[#E53935] fill-[#E53935]' : 'text-gray-200'}`} 
                />
              ))}
            </div>
            <span className="text-[11px] font-bold text-gray-400">({reviewCount} reviews)</span>
          </div>

          {/* Amenities List */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {(hotel.amenities || ['Free WiFi', 'Swiming Pool', 'Spa', 'Beach', 'Bar']).slice(0, 4).map((amenity) => (
              <span 
                key={amenity}
                className="text-[10px] font-semibold text-[#6B6B6B] bg-transparent border border-[#D0D0D0] rounded-full px-2.5 h-[21px] flex items-center gap-1.5"
              >
                {getAmenityIcon(amenity)}
                {formatAmenityLabel(amenity)}
              </span>
            ))}
          </div>
        </div>
        
        {/* Pricing & CTA Buttons */}
        <div className="border-t border-gray-100 pt-4 mt-auto">
          {/* Main Price + /night inline */}
          <div className="flex items-baseline gap-1.5 mb-1">
            <span className="text-[25px] font-extrabold text-[#1A1A1A] leading-none tracking-tight">₹{hotel.price.toLocaleString()}</span>
            <span className="text-[#6B6B6B] text-[13px] font-semibold">/ night</span>
          </div>
          {/* Original Strikethrough + Discount Badge */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[13px] text-gray-400 line-through font-satoshi">₹{originalPrice.toLocaleString()}</span>
            <span className="text-[12px] font-satoshi font-semibold text-[#2E7D32] bg-[#e8f5e9] px-2.5 py-1 rounded-full leading-none">
              {discountPercent}% off
            </span>
          </div>
          
          {/* CTA Button */}
          <div className="w-full">
            <button 
              className="w-full flex items-center justify-center text-white font-satoshi font-bold transition-all border-none cursor-pointer active:scale-[0.98] hover:opacity-90"
              style={{
                background: '#E53935',
                height: '42px',
                borderRadius: '13.375px',
                fontSize: '14px',
              }}
            >
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

