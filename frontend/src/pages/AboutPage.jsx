import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Globe,
  ShieldCheck,
  Shield,
  Eye,
  CheckCircle2,
  Award,
  Star,
  TrendingUp,
  Users,
  Zap,
  Heart,
  Clock,
  Plane,
  Building2,
  Sparkles,
  PhoneCall,
  ArrowRight,
  Target,
  FileText,
  Compass,
  Bus,
  Train,
  Briefcase,
  MapPin,
  Mail,
  ThumbsUp,
  Handshake,
  Headset
} from 'lucide-react';
import TopBar from '../components/common/TopBar';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

const aboutPlaneBg = 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=2070&auto=format&fit=crop&q=80';
const arjunMehtaImg = 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&auto=format&fit=crop&q=80';
const priyaImg = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80';
const rohanImg = 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&auto=format&fit=crop&q=80';

// Stats list matching screenshot
const STATS = [
  { value: '2.4M+', label: 'Happy Travellers', icon: Users, bg: 'bg-blue-50', color: 'text-blue-500' },
  { value: '180+', label: 'Destinations Covered', icon: Globe, bg: 'bg-emerald-50', color: 'text-emerald-500' },
  { value: '12+', label: 'Years of Excellence', icon: Award, bg: 'bg-purple-50', color: 'text-purple-500' },
  { value: '98%', label: 'Customer Satisfaction', icon: Star, bg: 'bg-amber-50', color: 'text-amber-500' },
  { value: '50K+', label: 'Bookings / Month', icon: TrendingUp, bg: 'bg-pink-50', color: 'text-pink-500' },
  { value: '24/7', label: 'Travel Support', icon: Headset, bg: 'bg-cyan-50', color: 'text-cyan-500' },
];

// Our Story Cards
const STORY_CARDS = [
  {
    isDark: true,
    icon: Eye,
    title: 'Our Vision',
    desc: 'To be the most trusted travel companion for every Indian traveller, making world-class travel accessible, affordable, and effortless.',
  },
  {
    isDark: false,
    icon: Target,
    title: 'Our Mission',
    desc: 'Simplify every aspect of travel planning through technology, curated content, and human-first customer service.',
  },
  {
    isDark: false,
    icon: CheckCircle2,
    title: 'Our Promise',
    desc: 'Best price guarantee on all bookings. No hidden fees. Free rescheduling on eligible tickets. 24/7 real-human support.',
  },
  {
    isDark: false,
    icon: Clock,
    title: 'Always On',
    desc: "Round-the-clock travel desk, live chat, and emergency helpline — because journeys don't follow business hours.",
  },
];

// Services Offered
const SERVICES = [
  {
    icon: Plane,
    title: 'Flight Bookings',
    desc: 'Domestic & international flights on 200+ airlines with best-price guarantee.',
  },
  {
    icon: Building2,
    title: 'Hotel Stays',
    desc: 'From budget homestays to 5-star resorts — 80,000+ verified properties.',
  },
  {
    icon: Train,
    title: 'Train Tickets',
    desc: 'IRCTC-integrated booking with real-time seat availability and PNR tracking.',
  },
  {
    icon: Compass,
    title: 'Tour Packages',
    desc: '500+ handcrafted itineraries covering heritage, adventure, and culture.',
  },
  {
    icon: Sparkles,
    title: 'Holiday Deals',
    desc: 'All-inclusive holiday packages for couples, families, solo, and groups.',
  },
  {
    icon: Briefcase,
    title: 'Corporate Travel',
    desc: 'Managed travel programs for 200+ enterprise clients with dedicated desk.',
  },
];

