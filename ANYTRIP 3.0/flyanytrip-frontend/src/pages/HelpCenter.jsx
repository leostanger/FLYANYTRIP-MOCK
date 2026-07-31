import React from 'react';
import { HelpCircle, Search, FileQuestion, Book, LifeBuoy } from 'lucide-react';
import { Link } from 'react-router-dom';

const HelpCenter = () => {
  return (
    <div className="min-h-screen pt-24 pb-12 bg-gray-50">
      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex flex-col items-center text-center mb-10">
            <div className="w-16 h-16 bg-brand-red/10 text-brand-red rounded-full flex items-center justify-center mb-6">
              <HelpCircle size={32} />
            </div>
            <h1 className="text-4xl font-black text-brand-black mb-4">How can we help you?</h1>
            <div className="relative w-full max-w-md mx-auto">
              <input 
                type="text" 
                placeholder="Search for articles, topics, or FAQs..." 
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-all"
              />
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link to="/faq" className="p-6 border border-gray-100 rounded-2xl hover:shadow-md transition-shadow group flex items-start gap-4">
              <div className="w-12 h-12 bg-brand-red/5 text-brand-red rounded-full flex items-center justify-center shrink-0 group-hover:bg-brand-red group-hover:text-white transition-colors">
                <FileQuestion size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg text-brand-black mb-2">FAQs</h3>
                <p className="text-brand-black/60 text-sm">Quick answers to our most commonly asked questions regarding bookings and policies.</p>
              </div>
            </Link>
            
            <div className="p-6 border border-gray-100 rounded-2xl hover:shadow-md transition-shadow group flex items-start gap-4 cursor-pointer">
              <div className="w-12 h-12 bg-brand-red/5 text-brand-red rounded-full flex items-center justify-center shrink-0 group-hover:bg-brand-red group-hover:text-white transition-colors">
                <Book size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg text-brand-black mb-2">Booking Guides</h3>
                <p className="text-brand-black/60 text-sm">Step-by-step tutorials on how to manage, cancel, or modify your existing reservations.</p>
              </div>
            </div>

            <div className="p-6 border border-gray-100 rounded-2xl hover:shadow-md transition-shadow group flex items-start gap-4 cursor-pointer">
              <div className="w-12 h-12 bg-brand-red/5 text-brand-red rounded-full flex items-center justify-center shrink-0 group-hover:bg-brand-red group-hover:text-white transition-colors">
                <LifeBuoy size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg text-brand-black mb-2">Contact Support</h3>
                <p className="text-brand-black/60 text-sm">Can't find what you're looking for? Reach out to our 24/7 customer support team.</p>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center border-t border-gray-100 pt-8">
            <p className="text-brand-black/70 mb-4">Need immediate assistance with an ongoing trip?</p>
            <p className="font-bold text-xl text-brand-black">Call us: <a href="tel:+18000000000" className="text-brand-red hover:underline">+1 (800) 000-0000</a></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;
