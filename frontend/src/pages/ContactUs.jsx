import React, { useState } from 'react';
import { Mail, PhoneCall, MapPin, Send, MessageSquare, Clock, Globe, ArrowRight } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

export default function ContactUs() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    subject: 'Booking Inquiry',
    bookingRef: '',
    message: ''
  });
  const [toastMessage, setToastMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4500);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.message) {
      showToast('⚠️ Please fill in all required fields (marked with *).');
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      const ticketId = `FAT-TKT-${Math.floor(100000 + Math.random() * 900000)}`;
      showToast(`✉️ Support ticket ${ticketId} created successfully! We will email you back within 2-3 hours.`);
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        subject: 'Booking Inquiry',
        bookingRef: '',
        message: ''
      });
      setSubmitting(false);
    }, 1200);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-satoshi text-gray-800">
      <Navbar />

      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white px-5 py-4 rounded-2xl shadow-2xl border border-gray-800 flex items-center gap-3 text-sm font-medium animate-bounce max-w-md animate-fadeIn">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ef3535] animate-pulse shrink-0"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#111111] to-[#2a0e0b] py-20 px-4 text-center text-white">
        {/* Gradients and visual noise */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(239,53,53,0.15),transparent_45%)]" />
        <div className="relative z-10 max-w-4xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 text-red-400 text-xs font-semibold uppercase tracking-wider mb-4 border border-white/5 backdrop-blur-md font-quicksand">
            <Sparkles className="w-3.5 h-3.5" /> 24/7 Support Desk
          </span>
          <h1 className="font-quicksand text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Get in Touch with Our <span className="text-[#ef3535]">Travel Experts</span>
          </h1>
          <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto font-light leading-relaxed">
            Have questions about a booking, cancellations, or custom tour planning? We're here to help you navigate your journey smoothly.
          </p>
        </div>
      </section>

      {/* MAIN CONTAINER */}
      <main className="flex-grow max-w-[1400px] w-full mx-auto px-4 lg:px-8 py-12 md:py-16 -mt-8 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Contact Cards & Info (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Quick Contact Info */}
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 space-y-6">
              <h2 className="text-xl font-bold text-gray-900 font-quicksand mb-2">Support Channels</h2>
              
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-red-50 text-[#ef3535] flex items-center justify-center shrink-0">
                  <PhoneCall className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Call Us 24/7</h3>
                  <p className="text-base font-bold text-gray-800 mt-1 font-quicksand">+91 99999 88888</p>
                  <p className="text-xs text-gray-500 font-light mt-0.5">Toll-free: 1800 123 4567</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-red-50 text-[#ef3535] flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Email Inquiry</h3>
                  <p className="text-base font-bold text-gray-800 mt-1">support@flyanytrip.com</p>
                  <p className="text-xs text-gray-500 font-light mt-0.5">For corporate sales: bookings@flyanytrip.com</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-red-50 text-[#ef3535] flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Headquarters</h3>
                  <p className="text-base font-bold text-gray-800 mt-1 leading-snug">FlyAnyTrip Pvt. Ltd.</p>
                  <p className="text-sm text-gray-500 font-light mt-1">
                    Plot No. 123, Sector 44, Gurugram, Haryana - 122003, India
                  </p>
                </div>
              </div>
            </div>

            {/* Timings Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gray-50 text-gray-600 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 font-quicksand text-sm">Response Time SLA</h4>
                <p className="text-xs text-gray-500 font-light mt-0.5">Average chat response: &lt; 2 minutes</p>
                <p className="text-xs text-gray-500 font-light">Email tickets resolved: &lt; 4 hours</p>
              </div>
            </div>

            {/* Custom Support Card */}
            <div className="bg-gradient-to-br from-[#ef3535] to-[#c62828] rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
              <div className="absolute right-0 bottom-0 opacity-10">
                <MessageSquare className="w-40 h-40 transform translate-x-10 translate-y-10" />
              </div>
              <div className="relative z-10">
                <h4 className="font-quicksand font-bold text-lg mb-2">Need Instant Help?</h4>
                <p className="text-sm text-red-100 font-light mb-4 leading-relaxed">
                  Skip the ticket and start a live chat session with our virtual travel assistant right away.
                </p>
                <button
                  onClick={() => showToast('💬 Opening FlyAnyTrip Live Chat Widget...')}
                  className="bg-white text-[#ef3535] px-4 py-2 rounded-xl text-xs font-bold hover:bg-red-50 transition-colors shadow-sm inline-flex items-center gap-1.5 cursor-pointer border-none"
                >
                  Start Live Chat <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT: Contact Form (7 Cols) */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 font-quicksand mb-1">Submit a Support Ticket</h2>
              <p className="text-sm text-gray-500 font-light mb-6">
                Fill in the details below and our ticketing team will immediately assign an agent to your case.
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col text-left">
                    <label className="text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Full Name *</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="e.g., John Doe"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#ef3535] focus:outline-none text-sm transition-colors"
                    />
                  </div>
                  <div className="flex flex-col text-left">
                    <label className="text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="e.g., john@example.com"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#ef3535] focus:outline-none text-sm transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col text-left">
                    <label className="text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="e.g., +91 98765 43210"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#ef3535] focus:outline-none text-sm transition-colors"
                    />
                  </div>
                  <div className="flex flex-col text-left">
                    <label className="text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Booking Reference / PNR</label>
                    <input
                      type="text"
                      name="bookingRef"
                      value={formData.bookingRef}
                      onChange={handleInputChange}
                      placeholder="e.g., PNR-93B2F (Optional)"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#ef3535] focus:outline-none text-sm uppercase transition-colors"
                    />
                  </div>
                </div>

                <div className="flex flex-col text-left">
                  <label className="text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Subject / Issue Topic</label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#ef3535] focus:outline-none text-sm transition-colors bg-white"
                  >
                    <option value="Booking Inquiry">Booking Inquiry</option>
                    <option value="Cancellations & Refunds">Cancellations & Refunds</option>
                    <option value="Rescheduling & Changes">Rescheduling & Flight Changes</option>
                    <option value="Payment Issue">Payment & Billing Queries</option>
                    <option value="Tour Customization">Custom Holiday Packages</option>
                    <option value="Other support">General Support / Feedback</option>
                  </select>
                </div>

                <div className="flex flex-col text-left">
                  <label className="text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Message Details *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows="5"
                    placeholder="Describe your query or problem in detail. Please provide passenger details if relating to rescheduling."
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#ef3535] focus:outline-none text-sm transition-colors resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[#ef3535] hover:bg-red-600 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-sm flex items-center justify-center gap-2 cursor-pointer border-none font-quicksand text-base"
                >
                  {submitting ? 'Creating Ticket...' : 'Submit Support Request'}
                  <Send className="w-4.5 h-4.5" />
                </button>
              </form>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}

// Add sparkles SVG mock since lucide doesn't have it directly or import it
function Sparkles({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
      <path d="m5 3 1 2.5L8.5 6 6 7 5 9.5 4 7 1.5 6 4 5 5 3Z" opacity="0.6"/>
      <path d="m19 17 1 2.5 2.5.5-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1 1-2.5Z" opacity="0.6"/>
    </svg>
  );
}
