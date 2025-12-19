'use client'

import React from 'react';
import { Clock, Users, ArrowRight, Heart } from 'lucide-react';
import { Button } from './ui/button';
import { Course } from '@/data/mockData';
import Image from 'next/image';
import Link from 'next/link';
import { useWishlist } from '@/context/wishlist-context';

interface CourseCardProps {
    course: Course;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
    const { isInWishlist, toggleWishlist } = useWishlist();
    const inWishlist = isInWishlist(String(course.id));

    const handleWishlistClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWishlist(String(course.id));
    };

    return (
        <Link href={`/courses/${course.id}`} className="block">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-xl hover:border-orange-200 transition-all duration-300 group flex flex-col h-full overflow-hidden">
                <div className="relative h-48 overflow-hidden">
                    <Image
                        src={course.image}
                        alt={course.title}
                        width={800}
                        height={400}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                        <span className="bg-white/90 backdrop-blur-sm text-orange-600 text-xs font-bold px-2 py-1 rounded shadow-sm uppercase tracking-wide">
                            {course.tag}
                        </span>
                    </div>

                    {/* Wishlist Heart Button */}
                    <button
                        onClick={handleWishlistClick}
                        className={`absolute top-3 right-3 p-2 rounded-full shadow-lg backdrop-blur-sm transition-all hover:scale-110 z-10 ${inWishlist
                            ? 'bg-red-500 text-white'
                            : 'bg-white/90 text-gray-700 hover:bg-white'
                            }`}
                        title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                    >
                        <Heart className={`h-4 w-4 ${inWishlist ? 'fill-current' : ''}`} />
                    </button>

                    <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black/60 to-transparent"></div>
                </div>

                <div className="p-5 flex flex-col flex-grow">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs text-gray-500">{course.category}</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors">
                        {course.title}
                    </h3>
                    <div className="flex items-center gap-4 mb-2 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{course.duration}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span className="text-xs">{course.enrolled}</span>
                        </div>
                    </div>
                    <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                        <span className="text-xl font-bold text-gray-900">{course.price}</span>
                        <Button variant="ghost" className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 p-0 font-semibold h-auto group-hover:translate-x-1 transition-transform">
                            View Details
                            <ArrowRight className="ml-1 h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default CourseCard;
