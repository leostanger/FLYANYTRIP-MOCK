import React, { useMemo, useEffect } from 'react';

const FlightFilters = ({ results, filters, setFilters }) => {
  const airlines = useMemo(() => {
    const list = new Set();
    results.forEach(r => {
      if (r.airline) list.add(r.airline);
    });
    return Array.from(list).sort();
  }, [results]);

  const [minBound, maxBound] = useMemo(() => {
    let min = Infinity;
    let max = 0;
    results.forEach(r => {
      const p = parseInt(String(r.price).replace(/,/g, ''), 10);
      if (!isNaN(p)) {
        if (p < min) min = p;
        if (p > max) max = p;
      }
    });
    if (min === Infinity) return [0, 100000];
    return [Math.max(0, Math.floor(min / 1000) * 1000), Math.ceil(max / 1000) * 1000];
  }, [results]);

  useEffect(() => {
    // Initialize filters with actual min/max from results only once when results arrive
    if (filters.priceRange[0] === 0 && filters.priceRange[1] === 500000 && maxBound > 0) {
      if (minBound !== 0 || maxBound !== 500000) {
        setFilters(prev => ({ ...prev, priceRange: [minBound, maxBound] }));
      }
    }
  }, [minBound, maxBound, setFilters]);

  const handleCheckboxChange = (category, value) => {
    setFilters(prev => {
      const current = prev[category];
      if (current.includes(value)) {
        return { ...prev, [category]: current.filter(item => item !== value) };
      } else {
        return { ...prev, [category]: [...current, value] };
      }
    });
  };

  const resetFilters = () => {
    setFilters({
      priceRange: [minBound, maxBound],
      airlines: [],
      depTime: [],
      arrTime: [],
      stops: [],
      duration: 100
    });
  };

  const timeSlots = [
    { label: 'Early Morning (12AM-6AM)', value: 'early_morning' },
    { label: 'Morning (6AM-12PM)', value: 'morning' },
    { label: 'Afternoon (12PM-6PM)', value: 'afternoon' },
    { label: 'Evening (6PM-12AM)', value: 'evening' }
  ];

  const stopOptions = [
    { label: 'Non-stop', value: 0 },
    { label: '1 Stop', value: 1 },
    { label: '2+ Stops', value: 2 }
  ];

  return (
    <div className="bg-white rounded-3xl lg:border border-black/5 lg:p-6 shadow-sm lg:sticky top-6">
      <div className="hidden lg:flex items-center justify-between mb-6">
        <h3 className="text-xl font-extrabold text-brand-black tracking-tight">Filters</h3>
        <button onClick={resetFilters} className="text-sm font-bold text-brand-red hover:underline">Reset All</button>
      </div>

      <div className="mb-8">
        <h4 className="text-sm font-bold uppercase tracking-wider text-brand-black/60 mb-4">Price Range</h4>
        <div className="flex justify-between text-sm font-bold text-brand-black mb-3">
          <span>₹{minBound.toLocaleString()}</span>
          <span>₹{filters.priceRange[1].toLocaleString()}</span>
        </div>
        <div className="px-2 relative h-4 flex items-center">
          <input 
            type="range" 
            min={minBound} 
            max={maxBound} 
            step="500"
            value={filters.priceRange[1]} 
            onChange={(e) => setFilters(prev => ({ ...prev, priceRange: [minBound, parseInt(e.target.value)] }))}
            className="w-full absolute z-20 opacity-0 cursor-pointer h-full"
          />
          <div className="w-full h-1.5 bg-black/10 rounded-full overflow-hidden absolute z-10">
             <div className="h-full bg-brand-red" style={{ width: `${((filters.priceRange[1] - minBound) / (maxBound - minBound)) * 100}%` }}></div>
          </div>
          <div 
             className="w-4 h-4 bg-white border-2 border-brand-red rounded-full absolute z-10 shadow-md pointer-events-none" 
             style={{ left: `calc(${((filters.priceRange[1] - minBound) / (maxBound - minBound)) * 100}% - 8px)` }}
          ></div>
        </div>
      </div>

      {airlines.length > 0 && (
        <div className="mb-8">
          <h4 className="text-sm font-bold uppercase tracking-wider text-brand-black/60 mb-4">Airlines</h4>
          <div className="space-y-3">
            {airlines.map((al, idx) => (
              <label key={`airline-${al}-${idx}`} className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={filters.airlines.includes(al)}
                  onChange={() => handleCheckboxChange('airlines', al)}
                  className="w-5 h-5 accent-brand-red rounded cursor-pointer"
                />
                <span className="text-sm font-semibold text-brand-black group-hover:text-brand-red transition-colors">{al}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      <div className="mb-8">
        <h4 className="text-sm font-bold uppercase tracking-wider text-brand-black/60 mb-4">Stops</h4>
        <div className="space-y-3">
          {stopOptions.map(stop => (
            <label key={stop.value} className="flex items-center gap-3 cursor-pointer group">
              <input 
                type="checkbox" 
                checked={filters.stops.includes(stop.value)}
                onChange={() => handleCheckboxChange('stops', stop.value)}
                className="w-5 h-5 accent-brand-red rounded cursor-pointer"
              />
              <span className="text-sm font-semibold text-brand-black group-hover:text-brand-red transition-colors">{stop.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h4 className="text-sm font-bold uppercase tracking-wider text-brand-black/60 mb-4">Departure Time</h4>
        <div className="grid grid-cols-2 gap-3">
          {timeSlots.map(slot => (
            <label 
              key={slot.value} 
              className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center cursor-pointer transition-all ${filters.depTime.includes(slot.value) ? 'border-brand-red bg-brand-red/5 text-brand-red' : 'border-black/10 hover:border-brand-red/30 text-brand-black/70'}`}
              onClick={() => handleCheckboxChange('depTime', slot.value)}
            >
              <span className="text-xs font-bold leading-tight mt-1">{slot.label.split('(')[0]}</span>
              <span className="text-[10px] opacity-70">({slot.label.split('(')[1]}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="mb-2">
        <h4 className="text-sm font-bold uppercase tracking-wider text-brand-black/60 mb-4">Arrival Time</h4>
        <div className="grid grid-cols-2 gap-3">
          {timeSlots.map(slot => (
            <label 
              key={slot.value} 
              className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center cursor-pointer transition-all ${filters.arrTime.includes(slot.value) ? 'border-brand-red bg-brand-red/5 text-brand-red' : 'border-black/10 hover:border-brand-red/30 text-brand-black/70'}`}
              onClick={() => handleCheckboxChange('arrTime', slot.value)}
            >
              <span className="text-xs font-bold leading-tight mt-1">{slot.label.split('(')[0]}</span>
              <span className="text-[10px] opacity-70">({slot.label.split('(')[1]}</span>
            </label>
          ))}
        </div>
      </div>

    </div>
  );
};

export default FlightFilters;
