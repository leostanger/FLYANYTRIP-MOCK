import React from 'react';
import { Briefcase, BarChart, Users, CheckCircle } from 'lucide-react';

const CorporateTravel = () => {
  return (
    <div className="min-h-screen pt-24 pb-12 bg-gray-50">
      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-brand-red text-white rounded-full flex items-center justify-center shrink-0">
              <Briefcase size={28} />
            </div>
            <h1 className="text-4xl font-black text-brand-black">Corporate Travel</h1>
          </div>
          
          <div className="prose prose-lg text-brand-black/70 max-w-none space-y-6">
            <p className="text-xl">
              Streamline your company's business travel with FlyAnyTrip Corporate. We offer a comprehensive suite of tools designed to manage bookings, track expenses, and ensure traveler compliance—all in one place.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-10 mb-6">Features for Businesses</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 not-prose mb-8">
              <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 flex gap-4">
                <BarChart className="text-brand-red shrink-0" size={24} />
                <div>
                  <h3 className="font-bold text-lg mb-2">Expense Management</h3>
                  <p className="text-sm text-brand-black/60">Automated reporting, consolidated invoicing, and real-time budget tracking to optimize your travel spend.</p>
                </div>
              </div>
              <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 flex gap-4">
                <CheckCircle className="text-brand-red shrink-0" size={24} />
                <div>
                  <h3 className="font-bold text-lg mb-2">Policy Compliance</h3>
                  <p className="text-sm text-brand-black/60">Set custom travel policies and approval workflows. Prevent out-of-policy bookings before they happen.</p>
                </div>
              </div>
              <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 flex gap-4">
                <Users className="text-brand-red shrink-0" size={24} />
                <div>
                  <h3 className="font-bold text-lg mb-2">Team Management</h3>
                  <p className="text-sm text-brand-black/60">Easily onboard employees, manage roles, and track traveler locations for duty of care requirements.</p>
                </div>
              </div>
              <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 flex gap-4">
                <Briefcase className="text-brand-red shrink-0" size={24} />
                <div>
                  <h3 className="font-bold text-lg mb-2">Exclusive Corporate Rates</h3>
                  <p className="text-sm text-brand-black/60">Unlock negotiated discounts on flights and premium hotels exclusively for our corporate partners.</p>
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-brand-black mt-8 mb-4">Dedicated Support</h2>
            <p>
              Every corporate account is assigned a dedicated Account Manager. Your team also gets priority 24/7 support for emergency rebookings, cancellations, or itinerary modifications.
            </p>

            <div className="mt-10 p-8 border-2 border-brand-red/20 bg-brand-red/5 rounded-3xl text-center not-prose">
              <h3 className="text-2xl font-bold mb-4 text-brand-black">Elevate Your Business Travel</h3>
              <p className="text-brand-black/60 mb-6 max-w-md mx-auto">Get a customized demonstration of our corporate booking tool and see how much your company can save.</p>
              <button className="bg-brand-red text-white px-8 py-3 rounded-full font-bold hover:bg-brand-red/90 transition-colors">
                Request a Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CorporateTravel;
