import React from 'react';
import { ShieldCheck, Lock, UserCheck, CreditCard } from 'lucide-react';

const TrustSafety = () => {
  return (
    <div className="min-h-screen pt-24 pb-12 bg-gray-50">
      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-brand-red text-white rounded-full flex items-center justify-center shrink-0">
              <ShieldCheck size={28} />
            </div>
            <h1 className="text-4xl font-black text-brand-black">Trust & Safety</h1>
          </div>
          
          <div className="prose prose-lg text-brand-black/70 max-w-none space-y-6">
            <p className="text-xl">
              Your safety, security, and peace of mind are our top priorities. At FlyAnyTrip, we employ industry-leading standards to ensure a secure booking experience.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 not-prose mt-8">
              <div className="p-6 border border-gray-100 rounded-2xl">
                <Lock className="text-brand-red mb-4" size={32} />
                <h3 className="font-bold text-xl text-brand-black mb-2">Secure Transactions</h3>
                <p className="text-brand-black/70 text-sm leading-relaxed">
                  Every transaction on FlyAnyTrip is encrypted using 256-bit SSL technology. Your payment details are processed through PCI-DSS compliant gateways, ensuring bank-level security.
                </p>
              </div>
              <div className="p-6 border border-gray-100 rounded-2xl">
                <UserCheck className="text-brand-red mb-4" size={32} />
                <h3 className="font-bold text-xl text-brand-black mb-2">Data Protection</h3>
                <p className="text-brand-black/70 text-sm leading-relaxed">
                  We respect your privacy. We never sell your personal information to third parties, and our data handling practices comply with global GDPR and CCPA standards.
                </p>
              </div>
              <div className="p-6 border border-gray-100 rounded-2xl">
                <CreditCard className="text-brand-red mb-4" size={32} />
                <h3 className="font-bold text-xl text-brand-black mb-2">Fraud Prevention</h3>
                <p className="text-brand-black/70 text-sm leading-relaxed">
                  Our AI-driven fraud detection systems work 24/7 to identify and block suspicious activities, keeping your account and funds safe from unauthorized access.
                </p>
              </div>
              <div className="p-6 border border-gray-100 rounded-2xl">
                <ShieldCheck className="text-brand-red mb-4" size={32} />
                <h3 className="font-bold text-xl text-brand-black mb-2">Verified Partners</h3>
                <p className="text-brand-black/70 text-sm leading-relaxed">
                  We rigorously vet all airlines, hotels, and tour operators on our platform. We only partner with reputable providers to guarantee the quality of your trip.
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-brand-black mt-10 mb-4">Reporting an Issue</h2>
            <p>
              If you discover a security vulnerability or have concerns about a listing on our platform, please report it immediately. We take all reports seriously and investigate them promptly.
            </p>
            <p>
              Contact our Trust & Safety team directly at: <a href="mailto:safety@flyanytrip.com" className="text-brand-red font-bold hover:underline">safety@flyanytrip.com</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrustSafety;
