'use client';

import React from 'react';
import CourseCarousel from './CourseCarousel';
import { useCourses } from '@/hooks/useCourses';

const TopRatedSection: React.FC = () => {
    const { getTopRatedCourses, loading } = useCourses();
    const topRatedCourses = getTopRatedCourses();

    if (loading) return null;

    return (
        <CourseCarousel
            title="Top Rated Courses"
            subtitle="Highest rated by our students"
            courses={topRatedCourses}
            viewAllLink="/courses?sort=rating"
        />
    );
};

export default TopRatedSection;
