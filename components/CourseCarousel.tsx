'use client';

import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Course } from '@/data/mockData';
import { useRouter } from 'next/navigation';

interface CourseCarouselProps {
    title: string;
    subtitle?: string;
    courses: Course[];
    viewAllLink?: string;
}

const CourseCarousel: React.FC<CourseCarouselProps> = ({
    title,
    subtitle,
    courses,
    viewAllLink = '/courses',
}) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = 400;
            const newScrollLeft =
                scrollContainerRef.current.scrollLeft +
                (direction === 'left' ? -scrollAmount : scrollAmount);
            scrollContainerRef.current.scrollTo({
                left: newScrollLeft,
                behavior: 'smooth',
            });
        }
    };

    const handleCourseClick = (courseId: string | number) => {
        router.push(`/courses/${courseId}`);
    };

    return (
        <section className="py-12 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                            {title}
                        </h2>
                        {subtitle && (
                            <p className="text-lg text-gray-600">{subtitle}</p>
                        )}
                    </div>
                    <button
                        onClick={() => router.push(viewAllLink)}
                        className="hidden md:flex items-center gap-2 text-orange-600 hover:text-orange-700 font-semibold group"
                    >
                        View all
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>

                {/* Carousel Container */}
                <div className="relative group/carousel">
                    {/* Navigation Buttons */}
                    <button
                        onClick={() => scroll('left')}
                        className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 items-center justify-center w-12 h-12 bg-white rounded-full shadow-lg border border-gray-200 hover:bg-gray-50 hover:border-orange-300 transition-all opacity-0 group-hover/carousel:opacity-100"
                        aria-label="Scroll left"
                    >
                        <ChevronLeft className="w-6 h-6 text-gray-700" />
                    </button>
                    <button
                        onClick={() => scroll('right')}
                        className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 items-center justify-center w-12 h-12 bg-white rounded-full shadow-lg border border-gray-200 hover:bg-gray-50 hover:border-orange-300 transition-all opacity-0 group-hover/carousel:opacity-100"
                        aria-label="Scroll right"
                    >
                        <ChevronRight className="w-6 h-6 text-gray-700" />
                    </button>

                    {/* Course Cards Scroll Container */}
                    <div
                        ref={scrollContainerRef}
                        className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {courses.map((course, index) => (
                            <motion.div
                                key={course.id}
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.05 }}
                                className="flex-shrink-0 w-[280px] sm:w-[320px]"
                            >
                                <button
                                    onClick={() => handleCourseClick(course.id)}
                                    className="group w-full bg-white rounded-lg border border-gray-200 hover:border-orange-300 hover:shadow-xl transition-all duration-300 overflow-hidden text-left"
                                >
                                    {/* Course Image */}
                                    <div className="relative h-44 overflow-hidden bg-gray-100">
                                        <img
                                            src={course.image}
                                            alt={course.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                        {/* Tag Badge */}
                                        {course.tag && (
                                            <div className="absolute top-3 left-3 px-3 py-1 bg-orange-500 text-white text-xs font-semibold rounded-full">
                                                {course.tag}
                                            </div>
                                        )}
                                    </div>

                                    {/* Course Info */}
                                    <div className="p-4">
                                        <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors">
                                            {course.title}
                                        </h3>
                                        <p className="text-sm text-gray-600 mb-3">
                                            {course.category}
                                        </p>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-600">
                                                {course.duration}
                                            </span>
                                            <span className="font-bold text-orange-600 text-lg">
                                                {course.price}
                                            </span>
                                        </div>
                                        <div className="mt-2 text-xs text-gray-500">
                                            {course.enrolled}
                                        </div>
                                    </div>
                                </button>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Mobile View All Button */}
                <div className="md:hidden text-center mt-6">
                    <button
                        onClick={() => router.push(viewAllLink)}
                        className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-semibold"
                    >
                        View all
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </section>
    );
};

export default CourseCarousel;