// Core Values
const CORE_VALUES = [
  {
    icon: Heart,
    title: 'Traveller-First',
    desc: 'Every decision starts with one question: does this make the journey better for the traveller?',
  },
  {
    icon: Shield,
    title: 'Trust & Transparency',
    desc: 'No hidden charges, no dark patterns. Price shown is price paid — always.',
  },
  {
    icon: Zap,
    title: 'Speed & Reliability',
    desc: 'Instant confirmation, real-time inventory, and sub-3-second search results.',
  },
  {
    icon: Globe,
    title: 'World-Class Reach',
    desc: '180+ destinations, 500+ airlines, 80,000+ hotels — all searchable in one place.',
  },
  {
    icon: Target,
    title: 'Personalisation',
    desc: 'AI-curated recommendations that learn from your preferences and past travels.',
  },
  {
    icon: Eye,
    title: 'Accessibility',
    desc: 'Built for every Indian — from metros to Tier-3 cities, in 8 regional languages.',
  },
];

// Leadership Team
const TEAM = [
  {
    name: 'Arjun Mehta',
    role: 'Founder & CEO',
    desc: 'Ex-McKinsey travel tech strategist with 18 years in global OTA leadership.',
    location: 'Mumbai',
    since: 'Since 2012',
    image: arjunMehtaImg,
  },
  {
    name: 'Priya Chandrasekhar',
    role: 'Co-Founder & COO',
    desc: 'Ex-McKinsey travel tech strategist with 18 years in global OTA leadership.',
    location: 'Mumbai',
    since: 'Since 2012',
    image: priyaImg,
  },
  {
    name: 'Rohan Kapoor',
    role: 'CTO',
    desc: 'Ex-McKinsey travel tech strategist with 18 years in global OTA leadership.',
    location: 'Mumbai',
    since: 'Since 2012',
    image: rohanImg,
  },
];

// Offices
const OFFICES = [
  {
    city: 'Mumbai',
    label: 'Headquarters',
    address: 'Level 14, One BKC, Bandra Kurla Complex, Mumbai – 400 051',
    phone: '+91 22 6900 0001',
  },
  {
    city: 'Delhi',
    label: 'North India Office',
    address: '3rd Floor, DLF Cyber Hub, Gurugram – 122 002',
    phone: '+91 11 4500 0002',
  },
  {
    city: 'Bangalore',
    label: 'Tech Hub',
    address: 'Prestige Tech Park, Outer Ring Road, Bangalore – 560 103',
    phone: '+91 80 6800 0003',
  },
  {
    city: 'Dubai',
    label: 'International Office',
    address: 'Office 2101, Single Business Tower, DIFC, Dubai, UAE',
    phone: '+971 4 520 0004',
  },
];

