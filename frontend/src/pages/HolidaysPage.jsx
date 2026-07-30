import React, { useState } from 'react';
import {
  Palmtree,
  Mountain,
  Landmark,
  PawPrint,
  Backpack,
  Globe,
  Heart,
  Users,
  Calendar,
  Plane,
  Building2,
  Map,
  ShieldCheck,
  Sparkles,
  Star,
  CheckCircle2,
  Check
} from 'lucide-react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';


const filterOptions = [
  { id: 'beach', label: 'Beach', icon: <Palmtree className="w-4 h-4" />, count: 48 },
  { id: 'mountains', label: 'Mountains', icon: <Mountain className="w-4 h-4" />, count: 32 },
  { id: 'heritage', label: 'Heritage', icon: <Landmark className="w-4 h-4" />, count: 26 },
  { id: 'wildlife', label: 'Wildlife', icon: <PawPrint className="w-4 h-4" />, count: 18 },
  { id: 'adventure', label: 'Adventure', icon: <Backpack className="w-4 h-4" />, count: 22 },
  { id: 'international', label: 'International', icon: <Globe className="w-4 h-4" />, count: 64 },
];

const travellerCategories = [
  {
    id: 1,
    icon: <Heart className="w-5 h-5 stroke-[1.8]" />,
    title: 'Honeymoon Specials',
    subtitle: 'Romantic escapes for couples',
    tags: ['Maldives', 'Bali', 'Kerala', 'Paris'],
    packageCount: '35 packages ›',
  },
  {
    id: 2,
    icon: <Users className="w-5 h-5 stroke-[1.8]" />,
    title: 'Family Holidays',
    subtitle: 'Fun for every family member',
    tags: ['Goa', 'Singapore', 'Thailand', 'Rajasthan'],
    packageCount: '48 packages ›',
  },
  {
    id: 3,
    icon: <Backpack className="w-5 h-5 stroke-[1.8]" />,
    title: 'Solo Traveller',
    subtitle: 'Freedom to explore at your pace',
    tags: ['Ladakh', 'Spiti', 'Bali', 'Vietnam'],
    packageCount: '22 packages ›',
  },
  {
    id: 4,
    icon: <Calendar className="w-5 h-5 stroke-[1.8]" />,
    title: 'Weekend Getaways',
    subtitle: 'Short escapes 2-4 nights from major cities',
    tags: ['Coorg', 'Shimla', 'Pondicherry', 'Munnar'],
    packageCount: '60 packages ›',
  },
];

const featuredHolidaysData = [
  {
    id: 1,
    destination: 'Maldives',
    tagline: 'Private Island Bliss',
    rating: '4.9',
    inclusions: ['Water Villa', 'Flights', 'All Meals', 'Snorkeling'],
    price: '₹89,999',
    duration: '4N/5D',
    badge: 'Luxury',
    image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=80',
    category: 'beach'
  },
  {
    id: 2,
    destination: 'Kashmir',
    tagline: 'Paradise on Earth',
    rating: '4.8',
    inclusions: ['Houseboat', 'Shikara', 'Sightseeing', 'Breakfast'],
    price: '₹24,999',
    duration: '5N/6D',
    badge: 'Trending',
    image: 'https://images.unsplash.com/photo-1566837945700-30057527ade0?w=800&q=80',
    category: 'mountains'
  },
  {
    id: 3,
    destination: 'Coorg',
    tagline: 'Scotland of India',
    rating: '4.6',
    inclusions: ['Resort', 'Plantation Tour', 'Breakfast', 'Transport'],
    price: '₹12,999',
    duration: '3N/4D',
    badge: 'Weekend',
    image: 'https://images.unsplash.com/photo-1596178060671-7a80dc8059ea?w=800&q=80',
    category: 'mountains'
  },
  {
    id: 4,
    destination: 'Andaman',
    tagline: 'Crystal Clear Waters',
    rating: '4.7',
    inclusions: ['Resort', 'Flights', 'Island Hopping', 'Snorkeling'],
    price: '₹32,999',
    duration: '5N/6D',
    badge: 'Popular',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80',
    category: 'beach'
  },
  {
    id: 5,
    destination: 'Switzerland',
    tagline: 'Alps & Chocolate',
    rating: '4.8',
    inclusions: ['4-star Hotels', 'Flights', 'Rail Pass', 'Visa'],
    price: '₹155,999',
    duration: '7N/8D',
    badge: 'International',
    image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=800&q=80',
    category: 'international'
  },
  {
    id: 6,
    destination: 'Rajasthan',
    tagline: 'Royal Colours',
    rating: '4.7',
    inclusions: ['Heritage Hotels', 'AC Transport', 'Breakfast', 'Guide'],
    price: '₹18,999',
    duration: '6N/7D',
    badge: 'Heritage',
    image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&q=80',
    category: 'heritage'
  },
];

