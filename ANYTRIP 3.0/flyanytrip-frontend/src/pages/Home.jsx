/*
 * Flyanytrip
 * Authors: Gaurav Thakur, Milan Pandavadara
 *
 * The main landing page of the app. Renders the Hero section with
 * the tabbed search card (flights, tours, visa, etc.), a feature
 * highlights strip, and the HomeContent sections below the fold.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Plane, Compass, FileText, Building2,
  ShieldCheck, Headphones, Globe2
} from 'lucide-react';
import { useSearchContext } from '../context/SearchContext';
import Hero from '../layouts/Hero';
import FlightSearch from '../features/flights/FlightSearch';
import TourSearch from '../features/tours/TourSearch';
import VisaSearch from '../features/visa/VisaSearch';
import HotelSearch from '../features/hotels/HotelSearch';
import HomeContent from '../features/common/HomeContent';

// Each tab entry defines its ID, display label, icon, and which search component to render
const tabs = [
  { id: 'flights', label: 'Flights', icon: Plane, Component: FlightSearch },
  { id: 'hotels', label: 'Hotels', icon: Building2, Component: HotelSearch },
  { id: 'tours', label: 'Packages', icon: Compass, Component: TourSearch },
  { id: 'visa', label: 'Visa', icon: FileText, Component: VisaSearch },
];

// Trust signals displayed in the strip between the hero and the main content
const features = [
  { icon: ShieldCheck, title: 'Transparent Pricing', text: 'No hidden fees or charges' },
  { icon: Headphones, title: '24/7 Expert Support', text: 'Always here for you' },
  { icon: Globe2, title: 'Global Network', text: 'Partners in 150+ countries' }
];

/**
 * Home page component. Renders the hero section with the full search card,
 * the feature trust strip, and the HomeContent sections below.
 */
const Home = () => {
  const searchState = useSearchContext();
  const { activeTab, setActiveTab, results, searching, searchError, setSearchError } = searchState;
  const navigate = useNavigate();
  
  const ActiveComponent = tabs.find(t => t.id === activeTab)?.Component;

  return (
    <>
      <Hero>
        <motion.section 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-[1200px] mx-auto z-50 px-6 lg:px-0 -mb-32 relative"
        >
          <div className="glass-card rounded-[32px] shadow-[0_32px_80px_-16px_rgba(0,0,0,0.3)]">
            <div id="search-tabs" className="flex items-center justify-center bg-white shadow-sm overflow-x-auto no-scrollbar rounded-t-[32px] border-b border-black/5">
              {tabs.map((item) => (
                <button
                  key={item.id}
                  className={`flex flex-col items-center justify-center gap-1.5 px-8 py-3.5 transition-all duration-500 relative min-w-fit group ${activeTab === item.id ? 'text-brand-red' : 'text-brand-black/40 hover:text-brand-black/70'} first:rounded-tl-[32px] last:rounded-tr-[32px]`}
                  onClick={() => {
                    if (item.id === 'visa') {
                      window.open('https://askvisa.in', '_blank');
                      return;
                    }
                    setActiveTab(item.id); 
                    setSearchError('');
                    // Navigate to the corresponding route so content updates
                    const routeMap = { flights: '/flights', hotels: '/hotels', tours: '/tours' };
                    navigate(routeMap[item.id] || '/');
                  }}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ${activeTab === item.id ? 'bg-brand-red/10 scale-110' : 'bg-transparent group-hover:bg-black/5 group-hover:scale-105'}`}>
                    <item.icon size={16} className="transition-transform duration-500" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.15em] leading-none">{item.label}</span>
                  
                  {activeTab === item.id && (
                    <motion.div 
                      layoutId="active-line"
                      className="absolute bottom-0 left-0 right-0 h-1 bg-brand-red"
                    />
                  )}
                </button>
              ))}
            </div>

            <motion.div 
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="p-6 lg:p-8 rounded-b-[32px]"
            >
              {searchError && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mb-8 p-5 bg-red-50 border border-red-200 text-[#ce3131] font-bold rounded-2xl flex items-center gap-4 shadow-sm"
                >
                  <div className="bg-red-500 text-white p-1.5 rounded-full shadow-lg shadow-red-500/20">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                  </div>
                  {searchError}
                </motion.div>
              )}
              {ActiveComponent && <ActiveComponent {...searchState} />}
            </motion.div>
          </div>
        </motion.section>
      </Hero>

      <section className="py-20 bg-[#FBFBFB] border-b border-black/5 pt-40">
        <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-3 gap-12">
          {features.map((feature, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -8 }}
              className="flex items-start gap-6 p-8 rounded-[32px] transition-all hover:bg-white hover:shadow-[0_24px_48px_rgba(0,0,0,0.06)] group border border-transparent hover:border-black/5"
            >
              <div className="bg-brand-red/5 p-4 rounded-2xl group-hover:bg-brand-red group-hover:text-white transition-all duration-500 shadow-sm">
                <feature.icon className="w-8 h-8 transition-transform group-hover:scale-110" />
              </div>
              <div className="mt-1">
                <h4 className="font-black text-brand-black text-xl mb-2 tracking-tight">{feature.title}</h4>
                <p className="text-brand-black/40 text-sm font-medium leading-relaxed">{feature.text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <HomeContent {...searchState} />
    </>
  );
};

export default Home;
