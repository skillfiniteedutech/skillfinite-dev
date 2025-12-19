'use client';

import React from 'react';
import CourseCarousel from './CourseCarousel';
import { useCourses } from '@/hooks/useCourses';

const NewCoursesSection: React.FC = () => {
    const { getNewCourses, loading } = useCourses();
    const newCourses = getNewCourses();

    if (loading) return null;

    return (
        <CourseCarousel
            title="New Courses"
            subtitle="Recently added to our catalog"
            courses={newCourses}
            viewAllLink="/courses?sort=newest"
        />
    );
};

export default NewCoursesSection;
