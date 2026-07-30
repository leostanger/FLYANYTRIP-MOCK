import React from 'react';
import TopBar from '../components/common/TopBar';
import Navbar from '../components/common/Navbar';
import HeroSection from '../components/hero/HeroSection';
import TrustBar from '../components/common/TrustBar';
import PopularDestinations from '../components/home/PopularDestinations';
import PopularFlightRoutes from '../components/home/PopularFlightRoutes';
import TopHotelDeals from '../components/home/TopHotelDeals';
import WhyChooseUs from '../components/home/WhyChooseUs';
import Testimonials from '../components/home/Testimonials';
import FAQSection from '../components/home/FAQSection';
import Footer from '../components/common/Footer';

const Home = () => {
  return (
    <div className="font-sans flex flex-col min-h-screen">
      <TopBar />
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        <TrustBar />
        <PopularDestinations />
        <PopularFlightRoutes />
        <TopHotelDeals />
        <WhyChooseUs />
        <Testimonials />
        <FAQSection />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
