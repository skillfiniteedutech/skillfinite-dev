'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Star } from 'lucide-react';

interface FilterGroupProps {
    title: string;
    isOpen?: boolean;
    children: React.ReactNode;
}

const FilterGroup: React.FC<FilterGroupProps> = ({ title, isOpen = true, children }) => {
    const [open, setOpen] = useState(isOpen);

    return (
        <div className="border-b border-gray-200 py-4">
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center justify-between w-full text-left mb-2 group"
            >
                <h3 className="font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                    {title}
                </h3>
                {open ? (
                    <ChevronUp className="w-4 h-4 text-gray-500" />
                ) : (
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                )}
            </button>
            {open && <div className="space-y-2 mt-2">{children}</div>}
        </div>
    );
};

interface CourseFilterSidebarProps {
    selectedRatings: number[];
    toggleRating: (rating: number) => void;
    selectedLevels: string[];
    toggleLevel: (level: string) => void;
    selectedDurations: string[];
    toggleDuration: (duration: string) => void;
    categories: string[];
    selectedCategories: string[];
    toggleCategory: (category: string) => void;
    priceFilter: string;
    setPriceFilter: (price: string) => void;
}

const CourseFilterSidebar: React.FC<CourseFilterSidebarProps> = ({
    selectedRatings,
    toggleRating,
    selectedLevels,
    toggleLevel,
    selectedDurations,
    toggleDuration,
    categories,
    selectedCategories,
    toggleCategory,
    priceFilter,
    setPriceFilter
}) => {
    return (
        <div className="w-64 flex-shrink-0 hidden lg:block pr-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Filter by</h2>

            {/* Ratings Filter */}
            <FilterGroup title="Ratings">
                {[4.5, 4.0, 3.5, 3.0].map((rating) => (
                    <label key={rating} className="flex items-center gap-3 cursor-pointer group">
                        <input
                            type="checkbox"
                            checked={selectedRatings.includes(rating)}
                            onChange={() => toggleRating(rating)}
                            className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                        />
                        <div className="flex items-center text-sm text-gray-700 group-hover:text-orange-600">
                            <span className="flex items-center mr-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                        key={star}
                                        className={`w-3.5 h-3.5 ${star <= rating
                                            ? 'fill-orange-400 text-orange-400'
                                            : 'fill-gray-200 text-gray-200'
                                            }`}
                                    />
                                ))}
                            </span>
                            <span className="font-medium text-gray-600">{rating} & up</span>
                        </div>
                    </label>
                ))}
            </FilterGroup>

            {/* Duration Filter */}
            <FilterGroup title="Video Duration">
                {[
                    { label: '0-2 Hours', value: '0-2' },
                    { label: '3-6 Hours', value: '3-6' },
                    { label: '7-16 Hours', value: '7-16' },
                    { label: '17+ Hours', value: '17+' }
                ].map((duration) => (
                    <label key={duration.value} className="flex items-center gap-3 cursor-pointer group">
                        <input
                            type="checkbox"
                            checked={selectedDurations.includes(duration.value)}
                            onChange={() => toggleDuration(duration.value)}
                            className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                        />
                        <span className="text-sm text-gray-700 group-hover:text-orange-600">
                            {duration.label}
                        </span>
                    </label>
                ))}
            </FilterGroup>

            {/* Categories Filter */}
            <FilterGroup title="Topic">
                {categories.slice(0, 8).map((category) => (
                    <label key={category} className="flex items-center gap-3 cursor-pointer group">
                        <input
                            type="checkbox"
                            checked={selectedCategories.includes(category)}
                            onChange={() => toggleCategory(category)}
                            className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                        />
                        <span className="text-sm text-gray-700 group-hover:text-orange-600 line-clamp-1">
                            {category}
                        </span>
                    </label>
                ))}
            </FilterGroup>

            {/* Level Filter */}
            <FilterGroup title="Level">
                {['All Levels', 'Beginner', 'Intermediate', 'Expert'].map((level) => (
                    <label key={level} className="flex items-center gap-3 cursor-pointer group">
                        <input
                            type="checkbox"
                            checked={selectedLevels.includes(level)}
                            onChange={() => toggleLevel(level)}
                            className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                        />
                        <span className="text-sm text-gray-700 group-hover:text-orange-600">
                            {level}
                        </span>
                    </label>
                ))}
            </FilterGroup>

            {/* Price Filter */}
            <FilterGroup title="Price">
                {['All', 'Paid', 'Free'].map((price) => (
                    <label key={price} className="flex items-center gap-3 cursor-pointer group">
                        <input
                            type="radio"
                            name="price-filter"
                            checked={priceFilter === price}
                            onChange={() => setPriceFilter(price)}
                            className="w-4 h-4 text-orange-600 border-gray-300 focus:ring-orange-500"
                        />
                        <span className="text-sm text-gray-700 group-hover:text-orange-600">
                            {price}
                        </span>
                    </label>
                ))}
            </FilterGroup>
        </div>
    );
};

export default CourseFilterSidebar;
