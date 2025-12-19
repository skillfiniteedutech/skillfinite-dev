'use client';

import React from 'react';
import CourseCarousel from './CourseCarousel';
import { useCourses } from '@/hooks/useCourses';

const TrendingCoursesSection: React.FC = () => {
    const { getTrendingCourses, loading } = useCourses();
    const trendingCourses = getTrendingCourses();

    if (loading) return null;

    return (
        <CourseCarousel
            title="Trending Courses"
            subtitle="Most popular courses this month"
            courses={trendingCourses}
            viewAllLink="/courses?sort=trending"
        />
    );
};

export default TrendingCoursesSection;
