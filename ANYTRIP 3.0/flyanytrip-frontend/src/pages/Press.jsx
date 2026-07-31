import React from 'react';
import { Newspaper, Download, Mail } from 'lucide-react';

const Press = () => {
  return (
    <div className="min-h-screen pt-24 pb-12 bg-gray-50">
      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100">
          <h1 className="text-4xl font-black text-brand-black mb-6">Press & Media</h1>
          
          <div className="prose prose-lg text-brand-black/70 max-w-none space-y-6">
            <p className="text-xl">
              Welcome to the FlyAnyTrip Press Room. Here you will find our latest announcements, media resources, and brand guidelines.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-10 mb-6">Latest Press Releases</h2>
            
            <div className="space-y-4 not-prose">
              <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="text-sm font-bold text-brand-red mb-1">June 15, 2026</div>
                  <h3 className="font-bold text-lg text-brand-black">FlyAnyTrip Launches AI-Powered Corporate Travel Dashboard</h3>
                </div>
                <button className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 bg-white rounded-full text-sm font-bold hover:bg-gray-50 transition-colors">
                  <Newspaper size={16} /> Read
                </button>
              </div>
              <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="text-sm font-bold text-brand-red mb-1">March 22, 2026</div>
                  <h3 className="font-bold text-lg text-brand-black">FlyAnyTrip Secures Series B Funding to Expand Global Operations</h3>
                </div>
                <button className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 bg-white rounded-full text-sm font-bold hover:bg-gray-50 transition-colors">
                  <Newspaper size={16} /> Read
                </button>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-brand-black mt-10 mb-6">Brand Assets</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 not-prose">
              <div className="p-6 bg-brand-black rounded-2xl text-white flex flex-col items-center text-center">
                <img src="/logos/logo.png" alt="FlyAnyTrip Logo" className="h-12 w-auto mb-4 invert" onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/160x32/1a1a1a/ffffff?text=FlyAnyTrip'; }} />
                <h4 className="font-bold mb-2">Primary Logo</h4>
                <button className="flex items-center gap-2 text-sm text-brand-red hover:text-white transition-colors">
                  <Download size={14} /> Download PNG/SVG
                </button>
              </div>
              <div className="p-6 bg-gray-100 rounded-2xl flex flex-col items-center text-center">
                <img src="/logos/logo.png" alt="FlyAnyTrip Logo" className="h-12 w-auto mb-4" onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/160x32/f3f4f6/a8a29e?text=FlyAnyTrip'; }} />
                <h4 className="font-bold mb-2">Dark Logo</h4>
                <button className="flex items-center gap-2 text-sm text-brand-red hover:text-brand-black transition-colors">
                  <Download size={14} /> Download PNG/SVG
                </button>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-brand-black mt-10 mb-6">Media Contact</h2>
            <div className="flex items-center gap-4 p-6 bg-brand-red/5 border border-brand-red/10 rounded-2xl not-prose">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-brand-red shrink-0 shadow-sm">
                <Mail size={24} />
              </div>
              <div>
                <h3 className="font-bold text-brand-black">Press Inquiries</h3>
                <p className="text-brand-black/60 text-sm">For media inquiries, interview requests, or additional information, please email <a href="mailto:press@flyanytrip.com" className="text-brand-red font-bold hover:underline">press@flyanytrip.com</a>.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Press;
