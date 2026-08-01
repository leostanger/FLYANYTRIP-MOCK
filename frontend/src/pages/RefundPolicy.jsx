import React from 'react';
import { ShieldCheck, RotateCcw, Clock, AlertTriangle, ChevronRight, HelpCircle } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

export default function RefundPolicy() {
  const highlightPoints = [
    {
      icon: <Clock className="w-6 h-6 text-[#ef3535]" />,
      title: "Fast Process",
      desc: "Refunds are initiated immediately upon cancellation. Gateways typically process within 5-7 business days."
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-emerald-500" />,
      title: "100% Secure",
      desc: "All transactions are processed through certified PCI-DSS Level 1 secure gateways back to your original source."
    },
    {
      icon: <RotateCcw className="w-6 h-6 text-blue-500" />,
      title: "Easy Cancellation",
      desc: "Cancel your flights or hotels with a single click in your 'My Bookings' panel. Safe and direct."
    }
  ];

  const steps = [
    { num: "01", title: "Cancel Booking", desc: "User triggers cancellation from the dashboard." },
    { num: "02", title: "System Audit", desc: "Airlines and FlyAnyTrip calculate applicable penalty fees." },
    { num: "03", title: "Instant Approval", desc: "Refund amount is approved and released to the gateway." },
    { num: "04", title: "Bank Credit", desc: "Your bank credits the amount to your original payment method." }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-satoshi text-gray-800">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#111111] to-[#2a0e0b] py-20 px-4 text-center text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(239,53,53,0.15),transparent_45%)]" />
        <div className="relative z-10 max-w-4xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 text-red-400 text-xs font-semibold uppercase tracking-wider mb-4 border border-white/5 backdrop-blur-md font-quicksand">
            <ShieldCheck className="w-3.5 h-3.5" /> Guarantee Trust
          </span>
          <h1 className="font-quicksand text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Refund & <span className="text-[#ef3535]">Cancellation</span> Policy
          </h1>
          <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto font-light leading-relaxed">
            At FlyAnyTrip, we believe in fair, clear, and transparent refund terms. Find details about cancellation fees and refund timelines below.
          </p>
        </div>
      </section>

      {/* HIGHLIGHT CARDS */}
      <main className="flex-grow max-w-[1200px] w-full mx-auto px-4 py-12 md:py-16 -mt-8 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {highlightPoints.map((pt, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-start gap-4">
              <div className="p-3 bg-slate-50 rounded-xl shrink-0">
                {pt.icon}
              </div>
              <div className="text-left">
                <h3 className="font-quicksand font-bold text-base text-gray-900">{pt.title}</h3>
                <p className="text-xs sm:text-sm text-gray-500 font-light mt-1 leading-relaxed">{pt.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* POLICY GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          {/* Main Content (8 Cols) */}
          <div className="lg:col-span-8 bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 text-left space-y-8">
            
            {/* Section 1 */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 font-quicksand border-b border-gray-100 pb-3 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-[#ef3535] rounded-full"></span> Flights Cancellation & Refunds
              </h2>
              <div className="mt-4 space-y-3 text-sm sm:text-[15px] text-gray-600 font-light leading-relaxed">
                <p>
                  <strong>Airline Penalty:</strong> Cancellations are subject to charges levied by the respective airline. These charges vary based on the sector, booking class, and time remaining until departure.
                </p>
                <p>
                  <strong>Convenience Charges:</strong> The initial convenience or payment fee paid at the time of booking is non-refundable in all cancellation scenarios.
                </p>
                <p>
                  <strong>No-Show Policy:</strong> If a passenger fails to check-in or board the flight within the stipulated time, it is classified as a "No-Show" and is subject to no-show fees. In many cases, no-show tickets carry zero refund value.
                </p>
              </div>
            </div>

            {/* Section 2 */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 font-quicksand border-b border-gray-100 pb-3 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-[#ef3535] rounded-full"></span> Hotels Cancellation & Refunds
              </h2>
              <div className="mt-4 space-y-3 text-sm sm:text-[15px] text-gray-600 font-light leading-relaxed">
                <p>
                  <strong>Free Cancellation:</strong> Bookings marked with "Free Cancellation" can be cancelled without penalties before the specified cut-off date (usually 24-48 hours before check-in).
                </p>
                <p>
                  <strong>Non-Refundable Bookings:</strong> Certain promotional or heavily discounted room rates are non-refundable. Cancellations or changes to these bookings will result in 100% forfeiture of the paid booking amount.
                </p>
              </div>
            </div>

            {/* Section 3 */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 font-quicksand border-b border-gray-100 pb-3 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-[#ef3535] rounded-full"></span> Tour Packages & Holidays
              </h2>
              <div className="mt-4 space-y-3 text-sm sm:text-[15px] text-gray-600 font-light leading-relaxed">
                <p>
                  Tour package cancellations depend heavily on our local vendor cancellation rules (hotels, transport, activities). Standard policies require cancellations to be raised at least 15-30 days before departure for a partial refund. Detailed terms are provided inside the tour invoice.
                </p>
              </div>
            </div>

            {/* Warning Alert Box */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 flex items-start gap-4">
              <AlertTriangle className="w-5.5 h-5.5 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-left text-xs sm:text-sm text-amber-800">
                <p className="font-bold">Important Notice regarding Special/Charters Flights</p>
                <p className="font-light mt-1">
                  Promo tickets, group bookings, and charter flights are entirely non-refundable, non-changeable, and non-reroutable under airline regulations. Please check ticket restrictions carefully during checkout.
                </p>
              </div>
            </div>

          </div>

          {/* Right sidebar: Processing steps (4 Cols) */}
          <div className="lg:col-span-4 bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 text-left">
            <h3 className="font-quicksand font-bold text-lg text-gray-900 mb-6">Refund Processing Flow</h3>
            <div className="relative border-l border-gray-100 ml-4 space-y-6">
              {steps.map((st, i) => (
                <div key={i} className="relative pl-8">
                  {/* Circle number indicator */}
                  <span className="absolute -left-[17px] top-0.5 w-8 h-8 rounded-full bg-red-50 text-[#ef3535] border border-red-100 text-xs font-bold flex items-center justify-center font-quicksand">
                    {st.num}
                  </span>
                  <div>
                    <h4 className="font-bold text-sm text-gray-800">{st.title}</h4>
                    <p className="text-xs text-gray-500 font-light mt-0.5 leading-relaxed">{st.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100">
              <h4 className="font-bold text-xs uppercase tracking-wider text-gray-400">Still have queries?</h4>
              <p className="text-xs text-gray-500 mt-2 font-light leading-relaxed">
                Connect with our refunds support desk directly for updates on active claims.
              </p>
              <a
                href="mailto:refunds@flyanytrip.com"
                className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[#ef3535] hover:underline"
              >
                refunds@flyanytrip.com <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* FAQ ROW */}
        <div className="max-w-4xl mx-auto text-left space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 font-quicksand text-center mb-8">Refund FAQs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-5 shadow-xs border border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <HelpCircle className="w-4 h-4 text-[#ef3535] shrink-0" />
                <h4 className="font-bold text-sm text-gray-800">Can I request refund in original payment form?</h4>
              </div>
              <p className="text-xs sm:text-sm text-gray-500 font-light leading-relaxed pl-6">
                Yes, by default we process refunds back to the exact credit card, bank account, or wallet used to initiate the booking. We cannot credit a different card for security reasons.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-5 shadow-xs border border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <HelpCircle className="w-4 h-4 text-[#ef3535] shrink-0" />
                <h4 className="font-bold text-sm text-gray-800">What if my card has expired or is blocked?</h4>
              </div>
              <p className="text-xs sm:text-sm text-gray-500 font-light leading-relaxed pl-6">
                Even if the card has expired, banks usually redirect the funds to the linked savings account. If the account is completely closed, contact our support team with a bank account closure certificate to process an alternative transfer.
              </p>
            </div>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
