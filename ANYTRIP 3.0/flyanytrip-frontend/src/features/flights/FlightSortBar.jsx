import React, { useState, useRef, useEffect } from 'react';
import { Filter, Zap, CircleDollarSign, ListFilter, ChevronDown } from 'lucide-react';

const FlightSortBar = ({ sortOption, setSortOption, totalResults, setShowMobileFilters }) => {
  const [showOtherSort, setShowOtherSort] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowOtherSort(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const sortTabs = [
    { label: 'CHEAPEST', sub: 'Lowest fare', value: 'cheapest', icon: <CircleDollarSign size={20} /> },
    { label: 'FASTEST', sub: 'Shortest time', value: 'fastest', icon: <Zap size={20} /> },
  ];

  const otherSortOptions = [
    { label: 'Early Departure', value: 'dep_early' },
    { label: 'Late Departure', value: 'dep_late' },
    { label: 'Early Arrival', value: 'arr_early' },
    { label: 'Late Arrival', value: 'arr_late' },
  ];

  const isOtherSortActive = otherSortOptions.some(opt => opt.value === sortOption);
  const activeOtherSort = otherSortOptions.find(opt => opt.value === sortOption);

  return (
    <div className="mb-6 flex flex-col gap-4 relative">
      {/* Mobile Filter Toggle & Results Count */}
      <div className="flex items-center justify-between lg:hidden">
        <span className="text-sm font-bold text-brand-black/60">Showing {totalResults} flights</span>
        <button 
          onClick={() => setShowMobileFilters(true)}
          className="flex items-center gap-2 bg-brand-red text-white px-5 py-2 rounded-xl text-sm font-bold shadow-md active:scale-95 transition-all"
        >
          <Filter size={16} /> Filters
        </button>
      </div>

      {/* Sort Bar Container */}
      <div className="bg-white rounded-2xl border border-black/5 shadow-sm overflow-visible flex flex-col xl:flex-row xl:items-center">
        
        {/* Sort Tabs - MMT Style */}
        <div className="flex flex-row w-full divide-x divide-black/5 relative">
          {sortTabs.map(tab => {
            const isActive = sortOption === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => setSortOption(tab.value)}
                className={`flex-1 min-w-[120px] flex items-center justify-center gap-3 p-4 transition-all relative ${isActive ? 'bg-brand-red/5' : 'hover:bg-black/[0.02]'}`}
              >
                {isActive && <div className="absolute top-0 left-0 w-full h-1 bg-brand-red rounded-b-sm" />}
                <div className={`${isActive ? 'text-brand-red' : 'text-brand-black/40'}`}>
                  {tab.icon}
                </div>
                <div className="text-left hidden sm:block">
                  <div className={`text-xs font-black tracking-widest ${isActive ? 'text-brand-black' : 'text-brand-black/60'}`}>
                    {tab.label}
                  </div>
                  <div className="text-[10px] font-semibold text-brand-black/40 mt-0.5">
                    {tab.sub}
                  </div>
                </div>
              </button>
            );
          })}

          {/* Other Sort Dropdown */}
          <div className="relative flex-1 min-w-[120px]" ref={dropdownRef}>
            <button
              onClick={() => setShowOtherSort(!showOtherSort)}
              className={`w-full h-full flex items-center justify-center gap-3 p-4 transition-all relative ${isOtherSortActive ? 'bg-brand-red/5' : 'hover:bg-black/[0.02]'}`}
            >
              {isOtherSortActive && <div className="absolute top-0 left-0 w-full h-1 bg-brand-red rounded-b-sm" />}
              <div className={`${isOtherSortActive ? 'text-brand-red' : 'text-brand-black/40'}`}>
                <ListFilter size={20} />
              </div>
              <div className="text-left hidden sm:block">
                <div className={`text-xs font-black tracking-widest ${isOtherSortActive ? 'text-brand-black' : 'text-brand-black/60'}`}>
                  {isOtherSortActive ? activeOtherSort.label.toUpperCase() : 'OTHER SORT'}
                </div>
                <div className="text-[10px] font-semibold text-brand-black/40 mt-0.5 flex items-center gap-1">
                  More options <ChevronDown size={10} className={`transition-transform ${showOtherSort ? 'rotate-180' : ''}`} />
                </div>
              </div>
            </button>

            {showOtherSort && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-black/5 py-2 z-50 overflow-hidden">
                {otherSortOptions.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      setSortOption(opt.value);
                      setShowOtherSort(false);
                    }}
                    className={`w-full text-left px-5 py-3 text-xs font-bold hover:bg-black/5 transition-colors ${sortOption === opt.value ? 'text-brand-red bg-brand-red/5' : 'text-brand-black/70'}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightSortBar;
