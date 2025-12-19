'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Star, Clock, BookOpen, BarChart } from 'lucide-react';
import { ExtendedCourse } from '@/data/mockData';

interface CourseCardHorizontalProps {
    course: ExtendedCourse;
    highlightTerm?: string;
}

const HighlightText = ({ text, highlight }: { text: string; highlight?: string }) => {
    if (!highlight || !highlight.trim()) {
        return <>{text}</>;
    }
    const regex = new RegExp(`(${highlight})`, 'gi');
    const parts = text.split(regex);
    return (
        <>
            {parts.map((part, i) =>
                regex.test(part) ? <span key={i} className="bg-yellow-200 text-gray-900">{part}</span> : part
            )}
        </>
    );
};

const CourseCardHorizontal: React.FC<CourseCardHorizontalProps> = ({ course, highlightTerm }) => {
    const router = useRouter();

    return (
        <div
            onClick={() => router.push(`/courses/${course.id}`)}
            className="flex flex-col sm:flex-row gap-4 p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer group"
        >
            {/* Thumbnail */}
            <div className="flex-shrink-0 relative w-full sm:w-64 h-40 bg-gray-200 rounded-lg overflow-hidden">
                <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {course.bestseller && (
                    <div className="absolute top-2 left-2 px-2 py-1 bg-yellow-400 text-xs font-bold text-gray-900 uppercase tracking-wide rounded-sm shadow-sm">
                        Bestseller
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col justify-start">
                <div className="flex justify-between items-start">
                    <div className="space-y-1">
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-orange-600 line-clamp-2 leading-tight">
                            <HighlightText text={course.title} highlight={highlightTerm} />
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-1">
                            <HighlightText text={course.description || "Learn the essential skills to master this subject."} highlight={highlightTerm} />
                        </p>
                        <p className="text-xs text-gray-500">
                            {course.instructor}
                        </p>
                    </div>
                    <div className="text-right hidden sm:block">
                        <div className="font-bold text-lg text-gray-900">
                            {course.price}
                        </div>
                        {course.price !== 'Free' && (
                            <div className="text-xs text-gray-500 line-through">
                                ${(parseInt(course.price.replace(/[^0-9]/g, '')) * 1.5).toLocaleString('en-IN')}
                            </div>
                        )}
                    </div>
                </div>

                {/* Rating & Stats */}
                <div className="mt-2 space-y-1">
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-amber-800 text-sm">{course.rating.toFixed(1)}</span>
                        <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    className={`w-3.5 h-3.5 ${star <= Math.round(course.rating)
                                        ? 'fill-amber-400 text-amber-400'
                                        : 'fill-gray-200 text-gray-200'
                                        }`}
                                />
                            ))}
                        </div>
                        <span className="text-xs text-gray-500">({course.reviews} reviews)</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{course.duration}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <BookOpen className="w-3.5 h-3.5" />
                            <span>{course.lectures} lectures</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <BarChart className="w-3.5 h-3.5 rotate-90" />
                            <span>{course.level}</span>
                        </div>
                    </div>

                    {/* Tag Badge (if not bestseller) */}
                    {!course.bestseller && course.tag && (
                        <div className="pt-1">
                            <span className="inline-block px-2 py-0.5 bg-orange-100 text-orange-700 text-xs font-semibold rounded-sm">
                                {course.tag}
                            </span>
                        </div>
                    )}
                </div>

                {/* Mobile Price */}
                <div className="mt-4 sm:hidden flex items-baseline gap-2">
                    <span className="font-bold text-lg text-gray-900">{course.price}</span>
                    {course.price !== 'Free' && (
                        <span className="text-xs text-gray-500 line-through">
                            ${(parseInt(course.price.replace(/[^0-9]/g, '')) * 1.5).toLocaleString('en-IN')}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CourseCardHorizontal;
