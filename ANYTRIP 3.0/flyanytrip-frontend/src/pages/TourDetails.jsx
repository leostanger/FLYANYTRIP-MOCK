/*
 * Flyanytrip
 * Authors: Gaurav Thakur, Milan Pandavadara
 *
 * Detail page for a specific tour destination.
 * Displays a three-image gallery, tour title with ratings, practical
 * info (hours, address, phone), and a sticky booking card on the side.
 * Uses mock data — the tour ID from the URL is passed in but the data
 * is hardcoded as a placeholder until a real API is connected.
 */

import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Heart, Star, Info, MapPin, Phone, Clock, FileText, ChevronRight
} from 'lucide-react';

/**
 * Displays the full detail view for a single tour.
 * Scrolls to the top on load, then renders a photo gallery,
 * details panel (ratings, tags, info), and a sticky booking card.
 */
const TourDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Always scroll to the top when this page first loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Mock tour data — hardcoded until a real API is wired up
  // The `id` from the URL is stored but the content is the same for now
  const tour = {
    id: id || '1',
    title: 'The Grand Palace',
    localName: 'พระบรมมหาราชวัง',
    rating: '4.4/5',
    tripAdvisorScore: '8.6',
    reviewsCount: '12,887 reviews',
    totalTripAdvisorReviews: '36,062 reviews',
    tags: [
      { text: 'Trip.Best 2026 Global 100 - Night Attractions >', style: 'bg-[#6B4B2F] text-white', icon: true },
      { text: 'Historic landmark', style: 'bg-black/5 text-brand-black/70', outline: true },
      { text: 'Night view', style: 'bg-black/5 text-brand-black/70', outline: true }
    ],
    info: {
      open: '8:30 AM–4:30 PM (Tickets available until 3:30 PM) >',
      additionalOp: ['Dress code', '+ 2 more'],
      sightseeing: '2–3 hours',
      address: 'Phra Borom Maha Ratchawang, Phra Nakhon, Bangkok 10200, Thailand',
      phone: 'Ticket inquiry: +66-2-6235500'
    },
    booking: {
      price: 'INR 1,444.59',
      availability: 'Book now for tomorrow'
    },
    images: [
      '/assets/tours/grand_palace_center.png', // Wide center photo
      '/assets/tours/grand_palace_left.png', // Tall left photo
      '/assets/tours/grand_palace_right.png'  // Tall right photo
    ]
  };

  return (
    <div className="min-h-screen bg-[#f5f7fa] pb-24">
      {/* Top Background Banner - like the blue bar in the photo if it exists, or just breadcrumbs */}
      <div className="bg-[#1e48e8] h-12 w-full absolute top-16 left-0 right-0 z-0"></div>

      <div className="max-w-[1240px] mx-auto pt-6 px-6 relative z-10">
        
        {/* Navigation / Breadcrumbs could go here */}
        
        {/* Image Gallery Grid */}
        <div className="grid grid-cols-4 gap-1 h-[400px] mb-8 rounded-xl overflow-hidden shadow-sm bg-white">
          <div className="col-span-1 h-full">
            <img src={tour.images[1]} alt="Gallery left" className="w-full h-full object-cover hover:opacity-95 transition-opacity cursor-pointer" onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x800/f8f9fa/a8a29e?text=Image+Unavailable'; }} />
          </div>
          <div className="col-span-2 h-full">
            <img src={tour.images[0]} alt="Gallery main" className="w-full h-full object-cover hover:opacity-95 transition-opacity cursor-pointer" onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/1600x1200/f8f9fa/a8a29e?text=Image+Unavailable'; }} />
          </div>
          <div className="col-span-1 h-full relative group">
            <img src={tour.images[2]} alt="Gallery right" className="w-full h-full object-cover hover:opacity-95 transition-opacity cursor-pointer" onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x800/f8f9fa/a8a29e?text=Image+Unavailable'; }} />
            <button className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm text-white text-sm font-semibold px-4 py-2 rounded-lg flex items-center gap-1 hover:bg-black/80 transition-colors">
              See more <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Main Content Split */}
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* Core Details (Left Column) */}
          <div className="flex-1 bg-white rounded-xl shadow-sm border border-black/5 p-8 relative">
            <button className="absolute top-8 right-8 w-10 h-10 rounded-full border border-black/10 flex items-center justify-center text-brand-black hover:bg-black/5 transition-colors">
              <Heart size={20} />
            </button>

            {/* Header */}
            <div className="mb-4">
              <h1 className="text-[32px] font-extrabold text-[#111] leading-tight flex items-baseline gap-3">
                {tour.title}
                <span className="text-xl font-normal text-brand-black/50">{tour.localName}</span>
              </h1>
            </div>

            {/* Ratings row */}
            <div className="flex items-center gap-4 mb-6 text-sm">
              <div className="flex items-center gap-1 text-[#e63946] font-extrabold text-base">
                <span className="bg-[#e63946]/10 px-1 rounded">🔥</span> {tour.tripAdvisorScore}
              </div>
              <Info size={16} className="text-gray-400" />
              <div className="flex items-center gap-1">
                <span className="bg-[#1e48e8] text-white font-bold px-2 py-0.5 rounded text-xs">{tour.rating}</span>
                <span className="text-[#1e48e8] hover:underline cursor-pointer font-medium ml-1">
                  {tour.reviewsCount} <ChevronRight size={14} className="inline-block -ml-1" />
                </span>
              </div>
              <div className="flex items-center gap-2 border-l border-gray-200 pl-4">
                <div className="flex text-[#00a680]">
                  {'⚪⚪⚪⚪⚪'.split('').map((c, i) => <span key={i} className="text-[12px]">🟢</span>)}
                </div>
                <span className="text-[#1e48e8] hover:underline cursor-pointer font-medium">
                  based on {tour.totalTripAdvisorReviews} <ChevronRight size={14} className="inline-block -ml-1" />
                </span>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-8">
              {tour.tags.map((tag, idx) => (
                <span key={idx} className={`px-3 py-1.5 rounded-sm text-[12px] font-bold tracking-wide flex items-center gap-1 ${tag.style}`}>
                  {tag.icon && <Star size={12} className="fill-current text-yellow-500" />}
                  {tag.text}
                </span>
              ))}
            </div>

            <hr className="border-gray-100 mb-6" />

            {/* Practical Info List */}
            <div className="flex flex-col gap-4 text-[15px] text-[#222]">
              
              <div className="flex items-start gap-3">
                <Clock size={20} className="text-[#0f294d] mt-0.5" />
                <div>
                  <div className="font-semibold flex items-center gap-1 text-[#0f294d]">
                    Open <span className="font-normal">{tour.info.open}</span>
                  </div>
                  <div className="mt-1 flex gap-2">
                    {tour.info.additionalOp.map((op, i) => (
                      <span key={i} className="text-[12px] bg-gray-100/80 px-2 py-0.5 border border-gray-200 rounded text-gray-600">{op}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 mt-2">
                <Info size={20} className="text-[#0f294d]" />
                <div>
                  <span className="font-semibold text-[#0f294d]">Recommended sightseeing time: </span>
                  {tour.info.sightseeing}
                </div>
              </div>

              <div className="flex items-start gap-3 mt-2">
                <MapPin size={20} className="text-[#0f294d]" />
                <div>
                  <span className="font-semibold text-[#0f294d]">Address: </span>
                  {tour.info.address}
                  <button className="text-[#1e48e8] ml-2 font-medium hover:underline">Map</button>
                </div>
              </div>

              <div className="flex items-start gap-3 mt-2">
                <Phone size={20} className="text-[#0f294d]" />
                <div>
                  <span className="font-semibold text-[#0f294d]">Phone: </span>
                  {tour.info.phone}
                </div>
              </div>

            </div>
          </div>

          {/* Sticky Booking Card (Right Column) */}
          <div className="w-full lg:w-[340px] shrink-0">
            <div className="bg-white rounded-xl shadow-md border border-black/5 overflow-hidden sticky top-24">
              <div className="h-1 bg-[#1e48e8] w-full"></div>
              <div className="p-6 pb-8">
                <div className="text-xl font-extrabold text-[#111] mb-1">
                  From {tour.booking.price}
                </div>
                <div className="text-[13px] text-gray-500 font-medium mb-6 flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-[#1e48e8]"></span> {tour.booking.availability}
                </div>
                
                <button className="w-full bg-[#1e48e8] text-white font-bold text-[16px] py-3.5 rounded-lg transition-transform active:scale-[0.98] hover:bg-blue-700 shadow-sm shadow-blue-500/20">
                  Book now
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TourDetails;
