'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { partners } from '@/data/mockData';

const PartnerLogosSection: React.FC = () => {
    // Duplicate partners for infinite scroll effect
    const duplicatedPartners = [...partners, ...partners, ...partners];

    return (
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                        Trusted by Leading Organizations
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Our courses are aligned with industry standards and recognized by top companies
                    </p>
                </div>

                {/* Logos Marquee */}
                <div className="relative overflow-hidden">
                    {/* Gradient Overlays */}
                    <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-gray-50 to-transparent z-10" />
                    <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-gray-50 to-transparent z-10" />

                    {/* Scrolling Container */}
                    <motion.div
                        className="flex gap-12 items-center"
                        animate={{
                            x: [0, -1000],
                        }}
                        transition={{
                            x: {
                                repeat: Infinity,
                                repeatType: 'loop',
                                duration: 20,
                                ease: 'linear',
                            },
                        }}
                    >
                        {duplicatedPartners.map((partner, index) => (
                            <div
                                key={`${partner.name}-${index}`}
                                className="flex-shrink-0 w-40 h-20 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100"
                            >
                                <img
                                    src={partner.logo}
                                    alt={partner.name}
                                    className="max-w-full max-h-full object-contain"
                                />
                            </div>
                        ))}
                    </motion.div>
                </div>

                {/* Trust Badge */}
                <div className="text-center mt-12">
                    <div className="inline-flex items-center gap-2 px-6 py-3 bg-white rounded-full shadow-md border border-gray-200">
                        <div className="flex -space-x-2">
                            {[1, 2, 3, 4].map((i) => (
                                <div
                                    key={i}
                                    className="w-8 h-8 rounded-full border-2 border-white bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-xs font-semibold"
                                >
                                    {String.fromCharCode(65 + i)}
                                </div>
                            ))}
                        </div>
                        <span className="text-sm font-medium text-gray-700">
                            Join <span className="font-bold text-orange-600">17,000+</span> students learning with us
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PartnerLogosSection;
