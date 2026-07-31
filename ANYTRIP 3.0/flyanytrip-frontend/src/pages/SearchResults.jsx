/*
 * Flyanytrip
 * Authors: Gaurav Thakur, Milan Pandavadara
 *
 * Search results page shown after the user submits a search.
 * Displays the relevant search form in condensed mode at the top
 * so the user can modify their query, then lists the actual results below.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useSearchContext } from '../context/SearchContext';
import ResultsSection from '../features/common/ResultsSection';
import TopLoadingBar from '../features/common/TopLoadingBar';
import FlightSearch from '../features/flights/FlightSearch';
import TourSearch from '../features/tours/TourSearch';
import VisaSearch from '../features/visa/VisaSearch';
import HotelSearch from '../features/hotels/HotelSearch';
import { ArrowLeft } from 'lucide-react';

// Maps each tab ID to the search form component shown in modified-search mode
const SearchComponents = {
  flights: FlightSearch,
  hotels: HotelSearch,
  tours: TourSearch,
  visa: VisaSearch
};

/**
 * Results page component. Reads the current search state from context
 * and renders the matching search form (condensed) and result cards.
 */
const SearchResults = () => {
  const searchState = useSearchContext();
  const { results, activeTab, searchError, searching, isFarePopupOpen } = searchState;
  const navigate = useNavigate();
  const [isSticky, setIsSticky] = React.useState(false);
  
  const ActiveSearch = SearchComponents[activeTab];

  React.useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      // Threshold to start full-width sticky mode (e.g., past the initial margin)
      setIsSticky(currentScrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-[#FBFBFB] pb-32"
    >
      {/* Search Bar Condensed View */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`border-b border-black/5 shadow-sm sticky top-0 z-[1000] transition-all duration-500 ${
          isSticky ? 'py-4 bg-white shadow-xl' : 'pt-10 pb-8 bg-white'
        } ${isFarePopupOpen ? 'hidden' : 'block'}`}
      >
        <div className={`mx-auto px-6 transition-all duration-500 ${isSticky ? 'max-w-full' : 'max-w-[1440px]'}`}>
          {searchError && !isSticky && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-6 p-4 bg-red-50 border border-red-100 text-[#ce3131] text-xs font-bold rounded-xl flex items-center gap-3"
            >
              <div className="bg-red-500 text-white p-1 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
              </div>
              {searchError}
            </motion.div>
          )}

          <div className="w-full">
            {ActiveSearch && <ActiveSearch {...searchState} isCompact={true} />}
          </div>
        </div>
        <TopLoadingBar searching={searching} />
      </motion.div>
      
      {/* Search Results */}
      <div className="w-full">
        <ResultsSection results={results} activeTab={activeTab} searching={searching} />
      </div>
    </motion.div>
  );
};

export default SearchResults;
