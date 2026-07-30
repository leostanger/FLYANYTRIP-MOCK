import React from 'react';
import { Phone, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

const TopBar = () => {
  return (
    <div 
      className="border-[#d0d0d0] border-b-[0.8px] border-solid py-2 hidden md:block"
      style={{ backgroundImage: "linear-gradient(90deg, rgb(252, 236, 236) 0%, rgb(255, 190, 184) 50.829%, rgb(255, 190, 184) 55.887%, rgb(252, 236, 236) 100%)" }}
    >
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 flex justify-between items-center text-[15px] text-[#3c3c3c] font-satoshi font-medium">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 cursor-pointer hover:text-[#ef3535] transition-colors">
            <Globe size={14} className="text-[#ef3535]" />
            <span>India (INR ₹)</span>
          </div>
          <span className="text-gray-300">|</span>
          <div className="cursor-pointer hover:text-[#ef3535] transition-colors">English</div>
          <span className="text-gray-300">|</span>
          <div className="flex items-center gap-1.5 cursor-pointer hover:text-[#ef3535] transition-colors">
            <Phone size={14} className="text-[#3c3c3c]" />
            <span>1800-000-4567 (24/7 Toll Free)</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/help-center" className="text-[#3c3c3c] hover:text-[#ef3535] no-underline transition-colors">Help Center</Link>
          <span className="text-gray-300">|</span>
          <Link to="/offers" className="text-[#3c3c3c] hover:text-[#ef3535] no-underline transition-colors">Offers &amp; Deals</Link>
          <span className="text-gray-300">|</span>
          <Link to="/corporate" className="text-[#3c3c3c] hover:text-[#ef3535] no-underline transition-colors">Corporate Travel</Link>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
