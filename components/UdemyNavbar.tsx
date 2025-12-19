'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, ShoppingCart, Bell, ChevronDown, Menu, X, User, BookOpen, GraduationCap, Briefcase, Cloud, Code, Shield, Globe, Heart, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/components/auth-context';
import { useCart } from '@/context/cart-context';
import { useWishlist } from '@/context/wishlist-context';
import { categories } from '@/data/mockData';

// Category icons mapping
const categoryIcons: Record<string, any> = {
    'Student-Focused Learning': GraduationCap,
    'Career-Focused Tracks': Briefcase,
    'Professional & Enterprise Upskilling': Code,
    'AWS Aligned Programs': Cloud,
    'Microsoft Aligned Programs': Cloud,
    'Tamil-Language Learning': Globe,
    'Emerging Tech & Deep Tech': BookOpen,
    'Security & Compliance': Shield,
};

// Mega menu structure
const megaMenuCategories = categories.filter(cat => cat !== 'All Courses').map(category => ({
    name: category,
    icon: categoryIcons[category] || BookOpen,
    link: `/courses?category=${encodeURIComponent(category)}`,
}));

export default function UdemyNavbar() {
    const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    const { user, isAuthenticated } = useAuth();
    const { cartCount } = useCart();
    const { wishlistItems } = useWishlist();
    const router = useRouter();
    const megaMenuRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLDivElement>(null);

    // Handle scroll for sticky behavior
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mega menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (megaMenuRef.current && !megaMenuRef.current.contains(event.target as Node)) {
                setIsMegaMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/courses?search=${encodeURIComponent(searchQuery)}`);
            setSearchQuery('');
            setIsSearchFocused(false);
        }
    };

    const handleLogout = () => {
        // Clear authentication token
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Redirect to login page
        router.push('/login');
        // Optionally reload to clear any cached state
        window.location.href = '/login';
    };

    return (
        <nav
            className={`sticky top-0 z-50 w-full bg-white transition-shadow duration-200 ${isScrolled ? 'shadow-md' : 'border-b border-gray-200'
                }`}
        >
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 flex-shrink-0">
                        <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-lg">K</span>
                        </div>
                        <span className="text-xl font-bold text-gray-900 hidden sm:block">
                            Skill<span className="text-orange-500">finite</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center gap-6 flex-1 ml-8">
                        {/* Categories Mega Menu */}
                        <div className="relative" ref={megaMenuRef}>
                            <button
                                onClick={() => setIsMegaMenuOpen(!isMegaMenuOpen)}
                                className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-orange-600 transition-colors"
                            >
                                Categories
                                <ChevronDown
                                    className={`w-4 h-4 transition-transform duration-200 ${isMegaMenuOpen ? 'rotate-180' : ''
                                        }`}
                                />
                            </button>

                            {/* Mega Menu Dropdown */}
                            <AnimatePresence>
                                {isMegaMenuOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute left-0 top-full mt-2 w-[600px] bg-white rounded-lg shadow-2xl border border-gray-100 p-6"
                                    >
                                        <div className="grid grid-cols-2 gap-4">
                                            {megaMenuCategories.map((category, index) => {
                                                const Icon = category.icon;
                                                return (
                                                    <Link
                                                        key={index}
                                                        href={category.link}
                                                        onClick={() => setIsMegaMenuOpen(false)}
                                                        className="flex items-start gap-3 p-3 rounded-lg hover:bg-orange-50 transition-colors group"
                                                    >
                                                        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-orange-200 transition-colors">
                                                            <Icon className="w-5 h-5 text-orange-600" />
                                                        </div>
                                                        <div>
                                                            <div className="font-medium text-sm text-gray-900 group-hover:text-orange-600 transition-colors">
                                                                {category.name}
                                                            </div>
                                                        </div>
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                        <div className="mt-4 pt-4 border-t border-gray-100">
                                            <Link
                                                href="/courses"
                                                onClick={() => setIsMegaMenuOpen(false)}
                                                className="text-sm font-medium text-orange-600 hover:text-orange-700 flex items-center gap-1"
                                            >
                                                View all courses
                                                <ChevronDown className="w-4 h-4 -rotate-90" />
                                            </Link>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Search Bar */}
                        <div className="flex-1 max-w-xl" ref={searchRef}>
                            <form onSubmit={handleSearch} className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <Input
                                    type="text"
                                    placeholder="Search for courses..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onFocus={() => setIsSearchFocused(true)}
                                    onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                                    className="w-full pl-10 pr-4 h-11 border-gray-300 rounded-full focus:border-orange-500 focus:ring-orange-500"
                                />
                            </form>
                        </div>
                    </div>

                    {/* Right Side Actions */}
                    <div className="flex items-center gap-4">
                        {/* Desktop Actions */}
                        <div className="hidden lg:flex items-center gap-4">
                            {isAuthenticated ? (
                                <>
                                    <Link href="/mycourses">
                                        <Button variant="ghost" className="text-gray-700 hover:text-orange-600">
                                            My Learning
                                        </Button>
                                    </Link>

                                    {/* Wishlist */}
                                    <Link href="/wishlist" className="relative">
                                        <Heart className="w-6 h-6 text-gray-700 hover:text-orange-600 cursor-pointer transition-colors" />
                                        {/* Badge for wishlist items */}
                                        {wishlistItems.length > 0 && (
                                            <span className="absolute -top-2 -right-2 w-5 h-5 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center">
                                                {wishlistItems.length}
                                            </span>
                                        )}
                                    </Link>

                                    {/* Cart */}
                                    {/* Cart */}
                                    <Link href="/cart" className="relative">
                                        <ShoppingCart className="w-6 h-6 text-gray-700 hover:text-orange-600 cursor-pointer transition-colors" />
                                        {/* Badge for cart items */}
                                        {cartCount > 0 && (
                                            <span className="absolute -top-2 -right-2 w-5 h-5 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center">
                                                {cartCount}
                                            </span>
                                        )}
                                    </Link>

                                    {/* Profile */}
                                    <Link href="/profile">
                                        <div className="w-9 h-9 bg-orange-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-orange-600 transition-colors">
                                            <span className="text-white font-medium text-sm">
                                                {user?.name?.charAt(0).toUpperCase() || 'U'}
                                            </span>
                                        </div>
                                    </Link>

                                    {/* Logout Button */}
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Logout"
                                    >
                                        <LogOut className="w-5 h-5" />
                                        <span>Logout</span>
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link href="/login">
                                        <Button variant="ghost" className="text-gray-700 hover:text-orange-600 hover:bg-orange-50">
                                            Log In
                                        </Button>
                                    </Link>
                                    <Link href="/signup">
                                        <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                                            Sign Up
                                        </Button>
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="lg:hidden p-2"
                        >
                            {isMobileMenuOpen ? (
                                <X className="w-6 h-6 text-gray-700" />
                            ) : (
                                <Menu className="w-6 h-6 text-gray-700" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="lg:hidden border-t border-gray-200 py-4 space-y-4"
                        >
                            {/* Mobile Search */}
                            <form onSubmit={handleSearch} className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <Input
                                    type="text"
                                    placeholder="Search for courses..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 h-11 border-gray-300 rounded-full focus:border-orange-500 focus:ring-orange-500"
                                />
                            </form>

                            {/* Mobile Categories */}
                            <div className="space-y-2">
                                <div className="font-semibold text-sm text-gray-900 px-2">Categories</div>
                                <div className="space-y-1">
                                    {megaMenuCategories.slice(0, 6).map((category, index) => {
                                        const Icon = category.icon;
                                        return (
                                            <Link
                                                key={index}
                                                href={category.link}
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-orange-50 transition-colors"
                                            >
                                                <Icon className="w-5 h-5 text-orange-600" />
                                                <span className="text-sm text-gray-700">{category.name}</span>
                                            </Link>
                                        );
                                    })}
                                    <Link
                                        href="/courses"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="flex items-center gap-1 px-2 py-2 text-sm font-medium text-orange-600"
                                    >
                                        View all categories
                                        <ChevronDown className="w-4 h-4 -rotate-90" />
                                    </Link>
                                </div>
                            </div>

                            {/* Mobile Actions */}
                            {isAuthenticated ? (
                                <div className="space-y-2 pt-4 border-t border-gray-200">
                                    <Link
                                        href="/mycourses"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="block px-2 py-2 text-sm font-medium text-gray-700 hover:text-orange-600"
                                    >
                                        My Learning
                                    </Link>
                                    <Link
                                        href="/wishlist"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="block px-2 py-2 text-sm font-medium text-gray-700 hover:text-orange-600"
                                    >
                                        Wishlist
                                    </Link>
                                    <Link
                                        href="/cart"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="block px-2 py-2 text-sm font-medium text-gray-700 hover:text-orange-600"
                                    >
                                        Cart
                                    </Link>
                                    <Link
                                        href="/profile"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="block px-2 py-2 text-sm font-medium text-gray-700 hover:text-orange-600"
                                    >
                                        Profile
                                    </Link>
                                    <button
                                        onClick={() => {
                                            setIsMobileMenuOpen(false);
                                            handleLogout();
                                        }}
                                        className="w-full text-left px-2 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2"
                                    >
                                        <LogOut className="w-5 h-5" />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            ) : (
                                <div className="flex gap-3 pt-4 border-t border-gray-200">
                                    <Link href="/login" className="flex-1" onClick={() => setIsMobileMenuOpen(false)}>
                                        <Button variant="outline" className="w-full">
                                            Log In
                                        </Button>
                                    </Link>
                                    <Link href="/signup" className="flex-1" onClick={() => setIsMobileMenuOpen(false)}>
                                        <Button className="w-full bg-orange-500 hover:bg-orange-600">
                                            Sign Up
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </nav>
    );
}
