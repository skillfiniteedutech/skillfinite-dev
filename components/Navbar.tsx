'use client';

import React, { useState } from 'react';
import { Search, Menu, X, ChevronDown, ShoppingCart, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { categories } from '@/data/mockData';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isCatalogOpen, setIsCatalogOpen] = useState(false);

    return (
        <nav className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center gap-8">
                    <a href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-xl">K</span>
                        </div>
                        <span className="text-xl font-bold text-gray-900">
                            Skill<span className="text-orange-500">finite</span>
                        </span>
                    </a>

                    {/* Desktop Search */}
                    <div className="hidden md:flex items-center relative w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <input
                            type="text"
                            placeholder="What do you want to learn today?"
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm"
                        />
                    </div>
                </div>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-6">
                    {/* Catalog Dropdown */}
                    <div
                        className="relative group"
                        onMouseEnter={() => setIsCatalogOpen(true)}
                        onMouseLeave={() => setIsCatalogOpen(false)}
                    >
                        <button
                            className="flex items-center gap-1 cursor-pointer hover:text-orange-600 transition-colors font-medium text-sm py-4"
                        >
                            Catalog <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isCatalogOpen ? 'rotate-180' : ''}`} />
                        </button>

                        <AnimatePresence>
                            {isCatalogOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute top-full left-0 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 overflow-hidden"
                                >
                                    {categories.filter(c => c !== 'All Courses').map((category, index) => (
                                        <a
                                            key={index}
                                            href="/#courses"
                                            className="block px-4 py-2.5 text-sm text-gray-600 hover:bg-orange-50 hover:text-orange-600 transition-colors flex items-center justify-between group/item"
                                        >
                                            {category}
                                            <ChevronRight className="w-4 h-4 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                                        </a>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <a
                        href="/courses"
                        className="text-gray-600 hover:text-orange-600 transition-colors font-medium text-sm"
                    >
                        Courses
                    </a>
                    <a
                        href="#"
                        className="text-gray-600 hover:text-orange-600 transition-colors font-medium text-sm"
                    >
                        Corporate
                    </a>
                    <a
                        href="#"
                        className="text-gray-600 hover:text-orange-600 transition-colors font-medium text-sm"
                    >
                        Resources
                    </a>
                </div>

                {/* Actions */}
                <div className="hidden md:flex items-center gap-3">
                    <ShoppingCart className="h-5 w-5 text-gray-600 hover:text-orange-600 cursor-pointer" />
                    <Button variant="ghost" className="text-gray-700 hover:text-orange-600 hover:bg-orange-50" asChild>
                        <a href="/login">Log In</a>
                    </Button>
                    <Button className="bg-orange-500 hover:bg-orange-600 text-white" asChild>
                        <a href="/signup">Sign Up</a>
                    </Button>
                </div>

                {/* Mobile Toggle */}
                <button className="md:hidden p-2" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-white border-t p-4 flex flex-col gap-4 shadow-lg absolute w-full max-h-[80vh] overflow-y-auto">
                    <div className="relative w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <input
                            type="text"
                            placeholder="Search courses..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                        />
                    </div>

                    <div className="border-b pb-2">
                        <div className="font-medium py-2 text-gray-900 mb-2">Catalog</div>
                        <div className="pl-4 flex flex-col gap-2">
                            {categories.filter(c => c !== 'All Courses').map((category, index) => (
                                <a
                                    key={index}
                                    href="/#courses"
                                    className="text-sm text-gray-600 py-1"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {category}
                                </a>
                            ))}
                        </div>
                    </div>

                    <a href="/courses" className="font-medium py-2 border-b" onClick={() => setIsOpen(false)}>
                        Courses
                    </a>
                    <a href="#" className="font-medium py-2 border-b">
                        Corporate
                    </a>
                    <a href="#" className="font-medium py-2 border-b">
                        Resources
                    </a>
                    <div className="flex gap-3 pt-2">
                        <Button variant="outline" className="flex-1" asChild>
                            <a href="/login">Log In</a>
                        </Button>
                        <Button className="flex-1 bg-orange-500 hover:bg-orange-600" asChild>
                            <a href="/signup">Sign Up</a>
                        </Button>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
