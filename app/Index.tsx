'use client';

import { useEffect } from 'react';
import axios from 'axios';
import UdemyNavbar from '@/components/UdemyNavbar';
import Hero from '@/components/Hero';
import CategoryCardsSection from '@/components/CategoryCardsSection';
import TrendingCoursesSection from '@/components/TrendingCoursesSection';
import TopRatedSection from '@/components/TopRatedSection';
import NewCoursesSection from '@/components/NewCoursesSection';
import StatsSection from '@/components/StatsSection';
import CourseSection from '@/components/CourseSection';
import SmartFeatures from '@/components/SmartFeatures';
import PartnerLogosSection from '@/components/PartnerLogosSection';
import RecommendedForYouSection from '@/components/RecommendedForYouSection';
import RealTimeViewers from '@/components/RealTimeViewers';
import ConnectSection from '@/components/ConnectSection';
import Testimonials from '@/components/ui/testimonials-columns';
import { AnimatedTestimonials } from '@/components/ui/animated-testimonials';
import Footer from '@/components/Footer';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function Index() {
  // Simple check to ensure backend is reachable
  useEffect(() => {
    const checkBackend = async () => {
      try {
        await axios.get(`${API}/`);
        console.log('Backend Connected');
      } catch (e) {
        console.log('Backend not ready yet, running in frontend mock mode');
      }
    };
    checkBackend();
  }, []);

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-900 bg-white">
      <UdemyNavbar />
      <main>
        {/* Hero Section - Enhanced */}
        <Hero />

        {/* Category Cards - NEW */}
        <CategoryCardsSection />

        {/* Trending Courses Carousel - NEW */}
        <TrendingCoursesSection />

        {/* Top Rated Courses Carousel - NEW */}
        <TopRatedSection />

        {/* New Courses Carousel - NEW */}
        <NewCoursesSection />

        {/* Recommended for You - NEW (Authenticated) */}
        <RecommendedForYouSection />

        {/* Statistics Section - NEW */}
        <StatsSection />

        {/* Existing Course Section - "Find the Course Right for Your Goals" */}
        <CourseSection />

        {/* Smart Features */}
        <SmartFeatures />

        {/* Partner Logos - NEW */}
        <PartnerLogosSection />

        {/* Connect Section */}
        <ConnectSection />

        {/* Marquee Testimonials */}
        <Testimonials />

        {/* Spotlight Testimonials */}
        <AnimatedTestimonials
          title="Success Stories"
          subtitle="See how our learners achieved their career goals with Skillfinite certifications."
          badgeText="Learner Spotlight"
          autoRotateInterval={5000}
          testimonials={[
            {
              id: 1,
              name: 'Alex Johnson',
              role: 'Scrum Master',
              company: 'TechFlow',
              content:
                'The CSM certification course was fantastic. I moved from a developer role to a Scrum Master role within 2 months of completion. The salary hike was substantial!',
              rating: 5,
              avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
            },
            {
              id: 2,
              name: 'Sarah Miller',
              role: 'Project Manager',
              company: 'DesignHub',
              content:
                'PMP certification was tough, but Skillfinite\'s prep course made it manageable. I passed on my first attempt with Above Target in all domains.',
              rating: 5,
              avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
            },
            {
              id: 3,
              name: 'Michael Chen',
              role: 'Data Scientist',
              company: 'InnovateLabs',
              content:
                'The Data Science bootcamp is comprehensive. We covered everything from Python basics to Deep Learning. The capstone project helped me build a strong portfolio.',
              rating: 5,
              avatar: 'https://randomuser.me/api/portraits/men/46.jpg',
            }
          ]}
          trustedCompanies={['Google', 'Microsoft', 'Airbnb', 'Spotify', 'Netflix']}
          trustedCompaniesTitle="Our alumni work at"
        />
        <RealTimeViewers />
      </main>
      <Footer />
    </div>
  );
}
