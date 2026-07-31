/*
 * Flyanytrip
 * Authors: Gaurav Thakur, Milan Pandavadara
 *
 * Site-wide footer displayed at the bottom of every page.
 * Contains the brand logo, tagline, social media icons, and
 * three link columns: Company, Services, and Support.
 */

import React from 'react';
import { Globe2, Instagram } from 'lucide-react';

const Footer = () => (
  <footer className="bg-brand-black pt-7 pb-5">
    <div className="max-w-[1200px] mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-x-12 gap-y-6 mb-6 border-b border-white/5 pb-6">
        <div className="flex flex-col gap-6 items-start">
          <img src="logos/logo.png" alt="FlyAnyTrip" className="h-8 w-auto object-contain max-w-[160px]" onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/160x32/f8f9fa/a8a29e?text=FlyAnyTrip'; }} />
          <p className="text-white/40 text-sm max-w-xs leading-relaxed">Elevating global travel through professional precision and uncompromising luxury.</p>
          <div className="flex gap-3">
            <div className="w-8 h-8 bg-white/5 rounded-full flex items-center justify-center text-white/40 hover:bg-brand-red/20 hover:text-brand-red transition-all cursor-pointer">
              <Globe2 size={16} />
            </div>
            <div className="w-8 h-8 bg-white/5 rounded-full flex items-center justify-center text-white/40 hover:bg-brand-red/20 hover:text-brand-red transition-all cursor-pointer">
              <Instagram size={16} />
            </div>
            <div 
              className="w-8 h-8 bg-white/5 rounded-full flex items-center justify-center text-white/40 hover:bg-brand-red/20 hover:text-brand-red transition-all cursor-pointer"
              title="X (Twitter)"
            >
              <svg viewBox="0 0 24 24" className="w-[14px] h-[14px] fill-current">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
              </svg>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-1">Company</h4>
          <a href="#" className="text-white/30 text-sm hover:text-white transition-colors">About Us</a>
          <a href="#" className="text-white/30 text-sm hover:text-white transition-colors">Careers</a>
          <a href="#" className="text-white/30 text-sm hover:text-white transition-colors">Press</a>
          <a href="#" className="text-white/30 text-sm hover:text-white transition-colors">Trust & Safety</a>
        </div>
        <div className="flex flex-col gap-3">
          <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-1">Services</h4>
          <a href="#" className="text-white/30 text-sm hover:text-white transition-colors">Flight Booking</a>
          <a href="#" className="text-white/30 text-sm hover:text-white transition-colors">Curated Tours</a>
          <a href="#" className="text-white/30 text-sm hover:text-white transition-colors">Visa Services</a>
          <a href="#" className="text-white/30 text-sm hover:text-white transition-colors">Corporate Travel</a>
        </div>
        <div className="flex flex-col gap-3">
          <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-1">Support</h4>
          <a href="#" className="text-white/30 text-sm hover:text-white transition-colors">Help Center</a>
          <a href="#" className="text-white/30 text-sm hover:text-white transition-colors">Terms of Service</a>
          <a href="#" className="text-white/30 text-sm hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="text-white/30 text-sm hover:text-white transition-colors">Cookie Policy</a>
        </div>
      </div>
      <div className="flex flex-col md:flex-row justify-between items-center gap-3 text-white/20 text-xs font-bold uppercase tracking-wider">
        <p>&copy; 2026 FlyAnyTrip. All rights reserved.</p>
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors"><Globe2 size={14} /> English (US)</span>
          <span className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors">₹ INR</span>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
