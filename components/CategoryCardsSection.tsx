'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { categoryMetadata } from '@/data/categoryIcons';
import { getCategoryCount, categories } from '@/data/mockData';
import { ArrowRight } from 'lucide-react';

const CategoryCardsSection: React.FC = () => {
    const router = useRouter();

    // Filter out "All Courses" from categories
    const displayCategories = categories.filter(cat => cat !== 'All Courses');

    const handleCategoryClick = (categoryName: string) => {
        router.push(`/courses?category=${encodeURIComponent(categoryName)}`);
    };

    return (
        <section className="py-16 bg-gradient-to-b from-white to-gray-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                        Explore Top Categories
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Choose from our diverse range of courses across multiple domains
                    </p>
                </div>

                {/* Category Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {displayCategories.map((categoryName, index) => {
                        const meta = categoryMetadata[categoryName];
                        if (!meta) return null;

                        const Icon = meta.icon;
                        const courseCount = getCategoryCount(categoryName);

                        return (
                            <motion.div
                                key={categoryName}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <button
                                    onClick={() => handleCategoryClick(categoryName)}
                                    className="group relative w-full h-full p-6 bg-white rounded-xl border-2 border-gray-200 hover:border-orange-300 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 text-left"
                                >
                                    {/* Icon with Gradient Background */}
                                    <div className={`inline-flex items-center justify-center w-14 h-14 rounded-lg bg-gradient-to-br ${meta.color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                        <Icon className="w-7 h-7 text-white" />
                                    </div>

                                    {/* Category Name */}
                                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                                        {meta.name}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                        {meta.description}
                                    </p>

                                    {/* Course Count */}
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-semibold text-gray-700">
                                            {courseCount} {courseCount === 1 ? 'course' : 'courses'}
                                        </span>
                                        <ArrowRight className="w-4 h-4 text-orange-500 group-hover:translate-x-1 transition-transform" />
                                    </div>

                                    {/* Hover Gradient Overlay */}
                                    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-orange-500/0 to-orange-600/0 group-hover:from-orange-500/5 group-hover:to-orange-600/5 transition-all duration-300 pointer-events-none" />
                                </button>
                            </motion.div>
                        );
                    })}
                </div>

                {/* View All Categories Link */}
                <div className="text-center mt-10">
                    <button
                        onClick={() => router.push('/courses')}
                        className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-semibold text-lg group"
                    >
                        View all courses
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        </section>
    );
};

export default CategoryCardsSection;
