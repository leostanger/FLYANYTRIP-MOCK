/*
 * Flyanytrip
 * Authors: Gaurav Thakur, Milan Pandavadara
 *
 * Refactored "Happy Customers" section.
 * Aligned with the project's premium design: clean backgrounds,
 * extrabold typography, and glass-card effects.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Search, Sliders, Tag, MessageSquare, ArrowRight } from 'lucide-react';

const customerFeatures = [
  {
    title: "Pay What You See",
    icon: Search,
    description: "FlyAnyTrip's \"Pay What You See\" ensures transparent pricing with no hidden fees, zero convenience fees, and no last-minute surprises.",
    images: ["c-9.jpg", "c-8.jpg"],
    reverse: false
  },
  {
    title: "Freedom to Customization",
    icon: Sliders,
    description: "Customize your travel experience exactly how you want. From flexible dates to personalized itineraries, we put you in control.",
    images: ["c-5.jpg", "c-10.jpg"],
    reverse: true
  },
  {
    title: "Unbelievable Pricing Deals",
    icon: Tag,
    description: "Get the best travel deals at unbeatable prices. Our direct partnerships with airlines and hotels ensure you get the lowest rates globally.",
    images: ["c-11.jpg", "c-12.jpg"],
    reverse: false
  },
  {
    title: "Dedicated Customer Assistance",
    icon: MessageSquare,
    description: "24/7 expert support to help you throughout your journey. Whether it's a rescheduling or a surprise destination change, we've got your back.",
    images: ["c-13.jpg", "c-14.jpg"],
    reverse: true
  }
];

/**
 * Renders the "Happy Customers" informational section.
 * This component uses an alternating 2-column layout to highlight key
 * company value propositions with associated customer photos.
 *
 * @returns {JSX.Element} The rendered section.
 */
const HappyCustomers = () => {
  return (
    <section className="py-32 bg-[#F9FAFB] border-y border-black/5">
      <div className="max-w-[1200px] mx-auto px-6">
        
        {/* Section Heading — Synced with site standards */}
        <div className="text-center mb-24">
          <h2 className="text-4xl font-extrabold text-brand-black mb-4 tracking-tight">
            Happy <span className="text-brand-red">Customers</span>
          </h2>
          <p className="text-brand-black/50 text-lg font-medium">
            Explore More Spend Less.
          </p>
        </div>

        {/* Feature Blocks — Refined alternating layout */}
        <div className="flex flex-col gap-24 lg:gap-32">
          {customerFeatures.map((block, index) => (
            <div 
              key={index}
              className={`flex flex-col lg:flex-row items-center gap-16 lg:gap-24 ${block.reverse ? 'lg:flex-row-reverse' : ''}`}
            >
              
              {/* Text Card Side — Standardized Glass Card */}
              <div className="w-full lg:w-1/2">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="relative p-10 lg:p-14 rounded-3xl glass-card group transition-all duration-500 hover:shadow-2xl hover:shadow-brand-red/5"
                >
                  <div className="mb-6 p-4 bg-brand-red/5 w-fit rounded-2xl group-hover:bg-brand-red/10 transition-colors">
                    <block.icon className="text-brand-red" size={28} />
                  </div>
                  
                  <h4 className="text-2xl font-extrabold text-brand-black mb-4 flex items-center gap-3">
                    {block.title}
                  </h4>
                  <p className="text-brand-black/60 text-lg leading-relaxed font-medium mb-8">
                    {block.description}
                  </p>
                  
                  <div className="flex items-center gap-2 text-brand-red font-bold text-sm tracking-widest uppercase group-hover:gap-4 transition-all cursor-pointer">
                    Learn More <ArrowRight size={16} />
                  </div>
                </motion.div>
              </div>

              {/* Images Side — Standardized image treatment */}
              <div className="w-full lg:w-1/2 flex gap-6">
                {block.images.map((img, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="w-1/2 aspect-[3/4] rounded-3xl overflow-hidden shadow-xl ring-1 ring-black/5 group cursor-pointer"
                  >
                    <img 
                      src={`/assets/customer/${img}`} 
                      alt={`Customer ${index + i + 1}`} 
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                      onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x800/f8f9fa/a8a29e?text=Customer'; }}
                    />
                  </motion.div>
                ))}
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default HappyCustomers;
