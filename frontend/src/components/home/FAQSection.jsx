import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import faqs from '../../data/faq';

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="py-16 bg-gray-50/50 w-full font-satoshi">
      <div className="container mx-auto px-4 max-w-4xl">
        <h2 className="text-[34px] font-extrabold text-center mb-10 text-[#1a1a1a] font-satoshi tracking-tight leading-tight">Frequently Asked Questions</h2>
        <div className="space-y-4 font-satoshi">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div 
                key={index} 
                className={`border rounded-2xl overflow-hidden transition-all duration-300 ${isOpen ? 'bg-[#fef2f2] border-[#fca5a5]/30' : 'bg-white border-gray-100 hover:border-gray-200'}`}
              >
                <button
                  className="w-full text-left px-6 py-5 flex justify-between items-center focus:outline-none"
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                >
                  <span className={`text-[15px] font-satoshi font-semibold ${isOpen ? 'text-[#1a1a1a]' : 'text-gray-800'}`}>{faq.question}</span>
                  <div className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full transition-colors ${isOpen ? 'bg-[#ef3535]/10' : 'bg-gray-50'}`}>
                    {isOpen ? <ChevronUp size={18} className="text-[#ef3535]" /> : <ChevronDown size={18} className="text-gray-400" />}
                  </div>
                </button>
                <div 
                  className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}
                >
                  <div className="px-6 pb-5 text-[#666] text-[14px] font-satoshi font-normal leading-relaxed">
                    <p>{faq.answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
