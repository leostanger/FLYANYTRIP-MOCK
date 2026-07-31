import React from 'react';
import { Briefcase, Users, Zap, Globe2 } from 'lucide-react';

const Careers = () => {
  return (
    <div className="min-h-screen pt-24 pb-12 bg-gray-50">
      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100">
          <h1 className="text-4xl font-black text-brand-black mb-6">Careers at FlyAnyTrip</h1>
          
          <div className="prose prose-lg text-brand-black/70 max-w-none space-y-6">
            <p className="text-xl">
              Join our mission to revolutionize global travel. We are a team of passionate innovators, engineers, and travel enthusiasts building the future of seamless journeys.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-10 mb-6">Why Work With Us?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 not-prose">
              <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="w-12 h-12 bg-brand-red/10 text-brand-red rounded-full flex items-center justify-center mb-4">
                  <Globe2 size={24} />
                </div>
                <h3 className="font-bold text-lg mb-2">Remote-First Culture</h3>
                <p className="text-brand-black/60 text-sm">Work from anywhere in the world. We value outcomes over hours.</p>
              </div>
              <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="w-12 h-12 bg-brand-red/10 text-brand-red rounded-full flex items-center justify-center mb-4">
                  <Zap size={24} />
                </div>
                <h3 className="font-bold text-lg mb-2">Impactful Work</h3>
                <p className="text-brand-black/60 text-sm">Build products that millions of travelers rely on every day.</p>
              </div>
              <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="w-12 h-12 bg-brand-red/10 text-brand-red rounded-full flex items-center justify-center mb-4">
                  <Users size={24} />
                </div>
                <h3 className="font-bold text-lg mb-2">Top-Tier Team</h3>
                <p className="text-brand-black/60 text-sm">Collaborate with industry experts and continuous learners.</p>
              </div>
              <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="w-12 h-12 bg-brand-red/10 text-brand-red rounded-full flex items-center justify-center mb-4">
                  <Briefcase size={24} />
                </div>
                <h3 className="font-bold text-lg mb-2">Great Benefits</h3>
                <p className="text-brand-black/60 text-sm">Health insurance, travel credits, wellness stipends, and more.</p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-brand-black mt-10 mb-6">Open Positions</h2>
            <div className="border border-gray-100 rounded-2xl p-8 text-center bg-gray-50 not-prose">
              <p className="text-brand-black/60 mb-4">We are currently updating our open positions. Please check back soon or send your resume to our hiring team.</p>
              <a href="mailto:careers@flyanytrip.com" className="inline-block bg-brand-red text-white px-6 py-3 rounded-full font-bold hover:bg-brand-red/90 transition-colors">
                Email Resume
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Careers;
