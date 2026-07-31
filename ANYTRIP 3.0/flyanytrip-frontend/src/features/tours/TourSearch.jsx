/*
 * Flyanytrip
 * Authors: Gaurav Thakur, Milan Pandavadara
 *
 * Tour destination search component.
 * Features a text input with a dropdown panel that shows:
 * - Recent search history (as removable pill tags)
 * - A photo grid of recommended destinations
 * Closes automatically when the user clicks outside the dropdown.
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, X, Clock } from 'lucide-react';

// Maps destination names to their preview images shown in the dropdown grid
const DEST_IMAGES = {
  Thailand:  '/assets/destinations/thailand.png',
  Vietnam:   '/assets/destinations/vietnam.png',
  Dubai:     '/assets/activities/dubai.png',
  Singapore: '/assets/destinations/singapore.png',
  India:     '/assets/destinations/india.png',
  Oman:      '/assets/destinations/oman.png',
  Bali:      '/assets/destinations/bali.png',
};

/**
 * Tour destination search component.
 *
 * @param tourDest            - The currently selected destination name
 * @param setTourDest         - Updates the selected destination
 * @param tourDestinations    - Full list of available tour destinations
 * @param showTourMenu        - Whether the destination dropdown is open
 * @param setShowTourMenu     - Opens/closes the dropdown
 * @param handleSearch        - Runs the search when the button is clicked
 */
const TourSearch = ({
  tourDest, setTourDest, tourDestinations,
  showTourMenu, setShowTourMenu,
  handleSearch,
  setShowFromMenu, setShowToMenu,
  setShowVisaMenu, setShowActivityMenu,
}) => {
  const [query, setQuery] = useState(tourDest || '');
  const [history, setHistory] = useState(['Thailand', 'Bali']);
  const inputRef = useRef(null);
  const panelRef = useRef(null);

  const filtered = query.trim()
    ? tourDestinations.filter(d => d.toLowerCase().includes(query.toLowerCase()))
    : tourDestinations;

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (
        panelRef.current && !panelRef.current.contains(e.target) &&
        inputRef.current && !inputRef.current.contains(e.target)
      ) {
        setShowTourMenu(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [setShowTourMenu]);

  /**
   * Selects a destination and updates both the state and the input text.
   * Also adds the choice to the search history (up to 5 recent items).
   *
   * @param dest - The destination name the user clicked on
   */
  const selectDest = (dest) => {
    setTourDest(dest);
    setQuery(dest);
    setShowTourMenu(false);
    if (!history.includes(dest)) setHistory(prev => [dest, ...prev].slice(0, 5));
  };

  /**
   * Removes a specific destination from the recent search history.
   * Stops event propagation so the dropdown doesn't accidentally select it.
   *
   * @param dest - The destination to remove from history
   * @param e    - The click event (used to stop bubbling)
   */
  const removeHistory = (dest, e) => {
    e.stopPropagation();
    setHistory(prev => prev.filter(h => h !== dest));
  };

  /**
   * Opens the tour destination dropdown and closes all other open dropdowns.
   * Guards with && checks because not all menus are always provided as props.
   */
  const openMenu = () => {
    setShowTourMenu(true);
    setShowFromMenu && setShowFromMenu(false);
    setShowToMenu && setShowToMenu(false);
    setShowVisaMenu && setShowVisaMenu(false);
    setShowActivityMenu && setShowActivityMenu(false);
  };

  return (
    <div className="flex gap-4 items-end">
      {/* Search Input */}
      <div className="relative flex-1">
        <div
          ref={inputRef}
          className="flex items-center gap-3 bg-white border-2 rounded-xl px-4 py-3 transition-all"
          style={{ borderColor: showTourMenu ? '#e63946' : 'rgba(0,0,0,0.1)' }}
        >
          <Search size={18} style={{ color: '#e63946', flexShrink: 0 }} />
          <input
            type="text"
            value={query}
            onChange={e => { setQuery(e.target.value); openMenu(); }}
            onFocus={openMenu}
            placeholder="Search tour destinations & packages"
            style={{
              width: '100%',
              border: 'none',
              outline: 'none',
              fontSize: '15px',
              fontWeight: 500,
              background: 'transparent',
              color: '#1a1a2e',
            }}
          />
          {query && (
            <button onClick={() => setQuery('')}>
              <X size={16} style={{ color: '#aaa' }} />
            </button>
          )}
        </div>

        {/* Dropdown Panel */}
        <AnimatePresence>
          {showTourMenu && (
            <motion.div
              ref={panelRef}
              initial={{ opacity: 0, y: 8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.97 }}
              transition={{ duration: 0.18 }}
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                left: 0,
                right: 0,
                background: '#fff',
                borderRadius: '16px',
                boxShadow: '0 20px 60px rgba(0,0,0,0.14)',
                border: '1px solid rgba(0,0,0,0.06)',
                zIndex: 200,
                padding: '20px',
                minWidth: '520px',
              }}
            >
              {/* Search History */}
              {history.length > 0 && !query.trim() && (
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                    <Clock size={13} style={{ color: '#888' }} />
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      Search history
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {history.map(h => (
                      <div
                        key={h}
                        onClick={() => selectDest(h)}
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: '6px',
                          padding: '5px 12px', borderRadius: '20px',
                          background: '#f4f4f6', border: '1px solid #e8e8ec',
                          fontSize: '13px', fontWeight: 600, color: '#333',
                          cursor: 'pointer', transition: 'all 0.15s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = '#e63946'}
                        onMouseLeave={e => e.currentTarget.style.borderColor = '#e8e8ec'}
                      >
                        <MapPin size={12} style={{ color: '#e63946' }} />
                        {h}
                        <button
                          onClick={(e) => removeHistory(h, e)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}
                        >
                          <X size={11} style={{ color: '#aaa' }} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommended Destinations Grid */}
              <div>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  {query.trim() ? 'Results' : 'Recommended destinations'}
                </span>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '10px',
                  marginTop: '12px',
                }}>
                  {filtered.map(dest => (
                    <div
                      key={dest}
                      onClick={() => selectDest(dest)}
                      style={{
                        position: 'relative', borderRadius: '12px', overflow: 'hidden',
                        aspectRatio: '4/3', cursor: 'pointer',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.12)',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.04)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.22)'; }}
                      onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.12)'; }}
                    >
                      <img
                        src={DEST_IMAGES[dest] || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600&auto=format&fit=crop'}
                        alt={dest}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x400/f8f9fa/a8a29e?text=' + encodeURIComponent(dest); }}
                      />
                      <div style={{
                        position: 'absolute', inset: 0,
                        background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 50%)',
                      }} />
                      <span style={{
                        position: 'absolute', bottom: '8px', left: '10px',
                        color: '#fff', fontSize: '13px', fontWeight: 700,
                        textShadow: '0 1px 4px rgba(0,0,0,0.5)',
                      }}>
                        {dest}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Search Button */}
      <button
        onClick={handleSearch}
        style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          background: '#1a1a2e', color: '#fff',
          height: '54px', padding: '0 28px',
          borderRadius: '12px', border: 'none',
          fontSize: '15px', fontWeight: 700, cursor: 'pointer',
          transition: 'background 0.2s, transform 0.1s',
          whiteSpace: 'nowrap',
        }}
        onMouseEnter={e => e.currentTarget.style.background = '#e63946'}
        onMouseLeave={e => e.currentTarget.style.background = '#1a1a2e'}
        onMouseDown={e => e.currentTarget.style.transform = 'scale(0.96)'}
        onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        <Search size={18} /> Find Tours
      </button>
    </div>
  );
};

export default TourSearch;
