import React, { useState } from 'react';
import { 
  ShieldCheck, Lock, Eye, FileText, Landmark, Info, 
  Database, Share2, Cookie, CheckSquare, HeartHandshake, AlertOctagon,
  Users, UserCheck, HelpCircle, Mail, MapPin
} from 'lucide-react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

export default function PrivacyPolicy() {
  const [activeSection, setActiveSection] = useState('introduction');

  const sections = [
    { id: "introduction", title: "1. Introduction", icon: Info },
    { id: "scope", title: "2. Scope", icon: Eye },
    { id: "collect", title: "3. Information We Collect", icon: Database },
    { id: "use", title: "4. How We Use Your Information", icon: ShieldCheck },
    { id: "cookies", title: "5. Cookies & Tracking", icon: Cookie },
    { id: "consent", title: "6. Consent & Legal Basis", icon: CheckSquare },
    { id: "disclosure", title: "7. Disclosure of Information", icon: Share2 },
    { id: "security", title: "8. Data Security & Retention", icon: Lock },
    { id: "cross-border", title: "9. Cross-Border Transfer", icon: Landmark },
    { id: "rights", title: "10. Your Rights", icon: UserCheck },
    { id: "children", title: "11. Children's Privacy", icon: Users },
    { id: "marketing", title: "12. Marketing & Opt-Out", icon: Mail },
    { id: "third-party", title: "13. Third-Party Links", icon: HelpCircle },
    { id: "grievance", title: "14. Grievance Officer", icon: MapPin },
    { id: "changes", title: "15. Changes to Policy", icon: FileText },
    { id: "contact", title: "16. Contact Us", icon: Mail },
    { id: "governing-law", title: "17. Governing Law", icon: Landmark }
  ];

  const handleScroll = (id) => {
    setActiveSection(id);
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
            <Lock className="w-3.5 h-3.5" /> GDPR & DPDP Compliant
          </span>
          <h1 className="font-quicksand text-4xl font-bold tracking-tight mb-3">
            Privacy <span className="text-[#ef3535]">Policy</span>
          </h1>
          <p className="text-gray-400 text-sm md:text-base max-w-xl mx-auto font-light">
            Last Updated: July 2026. flyanytrip.com — a platform owned and operated by AnyTrip India Pvt Ltd.
          </p>
        </div>
      </section>

      {/* MAIN CONTAINER */}
      <main className="flex-grow max-w-[1200px] w-full mx-auto px-4 py-12 md:py-16 -mt-8 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Sticky Table of Contents (3 Cols) */}
          <div className="lg:col-span-3 lg:sticky lg:top-24 bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-left space-y-1 hidden lg:block">
            <h4 className="font-quicksand font-bold text-xs uppercase tracking-wider text-gray-400 mb-3 px-3">Table of Contents</h4>
            <div className="overflow-y-auto max-h-[calc(100vh-220px)] pr-1 scrollbar-thin">
              {sections.map(s => {
                const IconComponent = s.icon;
                return (
                  <button
                    key={s.id}
                    onClick={() => handleScroll(s.id)}
                    className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-xl transition-all border-none bg-transparent cursor-pointer flex items-center gap-2 ${
                      activeSection === s.id 
                        ? 'text-[#ef3535] bg-red-50/50' 
                        : 'text-gray-600 hover:text-[#ef3535] hover:bg-slate-50'
                    }`}
                  >
                    <IconComponent className={`w-3.5 h-3.5 shrink-0 ${activeSection === s.id ? 'text-[#ef3535]' : 'text-gray-400'}`} />
                    <span className="truncate">{s.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* RIGHT: Document Text (9 Cols) */}
          <div className="lg:col-span-9 bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 text-left space-y-8">
            
            {/* 1. INTRODUCTION */}
            <div id="introduction" className="scroll-mt-24 space-y-3">
              <h2 className="text-xl font-bold text-gray-900 font-quicksand border-b border-gray-100 pb-2.5 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-[#ef3535] rounded-full"></span> 1. INTRODUCTION
              </h2>
              <div className="text-sm sm:text-[15px] text-gray-600 font-light leading-relaxed space-y-3">
                <p>
                  AnyTrip India Pvt Ltd ("AnyTrip", "Company", "we", "us", or "our") owns and operates the website and mobile platform <strong>flyanytrip.com</strong> (the "Platform"), through which we offer travel-related services including flight bookings, hotel bookings, cab and ground transportation, visa assistance, holiday and business tour packages, and airport lounge access (collectively, the "Services").
                </p>
                <p>
                  This Privacy Policy explains how we collect, use, disclose, store, and protect information about you when you access or use the Platform or our Services, and describes the choices and rights available to you in respect of your personal data. This Policy is published in accordance with the Information Technology Act, 2000, the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011, and the Digital Personal Data Protection Act, 2023, read with the Digital Personal Data Protection Rules, 2025, as applicable.
                </p>
                <p className="text-amber-700 bg-amber-50/50 p-3 rounded-lg border border-amber-100/50 font-medium">
                  By accessing or using the Platform, you agree to the collection, use, and disclosure of your information as described in this Privacy Policy. If you do not agree with this Policy, please do not use the Platform or our Services.
                </p>
              </div>
            </div>

            {/* 2. SCOPE */}
            <div id="scope" className="scroll-mt-24 space-y-3">
              <h2 className="text-xl font-bold text-gray-900 font-quicksand border-b border-gray-100 pb-2.5 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-[#ef3535] rounded-full"></span> 2. SCOPE
              </h2>
              <p className="text-sm sm:text-[15px] text-gray-600 font-light leading-relaxed">
                This Policy applies to all users of the Platform, including visitors who browse the Platform without registering, registered users, and travelers whose details are provided to us by a registered user for the purpose of availing the Services. This Policy does not apply to any third-party websites, applications, or services that may be linked to or accessible from the Platform, including websites of airlines, hotels, visa consulates, or payment processors, which are governed by their own respective privacy policies.
              </p>
            </div>

            {/* 3. INFORMATION WE COLLECT */}
            <div id="collect" className="scroll-mt-24 space-y-4">
              <h2 className="text-xl font-bold text-gray-900 font-quicksand border-b border-gray-100 pb-2.5 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-[#ef3535] rounded-full"></span> 3. INFORMATION WE COLLECT
              </h2>
              
              <div className="space-y-3">
                <h3 className="text-base font-bold text-gray-800 font-quicksand">3.1 Information You Provide to Us</h3>
                <ul className="list-disc pl-5 space-y-2 text-sm sm:text-[15px] text-gray-600 font-light leading-relaxed">
                  <li><strong>Identity and contact information:</strong> name, gender, date of birth, email address, mobile number, and residential or billing address;</li>
                  <li><strong>Travel and booking information:</strong> travel dates, origin and destination, hotel and flight preferences, frequent flyer/loyalty program details, and special requests (e.g., meal or seating preferences);</li>
                  <li><strong>Government-issued identification & travel documents:</strong> documents required for bookings, visa processing, or regulatory compliance, such as passport, PAN, Aadhaar (last four digits, where legally permitted), driving license, or other identity/travel documents, along with photographs where required;</li>
                  <li><strong>Payment information:</strong> bank account, debit/credit card, UPI, or net-banking details, which are processed through secure, PCI-DSS compliant third-party payment gateways; AnyTrip does not permanently store complete card details on its own servers;</li>
                  <li><strong>Communications you send us:</strong> including customer support requests, feedback, reviews, and correspondence via email, chat, or phone;</li>
                  <li><strong>Information of co-travelers:</strong> details of other individuals that you provide to us for the purpose of making a booking on their behalf, in which case you confirm that you have obtained their consent to share such information with us.</li>
                </ul>
              </div>

              <div className="space-y-3 pt-2">
                <h3 className="text-base font-bold text-gray-800 font-quicksand">3.2 Information Collected Automatically</h3>
                <ul className="list-disc pl-5 space-y-2 text-sm sm:text-[15px] text-gray-600 font-light leading-relaxed">
                  <li><strong>Device and technical information:</strong> IP address, browser type and version, operating system, device identifiers, and network information;</li>
                  <li><strong>Usage information:</strong> pages viewed, searches performed, links clicked, time spent on the Platform, and referring/exit pages;</li>
                  <li><strong>Location information:</strong> where you have enabled location services, to help us show relevant cab availability, nearby hotels, or local offers;</li>
                  <li><strong>Cookies and tracking technologies:</strong> as described in Clause 5 below.</li>
                </ul>
              </div>

              <div className="space-y-3 pt-2">
                <h3 className="text-base font-bold text-gray-800 font-quicksand">3.3 Information from Third Parties</h3>
                <ul className="list-disc pl-5 space-y-2 text-sm sm:text-[15px] text-gray-600 font-light leading-relaxed">
                  <li><strong>Booking details:</strong> confirmations, fare rules, and status updates from airlines, hotels, cab operators, tour operators, visa processing agencies, and lounge networks with whom bookings are made;</li>
                  <li><strong>Payment updates:</strong> information from payment gateways and banks confirming successful, failed, or refunded transactions;</li>
                  <li><strong>Social media info:</strong> information from social media or single sign-on platforms, if you choose to register or log in using such services.</li>
                </ul>
              </div>
            </div>

            {/* 4. HOW WE USE YOUR INFORMATION */}
            <div id="use" className="scroll-mt-24 space-y-3">
              <h2 className="text-xl font-bold text-gray-900 font-quicksand border-b border-gray-100 pb-2.5 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-[#ef3535] rounded-full"></span> 4. HOW WE USE YOUR INFORMATION
              </h2>
              <ul className="list-disc pl-5 space-y-2 text-sm sm:text-[15px] text-gray-600 font-light leading-relaxed">
                <li>To create and manage your account and process your bookings for flights, hotels, cabs, visas, tours, and lounge access;</li>
                <li>To communicate with you regarding bookings, confirmations, itinerary changes, cancellations, and customer support requests;</li>
                <li>To process payments, issue invoices, and manage refunds or credit note settlements;</li>
                <li>To verify your identity and travel documents where required by airlines, hotels, visa authorities, or applicable law;</li>
                <li>To personalize your experience on the Platform, including recommending relevant offers, destinations, or services;</li>
                <li>To send promotional communications, newsletters, and offers, subject to your consent and opt-out preferences as described in Clause 12;</li>
                <li>To detect, prevent, and investigate fraud, unauthorized transactions, or misuse of the Platform;</li>
                <li>To comply with applicable laws, regulatory requirements, and lawful requests from government or law enforcement authorities;</li>
                <li>To analyze usage patterns and improve the functionality, security, and performance of the Platform, including in connection with new features, modules, and UI updates.</li>
              </ul>
            </div>

            {/* 5. COOKIES AND TRACKING TECHNOLOGIES */}
            <div id="cookies" className="scroll-mt-24 space-y-3">
              <h2 className="text-xl font-bold text-gray-900 font-quicksand border-b border-gray-100 pb-2.5 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-[#ef3535] rounded-full"></span> 5. COOKIES AND TRACKING TECHNOLOGIES
              </h2>
              <ul className="list-disc pl-5 space-y-2 text-sm sm:text-[15px] text-gray-600 font-light leading-relaxed">
                <li>The Platform uses cookies, web beacons, and similar technologies to recognize you as a returning visitor, remember your preferences, maintain your session, and analyze traffic and usage patterns.</li>
                <li>Cookies may be "session" cookies (deleted once you close your browser) or "persistent" cookies (which remain until deleted or expired).</li>
                <li>You may configure your browser to refuse some or all browser cookies; however, if you disable cookies, some parts of the Platform, including the booking process, may not function properly.</li>
              </ul>
            </div>

            {/* 6. CONSENT AND LEGAL BASIS FOR PROCESSING */}
            <div id="consent" className="scroll-mt-24 space-y-3">
              <h2 className="text-xl font-bold text-gray-900 font-quicksand border-b border-gray-100 pb-2.5 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-[#ef3535] rounded-full"></span> 6. CONSENT AND LEGAL BASIS FOR PROCESSING
              </h2>
              <ul className="list-disc pl-5 space-y-2 text-sm sm:text-[15px] text-gray-600 font-light leading-relaxed">
                <li>We collect and process your personal data on the basis of your consent, provided at the time of registration, booking, or otherwise on the Platform, or where processing is necessary to perform a contract with you, comply with a legal obligation, or pursue our legitimate business interests in a manner that does not override your rights.</li>
                <li>Where processing is based on consent, you have the right to withdraw such consent at any time, as described in Clause 10, without affecting the lawfulness of processing carried out prior to such withdrawal.</li>
              </ul>
            </div>

            {/* 7. DISCLOSURE OF INFORMATION */}
            <div id="disclosure" className="scroll-mt-24 space-y-3">
              <h2 className="text-xl font-bold text-gray-900 font-quicksand border-b border-gray-100 pb-2.5 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-[#ef3535] rounded-full"></span> 7. DISCLOSURE OF INFORMATION
              </h2>
              <div className="text-sm sm:text-[15px] text-gray-600 font-light leading-relaxed space-y-2.5">
                <p>We may share your information with the following categories of recipients, strictly for the purposes described in this Policy:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong>Travel service providers:</strong> including airlines, hotels, cab and transport partners, visa processing agencies, tour operators, and airport lounge networks, to the extent necessary to fulfil your booking;</li>
                  <li><strong>Payment systems:</strong> payment gateways, banks, and financial institutions, to process payments and refunds;</li>
                  <li><strong>IT support:</strong> information technology, hosting, cloud storage, analytics, and customer support service providers who process data on our behalf under contractual confidentiality obligations;</li>
                  <li><strong>Marketing agencies:</strong> marketing and communication service providers, where you have consented to receive promotional communications;</li>
                  <li><strong>Legal authorities:</strong> government authorities, regulators, courts, or law enforcement agencies, where required under applicable law, regulation, legal process, or governmental request;</li>
                  <li><strong>Business successors:</strong> a successor entity in connection with any merger, acquisition, restructuring, or sale of all or a portion of our business or assets, subject to equivalent confidentiality protections.</li>
                </ul>
                <p className="mt-2 text-[#ef3535] font-semibold bg-red-50/50 p-3 rounded-lg border border-red-100/50">
                  We do not sell your personal data to third parties for their independent marketing purposes.
                </p>
              </div>
            </div>

            {/* 8. DATA STORAGE, SECURITY AND RETENTION */}
            <div id="security" className="scroll-mt-24 space-y-3">
              <h2 className="text-xl font-bold text-gray-900 font-quicksand border-b border-gray-100 pb-2.5 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-[#ef3535] rounded-full"></span> 8. DATA STORAGE, SECURITY AND RETENTION
              </h2>
              <ul className="list-disc pl-5 space-y-2 text-sm sm:text-[15px] text-gray-600 font-light leading-relaxed">
                <li>We implement reasonable security practices and procedures, including administrative, technical, and physical safeguards, to protect your information against unauthorized access, alteration, disclosure, or destruction, consistent with the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011.</li>
                <li>We retain personal data only for as long as necessary to fulfil the purposes described in this Policy, including to comply with legal, accounting, or regulatory requirements, resolve disputes, and enforce our agreements, after which it is securely deleted or anonymized.</li>
                <li>While we take reasonable steps to protect your information, no method of transmission over the internet or electronic storage is completely secure, and we cannot guarantee absolute security.</li>
              </ul>
            </div>

            {/* 9. CROSS-BORDER DATA TRANSFER */}
            <div id="cross-border" className="scroll-mt-24 space-y-3">
              <h2 className="text-xl font-bold text-gray-900 font-quicksand border-b border-gray-100 pb-2.5 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-[#ef3535] rounded-full"></span> 9. CROSS-BORDER DATA TRANSFER
              </h2>
              <p className="text-sm sm:text-[15px] text-gray-600 font-light leading-relaxed">
                As bookings may involve international airlines, hotels, or visa authorities located outside India, your information may be transferred to and processed in countries other than India. Where such transfers occur, we take reasonable steps to ensure that the recipient provides an appropriate standard of protection for your personal data, consistent with applicable law.
              </p>
            </div>

            {/* 10. YOUR RIGHTS */}
            <div id="rights" className="scroll-mt-24 space-y-3">
              <h2 className="text-xl font-bold text-gray-900 font-quicksand border-b border-gray-100 pb-2.5 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-[#ef3535] rounded-full"></span> 10. YOUR RIGHTS
              </h2>
              <ul className="list-disc pl-5 space-y-2 text-sm sm:text-[15px] text-gray-600 font-light leading-relaxed">
                <li>Right to access and obtain a summary of the personal data we hold about you and the processing activities undertaken;</li>
                <li>Right to correction of inaccurate or incomplete personal data and updating of your information;</li>
                <li>Right to withdraw consent for processing at any time, where processing is based on consent, without affecting past processing;</li>
                <li>Right to erasure of personal data that is no longer necessary for the purpose for which it was collected, subject to our legal and regulatory retention obligations;</li>
                <li>Right to grievance redressal in relation to any act or omission of AnyTrip regarding your personal data, as described in Clause 14.</li>
              </ul>
              <p className="text-xs text-gray-500 font-light">
                To exercise any of these rights, you may write to us using the contact details provided in Clause 16.
              </p>
            </div>

            {/* 11. CHILDREN'S PRIVACY */}
            <div id="children" className="scroll-mt-24 space-y-3">
              <h2 className="text-xl font-bold text-gray-900 font-quicksand border-b border-gray-100 pb-2.5 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-[#ef3535] rounded-full"></span> 11. CHILDREN'S PRIVACY
              </h2>
              <p className="text-sm sm:text-[15px] text-gray-600 font-light leading-relaxed">
                The Platform is not intended for use by individuals under the age of 18. We do not knowingly collect personal data directly from children. Where a booking involves a minor traveling with a parent or guardian, the necessary information is collected from and with the consent of the parent or guardian making the booking.
              </p>
            </div>

            {/* 12. MARKETING COMMUNICATIONS AND OPT-OUT */}
            <div id="marketing" className="scroll-mt-24 space-y-3">
              <h2 className="text-xl font-bold text-gray-900 font-quicksand border-b border-gray-100 pb-2.5 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-[#ef3535] rounded-full"></span> 12. MARKETING COMMUNICATIONS AND OPT-OUT
              </h2>
              <p className="text-sm sm:text-[15px] text-gray-600 font-light leading-relaxed">
                You may opt out of receiving promotional emails, SMS, or push notifications from us at any time by using the unsubscribe link in our communications, adjusting your account preferences, or writing to us at the contact details below. Please note that you may continue to receive transactional and service-related communications relating to your bookings even after opting out of marketing communications.
              </p>
            </div>

            {/* 13. THIRD-PARTY LINKS */}
            <div id="third-party" className="scroll-mt-24 space-y-3">
              <h2 className="text-xl font-bold text-gray-900 font-quicksand border-b border-gray-100 pb-2.5 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-[#ef3535] rounded-full"></span> 13. THIRD-PARTY LINKS
              </h2>
              <p className="text-sm sm:text-[15px] text-gray-600 font-light leading-relaxed">
                The Platform may contain links to third-party websites or services, including those of airlines, hotels, and payment processors. We are not responsible for the privacy practices or content of such third-party websites. We encourage you to review the privacy policy of any third-party website before providing any information to it.
              </p>
            </div>

            {/* 14. GRIEVANCE OFFICER */}
            <div id="grievance" className="scroll-mt-24 space-y-3">
              <h2 className="text-xl font-bold text-gray-900 font-quicksand border-b border-gray-100 pb-2.5 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-[#ef3535] rounded-full"></span> 14. GRIEVANCE OFFICER
              </h2>
              <div className="text-sm sm:text-[15px] text-gray-600 font-light leading-relaxed space-y-2.5">
                <p>
                  In accordance with the Information Technology Act, 2000, and rules made thereunder, and the Digital Personal Data Protection Act, 2023, the details of the Grievance Officer are as follows:
                </p>
                <div className="bg-slate-50 border border-gray-150 p-5 rounded-xl text-xs sm:text-sm font-medium space-y-1">
                  <p><span className="text-gray-400">Name:</span> Grievance Officer</p>
                  <p><span className="text-gray-400">Designation:</span> Grievance Officer</p>
                  <p><span className="text-gray-400">Company:</span> AnyTrip India Pvt Ltd</p>
                  <p><span className="text-gray-400">Email:</span> <a href="mailto:grievance@flyanytrip.com" className="text-[#ef3535] underline font-semibold">grievance@flyanytrip.com</a></p>
                  <p><span className="text-gray-400">Address:</span> Shop No 16, 2nd Floor, VED TransCube Plaza K. J, Indubhai Patel Marg, opposite the Main Railway Station, Maharaja Sayajirao University, Sayajiganj, Vadodara, Gujarat 390007</p>
                </div>
                <p className="text-xs text-gray-500 font-light">
                  We will acknowledge and address grievances in accordance with the timelines prescribed under applicable law.
                </p>
              </div>
            </div>

            {/* 15. CHANGES TO THIS PRIVACY POLICY */}
            <div id="changes" className="scroll-mt-24 space-y-3">
              <h2 className="text-xl font-bold text-gray-900 font-quicksand border-b border-gray-100 pb-2.5 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-[#ef3535] rounded-full"></span> 15. CHANGES TO THIS PRIVACY POLICY
              </h2>
              <p className="text-sm sm:text-[15px] text-gray-600 font-light leading-relaxed">
                We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or for other operational reasons, including in connection with new modules or features introduced on the Platform. The revised Policy will be posted on this page with an updated "Last updated" date, and, where required by law, we will provide additional notice or seek fresh consent for material changes. Your continued use of the Platform after such changes constitutes acceptance of the revised Policy.
              </p>
            </div>

            {/* 16. CONTACT US */}
            <div id="contact" className="scroll-mt-24 space-y-3">
              <h2 className="text-xl font-bold text-gray-900 font-quicksand border-b border-gray-100 pb-2.5 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-[#ef3535] rounded-full"></span> 16. CONTACT US
              </h2>
              <div className="text-sm sm:text-[15px] text-gray-600 font-light leading-relaxed space-y-2">
                <p>
                  If you have any questions, concerns, or requests relating to this Privacy Policy or the processing of your personal data, please contact us at:
                </p>
                <div className="bg-slate-50 border border-gray-150 p-5 rounded-xl text-xs sm:text-sm font-medium space-y-1">
                  <p><span className="text-gray-400">Company:</span> AnyTrip India Pvt Ltd</p>
                  <p><span className="text-gray-400">Email:</span> <a href="mailto:support@flyanytrip.com" className="text-[#ef3535] underline font-semibold">support@flyanytrip.com</a></p>
                  <p><span className="text-gray-400">Address:</span> Shop No 16, 2nd Floor, VED TransCube Plaza K. J, Indubhai Patel Marg, opposite the Main Railway Station, Maharaja Sayajirao University, Sayajiganj, Vadodara, Gujarat 390007</p>
                </div>
              </div>
            </div>

            {/* 17. GOVERNING LAW */}
            <div id="governing-law" className="scroll-mt-24 space-y-3">
              <h2 className="text-xl font-bold text-gray-900 font-quicksand border-b border-gray-100 pb-2.5 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-[#ef3535] rounded-full"></span> 17. GOVERNING LAW
              </h2>
              <p className="text-sm sm:text-[15px] text-gray-600 font-light leading-relaxed">
                This Privacy Policy shall be governed by and construed in accordance with the laws of India, and courts at Vadodara, Gujarat shall have exclusive jurisdiction over any disputes arising in connection with it.
              </p>
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