const includedItems = [
  {
    icon: <Plane className="w-7 h-7 stroke-[1.6]" />,
    title: 'Return Flights',
    description: 'Round-trip from your nearest city',
  },
  {
    icon: <Building2 className="w-7 h-7 stroke-[1.6]" />,
    title: 'Hotel Stays',
    description: 'Hand-picked, rated, verified hotels',
  },
  {
    icon: <Map className="w-7 h-7 stroke-[1.6]" />,
    title: 'Sightseeing',
    description: 'All major attractions covered',
  },
  {
    icon: <ShieldCheck className="w-7 h-7 stroke-[1.6]" />,
    title: 'Travel Insurance',
    description: 'Covered for trip cancellation & medical',
  },
];

const Holidays = () => {
  const [activeFilter, setActiveFilter] = useState(null);
  const [wishlist, setWishlist] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    destination: '',
    departureDate: '',
    travellers: '',
    notes: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const toggleWishlist = (id) => {
    setWishlist((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleFilterClick = (filterId) => {
    if (activeFilter === filterId) {
      setActiveFilter(null);
    } else {
      setActiveFilter(filterId);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Please enter your full name';
    if (!formData.phone.trim()) errors.phone = 'Please enter phone or WhatsApp number';
    if (!formData.email.trim()) {
      errors.email = 'Please enter your email address';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    if (!formData.destination.trim()) errors.destination = 'Please specify where you want to go';
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
    } else {
      setIsSubmitted(true);
      setFormErrors({});
    }
  };

  const displayedHolidays = activeFilter
    ? featuredHolidaysData.filter((h) => h.category === activeFilter)
    : featuredHolidaysData;

  return (
    <div className="font-quicksand flex flex-col min-h-screen bg-white text-gray-800">
      {/* 1. Top Utility Bar */}
      <Navbar />

      {/* 2. Main Navbar */}
      

      <main className="flex-grow">
        {/* 3. Hero Banner Section */}
        <section className="max-w-[1400px] mx-auto px-4 lg:px-8 pt-4 md:pt-6 pb-6 md:pb-8">
          <div className="relative rounded-2xl md:rounded-3xl overflow-hidden shadow-lg bg-gray-950 min-h-[360px] md:min-h-[400px] lg:min-h-[420px] flex flex-col justify-between p-6 md:p-8 lg:p-10 border border-gray-100">
            {/* Background Tropical Beach Photo */}
            <img
              src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&q=80"
              alt="Tropical Beach Island"
              className="absolute inset-0 w-full h-full object-cover object-center transform scale-105 transition-transform duration-1000"
            />
            
            {/* Red-to-Transparent Overlay on LEFT half */}
            <div 
              className="absolute inset-0 bg-gradient-to-r from-[#E8442D] via-[#E8442D]/95 to-transparent md:w-[72%] z-10"
            />
            {/* Dark bottom gradient overlay for mobile readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-[#E8442D]/80 to-transparent md:hidden z-10" />

            {/* Top & Center Hero Content */}
            <div className="relative z-20 max-w-2xl my-auto py-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-[11px] font-medium tracking-wider uppercase mb-3 border border-white/30 shadow-xs font-jetbrains">
                <Sparkles size={14} className="text-amber-300 shrink-0" />
                <span>CURATED HOLIDAY EXPERIENCES</span>
              </div>
              <h1 className="text-white font-semibold text-[26px] sm:text-[30px] lg:text-[32px] tracking-tight mb-2.5 leading-tight">
                Discover Your Perfect Holiday
              </h1>
              <p className="text-white/90 text-xs sm:text-[13px] font-normal leading-relaxed mb-4 max-w-xl">
                From mountain retreats to beachside villas — handcrafted holiday packages for every kind of traveller.
              </p>
            </div>

            {/* Row of 6 Pill-shaped Filter Buttons */}
            <div className="relative z-20 mt-auto pt-4 flex flex-wrap gap-2 items-center">
              {filterOptions.map((filter) => {
                const isSelected = activeFilter === filter.id;
                return (
                  <button
                    key={filter.id}
                    onClick={() => handleFilterClick(filter.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 sm:px-3.5 sm:py-1 rounded-full text-xs sm:text-[13px] font-normal transition-all duration-200 cursor-pointer border ${
                      isSelected
                        ? 'bg-white text-[#E8442D] border-white shadow-sm scale-102 font-medium'
                        : 'bg-black/45 hover:bg-black/65 text-white border-white/20 backdrop-blur-md'
                    }`}
                  >
                    <span className="flex items-center justify-center leading-none">{filter.icon}</span>
                    <span>{filter.label}</span>
                    <span className={`text-[11px] font-medium ${isSelected ? 'text-[#E8442D]/80' : 'text-white/70'}`}>
                      ({filter.count})
                    </span>
                  </button>
                );
              })}
              {activeFilter && (
                <button
                  onClick={() => setActiveFilter(null)}
                  className="text-xs text-white/90 underline ml-2 font-semibold hover:text-white cursor-pointer"
                >
                  Clear filter
                </button>
              )}
            </div>
          </div>
        </section>

        {/* 4. "Holidays for Every Traveller" Section */}
        <section className="py-6 md:py-8 px-4 lg:px-8 max-w-[1400px] mx-auto">
          <h2 className="text-[20px] md:text-[22px] font-semibold text-[#1F2937] mb-5 tracking-tight">
            Holidays for Every Traveller
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {travellerCategories.map((cat) => (
              <div
                key={cat.id}
                className="bg-white border border-gray-200/80 rounded-xl p-4 md:p-4.5 shadow-xs hover:shadow-md hover:border-gray-300 transition-all duration-300 flex flex-col justify-between group hover:-translate-y-0.5"
              >
                <div>
                  <div className="w-10 h-10 rounded-full bg-[#fceded] text-[#E8442D] flex items-center justify-center mb-3 shadow-inner group-hover:scale-110 transition-transform">
                    {cat.icon}
                  </div>
                  <h3 className="text-[15px] font-medium text-[#1F2937] mb-1">{cat.title}</h3>
                  <p className="text-[12px] font-normal text-gray-500 mb-3 leading-normal">
                    {cat.subtitle}
                  </p>
                  <div className="flex flex-wrap gap-1 mb-3.5">
                    {cat.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 bg-[#F8F8F8] text-gray-600 rounded text-[11px] font-normal border border-gray-100"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mt-auto pt-2.5 border-t border-gray-100 flex items-center justify-between font-medium text-[#E8442D] group-hover:text-red-700 transition-colors text-xs cursor-pointer">
                  <span>{cat.packageCount}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 5. "Featured Holidays" Section */}
        <section id="featured" className="py-6 md:py-8 px-4 lg:px-8 max-w-[1400px] mx-auto">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-[20px] md:text-[22px] font-semibold text-[#1F2937] tracking-tight">
              Featured Holidays
            </h2>
            <a
              href="#featured"
              onClick={(e) => { e.preventDefault(); setActiveFilter(null); }}
              className="text-gray-500 hover:text-[#E8442D] font-medium text-xs sm:text-[13px] transition-colors no-underline flex items-center gap-1"
            >
              <span>View All ›</span>
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {displayedHolidays.map((holiday) => {
              const isWishlisted = wishlist[holiday.id];
              return (
                <div
                  key={holiday.id}
                  className="bg-white border border-gray-200/80 rounded-xl overflow-hidden shadow-xs hover:shadow-md hover:border-gray-300 transition-all duration-300 flex flex-col justify-between group hover:-translate-y-0.5"
                >
                  {/* Top Image Box */}
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-gray-100">
                    <img
                      src={holiday.image}
                      alt={holiday.destination}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />

                    {/* Top-left Badge Label */}
                    <div className="absolute top-2.5 left-2.5 bg-black/65 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full z-10 uppercase tracking-wide border border-white/10 shadow-xs">
                      {holiday.badge}
                    </div>

                    {/* Top-right Wishlist Heart Button */}
                    <button
                      onClick={() => toggleWishlist(holiday.id)}
                      className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-xs transition-all z-10 cursor-pointer active:scale-90"
                      aria-label="Save to Wishlist"
                    >
                      <Heart size={16} className={isWishlisted ? "fill-[#E8442D] text-[#E8442D]" : "text-gray-400 hover:text-[#E8442D]"} />
                    </button>

                    {/* Bottom-right Duration Badge */}
                    <div className="absolute bottom-2.5 right-2.5 bg-[#E8442D] text-white text-[11px] font-medium px-2 py-0.5 rounded-full shadow-xs z-10">
                      {holiday.duration}
                    </div>
                  </div>

                  {/* Card Content Below Image */}
                  <div className="p-4 flex flex-col flex-grow">
                    <div className="flex items-start justify-between gap-2 mb-0.5">
                      <h3 className="text-[15px] sm:text-[16px] font-medium text-[#1F2937] tracking-tight">
                        {holiday.destination}
                      </h3>
                    </div>
                    <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-2">
                      {holiday.tagline}
                    </p>

                    {/* Star Rating Row */}
                    <div className="flex items-center gap-1 mb-2.5">
                      <div className="flex items-center gap-0.5 text-amber-400">
                        <Star size={13} className="fill-amber-400 text-amber-400" />
                        <Star size={13} className="fill-amber-400 text-amber-400" />
                        <Star size={13} className="fill-amber-400 text-amber-400" />
                        <Star size={13} className="fill-amber-400 text-amber-400" />
                        <Star size={13} className="fill-amber-400 text-amber-400" />
                      </div>
                      <span className="text-xs font-normal text-gray-700">{holiday.rating}</span>
                    </div>

                    {/* Inclusions Row */}
                    <div className="flex flex-wrap gap-1 mb-3.5 flex-grow">
                      {holiday.inclusions.map((item) => (
                        <span
                          key={item}
                          className="px-2 py-0.5 bg-[#F8F8F8] text-gray-600 rounded text-[11px] font-normal border border-gray-100"
                        >
                          {item}
                        </span>
                      ))}
                    </div>

                    {/* Price & Action Row */}
                    <div className="flex items-center justify-between pt-2.5 border-t border-gray-100 mt-auto">
                      <div>
                        <span className="text-[18px] sm:text-[20px] font-bold text-[#1F2937] leading-none block font-jetbrains">
                          {holiday.price}
                        </span>
                        <span className="text-[11px] font-normal text-gray-400 block mt-0.5">
                          per person · all-inclusive
                        </span>
                      </div>
                      <button className="bg-[#E8442D] hover:bg-red-600 text-white font-medium px-3.5 py-1.5 rounded-lg text-xs sm:text-[13px] transition-all shadow-xs hover:shadow-sm cursor-pointer active:scale-95">
                        View Deal
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 6. "Everything You Need, Included" Section */}
        <section className="bg-[#F8F8F8]/70 py-10 md:py-12 border-y border-gray-100 mt-4">
          <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
            <h2 className="text-[20px] md:text-[22px] font-bold text-center text-[#1F2937] mb-8 tracking-tight font-satoshi">
              Everything You Need, Included
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {includedItems.map((item, idx) => (
                <div key={idx} className="flex flex-col items-center text-center p-3">
                  <div className="w-14 h-14 rounded-full bg-[#fceded] text-[#E8442D] flex items-center justify-center mb-4 shadow-xs">
                    {item.icon}
                  </div>
                  <h3 className="text-[15px] font-medium text-[#1F2937] mb-1.5">{item.title}</h3>
                  <p className="text-[12px] sm:text-[13px] text-gray-500 leading-relaxed font-normal max-w-xs">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 7. "Plan Your Dream Holiday" Form Section */}
        <section className="py-8 md:py-12 px-4 lg:px-8 max-w-[1400px] mx-auto">
          <div className="bg-white border border-gray-200/90 hover:border-[#E8442D]/60 rounded-2xl md:rounded-3xl p-6 md:p-8 lg:p-10 shadow-sm hover:shadow-md transition-all duration-500 relative overflow-hidden group">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#E8442D] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="max-w-3xl mb-6 relative z-10">
              <h2 className="text-[20px] md:text-[24px] font-bold text-[#1F2937] mb-1.5 tracking-tight font-satoshi">
                Plan Your Dream Holiday
              </h2>
              <p className="text-gray-500 font-normal text-xs sm:text-[13px] leading-relaxed">
                Tell us where you want to go and our travel expert will get back within 2 hours with a custom itinerary.
              </p>
            </div>

            {isSubmitted ? (
              <div className="bg-green-50/80 border border-green-200 rounded-xl p-6 text-center max-w-xl mx-auto my-6">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3 font-bold">
                  <CheckCircle2 size={26} className="text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-[#1F2937] mb-1">Quote Request Received!</h3>
                <p className="text-gray-600 text-xs sm:text-[13px] font-normal mb-5">
                  Thank you, <span className="font-semibold text-[#1F2937]">{formData.name}</span>. Our travel expert will review your requirement for <span className="font-semibold text-[#E8442D]">{formData.destination || 'your destination'}</span> and contact you within 2 hours.
                </p>
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setFormData({
                      name: '',
                      phone: '',
                      email: '',
                      destination: '',
                      departureDate: '',
                      travellers: '',
                      notes: '',
                    });
                  }}
                  className="bg-gray-900 text-white px-5 py-2 rounded-lg text-xs font-medium hover:bg-gray-800 transition-colors cursor-pointer"
                >
                  Submit Another Request
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Row 1 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div>
                    <label className="block text-[11px] font-medium text-gray-600 uppercase tracking-wider mb-1.5">
                      Your Name <span className="text-[#E8442D]">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Full name"
                      className={`w-full px-3.5 py-2.5 rounded-lg border ${formErrors.name ? 'border-red-500 bg-red-50/50' : 'border-gray-200'} focus:border-[#E8442D] focus:outline-none focus:ring-2 focus:ring-[#E8442D]/20 text-xs sm:text-[13px] font-normal transition-all`}
                    />
                    {formErrors.name && <p className="text-red-500 text-[11px] font-medium mt-1">{formErrors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-gray-600 uppercase tracking-wider mb-1.5">
                      Phone / WhatsApp <span className="text-[#E8442D]">*</span>
                    </label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+91 98XXXXXXXX"
                      className={`w-full px-3.5 py-2.5 rounded-lg border ${formErrors.phone ? 'border-red-500 bg-red-50/50' : 'border-gray-200'} focus:border-[#E8442D] focus:outline-none focus:ring-2 focus:ring-[#E8442D]/20 text-xs sm:text-[13px] font-normal transition-all`}
                    />
                    {formErrors.phone && <p className="text-red-500 text-[11px] font-medium mt-1">{formErrors.phone}</p>}
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-gray-600 uppercase tracking-wider mb-1.5">
                      Email Address <span className="text-[#E8442D]">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="you@email.com"
                      className={`w-full px-3.5 py-2.5 rounded-lg border ${formErrors.email ? 'border-red-500 bg-red-50/50' : 'border-gray-200'} focus:border-[#E8442D] focus:outline-none focus:ring-2 focus:ring-[#E8442D]/20 text-xs sm:text-[13px] font-normal transition-all`}
                    />
                    {formErrors.email && <p className="text-red-500 text-[11px] font-medium mt-1">{formErrors.email}</p>}
                  </div>
                </div>

                {/* Row 2 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div>
                    <label className="block text-[11px] font-medium text-gray-600 uppercase tracking-wider mb-1.5">
                      Destination <span className="text-[#E8442D]">*</span>
                    </label>
                    <input
                      type="text"
                      name="destination"
                      value={formData.destination}
                      onChange={handleInputChange}
                      placeholder="Where do you want to go?"
                      className={`w-full px-3.5 py-2.5 rounded-lg border ${formErrors.destination ? 'border-red-500 bg-red-50/50' : 'border-gray-200'} focus:border-[#E8442D] focus:outline-none focus:ring-2 focus:ring-[#E8442D]/20 text-xs sm:text-[13px] font-normal transition-all`}
                    />
                    {formErrors.destination && <p className="text-red-500 text-[11px] font-medium mt-1">{formErrors.destination}</p>}
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-gray-600 uppercase tracking-wider mb-1.5">
                      Departure Date
                    </label>
                    <input
                      type="text"
                      name="departureDate"
                      value={formData.departureDate}
                      onChange={handleInputChange}
                      placeholder="Month & Year"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 focus:border-[#E8442D] focus:outline-none focus:ring-2 focus:ring-[#E8442D]/20 text-xs sm:text-[13px] font-normal transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-gray-600 uppercase tracking-wider mb-1.5">
                      No. of Travellers
                    </label>
                    <input
                      type="text"
                      name="travellers"
                      value={formData.travellers}
                      onChange={handleInputChange}
                      placeholder="e.g. 2 Adults, 1 Child"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 focus:border-[#E8442D] focus:outline-none focus:ring-2 focus:ring-[#E8442D]/20 text-xs sm:text-[13px] font-normal transition-all"
                    />
                  </div>
                </div>

                {/* Row 3 (full width) */}
                <div>
                  <label className="block text-[11px] font-medium text-gray-600 uppercase tracking-wider mb-1.5">
                    Special Requirements / Notes
                  </label>
                  <textarea
                    rows="3"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Any specific requests, dietary needs, accessibility requirements..."
                    className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 focus:border-[#E8442D] focus:outline-none focus:ring-2 focus:ring-[#E8442D]/20 text-xs sm:text-[13px] font-normal transition-all resize-y"
                  ></textarea>
                </div>

                {/* Submit Button & Trust Line */}
                <div className="pt-2 flex flex-col items-center sm:items-start">
                  <button
                    type="submit"
                    className="bg-[#E8442D] hover:bg-red-600 text-white font-medium text-[13px] sm:text-sm px-6 py-2.5 rounded-lg shadow-sm hover:shadow transition-all cursor-pointer active:scale-95"
                  >
                    Get Free Quote
                  </button>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 md:gap-5 mt-3.5 text-[11px] font-normal text-gray-500">
                    <span className="flex items-center gap-1"><Check size={13} className="text-[#E8442D]" /> No spam</span>
                    <span>·</span>
                    <span className="flex items-center gap-1"><Check size={13} className="text-[#E8442D]" /> Response within 2 hours</span>
                    <span>·</span>
                    <span className="flex items-center gap-1"><Check size={13} className="text-[#E8442D]" /> 100% free consultation</span>
                  </div>
                </div>
              </form>
            )}
          </div>
        </section>
      </main>

      {/* 9. Footer Section */}
      <Footer />
    </div>
  );
};

export default Holidays;

