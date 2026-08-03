import React from 'react';
import { Link } from 'react-router-dom';
import { Network, Plane, Hotel, Navigation, ShieldCheck, Mail, HelpCircle, Briefcase, FileText, Info } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

export default function Sitemap() {
  const categories = [
    {
      title: "Booking Portals",
      desc: "Instant search engine forms for flights, hotels, and customized group packages.",
      links: [
        { label: "Flight Bookings", path: "/?tab=flights", icon: <Plane className="w-4 h-4 text-[#ef3535]" /> },
        { label: "Hotel Reservations", path: "/?tab=hotels", icon: <Hotel className="w-4 h-4 text-blue-500" /> },
        { label: "Tour Packages Catalog", path: "/tour-packages", icon: <Navigation className="w-4 h-4 text-emerald-500" /> }
      ]
    },
    {
      title: "Customer Support & Actions",
      desc: "Direct digital panels to track flight PNRs, file refund claims, or request cancellation tickets.",
      links: [
        { label: "Help Center / FAQs", path: "/support", icon: <HelpCircle className="w-4 h-4 text-purple-500" /> },
        { label: "Contact Us Desk", path: "/contact-us", icon: <Mail className="w-4 h-4 text-[#ef3535]" /> },
        { label: "Refund Policy Statement", path: "/refund-policy", icon: <ShieldCheck className="w-4 h-4 text-emerald-500" /> },
        { label: "Cancel Booking Panel", path: "/cancel-booking", icon: <ShieldCheck className="w-4 h-4 text-red-500" /> },
        { label: "Flight PNR Status Tracker", path: "/pnr-status", icon: <Plane className="w-4 h-4 text-blue-500" /> }
      ]
    },
    {
      title: "Corporate & Team",
      desc: "Find out more about our journey, certified associations, and active job postings.",
      links: [
        { label: "About Us Story", path: "/about-us", icon: <Info className="w-4 h-4 text-amber-500" /> },
        { label: "Careers & Open Roles", path: "/careers", icon: <Briefcase className="w-4 h-4 text-[#ef3535]" /> }
      ]
    },
    {
      title: "Legal & Standards",
      desc: "User compliance terms, transaction limits, and user private data processing protocols.",
      links: [
        { label: "Privacy Policy Document", path: "/privacy-policy", icon: <FileText className="w-4 h-4 text-gray-500" /> },
        { label: "Terms & Conditions Agreement", path: "/terms-and-conditions", icon: <FileText className="w-4 h-4 text-gray-500" /> }
      ]
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-satoshi text-gray-800">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#111111] to-[#2a0e0b] py-16 px-4 text-center text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(239,53,53,0.15),transparent_45%)]" />
        <div className="relative z-10 max-w-4xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 text-red-400 text-xs font-semibold uppercase tracking-wider mb-4 border border-white/5 backdrop-blur-md font-quicksand">
            <Network className="w-3.5 h-3.5" /> Full Sitemap Directory
          </span>
          <h1 className="font-quicksand text-4xl font-bold tracking-tight mb-3">
            FlyAnyTrip <span className="text-[#ef3535]">Sitemap</span>
          </h1>
          <p className="text-gray-400 text-sm md:text-base max-w-xl mx-auto font-light">
            A comprehensive, clean index of all available search tabs, booking panels, refund desks, and policy terms on our platform.
          </p>
        </div>
      </section>

      {/* SITEMAP GRID */}
      <main className="flex-grow max-w-[1200px] w-full mx-auto px-4 py-12 md:py-16 -mt-8 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          {categories.map((cat, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 flex flex-col justify-between">
              <div>
                <h3 className="font-quicksand font-bold text-lg text-gray-900 border-b border-gray-100 pb-3 mb-2">{cat.title}</h3>
                <p className="text-xs sm:text-sm text-gray-400 font-light mb-6 leading-relaxed">{cat.desc}</p>
                
                <ul className="space-y-4">
                  {cat.links.map((link, idx) => (
                    <li key={idx}>
                      <Link 
                        to={link.path} 
                        className="inline-flex items-center gap-3 text-sm font-semibold text-gray-700 hover:text-[#ef3535] transition-colors no-underline group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                          {link.icon}
                        </div>
                        <span className="group-hover:underline">{link.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
