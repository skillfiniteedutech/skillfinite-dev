'use client';

import React, { useState } from 'react';
import { categories } from '@/data/mockData';
import CourseCard from './CourseCard';
import { ChevronRight, Loader2 } from 'lucide-react';
import { useCourses } from '@/hooks/useCourses';
import Link from 'next/link';

// const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL; // Unused
// const API = `${BACKEND_URL}/api`; // Unused

const CourseSection: React.FC = () => {
    const { getCoursesByCategory, loading } = useCourses();

    // Filter out "All Courses" and get remaining categories
    const filteredCategories = categories.filter(cat => cat !== 'All Courses');
    const [activeCategory, setActiveCategory] = useState<string>(filteredCategories[0]);

    const courses = getCoursesByCategory(activeCategory).slice(0, 6);

    return (
        <section className="py-20 bg-gray-50" id="courses">
            <div className="container mx-auto px-4 max-w-7xl">
                {/* Header Section - Centered */}
                <div className="mb-12 text-center">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Find the Course Right for Your Goals
                    </h2>
                    <p className="text-lg text-gray-600">Explore From Over 400+ Courses</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Categories */}
                    <div className="lg:w-1/4">
                        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden sticky top-24">
                            <div className="p-5 bg-gradient-to-r from-orange-500 to-orange-600 border-b border-orange-600">
                                <h3 className="font-bold text-white text-lg">Browse Categories</h3>
                            </div>
                            <div className="max-h-[500px] overflow-y-auto custom-scrollbar">
                                {filteredCategories.map((cat, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setActiveCategory(cat)}
                                        className={`w-full text-left px-5 py-4 text-sm font-medium border-l-4 transition-all flex items-center justify-between group ${activeCategory === cat
                                            ? 'border-orange-500 bg-orange-50 text-orange-700'
                                            : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                            }`}
                                    >
                                        <span className="line-clamp-2">{cat}</span>
                                        {activeCategory === cat && <ChevronRight className="h-4 w-4 text-orange-500 flex-shrink-0 ml-2" />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Course Grid */}
                    <div className="lg:w-3/4">
                        {loading ? (
                            <div className="flex justify-center items-center h-96">
                                <Loader2 className="h-12 w-12 animate-spin text-orange-500" />
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                                    {courses.map((course) => (
                                        <CourseCard key={course.id} course={course} />
                                    ))}
                                </div>

                                {courses.length === 0 && (
                                    <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                                        <p className="text-gray-500 text-lg">No courses found in this category for now.</p>
                                    </div>
                                )}

                                {/* View All Button */}
                                <div className="text-center">
                                    <Link href="/courses">
                                        <button className="px-10 py-4 bg-white border-2 border-orange-500 text-orange-600 font-bold rounded-lg hover:bg-orange-50 transition-all shadow-md hover:shadow-lg transform hover:scale-105">
                                            View All 400+ Courses
                                        </button>
                                    </Link>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Custom Scrollbar Styles */}
            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 8px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #f1f1f1;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #fb923c;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #f97316;
                }
            `}</style>
        </section>
    );
};

export default CourseSection;
