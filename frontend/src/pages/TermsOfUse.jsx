import React from 'react';
import { FileText, CheckCircle2, AlertTriangle, Scale, Shield } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

export default function TermsOfUse() {
  const sections = [
    { id: "services", title: "1. Scope of Services" },
    { id: "accounts", title: "2. User Accounts" },
    { id: "bookings", title: "3. Booking & Fares" },
    { id: "payments", title: "4. Payments & Penalties" },
    { id: "disclaimers", title: "5. Disclaimers" },
    { id: "governing", title: "6. Governing Law" }
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
            <FileText className="w-3.5 h-3.5" /> Direct Agreement
          </span>
          <h1 className="font-quicksand text-4xl font-bold tracking-tight mb-3">
            Terms of <span className="text-[#ef3535]">Use</span>
          </h1>
          <p className="text-gray-400 text-sm md:text-base max-w-xl mx-auto font-light">
            Last Updated: August 01, 2026. Review the terms, conditions, and user legal policies of the FlyAnyTrip portal.
          </p>
        </div>
      </section>

      {/* MAIN CONTAINER */}
      <main className="flex-grow max-w-[1200px] w-full mx-auto px-4 py-12 md:py-16 -mt-8 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Sticky TOC (3 Cols) */}
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
                Welcome to FlyAnyTrip. By accessing our website, mobile application, or making bookings through our desk, you agree to comply with and be bound by the following terms and conditions. If you do not agree to these terms, please do not use our services.
              </p>
              <p>
                These terms govern all ticket searches, reservations, payments, and cancellations made on this platform. Respective airline passenger rules and hotel check-in parameters apply additionally.
              </p>
            </div>

            {/* Sec 1 */}
            <div id="services" className="scroll-mt-24 space-y-3">
              <h2 className="text-xl font-bold text-gray-900 font-quicksand border-b border-gray-100 pb-2.5 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-[#ef3535] rounded-full"></span> 1. Scope of Services
              </h2>
              <div className="text-sm sm:text-[15px] text-gray-600 font-light leading-relaxed space-y-2.5">
                <p>
                  FlyAnyTrip acts as a travel marketplace aggregator connecting you with third-party carriers (airlines), hotel desks, and local tour operators.
                </p>
                <p>
                  We compile flight fares and availability using Global Distribution Systems (GDS, e.g. Amadeus and Sabre). We do not own or operate flights, trains, cabs, or hotel structures. We are not responsible for delays, service standards, or schedule cancellations.
                </p>
              </div>
            </div>

            {/* Sec 2 */}
            <div id="accounts" className="scroll-mt-24 space-y-3">
              <h2 className="text-xl font-bold text-gray-900 font-quicksand border-b border-gray-100 pb-2.5 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-[#ef3535] rounded-full"></span> 2. User Accounts & Verification
              </h2>
              <div className="text-sm sm:text-[15px] text-gray-600 font-light leading-relaxed space-y-2.5">
                <p>
                  If you sign up for a FlyAnyTrip account, you are responsible for:
                </p>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li>Providing accurate, current, and complete personal credentials.</li>
                  <li>Maintaining password confidentiality and preventing unauthorized logins.</li>
                  <li>Ensuring that names entered for co-passengers match legal passport IDs.</li>
                </ul>
              </div>
            </div>

            {/* Sec 3 */}
            <div id="bookings" className="scroll-mt-24 space-y-3">
              <h2 className="text-xl font-bold text-gray-900 font-quicksand border-b border-gray-100 pb-2.5 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-[#ef3535] rounded-full"></span> 3. Booking & Fare Rules
              </h2>
              <div className="text-sm sm:text-[15px] text-gray-600 font-light leading-relaxed space-y-2.5">
                <p>
                  <strong>Fares & GDS Updates:</strong> Flight ticket fares are highly dynamic. Fares are locked only once payment completes and the ticket is successfully generated by GDS ticketing networks.
                </p>
                <p>
                  <strong>Convenience Fees:</strong> Non-refundable convenience or gateway transaction processing charges are added to bookings.
                </p>
              </div>
            </div>

            {/* Sec 4 */}
            <div id="payments" className="scroll-mt-24 space-y-3">
              <h2 className="text-xl font-bold text-gray-900 font-quicksand border-b border-gray-100 pb-2.5 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-[#ef3535] rounded-full"></span> 4. Payments, Penalties & Cancellations
              </h2>
              <p className="text-sm sm:text-[15px] text-gray-600 font-light leading-relaxed">
                By booking, you authorize FlyAnyTrip to process charge amounts back to your card. Cancellations, date changes, and rescheduling are subject to direct airline penalties plus a FlyAnyTrip service fee. Promo fares, charter flights, and group tickets are completely non-changeable and non-refundable.
              </p>
            </div>

            {/* Sec 5 */}
            <div id="disclaimers" className="scroll-mt-24 space-y-3">
              <h2 className="text-xl font-bold text-gray-900 font-quicksand border-b border-gray-100 pb-2.5 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-[#ef3535] rounded-full"></span> 5. Liability Disclaimers
              </h2>
              <div className="text-sm sm:text-[15px] text-gray-600 font-light leading-relaxed space-y-2.5">
                <p>
                  The platform services, text, data, and GDS connections are provided on an "as is" and "as available" basis without warranties of any kind.
                </p>
                <p>
                  We are not liable for direct, indirect, incidental, or consequential damages arising from:
                </p>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li>Flight delays, overbooking, baggage losses, or airline insolvency.</li>
                  <li>Network connectivity failures during GDS handshakes or banking gateway validation.</li>
                  <li>Adverse weather conditions, lockdowns, or force majeure events.</li>
                </ul>
              </div>
            </div>

            {/* Sec 6 */}
            <div id="governing" className="scroll-mt-24 space-y-3">
              <h2 className="text-xl font-bold text-gray-900 font-quicksand border-b border-gray-100 pb-2.5 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-[#ef3535] rounded-full"></span> 6. Governing Law
              </h2>
              <p className="text-sm sm:text-[15px] text-gray-600 font-light leading-relaxed">
                These terms are governed by and construed in accordance with the laws of India. Any disputes arising from services used on this platform shall be subject to the exclusive jurisdiction of the courts located in Gurugram, Haryana.
              </p>
            </div>

            {/* Warning alerts */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 flex items-start gap-4">
              <AlertTriangle className="w-5.5 h-5.5 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-left text-xs sm:text-sm text-amber-800">
                <p className="font-bold">Third-party content limitations</p>
                <p className="font-light mt-1">
                  Descriptions, photographs, ratings, and amenity indicators for hotels or tour packages are provided directly by external vendors. FlyAnyTrip makes no quality assurances or accuracy statements regarding this data.
                </p>
              </div>
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
