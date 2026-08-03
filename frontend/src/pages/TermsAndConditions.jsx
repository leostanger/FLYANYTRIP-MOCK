import React, { useState } from 'react';
import { 
  FileText, Scale, Shield, AlertTriangle, CheckCircle2, HelpCircle, 
  UserCheck, ShieldAlert, BadgePercent, Users, BookOpen, AlertOctagon, 
  MapPin, Mail, ArrowRight, BookMarked, Landmark, ClipboardCheck, 
  UserX, HeartHandshake, Eye, ScrollText
} from 'lucide-react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

export default function TermsAndConditions() {
  const [activeSection, setActiveSection] = useState('acceptance');

  const sections = [
    { id: "acceptance", title: "1. Acceptance of Terms", icon: Shield },
    { id: "eligibility", title: "2. Eligibility", icon: UserCheck },
    { id: "nature-services", title: "3. Nature of Services", icon: HeartHandshake },
    { id: "account", title: "4. Account Registration", icon: ClipboardCheck },
    { id: "booking-payment", title: "5. Booking & Payment", icon: BadgePercent },
    { id: "relationship", title: "6. Relationship of Parties", icon: Users },
    { id: "third-parties", title: "7. Third Parties & Minors", icon: UserX },
    { id: "insurance", title: "8. Insurance", icon: ShieldAlert },
    { id: "taxes", title: "9. Taxes", icon: Scale },
    { id: "fraud", title: "10. Fraud & Chargebacks", icon: AlertOctagon },
    { id: "obligations", title: "11. User Obligations", icon: ScrollText },
    { id: "content-reviews", title: "12. User Content & Reviews", icon: BookOpen },
    { id: "intellectual-property", title: "13. Intellectual Property", icon: BookMarked },
    { id: "third-party-links", title: "14. Third-Party Links", icon: HelpCircle },
    { id: "regulatory", title: "15. Regulatory Compliance", icon: Landmark },
    { id: "consumer-protection", title: "16. Consumer Protection", icon: ClipboardCheck },
    { id: "warranties", title: "17. Disclaimer of Warranties", icon: AlertTriangle },
    { id: "liability", title: "18. Limitation of Liability", icon: ShieldAlert },
    { id: "indemnification", title: "19. Indemnification", icon: Shield },
    { id: "suspension", title: "20. Suspension & Termination", icon: UserX },
    { id: "force-majeure", title: "21. Force Majeure", icon: AlertTriangle },
    { id: "governing-law", title: "22. Governing Law", icon: Landmark },
    { id: "dispute-resolution", title: "23. Dispute Resolution", icon: Scale },
    { id: "modification", title: "24. Modification of Terms", icon: ScrollText },
    { id: "severability", title: "25. Severability", icon: Scale },
    { id: "grievance", title: "26. Grievance Redressal", icon: MapPin },
    { id: "waiver", title: "27. Waiver", icon: Shield },
    { id: "entire-agreement", title: "28. Entire Agreement", icon: BookMarked },
    { id: "assignment", title: "29. Assignment", icon: ClipboardCheck },
    { id: "notices", title: "30. Notices", icon: Mail },
    { id: "contact", title: "31. Contact Information", icon: HelpCircle }
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
            <FileText className="w-3.5 h-3.5" /> Legal Agreement
          </span>
          <h1 className="font-quicksand text-4xl font-bold tracking-tight mb-3">
            Terms and <span className="text-[#ef3535]">Conditions</span>
          </h1>
          <p className="text-gray-400 text-sm md:text-base max-w-xl mx-auto font-light">
            Last Updated: August 03, 2026. flyanytrip.com — AnyTrip India Private Limited.
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
            
            {/* Intro */}
            <div className="prose max-w-none text-gray-600 font-light leading-relaxed text-sm sm:text-base space-y-4">
              <p>
                These Terms and Conditions ("Terms") govern access to and use of the website <strong>flyanytrip.com</strong> and all related services, applications, and platforms (collectively, the "Platform") owned and operated by <strong>AnyTrip India Private Limited</strong> ("AnyTrip", "Company", "we", "us", or "our"), a company incorporated under the laws of India.
              </p>
              <p>
                By accessing, browsing, or using the Platform, or by booking any service through it, you ("User", "you", or "your") agree to be bound by these Terms. If you do not agree with any part of these Terms, you must not use the Platform.
              </p>
            </div>

            {/* Section 1 */}
            <div id="acceptance" className="scroll-mt-24 space-y-3">
              <h2 className="text-xl font-bold text-gray-900 font-quicksand border-b border-gray-100 pb-2.5 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-[#ef3535] rounded-full"></span> 1. Acceptance of Terms
              </h2>
              <p className="text-sm sm:text-[15px] text-gray-600 font-light leading-relaxed">
                Use of the Platform in any manner, including registration, booking, browsing, or making payment, constitutes unconditional acceptance of these Terms and our Privacy Policy, which is incorporated herein by reference. These Terms apply to all Users, including without limitation Users who are browsers, vendors, customers, merchants, and/or contributors of content.
              </p>
            </div>

            {/* Section 2 */}
            <div id="eligibility" className="scroll-mt-24 space-y-3">
              <h2 className="text-xl font-bold text-gray-900 font-quicksand border-b border-gray-100 pb-2.5 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-[#ef3535] rounded-full"></span> 2. Eligibility
              </h2>
              <p className="text-sm sm:text-[15px] text-gray-600 font-light leading-relaxed">
                You represent that you are at least 18 years of age and possess the legal authority and capacity to enter into a binding contract under the Indian Contract Act, 1872. If you use the Platform on behalf of any entity, you represent that you have the authority to bind that entity to these Terms.
              </p>
            </div>

            {/* Section 3 */}
            <div id="nature-services" className="scroll-mt-24 space-y-3">
              <h2 className="text-xl font-bold text-gray-900 font-quicksand border-b border-gray-100 pb-2.5 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-[#ef3535] rounded-full"></span> 3. Nature of Services — Facilitator Role
              </h2>
              <div className="text-sm sm:text-[15px] text-gray-600 font-light leading-relaxed space-y-2.5">
                <p>
                  AnyTrip is an intermediary and facilitator that enables Users to search, compare, and book cab, taxi, transport, and allied travel services offered by independent third-party transport operators, drivers, vendors, and service providers ("Service Providers") through the Platform.
                </p>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li>AnyTrip does not itself own, operate, or control any vehicle, fleet, or transport service, and is not a transport carrier, common carrier, or travel operator.</li>
                  <li>All bookings made through the Platform constitute a direct contract for services between the User and the relevant Service Provider. AnyTrip is not a party to that contract.</li>
                  <li>AnyTrip does not guarantee the availability, quality, safety, timeliness, legality, or fitness of any service offered by a Service Provider, and makes no representation or warranty in that regard.</li>
                  <li>Any dispute regarding the actual provision of transport services, including delays, cancellations, driver conduct, vehicle condition, or fare disputes at the point of service, must be resolved directly between the User and the Service Provider. AnyTrip may, at its sole discretion and without obligation, assist in facilitating communication between the parties.</li>
                </ul>
              </div>
            </div>

            {/* Section 4 */}
            <div id="account" className="scroll-mt-24 space-y-3">
              <h2 className="text-xl font-bold text-gray-900 font-quicksand border-b border-gray-100 pb-2.5 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-[#ef3535] rounded-full"></span> 4. Account Registration
              </h2>
              <p className="text-sm sm:text-[15px] text-gray-600 font-light leading-relaxed">
                You may be required to create an account to access certain features of the Platform. You agree to provide accurate, current, and complete information during registration and to update such information as necessary. You are solely responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. AnyTrip is not liable for any loss arising from unauthorized use of your account.
              </p>
            </div>

            {/* Section 5 */}
            <div id="booking-payment" className="scroll-mt-24 space-y-3">
              <h2 className="text-xl font-bold text-gray-900 font-quicksand border-b border-gray-100 pb-2.5 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-[#ef3535] rounded-full"></span> 5. Booking, Pricing, and Payment
              </h2>
              <div className="text-sm sm:text-[15px] text-gray-600 font-light leading-relaxed space-y-2.5">
                <ul className="list-disc pl-5 space-y-1.5">
                  <li>All fares, prices, and charges displayed on the Platform are indicative and subject to change based on factors including demand, traffic, route, waiting time, tolls, taxes, and surge conditions, unless expressly stated as fixed at the time of booking.</li>
                  <li>Payment may be collected by AnyTrip on behalf of the Service Provider, directly by the Service Provider, or through a third-party payment gateway. Use of any third-party payment gateway is subject to that provider's own terms and privacy policy, and AnyTrip is not responsible for errors, delays, or failures caused by such third parties.</li>
                  <li>Booking confirmations are subject to availability of the Service Provider and may be cancelled or modified by AnyTrip or the Service Provider in circumstances beyond reasonable control.</li>
                  <li>Cancellation charges, no-show charges, and refund timelines, where applicable, will be as displayed on the Platform at the time of booking or as separately communicated.</li>
                </ul>
              </div>
            </div>

            {/* Section 6 */}
            <div id="relationship" className="scroll-mt-24 space-y-3">
              <h2 className="text-xl font-bold text-gray-900 font-quicksand border-b border-gray-100 pb-2.5 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-[#ef3535] rounded-full"></span> 6. Relationship of Parties — No Employment or Agency
              </h2>
              <p className="text-sm sm:text-[15px] text-gray-600 font-light leading-relaxed">
                Nothing in these Terms shall be construed as creating an employment, agency, partnership, or joint-venture relationship between AnyTrip and any Service Provider, driver, or vendor listed on the Platform. Service Providers and drivers are independent third parties who are solely responsible for their own conduct, compliance with applicable licensing, permits, insurance, and labour laws, and the manner in which they render services. AnyTrip exercises no direction or control over the day-to-day work of any Service Provider or driver and shall not be treated as an employer, principal, or co-employer of any such person for any purpose, including under labour, employment, or social security legislation.
              </p>
            </div>

            {/* Section 7 */}
            <div id="third-parties" className="scroll-mt-24 space-y-3">
              <h2 className="text-xl font-bold text-gray-900 font-quicksand border-b border-gray-100 pb-2.5 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-[#ef3535] rounded-full"></span> 7. Booking on Behalf of Third Parties; Minors
              </h2>
              <p className="text-sm sm:text-[15px] text-gray-600 font-light leading-relaxed">
                If you make a booking on behalf of another person (including a minor, family member, guest, or colleague), you represent and warrant that you have their authority to do so and that you have informed them of, and they accept, these Terms. You remain responsible for such booking, including payment and any charges, as if you were the traveller. The Platform is not intended for use by, or booking of solo travel for, unaccompanied minors without adult supervision, and AnyTrip assumes no responsibility for verifying the age or accompaniment status of any traveller other than the registered User.
              </p>
            </div>

            {/* Section 8 */}
            <div id="insurance" className="scroll-mt-24 space-y-3">
              <h2 className="text-xl font-bold text-gray-900 font-quicksand border-b border-gray-100 pb-2.5 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-[#ef3535] rounded-full"></span> 8. Insurance
              </h2>
              <p className="text-sm sm:text-[15px] text-gray-600 font-light leading-relaxed">
                AnyTrip does not provide, arrange, or guarantee any insurance coverage for Users, their belongings, or third parties in connection with any trip booked through the Platform, unless expressly stated otherwise at the time of booking. Any insurance cover, if applicable, is that of the Service Provider, the vehicle owner, or as mandated under the Motor Vehicles Act, 1988, and Users are encouraged to independently verify and, where appropriate, obtain their own travel or personal accident insurance.
              </p>
            </div>

            {/* Section 9 */}
            <div id="taxes" className="scroll-mt-24 space-y-3">
              <h2 className="text-xl font-bold text-gray-900 font-quicksand border-b border-gray-100 pb-2.5 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-[#ef3535] rounded-full"></span> 9. Taxes
              </h2>
              <p className="text-sm sm:text-[15px] text-gray-600 font-light leading-relaxed">
                All fares and charges displayed on the Platform are subject to applicable taxes, including Goods and Services Tax (GST), unless expressly stated as inclusive. Users are responsible for any taxes applicable to their use of the Platform or booking of services, except where such taxes are, by law, required to be borne or collected by AnyTrip or the Service Provider.
              </p>
            </div>

            {/* Section 10 */}
            <div id="fraud" className="scroll-mt-24 space-y-3">
              <h2 className="text-xl font-bold text-gray-900 font-quicksand border-b border-gray-100 pb-2.5 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-[#ef3535] rounded-full"></span> 10. Fraudulent Transactions and Chargebacks
              </h2>
              <p className="text-sm sm:text-[15px] text-gray-600 font-light leading-relaxed">
                AnyTrip reserves the right to investigate, suspend, or cancel any booking, and to suspend or terminate any account, that it reasonably suspects to involve fraud, misuse of promotional offers, unauthorized use of payment instruments, or abuse of the chargeback or refund process. Users found to have raised a false, fraudulent, or bad-faith chargeback shall be liable to indemnify AnyTrip for the amount charged back together with any associated bank or processing fees, penalties, and reasonable costs of recovery.
              </p>
            </div>

            {/* Section 11 */}
            <div id="obligations" className="scroll-mt-24 space-y-3">
              <h2 className="text-xl font-bold text-gray-900 font-quicksand border-b border-gray-100 pb-2.5 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-[#ef3535] rounded-full"></span> 11. User Obligations and Conduct
              </h2>
              <div className="text-sm sm:text-[15px] text-gray-600 font-light leading-relaxed space-y-2.5">
                <p>You agree that you shall not:</p>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li>Use the Platform for any unlawful purpose or in violation of any applicable law, including the Information Technology Act, 2000 and rules made thereunder;</li>
                  <li>Provide false, inaccurate, or misleading information at the time of registration or booking;</li>
                  <li>Interfere with, disrupt, or attempt to gain unauthorized access to the Platform, its servers, or any connected network;</li>
                  <li>Reproduce, duplicate, copy, sell, resell, or exploit any portion of the Platform without express written permission;</li>
                  <li>Engage in abusive, threatening, or unlawful conduct towards any Service Provider, driver, or representative of AnyTrip;</li>
                  <li>Use automated means (bots, scrapers, crawlers) to access or extract data from the Platform without prior written consent;</li>
                  <li>Upload or transmit any virus, malware, or other harmful code.</li>
                </ul>
                <p className="text-amber-700 bg-amber-50 p-3 rounded-lg border border-amber-100">
                  Violation of this Section entitles AnyTrip, without prior notice, to cancel any booking, withhold any refund otherwise due, and suspend or terminate the User's account, in addition to any other remedy available in law.
                </p>
              </div>
            </div>

            {/* Section 12 */}
            <div id="content-reviews" className="scroll-mt-24 space-y-3">
              <h2 className="text-xl font-bold text-gray-900 font-quicksand border-b border-gray-100 pb-2.5 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-[#ef3535] rounded-full"></span> 12. User Content and Reviews
              </h2>
              <p className="text-sm sm:text-[15px] text-gray-600 font-light leading-relaxed">
                Where the Platform permits Users to submit reviews, ratings, feedback, or other content ("User Content"), you grant AnyTrip a non-exclusive, worldwide, royalty-free, perpetual, and sub-licensable licence to use, reproduce, publish, and display such User Content in connection with the operation and promotion of the Platform. You represent that your User Content is truthful, does not infringe any third-party right, and is not defamatory, obscene, or unlawful. AnyTrip reserves the right, but has no obligation, to monitor, edit, or remove any User Content at its sole discretion.
              </p>
            </div>

            {/* Section 13 */}
            <div id="intellectual-property" className="scroll-mt-24 space-y-3">
              <h2 className="text-xl font-bold text-gray-900 font-quicksand border-b border-gray-100 pb-2.5 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-[#ef3535] rounded-full"></span> 13. Intellectual Property
              </h2>
              <p className="text-sm sm:text-[15px] text-gray-600 font-light leading-relaxed">
                All content on the Platform, including but not limited to text, graphics, logos, icons, images, software, and the compilation thereof, is the property of AnyTrip or its licensors and is protected by applicable intellectual property laws. Nothing in these Terms grants you any right or license to use any trademark, logo, or brand feature of AnyTrip without prior written consent.
              </p>
            </div>

            {/* Section 14 */}
            <div id="third-party-links" className="scroll-mt-24 space-y-3">
              <h2 className="text-xl font-bold text-gray-900 font-quicksand border-b border-gray-100 pb-2.5 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-[#ef3535] rounded-full"></span> 14. Third-Party Links and Services
              </h2>
              <p className="text-sm sm:text-[15px] text-gray-600 font-light leading-relaxed">
                The Platform may contain links to third-party websites or services that are not owned or controlled by AnyTrip. We assume no responsibility for the content, privacy policies, or practices of any third-party websites or services. Your interactions with any third party found through the Platform are solely between you and that third party.
              </p>
            </div>

            {/* Section 15 */}
            <div id="regulatory" className="scroll-mt-24 space-y-3">
              <h2 className="text-xl font-bold text-gray-900 font-quicksand border-b border-gray-100 pb-2.5 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-[#ef3535] rounded-full"></span> 15. Regulatory Compliance
              </h2>
              <p className="text-sm sm:text-[15px] text-gray-600 font-light leading-relaxed">
                AnyTrip endeavours to operate the Platform in accordance with applicable Indian law, including, where applicable, guidelines issued for on-demand transportation aggregators by the Ministry of Road Transport and Highways and by relevant State Governments under the Motor Vehicles (Amendment) Act, 2019. Nothing in these Terms shall be construed as a representation that any particular Service Provider or driver holds a valid licence, permit, or aggregator authorisation; verifying and maintaining such authorisations remains the sole responsibility of the concerned Service Provider.
              </p>
            </div>

            {/* Section 16 */}
            <div id="consumer-protection" className="scroll-mt-24 space-y-3">
              <h2 className="text-xl font-bold text-gray-900 font-quicksand border-b border-gray-100 pb-2.5 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-[#ef3535] rounded-full"></span> 16. Compliance with Consumer Protection (E-Commerce) Rules, 2020
              </h2>
              <p className="text-sm sm:text-[15px] text-gray-600 font-light leading-relaxed">
                In compliance with the Consumer Protection (E-Commerce) Rules, 2020 and the Consumer Protection Act, 2019, AnyTrip publishes on the Platform, or makes available on request, information relating to booking, cancellation, and refund procedures, the identity and contact details of AnyTrip as the marketplace entity, and the grievance redressal mechanism set out in Section 26 below. Nothing in this Section shall be construed as AnyTrip assuming liability for the acts or omissions of any Service Provider, whose obligations as a seller of services remain their own under the said Rules.
              </p>
            </div>

            {/* Section 17 */}
            <div id="warranties" className="scroll-mt-24 space-y-3">
              <h2 className="text-xl font-bold text-gray-900 font-quicksand border-b border-gray-100 pb-2.5 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-[#ef3535] rounded-full"></span> 17. Disclaimer of Warranties
              </h2>
              <p className="text-sm sm:text-[15px] uppercase font-mono text-gray-500 bg-slate-50 p-4 rounded-xl leading-relaxed border border-gray-100">
                THE PLATFORM AND ALL SERVICES ACCESSED THROUGH IT ARE PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS, WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT, OR UNINTERRUPTED AND ERROR-FREE OPERATION. ANYTRIP DOES NOT WARRANT THAT THE PLATFORM WILL BE FREE FROM DEFECTS, VIRUSES, OR ERRORS, OR THAT ANY BOOKING WILL BE FULFILLED AS EXPECTED.
              </p>
            </div>

            {/* Section 18 */}
            <div id="liability" className="scroll-mt-24 space-y-3">
              <h2 className="text-xl font-bold text-gray-900 font-quicksand border-b border-gray-100 pb-2.5 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-[#ef3535] rounded-full"></span> 18. Limitation of Liability
              </h2>
              <div className="text-sm sm:text-[15px] uppercase font-mono text-gray-500 bg-slate-50 p-4 rounded-xl leading-relaxed space-y-3 border border-gray-100">
                <p>
                  TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, ANYTRIP, ITS DIRECTORS, OFFICERS, EMPLOYEES, AND AGENTS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, EXEMPLARY, OR PUNITIVE DAMAGES, INCLUDING LOSS OF PROFITS, DATA, GOODWILL, OR OTHER INTANGIBLE LOSSES, ARISING OUT OF OR IN CONNECTION WITH THE USE OF, OR INABILITY TO USE, THE PLATFORM OR ANY SERVICE BOOKED THROUGH IT, WHETHER BASED ON WARRANTY, CONTRACT, TORT, OR ANY OTHER LEGAL THEORY, AND WHETHER OR NOT ANYTRIP HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
                </p>
                <p>
                  IN NO EVENT SHALL THE AGGREGATE LIABILITY OF ANYTRIP ARISING OUT OF OR RELATED TO THESE TERMS OR THE USE OF THE PLATFORM EXCEED THE TOTAL AMOUNT PAID BY THE USER TO ANYTRIP FOR THE SPECIFIC BOOKING GIVING RISE TO THE CLAIM IN THE SIX (6) MONTHS PRECEDING THE EVENT GIVING RISE TO THE LIABILITY.
                </p>
                <p>
                  ANYTRIP SHALL NOT BE LIABLE FOR ANY ACT, OMISSION, NEGLIGENCE, OR MISCONDUCT OF ANY SERVICE PROVIDER, DRIVER, OR THIRD PARTY, INCLUDING BUT NOT LIMITED TO ACCIDENTS, INJURY, LOSS OF LIFE, OR PROPERTY DAMAGE ARISING DURING THE COURSE OF ANY TRANSPORT SERVICE.
                </p>
              </div>
            </div>

            {/* Section 19 */}
            <div id="indemnification" className="scroll-mt-24 space-y-3">
              <h2 className="text-xl font-bold text-gray-900 font-quicksand border-b border-gray-100 pb-2.5 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-[#ef3535] rounded-full"></span> 19. Indemnification
              </h2>
              <p className="text-sm sm:text-[15px] text-gray-600 font-light leading-relaxed">
                You agree to indemnify, defend, and hold harmless AnyTrip, its directors, officers, employees, affiliates, and agents from and against any and all claims, liabilities, damages, losses, costs, and expenses (including reasonable legal fees) arising out of or in any way connected with: (a) your use or misuse of the Platform; (b) your violation of these Terms; (c) your violation of any applicable law or the rights of any third party; or (d) any content or information you submit, post, or transmit through the Platform.
              </p>
            </div>

            {/* Section 20 */}
            <div id="suspension" className="scroll-mt-24 space-y-3">
              <h2 className="text-xl font-bold text-gray-900 font-quicksand border-b border-gray-100 pb-2.5 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-[#ef3535] rounded-full"></span> 20. Suspension and Termination
              </h2>
              <p className="text-sm sm:text-[15px] text-gray-600 font-light leading-relaxed">
                AnyTrip reserves the right, at its sole discretion, to suspend, restrict, or terminate your access to the Platform, with or without notice, for conduct that it believes violates these Terms, is harmful to other Users, Service Providers, or AnyTrip, or for any other reason. Upon termination, all provisions of these Terms which by their nature should survive shall survive, including without limitation ownership provisions, warranty disclaimers, indemnity, and limitations of liability.
              </p>
            </div>

            {/* Section 21 */}
            <div id="force-majeure" className="scroll-mt-24 space-y-3">
              <h2 className="text-xl font-bold text-gray-900 font-quicksand border-b border-gray-100 pb-2.5 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-[#ef3535] rounded-full"></span> 21. Force Majeure
              </h2>
              <p className="text-sm sm:text-[15px] text-gray-600 font-light leading-relaxed">
                AnyTrip shall not be held responsible for any delay or failure in performance to the extent such delay or failure is caused by circumstances beyond its reasonable control, including but not limited to acts of God, natural disasters, strikes, riots, war, governmental action, epidemic or pandemic, or failure of transportation, communication, or power infrastructure.
              </p>
            </div>

            {/* Section 22 */}
            <div id="governing-law" className="scroll-mt-24 space-y-3">
              <h2 className="text-xl font-bold text-gray-900 font-quicksand border-b border-gray-100 pb-2.5 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-[#ef3535] rounded-full"></span> 22. Governing Law and Jurisdiction
              </h2>
              <p className="text-sm sm:text-[15px] text-gray-600 font-light leading-relaxed">
                These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law principles.
              </p>
            </div>

            {/* Section 23 */}
            <div id="dispute-resolution" className="scroll-mt-24 space-y-3">
              <h2 className="text-xl font-bold text-gray-900 font-quicksand border-b border-gray-100 pb-2.5 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-[#ef3535] rounded-full"></span> 23. Dispute Resolution — Arbitration
              </h2>
              <div className="text-sm sm:text-[15px] text-gray-600 font-light leading-relaxed space-y-2.5">
                <p>
                  Any dispute, controversy, or claim arising out of or relating to these Terms, including its formation, interpretation, breach, or termination, shall first be sought to be resolved amicably through good-faith negotiation between the parties within thirty (30) days of written notice of the dispute.
                </p>
                <p>
                  If the dispute is not resolved amicably, it shall be referred to and finally resolved by arbitration under the Arbitration and Conciliation Act, 1996, and any statutory amendment or re-enactment thereof for the time being in force. The arbitration shall be conducted by a sole arbitrator appointed mutually by the parties, or failing mutual agreement, in accordance with the said Act. The seat and venue of arbitration shall be Vadodara, Gujarat, India, and the language of arbitration shall be English. The award rendered by the arbitrator shall be final and binding on the parties.
                </p>
                <p>
                  Each dispute shall be resolved on an individual basis. To the fullest extent permitted by law, no dispute shall be joined or consolidated with any other arbitration or proceeding, and no User may bring or participate in any claim as a representative or member of a class, collective, or consolidated proceeding against AnyTrip.
                </p>
                <p className="text-amber-700 font-medium">
                  Subject to the above, the courts at Vadodara, Gujarat shall have exclusive jurisdiction over all matters arising out of or in connection with these Terms, including for interim or injunctive relief in aid of arbitration.
                </p>
              </div>
            </div>

            {/* Section 24 */}
            <div id="modification" className="scroll-mt-24 space-y-3">
              <h2 className="text-xl font-bold text-gray-900 font-quicksand border-b border-gray-100 pb-2.5 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-[#ef3535] rounded-full"></span> 24. Modification of Terms
              </h2>
              <p className="text-sm sm:text-[15px] text-gray-600 font-light leading-relaxed">
                AnyTrip reserves the right to amend, modify, or update these Terms at any time, at its sole discretion. The revised Terms shall be effective upon posting on the Platform, and the "Last Updated" date shall be revised accordingly. Continued use of the Platform following any such change constitutes acceptance of the revised Terms. Users are encouraged to review these Terms periodically.
              </p>
            </div>

            {/* Section 25 */}
            <div id="severability" className="scroll-mt-24 space-y-3">
              <h2 className="text-xl font-bold text-gray-900 font-quicksand border-b border-gray-100 pb-2.5 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-[#ef3535] rounded-full"></span> 25. Severability
              </h2>
              <p className="text-sm sm:text-[15px] text-gray-600 font-light leading-relaxed">
                If any provision of these Terms is held by a court or arbitral tribunal of competent jurisdiction to be invalid, illegal, or unenforceable for any reason, such provision shall be severed from the remainder of these Terms, and the remaining provisions shall continue in full force and effect as if the invalid, illegal, or unenforceable provision had never been contained herein. The parties shall, in such event, negotiate in good faith to replace the invalid provision with a valid one that most closely reflects the original intent.
              </p>
            </div>

            {/* Section 26 */}
            <div id="grievance" className="scroll-mt-24 space-y-3">
              <h2 className="text-xl font-bold text-gray-900 font-quicksand border-b border-gray-100 pb-2.5 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-[#ef3535] rounded-full"></span> 26. Grievance Redressal
              </h2>
              <div className="text-sm sm:text-[15px] text-gray-600 font-light leading-relaxed space-y-2.5">
                <p>
                  In accordance with the Information Technology Act, 2000 and the rules made thereunder, and the Consumer Protection (E-Commerce) Rules, 2020, the details of the Grievance Officer are as follows:
                </p>
                <div className="bg-slate-50 border border-gray-150 p-5 rounded-xl text-xs sm:text-sm font-medium space-y-1">
                  <p><span className="text-gray-400">Designation:</span> Grievance Officer</p>
                  <p><span className="text-gray-400">Company:</span> AnyTrip India Pvt Ltd</p>
                  <p><span className="text-gray-400">Email:</span> <a href="mailto:grievance@flyanytrip.com" className="text-[#ef3535] underline font-semibold">grievance@flyanytrip.com</a></p>
                  <p><span className="text-gray-400">Address:</span> Shop No 16, 2nd Floor, VED TransCube Plaza K. J, Indubhai Patel Marg, opposite the Main Railway Station, Maharaja Sayajirao University, Sayajiganj, Vadodara, Gujarat 390007</p>
                </div>
                <p className="text-xs text-gray-500 font-light">
                  The Grievance Officer shall acknowledge complaints within forty-eight (48) hours of receipt and endeavour to resolve them within thirty (30) days, or such shorter period as may be prescribed by applicable law.
                </p>
              </div>
            </div>

            {/* Section 27 */}
            <div id="waiver" className="scroll-mt-24 space-y-3">
              <h2 className="text-xl font-bold text-gray-900 font-quicksand border-b border-gray-100 pb-2.5 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-[#ef3535] rounded-full"></span> 27. Waiver
              </h2>
              <p className="text-sm sm:text-[15px] text-gray-600 font-light leading-relaxed">
                No failure or delay by AnyTrip in exercising any right, power, or remedy under these Terms shall operate as a waiver thereof, nor shall any single or partial exercise of any right, power, or remedy preclude any further exercise thereof.
              </p>
            </div>

            {/* Section 28 */}
            <div id="entire-agreement" className="scroll-mt-24 space-y-3">
              <h2 className="text-xl font-bold text-gray-900 font-quicksand border-b border-gray-100 pb-2.5 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-[#ef3535] rounded-full"></span> 28. Entire Agreement
              </h2>
              <p className="text-sm sm:text-[15px] text-gray-600 font-light leading-relaxed">
                These Terms, together with the Privacy Policy and any other policies referenced herein, constitute the entire agreement between you and AnyTrip regarding your use of the Platform, and supersede all prior or contemporaneous agreements, representations, and understandings, whether written or oral.
              </p>
            </div>

            {/* Section 29 */}
            <div id="assignment" className="scroll-mt-24 space-y-3">
              <h2 className="text-xl font-bold text-gray-900 font-quicksand border-b border-gray-100 pb-2.5 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-[#ef3535] rounded-full"></span> 29. Assignment
              </h2>
              <p className="text-sm sm:text-[15px] text-gray-600 font-light leading-relaxed">
                You may not assign or transfer these Terms, or any rights or obligations hereunder, without the prior written consent of AnyTrip. AnyTrip may assign these Terms, in whole or in part, without restriction, including in connection with a merger, acquisition, or sale of assets.
              </p>
            </div>

            {/* Section 30 */}
            <div id="notices" className="scroll-mt-24 space-y-3">
              <h2 className="text-xl font-bold text-gray-900 font-quicksand border-b border-gray-100 pb-2.5 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-[#ef3535] rounded-full"></span> 30. Notices
              </h2>
              <p className="text-sm sm:text-[15px] text-gray-600 font-light leading-relaxed">
                Any notice required to be given under these Terms shall be in writing and shall be deemed duly given when delivered by email, registered post, or through a notice posted on the Platform, addressed to the contact details provided by the respective party.
              </p>
            </div>

            {/* Section 31 */}
            <div id="contact" className="scroll-mt-24 space-y-3">
              <h2 className="text-xl font-bold text-gray-900 font-quicksand border-b border-gray-100 pb-2.5 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-[#ef3535] rounded-full"></span> 31. Contact Information
              </h2>
              <div className="text-sm sm:text-[15px] text-gray-600 font-light leading-relaxed space-y-2">
                <p>
                  For any questions, complaints, or grievances relating to these Terms, you may contact AnyTrip India Private Limited at:
                </p>
                <div className="bg-slate-50 border border-gray-150 p-5 rounded-xl text-xs sm:text-sm font-medium space-y-1">
                  <p><span className="text-gray-400">Email:</span> <a href="mailto:support@flyanytrip.com" className="text-[#ef3535] underline font-semibold">support@flyanytrip.com</a></p>
                  <p><span className="text-gray-400">Address:</span> Shop No 16, 2nd Floor, VED TransCube Plaza K. J, Indubhai Patel Marg, opposite the Main Railway Station, Maharaja Sayajirao University, Sayajiganj, Vadodara, Gujarat 390007</p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
