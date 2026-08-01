import React from 'react';
import { ShieldCheck, Lock, Eye, FileText, Landmark } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

export default function PrivacyPolicy() {
  const sections = [
    { id: "collect", title: "1. Information We Collect" },
    { id: "use", title: "2. How We Use Information" },
    { id: "share", title: "3. Sharing Your Data" },
    { id: "cookies", title: "4. Cookies & Tracking" },
    { id: "rights", title: "5. Your Choices & Rights" },
    { id: "security", title: "6. Security Standards" }
  ];

  const handleScroll = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-satoshi text-gray-800">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#111111] to-[#2a0e0b] py-16 px-4 text-center text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(239,53,53,0.15),transparent_45%)]" />
        <div className="relative z-10 max-w-4xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 text-red-400 text-xs font-semibold uppercase tracking-wider mb-4 border border-white/5 backdrop-blur-md font-quicksand">
            <Lock className="w-3.5 h-3.5" /> GDPR & PCI Compliant
          </span>
          <h1 className="font-quicksand text-4xl font-bold tracking-tight mb-3">
            Privacy <span className="text-[#ef3535]">Policy</span>
          </h1>
          <p className="text-gray-400 text-sm md:text-base max-w-xl mx-auto font-light">
            Last Updated: August 01, 2026. This policy outlines how FlyAnyTrip collects, secures, and handles passenger and booking data.
          </p>
        </div>
      </section>

      {/* MAIN CONTAINER */}
      <main className="flex-grow max-w-[1200px] w-full mx-auto px-4 py-12 md:py-16 -mt-8 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Sticky Table of Contents (3 Cols) */}
          <div className="lg:col-span-3 lg:sticky lg:top-24 bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-left space-y-2 hidden lg:block">
            <h4 className="font-quicksand font-bold text-sm uppercase tracking-wider text-gray-400 mb-4 px-3">Table of Contents</h4>
            {sections.map(s => (
              <button
                key={s.id}
                onClick={() => handleScroll(s.id)}
                className="w-full text-left px-3 py-2 text-sm font-semibold rounded-xl text-gray-600 hover:text-[#ef3535] hover:bg-slate-50 transition-all cursor-pointer border-none bg-transparent"
              >
                {s.title}
              </button>
            ))}
          </div>

          {/* RIGHT: Document Text (9 Cols) */}
          <div className="lg:col-span-9 bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 text-left space-y-8">
            
            {/* Intro */}
            <div className="prose max-w-none text-gray-600 font-light leading-relaxed text-sm sm:text-base space-y-4">
              <p>
                FlyAnyTrip Pvt. Ltd. ("we", "us", or "our") is committed to protecting your privacy. This Privacy Policy describes how we collect, use, disclose, and safeguard your personal information when you use our website, mobile application, and related booking services.
              </p>
              <p>
                By accessing or using our services, you consent to the collection, transfer, manipulation, storage, disclosure, and other uses of your information as described in this policy. If you do not agree, please do not use our platform.
              </p>
            </div>

            {/* Sec 1 */}
            <div id="collect" className="scroll-mt-24 space-y-3">
              <h2 className="text-xl font-bold text-gray-900 font-quicksand border-b border-gray-100 pb-2.5 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-[#ef3535] rounded-full"></span> 1. Information We Collect
              </h2>
              <div className="text-sm sm:text-[15px] text-gray-600 font-light leading-relaxed space-y-2.5">
                <p>
                  To successfully book flight tickets, reserve hotel rooms, and manage travel itineraries, we collect:
                </p>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li><strong>Personal Identifiers:</strong> Name, Date of Birth, Gender, Passport Number (for international routes), and National ID details.</li>
                  <li><strong>Contact Details:</strong> Email Address, Phone Number, and Billing Addresses.</li>
                  <li><strong>Payment Information:</strong> Securely tokenized Card numbers, UPI handles, and payment transaction references.</li>
                  <li><strong>Travel Details:</strong> Co-passenger names, airline dietary choices, seat preferences, and booking logs.</li>
                </ul>
              </div>
            </div>

            {/* Sec 2 */}
            <div id="use" className="scroll-mt-24 space-y-3">
              <h2 className="text-xl font-bold text-gray-900 font-quicksand border-b border-gray-100 pb-2.5 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-[#ef3535] rounded-full"></span> 2. How We Use Information
              </h2>
              <div className="text-sm sm:text-[15px] text-gray-600 font-light leading-relaxed space-y-2.5">
                <p>
                  The collected data is exclusively used for standard operational actions:
                </p>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li>Processing ticket issuances with respective GDS networks and airlines.</li>
                  <li>Completing hotel confirmation deposits.</li>
                  <li>Sending real-time flight schedules, alerts, gate changes, and PNR status checks.</li>
                  <li>Resolving support requests, refunds calculations, and active claims.</li>
                  <li>Guarding against payment fraud and fake profiles.</li>
                </ul>
              </div>
            </div>

            {/* Sec 3 */}
            <div id="share" className="scroll-mt-24 space-y-3">
              <h2 className="text-xl font-bold text-gray-900 font-quicksand border-b border-gray-100 pb-2.5 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-[#ef3535] rounded-full"></span> 3. Sharing Your Data
              </h2>
              <div className="text-sm sm:text-[15px] text-gray-600 font-light leading-relaxed space-y-2.5">
                <p>
                  We share your data only with verified parties essential to your travel booking:
                </p>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li><strong>Airlines & Hotels:</strong> Direct service providers receive traveler names, contact info, and special requests to fulfill booking contracts.</li>
                  <li><strong>GDS Partners:</strong> Global Distribution Systems (e.g. Amadeus, Sabre, Adivaha integration) to lock pricing inventory.</li>
                  <li><strong>Payment Gateways:</strong> Certified processors handling secure PCI transactions.</li>
                </ul>
                <p className="mt-2 text-rose-500 font-medium bg-red-50/50 p-3 rounded-lg border border-red-100/50">
                  ⚠️ Note: FlyAnyTrip does NOT sell or rent your personal user details to third-party ad brokers or list buyers.
                </p>
              </div>
            </div>

            {/* Sec 4 */}
            <div id="cookies" className="scroll-mt-24 space-y-3">
              <h2 className="text-xl font-bold text-gray-900 font-quicksand border-b border-gray-100 pb-2.5 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-[#ef3535] rounded-full"></span> 4. Cookies & Tracking
              </h2>
              <p className="text-sm sm:text-[15px] text-gray-600 font-light leading-relaxed">
                We use cookies to save your language choices, store recent searches (flights, hotels, destinations), and track site speed performance. You can block or delete cookies in your browser settings, though doing so might disrupt session continuity.
              </p>
            </div>

            {/* Sec 5 */}
            <div id="rights" className="scroll-mt-24 space-y-3">
              <h2 className="text-xl font-bold text-gray-900 font-quicksand border-b border-gray-100 pb-2.5 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-[#ef3535] rounded-full"></span> 5. Your Choices & Rights
              </h2>
              <p className="text-sm sm:text-[15px] text-gray-600 font-light leading-relaxed">
                Depending on your jurisdiction (such as under the GDPR or Indian Digital Personal Data Protection Act), you have rights to access your data, request corrections, restrict processing, or request full deletion of your profile. To exercise these rights, email our compliance team.
              </p>
            </div>

            {/* Sec 6 */}
            <div id="security" className="scroll-mt-24 space-y-3">
              <h2 className="text-xl font-bold text-gray-900 font-quicksand border-b border-gray-100 pb-2.5 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-[#ef3535] rounded-full"></span> 6. Security Standards
              </h2>
              <p className="text-sm sm:text-[15px] text-gray-600 font-light leading-relaxed">
                We safeguard your information using standard TLS/SSL encryption, tokenized payment protocols, firewalls, and restricted user access lists. However, no digital storage is completely fail-safe. If we discover a data breach, we will notify you and relevant authorities within 72 hours.
              </p>
            </div>

            {/* Contact info */}
            <div className="pt-6 border-t border-gray-100">
              <h4 className="font-quicksand font-bold text-sm text-gray-800">Compliance & Grievance Contact</h4>
              <p className="text-xs text-gray-500 font-light mt-1.5 leading-relaxed">
                For any complaints or data-related deletion queries, contact our Data Protection Officer:
              </p>
              <p className="text-xs text-gray-800 font-semibold mt-1 font-quicksand">
                Email: privacy@flyanytrip.com | Address: DPO Office, Gurugram, India.
              </p>
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
