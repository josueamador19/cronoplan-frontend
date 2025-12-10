
import React from 'react';
import NavigationBar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import HeroSection from '../components/sections/HeroSection';
import FeaturesSection from '../components/sections/FeaturesSection';
import HowItWorksSection from '../components/sections/HowItWorksSection';
import ViewsSection from '../components/sections/ViewsSection';
import CTASection from '../components/sections/CTASection';

const LandingPage = () => {
  return (
    <div>
      <NavigationBar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <ViewsSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default LandingPage;