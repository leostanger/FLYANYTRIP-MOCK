import React, { useState } from 'react';
import { Briefcase, MapPin, Users, Heart, GraduationCap, Laptop, Sparkles, Send } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

export default function Careers() {
  const [activeDept, setActiveDept] = useState('All');
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicationData, setApplicationData] = useState({ name: '', email: '', portfolio: '', resume: '' });
  const [toastMessage, setToastMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4500);
  };

  const values = [
    { icon: <Heart className="w-5 h-5 text-[#ef3535]" />, title: 'Empathy first', desc: 'We build for travelers. Understanding their desires and pain points drives our design and engineering decisions.' },
    { icon: <Laptop className="w-5 h-5 text-blue-500" />, title: 'Radical Ownership', desc: 'We operate in high-trust, autonomous teams. You own your metrics, code deployments, and customer experiences.' },
    { icon: <GraduationCap className="w-5 h-5 text-emerald-500" />, title: 'Continuous Growth', desc: 'Travel expands the mind, and so should work. We provide generous learning stipends and professional mentoring.' }
  ];

  const perks = [
    { title: 'Annual Travel Credit', desc: '₹75,000 yearly credits to book flights & hotels on FlyAnyTrip.' },
    { title: 'Flexible Working', desc: 'Work from our beautiful Hubs in Milan or Gurgaon, or fully from home.' },
    { title: 'Health Insurance', desc: 'Premium medical coverage for you, your partner, and dependents.' },
    { title: 'Learning Allowance', desc: '100% reimbursement for books, courses, and certifications.' }
  ];

  const jobOpenings = [
    { id: 1, title: 'Senior Full-Stack React Engineer', dept: 'Engineering', location: 'Remote / Gurugram Hub', type: 'Full-time' },
    { id: 2, title: 'Lead UI/UX Designer', dept: 'Design', location: 'Milan, Italy (Hybrid)', type: 'Full-time' },
    { id: 3, title: 'SEO Growth Marketing Manager', dept: 'Marketing', location: 'Remote', type: 'Full-time' },
    { id: 4, title: 'QA & Automation Engineer', dept: 'Engineering', location: 'Gurugram Hub (Hybrid)', type: 'Full-time' },
    { id: 5, title: 'Customer Experience Associate', dept: 'Operations', location: 'Remote (Rotational shifts)', type: 'Full-time' }
  ];

  const depts = ['All', 'Engineering', 'Design', 'Marketing', 'Operations'];

  const filteredJobs = activeDept === 'All' 
    ? jobOpenings 
    : jobOpenings.filter(job => job.dept === activeDept);

  const handleApplySubmit = (e) => {
    e.preventDefault();
    if (!applicationData.name || !applicationData.email) {
      showToast('⚠️ Please enter both your name and email.');
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      showToast(`🎉 Application for "${selectedJob.title}" submitted successfully! Our HR team will reach out to you within 3 business days.`);
      setApplicationData({ name: '', email: '', portfolio: '', resume: '' });
      setSelectedJob(null);
      setSubmitting(false);
    }, 1200);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-satoshi text-gray-800">
      <Navbar />

      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white px-5 py-4 rounded-2xl shadow-2xl border border-gray-800 flex items-center gap-3 text-sm font-medium animate-bounce max-w-md">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#111111] to-[#2a0e0b] py-20 px-4 text-center text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(239,53,53,0.15),transparent_45%)]" />
        <div className="relative z-10 max-w-4xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 text-red-400 text-xs font-semibold uppercase tracking-wider mb-4 border border-white/5 backdrop-blur-md font-quicksand">
            <Sparkles className="w-3.5 h-3.5" /> Join the team
          </span>
          <h1 className="font-quicksand text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Help Us Shape the <span className="text-[#ef3535]">Future of Travel</span>
          </h1>
          <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto font-light leading-relaxed">
            At FlyAnyTrip, we are building a next-generation ecosystem to connect traveler dreams with frictionless realities. Explore our open positions and find your next challenge.
          </p>
        </div>
      </section>

      {/* VALUES CONTAINER */}
      <main className="flex-grow max-w-[1200px] w-full mx-auto px-4 py-12 md:py-16 -mt-8 relative z-20 space-y-16">
        
        {/* VALUES SECT */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {values.map((v, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 text-left">
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center mb-5 shrink-0">
                {v.icon}
              </div>
              <h3 className="font-quicksand font-bold text-base text-gray-900 mb-2">{v.title}</h3>
              <p className="text-sm text-gray-500 font-light leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </section>

        {/* PERKS SECT */}
        <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-left">
          <h2 className="font-quicksand font-bold text-2xl text-gray-900 mb-2 text-center md:text-left">Workplace Perks & Benefits</h2>
          <p className="text-sm text-gray-500 font-light mb-8 text-center md:text-left">Designed to support your physical, mental, and professional wellbeing.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {perks.map((pk, i) => (
              <div key={i} className="border border-slate-100 rounded-xl p-5 hover:border-red-100 transition-colors">
                <h4 className="font-bold text-sm text-gray-800 font-quicksand mb-1">{pk.title}</h4>
                <p className="text-xs text-gray-500 font-light leading-relaxed">{pk.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* JOB OPENINGS SECTION */}
        <section className="space-y-6 text-left">
          <h2 className="font-quicksand font-bold text-2xl text-gray-900 mb-2 text-center">Open Positions</h2>
          <p className="text-sm text-gray-500 font-light text-center mb-8">Filter by department to locate relevant openings.</p>
          
          {/* DEPT FILTERS */}
          <div className="flex flex-wrap gap-2 justify-center pb-4">
            {depts.map(d => (
              <button
                key={d}
                onClick={() => { setActiveDept(d); setSelectedJob(null); }}
                className={`px-4 py-2 rounded-full border text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                  activeDept === d
                    ? 'bg-[#ef3535] border-[#ef3535] text-white'
                    : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-800'
                }`}
              >
                {d}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Openings List (7 Cols) */}
            <div className={`${selectedJob ? 'lg:col-span-7' : 'lg:col-span-12'} space-y-4`}>
              {filteredJobs.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center border border-gray-150">
                  <Briefcase className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                  <h4 className="font-semibold text-gray-800 text-sm">No active roles in {activeDept}</h4>
                  <p className="text-xs text-gray-500 font-light mt-1">Check back later or register to get updates.</p>
                </div>
              ) : (
                filteredJobs.map(job => (
                  <div
                    key={job.id}
                    onClick={() => setSelectedJob(job)}
                    className={`bg-white rounded-2xl p-5 border shadow-xs transition-all duration-300 cursor-pointer flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${
                      selectedJob?.id === job.id 
                        ? 'border-[#ef3535] bg-red-50/10 ring-1 ring-[#ef3535]/15' 
                        : 'border-gray-150 hover:border-gray-300'
                    }`}
                  >
                    <div>
                      <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">{job.dept}</span>
                      <h4 className="font-quicksand font-bold text-base text-gray-900 mt-0.5">{job.title}</h4>
                      <div className="flex gap-4 mt-2 text-xs text-gray-500 font-light">
                        <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {job.location}</span>
                        <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5" /> {job.type}</span>
                      </div>
                    </div>
                    <button
                      className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-colors border-none cursor-pointer ${
                        selectedJob?.id === job.id 
                          ? 'bg-[#ef3535] text-white' 
                          : 'bg-slate-50 text-gray-600 hover:bg-[#ef3535] hover:text-white'
                      }`}
                    >
                      Apply Now
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Application side form (5 Cols) */}
            {selectedJob && (
              <div className="lg:col-span-5 bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-[#ef3535]/20 text-left animate-fadeIn">
                <h3 className="font-quicksand font-bold text-lg text-gray-900 mb-1">Apply for Role</h3>
                <p className="text-xs text-gray-500 font-light mb-4">{selectedJob.title}</p>
                <form onSubmit={handleApplySubmit} className="space-y-4">
                  <div className="flex flex-col">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      value={applicationData.name}
                      onChange={(e) => setApplicationData(prev => ({ ...prev, name: e.target.value }))}
                      required
                      placeholder="e.g. John Doe"
                      className="px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-[#ef3535] focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Email Address *</label>
                    <input
                      type="email"
                      value={applicationData.email}
                      onChange={(e) => setApplicationData(prev => ({ ...prev, email: e.target.value }))}
                      required
                      placeholder="john@example.com"
                      className="px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-[#ef3535] focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Portfolio Link</label>
                    <input
                      type="url"
                      value={applicationData.portfolio}
                      onChange={(e) => setApplicationData(prev => ({ ...prev, portfolio: e.target.value }))}
                      placeholder="https://github.com/johndoe (Optional)"
                      className="px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-[#ef3535] focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Resume / Cover Letter brief</label>
                    <textarea
                      value={applicationData.resume}
                      onChange={(e) => setApplicationData(prev => ({ ...prev, resume: e.target.value }))}
                      placeholder="Paste details of your background or share a drive link to your resume..."
                      rows="3"
                      className="px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-[#ef3535] focus:outline-none resize-none"
                    ></textarea>
                  </div>
                  <div className="flex gap-2.5 pt-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-grow bg-[#ef3535] hover:bg-red-600 disabled:bg-gray-400 text-white font-semibold py-2.5 rounded-xl transition-all text-xs border-none cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      {submitting ? 'Applying...' : 'Submit Application'} <Send className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedJob(null)}
                      className="px-4 py-2.5 border border-gray-200 hover:bg-gray-50 rounded-xl text-xs text-gray-500 bg-white font-semibold cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
