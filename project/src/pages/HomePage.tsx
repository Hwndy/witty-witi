import React from 'react';
import Hero from '../components/Hero';
import CategorySection from '../components/CategorySection';
import FeaturedProducts from '../components/FeaturedProducts';
import Testimonials from '../components/Testimonials';
import ContactSection from '../components/ContactSection';

const HomePage: React.FC = () => {
  return (
    <main>
      <Hero />
      <CategorySection />
      <FeaturedProducts />
      <Testimonials />
      <ContactSection />
    </main>
  );
};

export default HomePage;