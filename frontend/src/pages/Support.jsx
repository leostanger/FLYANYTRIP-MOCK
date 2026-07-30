import React, { useState, useRef } from 'react';
import {
  Search,
  X,
  Ticket,
  RotateCcw,
  CreditCard,
  Luggage,
  ChevronDown,
  MessageSquare,
  Mail,
  PhoneCall,
  Clock,
  User,
  Plane,
  FileText,
  Paperclip,
  Send,
  Star,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

const CATEGORY_CARDS = [
  { id: 'cat-1', icon: <Ticket className="w-6 h-6 stroke-[1.8]" />, title: 'Booking & Reservations' },
  { id: 'cat-2', icon: <RotateCcw className="w-6 h-6 stroke-[1.8]" />, title: 'Cancellations & Refunds' },
  { id: 'cat-3', icon: <CreditCard className="w-6 h-6 stroke-[1.8]" />, title: 'Payments & Pricing' },
  { id: 'cat-4', icon: <Luggage className="w-6 h-6 stroke-[1.8]" />, title: 'Baggage' },
];

const FAQ_ITEMS = [
  {
    id: 'faq-1',
    category: 'Booking & Reservations',
    question: 'How do I book a flight?',
    answer: "You can book a flight directly on our home page by entering your origin, destination, travel date, and passenger details, then clicking 'Search Flights'. Select your preferred flight and complete the checkout process using our secure payment gateway.",
  },
  {
    id: 'faq-2',
    category: 'Booking & Reservations',
    question: 'Can I book for someone else?',
    answer: 'Yes, absolutely! During the passenger details step on the booking page, simply enter the full legal name, ID details, and contact info of the person travelling. You can pay using your own card or payment method.',
  },
  {
    id: 'faq-3',
    category: 'Cancellations & Refunds',
    question: 'How do I cancel my booking?',
    answer: "Navigate to 'My Bookings' from the top bar, locate your confirmed trip, and click the 'Cancel Booking' button. Review the estimated refund amount in the popup modal and click 'Confirm Cancellation' to process it instantly.",
  },
  {
    id: 'faq-4',
    category: 'Cancellations & Refunds',
    question: 'When will I receive my refund?',
    answer: 'Once your booking cancellation is confirmed, the refund amount is initiated automatically and will be credited to your original payment method (Credit/Debit Card, Net Banking, UPI, or Wallet) within 5-7 business days.',
  },
  {
    id: 'faq-5',
    category: 'Payments & Pricing',
    question: 'Which payment methods are accepted?',
    answer: 'We accept all major Visa, Mastercard, American Express credit and debit cards, UPI (Google Pay, PhonePe, Paytm), Net Banking from 50+ Indian banks, and popular mobile wallets.',
  },
  {
    id: 'faq-6',
    category: 'Payments & Pricing',
    question: 'Are there any hidden charges?',
    answer: 'No, FlyAnyTrip believes in 100% price transparency. The total fare shown on the flight review page before payment includes all airline taxes, GST, and convenience fees. There are no surprise fees at checkout.',
  },
  {
    id: 'faq-7',
    category: 'Baggage',
    question: 'What is the baggage allowance?',
    answer: 'For domestic flights within India, standard check-in baggage allowance is typically 15kg per passenger, and cabin baggage allowance is 7kg (one handbag plus a laptop/personal item). Check your e-ticket for airline-specific rules.',
  },
  {
    id: 'faq-8',
    category: 'Baggage',
    question: 'How do I add extra baggage?',
    answer: "You can add pre-paid extra check-in baggage up to 3 hours before departure by clicking 'View Details' on your trip in 'My Bookings' or directly during the flight checkout flow under 'Add-ons & Extras'.",
  },
];

const TESTIMONIALS = [
  {
    id: 'test-1',
    stars: 5,
    quote: 'Issue resolved in under 5 minutes via live chat. Excellent service!',
    initial: 'K',
    name: 'Kiran Patel',
  },
  {
    id: 'test-2',
    stars: 5,
    quote: 'The support team was very patient and walked me through the whole refund process.',
    initial: 'M',
    name: 'Meera Nair',
  },
  {
    id: 'test-3',
    stars: 4,
    quote: 'Called the helpline and got connected immediately. No IVR maze!',
    initial: 'A',
    name: 'Arjun Singh',
  },
];

export default function Support() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [openFaqIds, setOpenFaqIds] = useState({});
  const [toastMessage, setToastMessage] = useState('');
  const [attachedFile, setAttachedFile] = useState(null);
  const fileInputRef = useRef(null);
  const faqSectionRef = useRef(null);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    pnr: '',
    category: 'Booking & Reservations',
    description: '',
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4500);
  };

  const toggleFaq = (id) => {
    setOpenFaqIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCategoryCardClick = (catTitle) => {
    setSelectedCategory(catTitle);
    setSearchQuery('');
    if (faqSectionRef.current) {
      faqSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setAttachedFile(file.name);
      showToast(`File attached: ${file.name}`);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files && e.dataTransfer.files[0];
    if (file) {
      setAttachedFile(file.name);
      showToast(`File attached: ${file.name}`);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.description) {
      showToast('Please fill out all required fields marked with *');
      return;
    }
    const reqId = `SR-${Math.floor(100000 + Math.random() * 900000)}`;
    showToast(`Support Request #${reqId} submitted successfully! We'll respond within 4-6 hours.`);
    setFormData({ fullName: '', email: '', pnr: '', category: 'Booking & Reservations', description: '' });
    setAttachedFile(null);
  };

  const handleLiveChat = () => {
    showToast('💬 Opening FlyAnyTrip Live Chat Widget... Connected to 24/7 Agent Support!');
  };

  const filteredFaqs = FAQ_ITEMS.filter((item) => {
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="font-sans flex flex-col min-h-screen bg-white text-gray-800">
      <Navbar />

      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white px-5 py-3.5 rounded-xl shadow-2xl border border-gray-700 flex items-center gap-3 text-sm font-medium animate-fadeIn max-w-md">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      <main className="flex-grow max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 space-y-16 sm:space-y-20">

        {/* HERO / SEARCH SECTION */}
        <section className="text-center max-w-4xl mx-auto pt-1 sm:pt-4">
          <h1 className="font-satoshi text-[24px] sm:text-[28px] font-bold text-[#1F2937] tracking-tight leading-tight">
            How can we help you?
          </h1>
          <p className="text-xs sm:text-[13px] font-normal text-gray-500 mt-1.5">
            Search our Help Center or choose a category below
          </p>

          <div className="mt-6 max-w-[640px] mx-auto relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
              <Search size={16} strokeWidth={2.5} />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for help (e.g. 'cancel booking', 'refund status')"
              className="w-full pl-11 pr-10 py-3 sm:py-3.5 rounded-xl border border-gray-300 focus:border-[#E8442D] focus:outline-none focus:ring-1 focus:ring-[#E8442D]/20 text-[13px] sm:text-[14px] font-normal transition-all shadow-[0_2px_10px_rgba(0,0,0,0.02)] bg-white text-gray-700 placeholder-gray-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X size={16} strokeWidth={2} />
              </button>
            )}
          </div>

          <div className="mt-4 flex flex-nowrap items-center justify-center gap-2 sm:gap-2.5 max-w-3xl mx-auto overflow-x-auto pb-2 px-2">
            {['Cancel booking', 'Refund status', 'Change date', 'Baggage policy', 'Web check-in', 'PNR status'].map((pill) => (
              <button
                key={pill}
                onClick={() => setSearchQuery(pill)}
                className="shrink-0 px-3.5 sm:px-4 py-1.5 bg-white rounded-full border border-gray-200 text-[11px] sm:text-[12px] text-gray-500 font-normal hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700 transition-colors cursor-pointer whitespace-nowrap"
              >
                {pill}
              </button>
            ))}
          </div>
        </section>

        {/* CATEGORY CARDS */}
        <section className="pt-2 !mt-8 sm:!mt-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {CATEGORY_CARDS.map((cat) => {
              const isSelected = selectedCategory === cat.title;
              return (
                <div
                  key={cat.id}
                  onClick={() => handleCategoryCardClick(cat.title)}
                  className={`p-4 sm:p-5 rounded-xl border transition-all duration-300 cursor-pointer text-center group flex flex-col items-center justify-center min-h-[140px] ${
                    isSelected
                      ? 'bg-[#fceded]/50 border-[#E8442D] shadow-xs ring-1 ring-[#E8442D]/20'
                      : 'bg-white border-gray-200/90 hover:shadow-sm hover:border-gray-300'
                  }`}
                >
                  <div className="w-11 h-11 rounded-full bg-[#fceded] text-[#E8442D] flex items-center justify-center text-xl mb-3 group-hover:scale-105 transition-transform shadow-xs select-none">
                    {cat.icon}
                  </div>
                  <h3 className="font-satoshi font-bold text-[13px] sm:text-[14px] text-[#1F2937] leading-snug tracking-tight">
                    {cat.title}
                  </h3>
                  {isSelected && (
                    <span className="mt-1.5 text-[11px] font-medium text-[#E8442D] bg-white px-2 py-0.5 rounded-full border border-[#fbdcd9]">
                      Active Filter
                    </span>
                  )}
                </div>
              );
            })}
          </div>
          {selectedCategory !== 'All' && (
            <div className="text-center mt-3.5">
              <button
                onClick={() => setSelectedCategory('All')}
                className="text-xs sm:text-[13px] font-semibold text-[#E8442D] hover:underline cursor-pointer inline-flex items-center gap-1"
              >
                <span>← Show All Categories</span>
              </button>
            </div>
          )}
        </section>

        {/* FAQ ACCORDION */}
        <section ref={faqSectionRef} className="w-full pt-2 text-left">
          <div className="space-y-2.5 w-full text-left">
            {filteredFaqs.length === 0 ? (
              <div className="bg-[#F7F7F8] border border-gray-200 rounded-xl p-8 text-center">
                <div className="flex justify-center mb-2 text-gray-400"><Search size={32} strokeWidth={1.5} /></div>
                <h3 className="text-[14px] font-semibold text-[#1F2937]">No matching help articles found</h3>
                <p className="text-xs sm:text-[13px] text-gray-500 mt-1 mb-4">
                  We couldn't find anything matching "{searchQuery}". Try different keywords or contact our support team below.
                </p>
                <button
                  onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                  className="bg-[#E8442D] text-white font-medium px-4 py-2 rounded-lg text-xs sm:text-[13px] hover:bg-red-600 transition-colors cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              filteredFaqs.map((faq) => {
                const isOpen = !!openFaqIds[faq.id];
                return (
                  <div
                    key={faq.id}
                    className="bg-white border border-gray-200/90 rounded-xl overflow-hidden transition-all duration-200 shadow-xs hover:border-gray-300 w-full text-left"
                  >
                    <button
                      onClick={() => toggleFaq(faq.id)}
                      className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-3 cursor-pointer focus:outline-none"
                    >
                      <span style={{ color: '#1A1A1A', fontFamily: 'Quicksand, sans-serif', fontSize: '14px', fontWeight: 500, lineHeight: '18.75px' }}>
                        {faq.question}
                      </span>
                      <span className={`transition-transform duration-300 shrink-0 select-none ${isOpen ? 'rotate-180 text-[#E8442D]' : 'text-gray-400'}`}>
                        <ChevronDown size={18} strokeWidth={2} />
                      </span>
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 pt-1 sm:px-5 sm:pb-5 text-xs sm:text-[13px] text-gray-500 leading-relaxed font-normal border-t border-gray-100/80 bg-[#F7F7F8]/50">
                        <p className="pt-2">{faq.answer}</p>
                        <div className="mt-3.5 pt-2.5 border-t border-dashed border-gray-200 flex items-center justify-between text-[11px] text-gray-400 font-medium">
                          <span>Category: <span className="font-satoshi text-gray-600 font-semibold">{faq.category}</span></span>
                          <span className="inline-flex items-center gap-1">
                            Was this helpful?
                            <button type="button" className="hover:text-[#E8442D] inline-flex items-center ml-1 cursor-pointer"><ThumbsUp size={13} /></button>
                            <button type="button" className="hover:text-[#E8442D] inline-flex items-center ml-1 cursor-pointer"><ThumbsDown size={13} /></button>
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </section>

        {/* CONTACT SUPPORT CARDS */}
        <section className="pt-4">
          <h2 className="text-[18px] sm:text-[20px] font-bold text-[#1F2937] mb-4 tracking-tight text-left">
            Contact Our Support Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">

            {/* Live Chat */}
            <div className="bg-white border border-gray-200/90 rounded-xl p-4 sm:p-5 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center mb-3 shadow-inner select-none">
                  <MessageSquare size={18} strokeWidth={2} />
                </div>
                <h3 className="text-[15px] font-bold text-[#1F2937] tracking-tight">Live Chat</h3>
                <p className="text-[12px] text-gray-500 font-normal mt-1 mb-3">Chat with a support agent in real-time</p>
                <div className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full w-fit mb-4 border border-emerald-200/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Avg. wait: &lt;2 minutes</span>
                </div>
              </div>
              <div>
                <button
                  onClick={handleLiveChat}
                  className="w-full py-2.5 px-3.5 rounded-lg bg-gray-900 hover:bg-black text-white font-medium text-xs sm:text-[13px] transition-all cursor-pointer shadow-xs active:scale-95 flex items-center justify-center gap-1.5"
                >
                  <MessageSquare size={15} strokeWidth={2} />
                  <span>Start Chat</span>
                </button>
                <div className="text-[11px] text-gray-400 font-medium text-center mt-2.5">Available 24/7</div>
              </div>
            </div>

            {/* Email Support */}
            <div className="bg-white border border-gray-200/90 rounded-xl p-4 sm:p-5 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-full bg-[#fceded] text-[#E8442D] flex items-center justify-center mb-3 shadow-xs select-none">
                  <Mail size={18} strokeWidth={2} />
                </div>
                <h3 className="text-[15px] font-bold text-[#1F2937] tracking-tight">Email Support</h3>
                <p className="text-[12px] text-gray-500 font-normal mt-1 mb-3">Send us a detailed query via email</p>
                <div className="flex items-center gap-1.5 text-[11px] font-medium text-gray-700 bg-gray-100 px-2.5 py-1 rounded-full w-fit mb-4 border border-gray-200">
                  <Clock size={13} className="text-gray-500" />
                  <span>Response within 4-6 hours</span>
                </div>
              </div>
              <div>
                <a
                  href="mailto:support@flyanytrip.com"
                  className="w-full py-2.5 px-3.5 rounded-lg bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium text-xs sm:text-[13px] transition-all cursor-pointer shadow-xs active:scale-95 flex items-center justify-center gap-1.5 no-underline"
                >
                  <Mail size={15} strokeWidth={2} className="text-[#E8442D]" />
                  <span>Send Email</span>
                </a>
                <div className="text-[11px] text-gray-400 font-medium text-center mt-2.5">support@flyanytrip.com</div>
              </div>
            </div>

            {/* Phone Support */}
            <div className="bg-white border border-gray-200/90 rounded-xl p-4 sm:p-5 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-full bg-[#fceded] text-[#E8442D] flex items-center justify-center mb-3 shadow-xs select-none">
                  <PhoneCall size={18} strokeWidth={2} />
                </div>
                <h3 className="text-[15px] font-bold text-[#1F2937] tracking-tight">Phone Support</h3>
                <p className="text-[12px] text-gray-500 font-normal mt-1 mb-3">Speak directly with our team</p>
                <div className="flex items-center gap-1.5 text-[11px] font-medium text-gray-700 bg-gray-100 px-2.5 py-1 rounded-full w-fit mb-4 border border-gray-200">
                  <Clock size={13} className="text-gray-500" />
                  <span>Avg. hold: 3-5 minutes</span>
                </div>
              </div>
              <div>
                <a
                  href="tel:18000004567"
                  className="w-full py-2.5 px-3.5 rounded-lg bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium text-xs sm:text-[13px] transition-all cursor-pointer shadow-xs active:scale-95 flex items-center justify-center gap-1.5 no-underline"
                >
                  <PhoneCall size={15} strokeWidth={2} className="text-[#E8442D]" />
                  <span>1800-000-4567 (Toll Free)</span>
                </a>
                <div className="text-[11px] text-gray-400 font-medium text-center mt-2.5">Mon-Sat: 7AM–11PM</div>
              </div>
            </div>

          </div>
        </section>

        {/* RAISE SUPPORT REQUEST FORM */}
        <section className="pt-4">
          <div className="bg-white border border-gray-200/90 rounded-xl p-5 sm:p-6 lg:p-8 shadow-sm w-full transition-all duration-300 hover:shadow-md hover:border-gray-300 focus-within:ring-4 focus-within:ring-[#E8442D]/30 focus-within:border-[#E8442D] focus-within:shadow-[0_0_35px_rgba(232,68,45,0.25)]">
            <h2 className="font-satoshi text-[18px] sm:text-[20px] font-bold text-[#1F2937] mb-5 tracking-tight">
              Raise a Support Request
            </h2>

            <form onSubmit={handleFormSubmit} className="space-y-4 sm:space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                <div>
                  <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">
                    Full Name <span className="text-[#E8442D]">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"><User size={16} /></span>
                    <input
                      type="text" required value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="Your name"
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-lg border border-gray-300 focus:border-[#E8442D] focus:outline-none focus:ring-2 focus:ring-[#E8442D]/40 focus:shadow-[0_0_15px_rgba(232,68,45,0.2)] font-normal text-xs sm:text-[13px] transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">
                    Email Address <span className="text-[#E8442D]">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"><Mail size={16} /></span>
                    <input
                      type="email" required value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="your@email.com"
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-lg border border-gray-300 focus:border-[#E8442D] focus:outline-none focus:ring-2 focus:ring-[#E8442D]/40 focus:shadow-[0_0_15px_rgba(232,68,45,0.2)] font-normal text-xs sm:text-[13px] transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                <div>
                  <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">
                    PNR / Booking Reference
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"><Plane size={16} /></span>
                    <input
                      type="text" value={formData.pnr}
                      onChange={(e) => setFormData({ ...formData, pnr: e.target.value })}
                      placeholder="e.g. FLY8K2M4"
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-lg border border-gray-300 focus:border-[#E8442D] focus:outline-none focus:ring-2 focus:ring-[#E8442D]/40 focus:shadow-[0_0_15px_rgba(232,68,45,0.2)] font-normal text-xs sm:text-[13px] transition-all uppercase"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">
                    Issue Category <span className="text-[#E8442D]">*</span>
                  </label>
                  <div className="relative">
                    <select
                      required value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 focus:border-[#E8442D] focus:outline-none focus:ring-2 focus:ring-[#E8442D]/40 font-normal text-xs sm:text-[13px] transition-all bg-white appearance-none cursor-pointer"
                    >
                      <option value="Booking & Reservations">Booking & Reservations</option>
                      <option value="Cancellations & Refunds">Cancellations & Refunds</option>
                      <option value="Payments & Pricing">Payments & Pricing</option>
                      <option value="Baggage">Baggage</option>
                      <option value="Other Technical Issue">Other Technical Issue</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-gray-400"><ChevronDown size={16} /></div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">
                  Describe your issue <span className="text-[#E8442D]">*</span>
                </label>
                <textarea
                  required rows={4} value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Please describe your issue in detail..."
                  className="w-full p-3.5 rounded-lg border border-gray-300 focus:border-[#E8442D] focus:outline-none focus:ring-2 focus:ring-[#E8442D]/40 focus:shadow-[0_0_15px_rgba(232,68,45,0.2)] font-normal text-xs sm:text-[13px] transition-all resize-y"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">
                  Attachments (optional)
                </label>
                <input
                  type="file" ref={fileInputRef} onChange={handleFileChange}
                  className="hidden" accept="image/png,image/jpeg,application/pdf"
                />
                <div
                  onDragOver={(e) => e.preventDefault()} onDrop={handleDrop}
                  onClick={() => fileInputRef.current && fileInputRef.current.click()}
                  className="border-2 border-dashed border-gray-300 hover:border-[#E8442D] rounded-xl p-5 sm:p-6 text-center bg-gray-50/50 hover:bg-[#fceded]/20 cursor-pointer transition-all"
                >
                  {attachedFile ? (
                    <div className="flex items-center justify-center gap-2 text-emerald-700 font-semibold text-xs sm:text-[13px]">
                      <Paperclip size={16} className="shrink-0" />
                      <span>File attached: <span className="underline">{attachedFile}</span></span>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setAttachedFile(null); }}
                        className="text-red-500 font-bold ml-2 hover:text-red-700"
                      >(Remove)</button>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-center mb-2 text-gray-400"><FileText size={28} strokeWidth={1.5} /></div>
                      <div className="text-xs sm:text-[13px] font-semibold text-gray-700">
                        Drag & drop files or <span className="text-[#E8442D] underline font-bold">browse</span>
                      </div>
                      <div className="text-[11px] font-normal text-gray-400 mt-1">PNG, JPG, PDF up to 5MB</div>
                    </>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-gray-100">
                <button
                  type="submit"
                  className="bg-[#E8442D] hover:bg-red-600 text-white font-medium px-6 py-2.5 rounded-lg shadow-xs hover:shadow-sm transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-2 text-xs sm:text-[13px] w-full sm:w-auto"
                >
                  <Send size={15} strokeWidth={2} />
                  <span>Submit Request</span>
                </button>
                <span className="text-xs sm:text-[13px] text-gray-500 font-normal text-center sm:text-right">
                  We'll respond within 4-6 hours
                </span>
              </div>
            </form>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="pt-6">
          <h2 className="text-[18px] sm:text-[20px] font-bold text-[#1F2937] mb-4 tracking-tight text-left">
            What Customers Say About Our Support
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
            {TESTIMONIALS.map((test) => (
              <div
                key={test.id}
                className="bg-white border border-gray-200/90 rounded-xl p-4 sm:p-5 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1 text-[#E8442D] mb-2.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i} size={15}
                        className={i < test.stars ? 'fill-[#E8442D] text-[#E8442D]' : 'fill-gray-200 text-gray-200'}
                      />
                    ))}
                  </div>
                  <p className="italic text-gray-600 text-xs sm:text-[13px] leading-relaxed font-normal mb-4">
                    "{test.quote}"
                  </p>
                </div>
                <div>
                  <div className="border-t border-gray-100 mb-3"></div>
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-red-100 text-[#E8442D] font-bold flex items-center justify-center text-xs select-none shadow-xs shrink-0">
                      {test.initial}
                    </div>
                    <div className="font-semibold text-[#1F2937] text-xs sm:text-[13px]">{test.name}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA BANNER */}
        <section className="pt-4 pb-4">
          <div
            className="text-white rounded-xl p-6 sm:p-8 shadow-md flex flex-col lg:flex-row items-center justify-between gap-6 text-center lg:text-left"
            style={{ background: 'linear-gradient(122deg, #F1393A 0%, #000 87.75%)' }}
          >
            <div>
              <h2 className="text-[20px] sm:text-[24px] font-bold tracking-tight mb-1.5">Still need help?</h2>
              <p className="text-gray-300 font-normal text-xs sm:text-[13px] max-w-xl">
                Our team is available 24/7. Average first response: under 2 minutes.
              </p>
            </div>
            <div className="flex flex-wrap sm:flex-nowrap items-center justify-center gap-3 shrink-0 w-full lg:w-auto">
              <button
                onClick={handleLiveChat}
                className="flex-1 sm:flex-initial bg-white hover:bg-gray-100 text-gray-900 font-medium px-5 py-2.5 rounded-lg shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 text-xs sm:text-[13px] active:scale-95 whitespace-nowrap"
              >
                <MessageSquare size={16} strokeWidth={2} className="text-[#1E3A8A]" />
                <span>Live Chat</span>
              </button>
              <a
                href="tel:18000004567"
                className="flex-1 sm:flex-initial bg-transparent hover:bg-white/10 text-white font-medium px-5 py-2.5 rounded-lg border border-white/80 transition-all cursor-pointer flex items-center justify-center gap-1.5 text-xs sm:text-[13px] active:scale-95 whitespace-nowrap no-underline"
              >
                <PhoneCall size={16} strokeWidth={2} />
                <span>Call Now</span>
              </a>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