export default function AboutPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="font-satoshi flex flex-col min-h-screen bg-gray-50/50 text-gray-900">
      <TopBar />
      <Navbar />

      <main className="flex-grow">
        {/* ── 1. HERO BANNER SECTION ── */}
        <section className="relative min-h-[480px] lg:min-h-[520px] flex flex-col justify-between text-gray-900 overflow-hidden bg-gradient-to-r from-orange-50/40 via-amber-50/20 to-transparent">
          {/* Background Image with Clean Airplane Wing Sunset */}
          <div className="absolute inset-0 z-0">
            <img
              src={aboutPlaneBg}
              alt="Airplane Wing Sunset"
              className="w-full h-full object-cover object-center sm:object-right-top"
            />
            {/* Soft subtle gradient tint on text side */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/80 via-white/40 to-transparent sm:w-[60%]" />
          </div>

          <div className="max-w-[1240px] w-full mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 relative z-10">
            <div className="max-w-[560px]">
              {/* Heading */}
              <h1 className="text-3xl sm:text-5xl lg:text-5xl font-extrabold tracking-tight leading-[1.15] mb-4 text-gray-900">
                We Make Every <br className="hidden sm:inline" />
                Journey <span className="text-[#E53935]">Unforgettable</span>
              </h1>

              {/* Description */}
              <p className="text-gray-700 text-xs sm:text-sm font-normal leading-relaxed mb-6 max-w-[480px]">
                India's full-service tours and travel platform. Flights, hotels, trains, tour packages, and holiday deals — curated, compared, and confirmed in one seamless experience.
              </p>

              {/* Action Button */}
              <Link
                to="/flights"
                className="inline-flex items-center justify-center bg-[#E53935] hover:bg-[#D32F2F] text-white font-bold px-7 py-3 rounded-xl transition-all duration-200 shadow-md text-sm no-underline"
              >
                Explore Now
              </Link>
            </div>
          </div>

          {/* ── 2. FLOATING WHITE STATS BAR OVERLAY INSIDE HERO ── */}
          <div className="relative z-20 max-w-[1240px] w-full mx-auto px-4 sm:px-6 lg:px-8 pb-6">
            <div className="bg-white rounded-2xl p-5 shadow-[0_15px_40px_-10px_rgba(0,0,0,0.08)] border border-gray-100">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
                {STATS.map((stat, idx) => {
                  const IconComponent = stat.icon;
                  return (
                    <div
                      key={idx}
                      className="flex flex-col items-center text-center p-1"
                    >
                      <div className={`w-9 h-9 rounded-full ${stat.bg} ${stat.color} flex items-center justify-center mb-2`}>
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight">
                        {stat.value}
                      </div>
                      <div className="text-gray-400 text-[11px] font-normal mt-0.5 whitespace-nowrap">
                        {stat.label}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ── 3. OUR STORY SECTION ── */}
        <section className="py-10 px-4 sm:px-6 lg:px-8 max-w-[1240px] mx-auto mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            {/* Left Narrative */}
            <div className="lg:col-span-6">
              <span className="text-[#E53935] text-xs font-bold uppercase tracking-wider mb-2 block">
                OUR STORY
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-900 leading-tight mb-6">
                Born in India. Built for the World's Most Curious Travellers.
              </h2>
              <p className="text-gray-500 text-xs sm:text-sm leading-relaxed mb-5 font-normal">
                FlyAnyTrip was founded in 2012 by two travel enthusiasts who were frustrated by fragmented booking experiences — one site for flights, another for hotels, a third for trains, and a travel agent for packages. We believed that a single, trustworthy platform could do it all, better.
              </p>
              <p className="text-gray-500 text-xs sm:text-sm leading-relaxed mb-8 font-normal">
                Today, we serve over 2.4 million travellers annually across flights, hotels, trains, tour packages, and curated holidays — from weekend getaways in Coorg to overwater bungalows in the Maldives. Every booking is backed by our 24/7 travel concierge team.
              </p>

              <Link
                to="/support"
                className="inline-flex items-center gap-2 border border-[#E53935] text-[#E53935] hover:bg-[#E53935] hover:text-white px-6 py-2.5 rounded-full font-medium text-xs sm:text-sm transition-all duration-200 no-underline"
              >
                <span>Contact Us</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Right 2x2 Feature Cards Grid */}
            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
              {STORY_CARDS.map((card, idx) => {
                const CardIcon = card.icon;
                return (
                  <div
                    key={idx}
                    className={`p-6 rounded-2xl transition-all duration-300 flex flex-col justify-between ${card.isDark
                        ? 'bg-[#18181B] text-white shadow-xl border border-gray-800'
                        : 'bg-white text-gray-900 border border-gray-200/80 shadow-sm hover:shadow-md'
                      }`}
                  >
                    <div>
                      {/* Icon Button */}
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center mb-4 ${card.isDark ? 'bg-white/10 text-white' : 'bg-[#FEE2E2]/60 text-[#E53935]'
                        }`}>
                        <CardIcon className="w-4 h-4" />
                      </div>
                      <h3 className={`text-base font-bold mb-2 ${card.isDark ? 'text-white' : 'text-gray-900'}`}>
                        {card.title}
                      </h3>
                      <p className={`text-xs leading-relaxed font-normal min-h-[38px] ${card.isDark ? 'text-gray-300' : 'text-gray-500'
                        }`}>
                        {card.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── 4. WHAT WE OFFER SECTION ── */}
        <section className="py-12 bg-white border-y border-gray-100 mb-16">
          <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-10">
              <span className="text-[#E53935] text-xs font-bold uppercase tracking-wider mb-2 block">
                WHAT WE OFFER
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-900">
                Everything Travel. One Platform.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {SERVICES.map((srv, i) => {
                const SrvIcon = srv.icon;
                return (
                  <div
                    key={i}
                    className="p-6 rounded-2xl bg-white border border-gray-200/80 shadow-sm hover:shadow-md transition-all duration-300 flex items-start gap-4"
                  >
                    {/* Soft Red Squircle Icon Button */}
                    <div className="w-10 h-10 rounded-xl bg-[#FEE2E2]/70 text-[#E53935] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <SrvIcon className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-bold text-gray-900 mb-1 leading-snug">{srv.title}</h3>
                      <p className="text-xs text-gray-500 font-normal leading-relaxed">{srv.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── 5. WHAT WE STAND FOR (CORE VALUES) ── */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-[1240px] mx-auto mb-16">
          <div className="mb-10">
            <span className="text-[#E53935] text-xs font-bold uppercase tracking-wider mb-2 block">
              OUR CORE VALUES
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-900">
              What We Stand For
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CORE_VALUES.map((val, i) => {
              const ValIcon = val.icon;
              return (
                <div
                  key={i}
                  className="p-6 rounded-2xl bg-white border border-gray-200/80 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Soft Green Circular Icon Button */}
                    <div className="w-9 h-9 rounded-full bg-[#ECFDF5] text-[#10B981] flex items-center justify-center mb-4">
                      <ValIcon className="w-4 h-4" />
                    </div>
                    <h3 className="text-base font-bold text-gray-900 mb-2">{val.title}</h3>
                    <p className="text-xs text-gray-500 font-normal leading-relaxed min-h-[38px]">{val.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── 6. LEADERSHIP TEAM SECTION ── */}
        <section className="py-12 bg-white border-y border-gray-100 mb-16">
          <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-10">
              <span className="text-[#E53935] text-xs font-bold uppercase tracking-wider mb-2 block">
                THE PEOPLE
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-900">
                Leadership Team
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {TEAM.map((member, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl overflow-hidden border border-gray-200/80 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                >
                  {/* Leadership Card Image Container */}
                  <div className="h-56 sm:h-64 w-full overflow-hidden relative bg-gray-100">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover object-[center_20%] hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6 flex-grow flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-0.5">{member.name}</h3>
                      <p className="text-xs text-gray-400 font-medium mb-3">{member.role}</p>
                      <p className="text-gray-600 text-xs sm:text-sm leading-relaxed font-normal mb-5">
                        {member.desc}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-400 font-medium">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                        <span>{member.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                        <span>{member.since}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 7. OUR OFFICES SECTION ── */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-[1240px] mx-auto mb-12">
          <div className="mb-8">
            <span className="text-[#E53935] text-xs font-bold uppercase tracking-widest bg-red-50 px-3 py-1 rounded-full inline-block mb-3">
              Find Us
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-gray-900">
              Our Offices
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {OFFICES.map((off, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-white border border-gray-200/80 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Red Squircle Icon Button */}
                  <div className="w-9 h-9 rounded-xl bg-[#E53935] text-white flex items-center justify-center mb-4 shadow-sm">
                    <Building2 className="w-4 h-4" />
                  </div>
                  {/* City Name */}
                  <h3 className="text-lg font-bold text-gray-900 mb-0.5 leading-snug">{off.city}</h3>
                  {/* Label */}
                  <p className="text-xs text-gray-400 font-normal mb-3">{off.label}</p>
                  {/* Address */}
                  <p className="text-xs text-gray-500 font-normal leading-relaxed mb-4 min-h-[38px]">{off.address}</p>
                </div>
                {/* Phone Call Line */}
                <div className="flex items-center gap-1.5 text-xs font-bold text-gray-900 pt-1">
                  <PhoneCall className="w-3.5 h-3.5 text-gray-700 flex-shrink-0" />
                  <span>{off.phone}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 8. WE'RE HERE TO HELP & PLAN YOUR NEXT TRIP ── */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-[1240px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Box: We're Here to Help */}
            <div className="lg:col-span-6 flex flex-col justify-between pr-0 lg:pr-4">
              <div>
                <span className="text-[#E53935] text-xs font-bold uppercase tracking-wider mb-2 block">
                  GET IN TOUCH
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-8">
                  We're Here to Help
                </h2>

                <div className="space-y-6 mb-10">
                  {/* Phone */}
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-full bg-[#FEE2E2]/70 text-[#E53935] flex items-center justify-center flex-shrink-0">
                      <PhoneCall className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-base font-bold text-gray-900 leading-tight">Toll-Free Helpline</p>
                      <p className="text-sm text-gray-500 font-normal">1800-000-4567 (24/7, all days)</p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-full bg-[#FEE2E2]/70 text-[#E53935] flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-base font-bold text-gray-900 leading-tight">Email Support</p>
                      <p className="text-sm text-gray-500 font-normal">support@flyanytrip.in · bookings@flyanytrip.in</p>
                    </div>
                  </div>

                  {/* Live Chat */}
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-full bg-[#FEE2E2]/70 text-[#E53935] flex items-center justify-center flex-shrink-0">
                      <Headset className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-base font-bold text-gray-900 leading-tight">Live Chat</p>
                      <p className="text-sm text-gray-500 font-normal">Available in-app and on website, 6 AM - midnight</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex items-center gap-3">
                <a href="#twitter" className="w-9 h-9 rounded-full border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 flex items-center justify-center transition-colors" title="Twitter / X">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                </a>
                <a href="#facebook" className="w-9 h-9 rounded-full border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 flex items-center justify-center transition-colors" title="Facebook">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                </a>
                <a href="#instagram" className="w-9 h-9 rounded-full border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 flex items-center justify-center transition-colors" title="Instagram">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                </a>
                <a href="#linkedin" className="w-9 h-9 rounded-full border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 flex items-center justify-center transition-colors" title="LinkedIn">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                </a>
              </div>
            </div>

            {/* Right Box: Plan Your Next Trip */}
            <div className="lg:col-span-6 bg-[#FDF2F2] p-8 sm:p-10 rounded-[28px]">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Plan Your Next Trip
              </h2>
              <p className="text-sm text-gray-600 font-normal leading-relaxed mb-8">
                Search flights, hotels, trains, tour packages, and holiday deals — all in one place.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link
                  to="/flights"
                  className="bg-[#E53935] hover:bg-[#d32f2f] text-white font-medium py-3.5 px-6 rounded-2xl text-sm flex items-center justify-start gap-3 shadow-sm transition-all duration-200 no-underline"
                >
                  <Plane className="w-4 h-4 text-white flex-shrink-0 rotate-45" />
                  <span>Search Flights</span>
                </Link>
                <Link
                  to="/hotels"
                  className="bg-[#E53935] hover:bg-[#d32f2f] text-white font-medium py-3.5 px-6 rounded-2xl text-sm flex items-center justify-start gap-3 shadow-sm transition-all duration-200 no-underline"
                >
                  <Building2 className="w-4 h-4 text-white flex-shrink-0" />
                  <span>Find Hotels</span>
                </Link>
                <Link
                  to="/tour-packages"
                  className="bg-[#E53935] hover:bg-[#d32f2f] text-white font-medium py-3.5 px-6 rounded-2xl text-sm flex items-center justify-start gap-3 shadow-sm transition-all duration-200 no-underline"
                >
                  <Compass className="w-4 h-4 text-white flex-shrink-0" />
                  <span>Tour Packages</span>
                </Link>
                <Link
                  to="/holidays"
                  className="bg-[#E53935] hover:bg-[#d32f2f] text-white font-medium py-3.5 px-6 rounded-2xl text-sm flex items-center justify-start gap-3 shadow-sm transition-all duration-200 no-underline"
                >
                  <Sparkles className="w-4 h-4 text-white flex-shrink-0" />
                  <span>Holiday Deals</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
