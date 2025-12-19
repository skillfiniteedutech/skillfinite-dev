'use client';

import React from 'react';
import CourseCarousel from './CourseCarousel';
import { useCourses } from '@/hooks/useCourses';
import { useAuth } from '@/components/auth-context';

const RecommendedForYouSection: React.FC = () => {
    const { isAuthenticated } = useAuth();
    const { getRecommendedCourses, loading } = useCourses();
    const recommendedCourses = getRecommendedCourses();

    if (!isAuthenticated || loading) return null;

    return (
        <CourseCarousel
            title="Recommended for You"
            subtitle="Based on your interests"
            courses={recommendedCourses}
            viewAllLink="/courses?sort=recommended"
        />
    );
};

export default RecommendedForYouSection;
