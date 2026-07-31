import React from 'react';
import { FileText, CheckCircle2, Clock, MapPin } from 'lucide-react';

const VisaServices = () => {
  return (
    <div className="min-h-screen pt-24 pb-12 bg-gray-50">
      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-brand-red text-white rounded-full flex items-center justify-center shrink-0">
              <FileText size={28} />
            </div>
            <h1 className="text-4xl font-black text-brand-black">Visa Services</h1>
          </div>
          
          <div className="prose prose-lg text-brand-black/70 max-w-none space-y-6">
            <p className="text-xl">
              Applying for a visa can be overwhelming. FlyAnyTrip makes the process simple, transparent, and hassle-free, getting you ready for your next adventure in record time.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-10 mb-6">How It Works</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 not-prose mb-10">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center text-brand-red mb-4">
                  <MapPin size={28} />
                </div>
                <h3 className="font-bold text-lg mb-2">1. Select Destination</h3>
                <p className="text-sm text-brand-black/60">Choose your destination country and citizenship to find requirements.</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center text-brand-red mb-4">
                  <FileText size={28} />
                </div>
                <h3 className="font-bold text-lg mb-2">2. Submit Documents</h3>
                <p className="text-sm text-brand-black/60">Upload your documents online. Our experts will verify everything.</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center text-brand-red mb-4">
                  <CheckCircle2 size={28} />
                </div>
                <h3 className="font-bold text-lg mb-2">3. Get Your Visa</h3>
                <p className="text-sm text-brand-black/60">Receive your approved e-Visa or passport directly to your inbox/doorstep.</p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-brand-black mt-8 mb-4">Why Use Our Services?</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Expert Guidance:</strong> Our visa specialists ensure your application is perfect before submission, minimizing rejection risks.</li>
              <li><strong>Fast Processing:</strong> We offer expedited processing options for urgent travel plans.</li>
              <li><strong>Real-time Tracking:</strong> Track the status of your visa application directly from your FlyAnyTrip dashboard.</li>
              <li><strong>Secure Handling:</strong> Your sensitive documents are encrypted and handled with the utmost confidentiality.</li>
            </ul>

            <div className="mt-10 p-8 bg-brand-black text-white rounded-3xl text-center not-prose">
              <h3 className="text-2xl font-bold mb-4">Ready to Apply?</h3>
              <p className="text-white/60 mb-6">Our automated visa portal is launching soon. In the meantime, speak with our visa experts to start your application.</p>
              <button className="bg-brand-red text-white px-8 py-3 rounded-full font-bold hover:bg-white hover:text-brand-black transition-colors">
                Contact Visa Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisaServices;
