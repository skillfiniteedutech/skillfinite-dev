'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Users, BookOpen, Award, Star } from 'lucide-react';

const StatsSection: React.FC = () => {
    const stats = [
        {
            icon: Users,
            value: '17,000+',
            label: 'Active Students',
            color: 'from-blue-500 to-blue-600',
        },
        {
            icon: BookOpen,
            value: '1,000+',
            label: 'Online Courses',
            color: 'from-orange-500 to-orange-600',
        },
        {
            icon: Award,
            value: '150+',
            label: 'Expert Instructors',
            color: 'from-purple-500 to-purple-600',
        },
        {
            icon: Star,
            value: '4.8/5',
            label: 'Average Rating',
            color: 'from-amber-500 to-amber-600',
        },
    ];

    return (
        <section className="py-16 bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                        Join Thousands of Learners Worldwide
                    </h2>
                    <p className="text-lg text-orange-100 max-w-2xl mx-auto">
                        Be part of a thriving community of learners achieving their goals
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                    {stats.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="text-center"
                            >
                                {/* Icon */}
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full mb-4">
                                    <Icon className="w-8 h-8 text-white" />
                                </div>

                                {/* Value */}
                                <motion.div
                                    initial={{ scale: 0.5 }}
                                    whileInView={{ scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                                    className="text-4xl sm:text-5xl font-bold text-white mb-2"
                                >
                                    {stat.value}
                                </motion.div>

                                {/* Label */}
                                <p className="text-orange-100 font-medium">
                                    {stat.label}
                                </p>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default StatsSection;
