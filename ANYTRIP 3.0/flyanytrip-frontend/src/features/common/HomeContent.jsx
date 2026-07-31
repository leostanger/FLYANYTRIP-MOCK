/*
 * Flyanytrip
 * Authors: Gaurav Thakur, Milan Pandavadara
 *
 * The "below the fold" content shown on the home page.
 * Contains informational sections:
 * 1. Trending Destinations — visual grid of popular countries
 * 2. Popular Activities    — curated activity cards with photographs
 * 3. Testimonials          — customer review cards
 * 4. Stats Bar              — key performance metrics (Happy Customers, etc.)
 * 5. Happy Customers       — detailed company features with images
 * 6. Partners Slider       — infinite auto-scrolling airline logo strip
 */

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRightLeft, Search } from 'lucide-react';
import HappyCustomers from './HappyCustomers';

const STATIC_CONTENT = {
  flights: {
    destTitle: "Popular Flight Routes",
    destSub: "Top picks for your next professional escape",
    destinations: [
      { city: 'London', iata: 'LHR', name: 'Heathrow Airport', price: '48,000', img: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=800&auto=format&fit=crop' },
      { city: 'Dubai', iata: 'DXB', name: 'Dubai International Airport', price: '22,500', img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=800&auto=format&fit=crop' },
      { city: 'Singapore', iata: 'SIN', name: 'Changi Airport', price: '18,000', img: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?q=80&w=800&auto=format&fit=crop' },
      { city: 'New York', iata: 'JFK', name: 'John F. Kennedy Intl', price: '75,900', img: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=800&auto=format&fit=crop' }
    ],
    actTitle: "Popular Airlines",
    actSub: "Fly with the best carriers in the world",
    activities: [
      { name: 'Air India', city: 'New Delhi', price: '5,500', tag: 'Heritage', img: '/assets/air-lines/air-india.jpg' },
      { name: 'IndiGo', city: 'Bengaluru', price: '4,200', tag: 'Efficient', img: '/assets/air-lines/indigo.jpg' },
      { name: 'Vistara', city: 'Mumbai', price: '4,800', tag: 'Premium', img: '/assets/air-lines/vistara.jpg' },
      { name: 'Akasa Air', city: 'Ahmedabad', price: '3,500', tag: 'Modern', img: '/assets/air-lines/akasa.jpg' }
    ]
  },
  hotels: {
    destTitle: "Top Hotel Destinations",
    destSub: "Stay in luxury across the globe",
    destinations: [
      { name: 'Maldives', price: '120,000', img: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=800&auto=format&fit=crop' },
      { name: 'Paris', price: '45,500', img: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?q=80&w=800&auto=format&fit=crop' },
      { name: 'Swiss Alps', price: '85,000', img: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?q=80&w=800&auto=format&fit=crop' },
      { name: 'Bali Villas', price: '28,900', img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=800&auto=format&fit=crop' },
      { name: 'Santorini', price: '92,000', img: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=800&auto=format&fit=crop' }
    ],
    actTitle: "Featured Properties",
    actSub: "Handpicked premium hotels just for you",
    activities: [
      { name: 'Burj Al Arab', city: 'Dubai', price: '145,000', tag: '7-Star', img: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=800&auto=format&fit=crop' },
      { name: 'Marina Bay Sands', city: 'Singapore', price: '58,000', tag: 'Iconic', img: 'https://images.unsplash.com/photo-1561501900-3701fa6a0864?q=80&w=800&auto=format&fit=crop' },
      { name: 'The Ritz', city: 'London', price: '72,000', tag: 'Heritage', img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800&auto=format&fit=crop' },
      { name: 'Taj Mahal Palace', city: 'Mumbai', price: '25,000', tag: 'Royal', img: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=800&auto=format&fit=crop' }
    ]
  },
  tours: {
    destTitle: "Trending Tour Packages",
    destSub: "Curated itineraries for unforgettable trips",
    destinations: [
      { name: 'Vietnam Explorer', price: '48,000', img: '/assets/destinations/vietnam.png' },
      { name: 'Bali Retreat', price: '42,500', img: '/assets/destinations/bali.png' },
      { name: 'Oman Desert', price: '85,000', img: '/assets/destinations/oman.png' },
      { name: 'Thailand Escape', price: '38,900', img: '/assets/destinations/thailand.png' },
      { name: 'Singapore F1', price: '52,000', img: '/assets/destinations/singapore.png' }
    ],
    actTitle: "Popular Activities",
    actSub: "Curated experiences for every global professional",
    activities: [
      { name: 'Heritage Walk', city: 'Vadodara', price: '1,200', tag: 'Cultural', img: '/assets/activities/vadodara.png' },
      { name: 'Desert Safari', city: 'Dubai', price: '4,500', tag: 'Adventure', img: '/assets/activities/dubai.png' },
      { name: 'Island Hopping', city: 'Thailand', price: '3,800', tag: 'Leisure', img: '/assets/activities/island_hopping.png' },
      { name: 'Skydeck Views', city: 'Singapore', price: '2,900', tag: 'Must Visit', img: '/assets/activities/skydeck.png' }
    ]
  }
};

/**
 * Renders all home page content sections below the hero search card.
 * Orchestrates the informational sections and the partnership slider.
 *
 * @param activeTab - the currently active tab context (flights, hotels, tours)
 * @param results   - search results from the last query
 * @param searching - whether a search is currently in progress
 * @returns {JSX.Element} The rendered content blocks.
 */
const HomeContent = ({ activeTab, results, searching, setTo, setActiveTab }) => {
  const currentTab = STATIC_CONTENT[activeTab] || STATIC_CONTENT.flights;

  const handleDestinationClick = (dest) => {
    if (activeTab !== 'flights') {
      setActiveTab('flights');
    }

    // Set the TO airport
    setTo({
      city: dest.city,
      iata: dest.iata,
      name: dest.name
    });

    // Smooth scroll to search card
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
  };

  return (
    <>
      <section key={activeTab} className="py-24 max-w-[1200px] mx-auto px-6">
        <motion.div
          key={`dest-header-${activeTab}`}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="mb-16 text-center"
        >
          <motion.div variants={itemVariants} className="inline-block mb-4 px-4 py-1.5 rounded-full bg-brand-red/5 border border-brand-red/10">
            <span className="text-brand-red text-xs font-bold uppercase tracking-[0.2em]">Explore the world</span>
          </motion.div>
          <motion.h2 variants={itemVariants} className="text-5xl font-black text-brand-black mb-4 tracking-tight">{currentTab.destTitle}</motion.h2>
          <motion.p variants={itemVariants} className="text-brand-black/50 text-xl font-medium max-w-2xl mx-auto">{currentTab.destSub}</motion.p>
        </motion.div>

        <motion.div
          key={`dest-grid-${activeTab}`}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {currentTab.destinations.slice(0, 4).map((dest, idx) => (
            <motion.div
              key={dest.city || dest.name || idx}
              variants={itemVariants}
              whileHover={{ y: -10 }}
              onClick={() => handleDestinationClick(dest)}
              className="relative h-[320px] rounded-[32px] overflow-hidden group cursor-pointer shadow-xl hover:shadow-2xl transition-all duration-500"
            >
              <img
                src={dest.img}
                alt={dest.city || dest.name || 'Destination'}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x400/f8f9fa/a8a29e?text=Image+Unavailable'; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-500" />
              <div className="absolute bottom-0 left-0 p-8 w-full transition-transform duration-500 group-hover:-translate-y-1">
                <div className="flex flex-col gap-1">
                  <span className="text-white/60 text-[10px] font-black uppercase tracking-[0.3em]">
                    {activeTab === 'hotels' ? 'Top Destination' : activeTab === 'tours' ? 'Tour Package' : 'Popular Route'}
                  </span>
                  <h3 className="text-3xl font-black text-white mb-2 tracking-tighter">{dest.city || dest.name}</h3>
                </div>
                <div className="flex justify-between items-center overflow-hidden">
                  <div className="flex flex-col">
                    <span className="text-white/40 text-[9px] font-bold uppercase tracking-widest leading-none mb-1">Starting from</span>
                    <span className="text-white text-lg font-black tracking-tight">₹{dest.price}</span>
                  </div>
                  <motion.div
                    initial={{ x: 20, opacity: 0 }}
                    whileHover={{ x: 0, opacity: 1 }}
                    className="bg-brand-red p-3 rounded-2xl text-white shadow-lg shadow-brand-red/30"
                  >
                    <ArrowRightLeft size={16} />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          key={`act-header-${activeTab}`}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="mt-40 mb-16 text-center"
        >
          <motion.div variants={itemVariants} className="inline-block mb-4 px-4 py-1.5 rounded-full bg-brand-red/5 border border-brand-red/10">
            <span className="text-brand-red text-xs font-bold uppercase tracking-[0.2em]">Our Network</span>
          </motion.div>
          <motion.h2 variants={itemVariants} className="text-5xl font-black text-brand-black mb-4 tracking-tight">{currentTab.actTitle}</motion.h2>
          <motion.p variants={itemVariants} className="text-brand-black/50 text-xl font-medium max-w-2xl mx-auto">{currentTab.actSub}</motion.p>
        </motion.div>

        <motion.div
          key={`act-grid-${activeTab}`}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {currentTab.activities.map((act, idx) => (
            <motion.div
              key={act.name || idx}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              className="relative h-[320px] rounded-[40px] overflow-hidden group cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 bg-white border border-black/5"
            >
              <img
                src={act.img}
                alt={act.name || 'Activity'}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x400/f8f9fa/a8a29e?text=Image+Unavailable'; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-black/90 via-transparent to-transparent opacity-70 group-hover:opacity-90 transition-opacity" />
              <div className="absolute top-6 left-6">
                <span className="bg-white/10 backdrop-blur-xl border border-white/20 text-white text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full shadow-2xl">
                  {act.tag}
                </span>
              </div>
              <div className="absolute bottom-0 left-0 p-8 w-full">
                <h3 className="text-2xl font-extrabold text-white mb-1 tracking-tight">{act.name}</h3>
                <div className="flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-white/60 text-xs font-bold uppercase tracking-widest mb-1">{act.city}</span>
                    <span className="text-white text-sm font-bold">From ₹{act.price}</span>
                  </div>

                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Stats Bar */}
      <section className="py-32 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-5 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand-red via-transparent to-transparent blur-3xl scale-150" />
        </div>

        <div className="max-w-[1200px] mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex items-center justify-around rounded-[60px] py-20 px-12 border border-white/60 relative group"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 0.92) 100%)',
              backdropFilter: 'blur(40px) saturate(2)',
              WebkitBackdropFilter: 'blur(40px) saturate(2)',
              boxShadow: '0 40px 100px -20px rgba(0,0,0,0.1), inset 0 2px 4px rgba(255, 255, 255, 0.8)',
            }}
          >
            {[
              { value: '2.5K+', label: 'Happy Customers' },
              { value: '350+', label: 'Airlines' },
              { value: '4.5K+', label: 'Destinations' },
              { value: '24/7', label: 'Support' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="flex flex-col items-center gap-3 flex-1 group/stat relative"
              >
                <span className="text-5xl font-black tracking-tighter text-brand-black transition-all group-hover/stat:scale-110 group-hover/stat:text-brand-red duration-500">
                  {stat.value}
                </span>
                <span className="text-[11px] font-black uppercase tracking-[0.3em] text-brand-black/30 group-hover/stat:text-brand-black transition-all duration-300">
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-32 bg-brand-black relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-brand-red rounded-full blur-[160px]" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-brand-red rounded-full blur-[160px]" />
        </div>

        <div className="max-w-[1200px] mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-block mb-6 px-6 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md"
            >
              <span className="text-white/60 text-[10px] font-black uppercase tracking-[0.5em]">Traveler Stories</span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-5xl font-black text-white mb-4 tracking-tight"
            >
              What Our Travelers Say
            </motion.h2>
          </div>

          <div className="grid grid-cols-3 gap-10">
            {[
              { name: "Ananya Sharma", role: "Software Engineer, Google", text: "FlyAnyTrip made my international work trip completely seamless. From visas to flights, they handled everything with absolute professional precision.", rating: 5 },
              { name: "Rahul Malhotra", role: "CEO, TechSphere", text: "The corporate travel services are unmatched. They understand the value of time and provide a level of service that is truly premium.", rating: 5 },
              { name: "Priya Patel", role: "Travel Enthusiast", text: "I've used many platforms, but the curated tours here are something else. They find those hidden gems that make every trip truly unforgettable.", rating: 4.9 }
            ].map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                whileHover={{ y: -10 }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-[40px] hover:bg-white/[0.08] transition-all duration-500 group relative"
              >
                <div className="absolute -top-6 -right-6 w-20 h-20 bg-brand-red/10 rounded-full blur-2xl group-hover:bg-brand-red/20 transition-all" />
                <div className="text-brand-red mb-8 flex gap-1.5">
                  {[...Array(5)].map((_, idx) => (
                    <span key={idx} className={`text-xl ${idx < Math.floor(t.rating) ? "opacity-100" : "opacity-20"}`}>★</span>
                  ))}
                </div>
                <p className="text-white/90 text-xl leading-relaxed mb-10 font-medium italic">"{t.text}"</p>
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-gradient-to-br from-brand-red to-red-800 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-brand-red/20">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-white font-black text-lg tracking-tight">{t.name}</div>
                    <div className="text-white/40 text-xs font-bold uppercase tracking-widest">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <HappyCustomers />

      {/* Partners Section */}
      <section className="py-32 bg-[#FBFBFB] border-y border-black/5 overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-6 mb-20">
          <div className="flex flex-col items-center text-center gap-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-[11px] font-black uppercase tracking-[0.5em] text-brand-red"
            >
              Alliance Network
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl font-black text-brand-black tracking-tighter"
            >
              PROUD MEMBER OF STAR ALLIANCE
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-brand-black/40 text-sm font-bold leading-relaxed uppercase tracking-[0.2em] max-w-xl"
            >
              Connecting you to the world with 25+ premium carriers across the globe.
            </motion.p>
          </div>
        </div>

        <div className="relative w-full">
          <div className="absolute left-0 top-0 bottom-0 w-60 bg-gradient-to-r from-[#FBFBFB] via-[#FBFBFB]/80 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-60 bg-gradient-to-l from-[#FBFBFB] via-[#FBFBFB]/80 to-transparent z-10 pointer-events-none" />
          <div className="flex overflow-hidden">
            <motion.div
              className="flex gap-10 py-6 whitespace-nowrap"
              animate={{ x: [0, -2800] }}
              transition={{ duration: 50, repeat: Infinity, ease: "linear", repeatType: "loop" }}
            >
              {[
                { name: "AIR INDIA", logo: "/assets/airlines/AI.png" },
                { name: "INDIGO", logo: "/assets/airlines/6E.png" },
                { name: "VISTARA", logo: "/assets/airlines/UK.png" },
                { name: "AKASA AIR", logo: "/assets/airlines/QP.png" },
                { name: "EMIRATES", logo: "/assets/airlines/EK.png" },
                { name: "LUFTHANSA", logo: "/assets/airlines/LH.png" },
                { name: "SINGAPORE AIRLINES", logo: "/assets/airlines/SQ.png" },
                { name: "UNITED", logo: "/assets/airlines/UA.png" },
                { name: "SWISS", logo: "/assets/airlines/LX.png" },
                { name: "THAI AIRWAYS", logo: "/assets/airlines/TG.png" },
                { name: "TURKISH", logo: "/assets/airlines/TK.png" },
                { name: "ANA (STAR ALLIANCE)", logo: "/assets/airlines/NH.png" }
              ].concat([
                { name: "AIR INDIA", logo: "/assets/airlines/AI.png" },
                { name: "INDIGO", logo: "/assets/airlines/6E.png" },
                { name: "VISTARA", logo: "/assets/airlines/UK.png" },
                { name: "AKASA AIR", logo: "/assets/airlines/QP.png" },
                { name: "EMIRATES", logo: "/assets/airlines/EK.png" },
                { name: "LUFTHANSA", logo: "/assets/airlines/LH.png" },
                { name: "SINGAPORE AIRLINES", logo: "/assets/airlines/SQ.png" },
                { name: "UNITED", logo: "/assets/airlines/UA.png" },
                { name: "SWISS", logo: "/assets/airlines/LX.png" },
                { name: "THAI AIRWAYS", logo: "/assets/airlines/TG.png" },
                { name: "TURKISH", logo: "/assets/airlines/TK.png" },
                { name: "ANA (STAR ALLIANCE)", logo: "/assets/airlines/NH.png" }
              ]).map((airline, i) => (
                <div key={i} className="flex items-center gap-6 px-10 py-6 rounded-[32px] border border-black/5 bg-white shadow-sm hover:shadow-2xl hover:border-brand-red/20 transition-all cursor-pointer group grayscale opacity-40 hover:grayscale-0 hover:opacity-100 min-w-[340px]">
                  <img src={airline.logo} alt={airline.name} className="h-12 w-auto object-contain" onError={(e) => { e.target.style.display = 'none'; }} />
                  <span className="text-sm font-black text-brand-black group-hover:text-brand-red transition-colors tracking-tighter uppercase">{airline.name}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomeContent;
