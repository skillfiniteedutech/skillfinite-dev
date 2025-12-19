'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import UdemyNavbar from '@/components/UdemyNavbar';
import Footer from '@/components/Footer';
import CourseFilterSidebar from '@/components/CourseFilterSidebar';
import CourseCardHorizontal from '@/components/CourseCardHorizontal';
import { ArrowUpDown, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

// Type definition for course
interface ExtendedCourse {
  id: string;
  title: string;
  subtitle?: string;
  description: string; // Changed to required
  category: string;
  level: string;
  thumbnail?: string;
  status: string;
  price: string;
  rating: number;
  reviews: number;
  duration: string;
  // Additional properties for CourseCardHorizontal
  image: string;
  instructor: string;
  enrolled: string; // Changed to string to match Course interface
  mode: string;
  tag: string; // Changed to required string
  bestseller: boolean; // Changed to required boolean
  lectures: number;
}

const CoursesPage: React.FC = () => {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All Courses';
  const initialSearch = searchParams.get('search') || '';

  // State for Courses
  const [allCourses, setAllCourses] = useState<ExtendedCourse[]>([]);
  const [categories, setCategories] = useState<string[]>(['All Courses']);
  const [isLoading, setIsLoading] = useState(true);

  // Filter States
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [selectedDurations, setSelectedDurations] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceFilter, setPriceFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('Most Popular');

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "https://skillfinite-backend-47sd.onrender.com";

  // Fetch courses from API
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${apiBaseUrl}/api/courses`, {
          method: "GET",
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch courses: ${response.status}`);
        }

        const data = await response.json();

        // Handle different response formats
        let coursesData: any[] = [];
        if (Array.isArray(data)) {
          coursesData = data;
        } else if (data.courses && Array.isArray(data.courses)) {
          coursesData = data.courses;
        } else if (data.data && Array.isArray(data.data)) {
          coursesData = data.data;
        } else if (data.data && data.data.courses && Array.isArray(data.data.courses)) {
          coursesData = data.data.courses;
        }

        // Filter only published courses
        const publishedCourses = coursesData.filter(
          (course) => course.status && course.status.toLowerCase() === "published"
        );

        // Transform API data to match ExtendedCourse interface
        const transformedCourses: ExtendedCourse[] = publishedCourses.map((course) => ({
          id: course.id || course._id,
          title: course.title,
          subtitle: course.subtitle || '',
          description: course.description || '',
          category: course.category || 'Uncategorized',
          level: course.level || 'Beginner',
          thumbnail: course.thumbnail || '',
          status: course.status,
          price: course.settings?.pricing?.type === 'free' ? 'Free' : `$${course.settings?.pricing?.price || 0}`,
          rating: course.rating || 4.5,
          reviews: course.studentsEnrolled || 0,
          duration: course.duration || '10 hours',
          // Additional properties for CourseCardHorizontal
          image: course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800',
          instructor: course.instructorId || 'Expert Instructor',
          enrolled: (course.studentsEnrolled || 0).toLocaleString(),
          mode: course.settings?.access?.enrollmentType || 'open',
          tag: course.tags?.[0] || '',
          bestseller: (course.studentsEnrolled || 0) > 500,
          lectures: course.curriculum?.length || parseInt(course.duration) * 2 || 20,
        }));

        setAllCourses(transformedCourses);

        // Extract unique categories from real data
        const uniqueCategories = Array.from(
          new Set(transformedCourses.map((c) => c.category).filter(Boolean))
        );
        setCategories(['All Courses', ...uniqueCategories]);

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching courses:", error);
        setAllCourses([]);
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, [apiBaseUrl]);

  // Handle URL Params
  useEffect(() => {
    if (initialCategory && initialCategory !== 'All Courses') {
      setSelectedCategories([initialCategory]);
    }
  }, [initialCategory]);

  // Filtering Logic
  const filteredCourses = useMemo(() => {
    return allCourses.filter(course => {
      // Search Query
      if (initialSearch && !course.title.toLowerCase().includes(initialSearch.toLowerCase())) {
        return false;
      }

      // Categories
      if (selectedCategories.length > 0 && !selectedCategories.includes(course.category)) {
        return false;
      }

      // Ratings
      if (selectedRatings.length > 0) {
        const matchesRating = selectedRatings.some(r => course.rating >= r);
        if (!matchesRating) return false;
      }

      // Levels
      if (selectedLevels.length > 0) {
        // Map mock level to simplified levels if needed, or use exact match
        const normalizedLevels = selectedLevels.map(l => l === 'Expert' ? 'Advanced' : l);
        if (!normalizedLevels.includes('All Levels') && !normalizedLevels.includes(course.level)) {
          return false;
        }
      }

      // Price
      if (priceFilter !== 'All') {
        const isFree = course.price === 'Free';
        if (priceFilter === 'Free' && !isFree) return false;
        if (priceFilter === 'Paid' && isFree) return false;
      }

      // Durations
      if (selectedDurations.length > 0) {
        const hours = parseInt(course.duration);
        const matchesDuration = selectedDurations.some(range => {
          if (range === '0-2') return hours <= 2;
          if (range === '3-6') return hours >= 3 && hours <= 6;
          if (range === '7-16') return hours >= 7 && hours <= 16;
          if (range === '17+') return hours >= 17;
          return false;
        });
        if (!matchesDuration) return false;
      }

      return true;
    });
  }, [allCourses, initialSearch, selectedCategories, selectedRatings, selectedLevels, priceFilter, selectedDurations]);

  // Sorting Logic
  const sortedCourses = useMemo(() => {
    return [...filteredCourses].sort((a, b) => {
      if (sortBy === 'Highest Rated') return b.rating - a.rating;
      if (sortBy === 'Newest') return Number(b.id) - Number(a.id);
      if (sortBy === 'Price: Low to High') {
        const priceA = a.price === 'Free' || typeof a.price === 'string' ? 0 : a.price;
        const priceB = b.price === 'Free' || typeof b.price === 'string' ? 0 : b.price;
        return priceA - priceB;
      }
      if (sortBy === 'Price: High to Low') {
        const priceA = a.price === 'Free' || typeof a.price === 'string' ? 0 : a.price;
        const priceB = b.price === 'Free' || typeof b.price === 'string' ? 0 : b.price;
        return priceB - priceA;
      }
      // Default "Most Popular"
      return b.reviews - a.reviews;
    });
  }, [filteredCourses, sortBy]);

  // Handlers
  const toggleSelection = (list: any[], setList: (l: any[]) => void, item: any) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const clearAllFilters = () => {
    setSelectedRatings([]);
    setSelectedLevels([]);
    setSelectedDurations([]);
    setSelectedCategories([]);
    setPriceFilter('All');
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-900 bg-white">
      <UdemyNavbar />

      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/courses">Courses</BreadcrumbLink>
              </BreadcrumbItem>
              {(selectedCategories.length > 0) && (
                <>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{selectedCategories[0]}</BreadcrumbPage>
                  </BreadcrumbItem>
                </>
              )}
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Desktop */}
          <CourseFilterSidebar
            selectedRatings={selectedRatings}
            toggleRating={(r) => toggleSelection(selectedRatings, setSelectedRatings, r)}
            selectedLevels={selectedLevels}
            toggleLevel={(l) => toggleSelection(selectedLevels, setSelectedLevels, l)}
            selectedDurations={selectedDurations}
            toggleDuration={(d) => toggleSelection(selectedDurations, setSelectedDurations, d)}
            categories={categories.filter(c => c !== 'All Courses')}
            selectedCategories={selectedCategories}
            toggleCategory={(c) => toggleSelection(selectedCategories, setSelectedCategories, c)}
            priceFilter={priceFilter}
            setPriceFilter={setPriceFilter}
          />

          {/* Main Content */}
          <div className="flex-1">
            {/* Header Controls */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
              {/* Mobile Filter Button */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="lg:hidden flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] sm:w-[400px] overflow-y-auto">
                  <div className="py-4">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-bold">Filters</h2>
                      <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                        Clear all
                      </Button>
                    </div>
                    <CourseFilterSidebar
                      selectedRatings={selectedRatings}
                      toggleRating={(r) => toggleSelection(selectedRatings, setSelectedRatings, r)}
                      selectedLevels={selectedLevels}
                      toggleLevel={(l) => toggleSelection(selectedLevels, setSelectedLevels, l)}
                      selectedDurations={selectedDurations}
                      toggleDuration={(d) => toggleSelection(selectedDurations, setSelectedDurations, d)}
                      categories={categories.filter(c => c !== 'All Courses')}
                      selectedCategories={selectedCategories}
                      toggleCategory={(c) => toggleSelection(selectedCategories, setSelectedCategories, c)}
                      priceFilter={priceFilter}
                      setPriceFilter={setPriceFilter}
                    />
                  </div>
                </SheetContent>
              </Sheet>

              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2 font-bold text-gray-700 bg-white border-black hover:bg-gray-50 h-12 w-full sm:w-auto">
                      <ArrowUpDown className="w-4 h-4" />
                      <span className="font-normal text-gray-500">Sort by</span>
                      {sortBy}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    {['Most Popular', 'Highest Rated', 'Newest', 'Price: Low to High', 'Price: High to Low'].map((option) => (
                      <DropdownMenuItem
                        key={option}
                        onClick={() => setSortBy(option)}
                        className="cursor-pointer font-medium"
                      >
                        {option}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="text-gray-600 font-bold text-lg">
                {sortedCourses.length} results
              </div>
            </div>

            {/* Active Filters Display */}
            {(selectedCategories.length > 0 || selectedRatings.length > 0 || priceFilter !== 'All') && (
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedCategories.map(cat => (
                  <Button key={cat} variant="secondary" size="sm" onClick={() => toggleSelection(selectedCategories, setSelectedCategories, cat)} className="flex items-center gap-1 rounded-full px-4">
                    {cat} <X className="w-3 h-3" />
                  </Button>
                ))}
                {priceFilter !== 'All' && (
                  <Button variant="secondary" size="sm" onClick={() => setPriceFilter('All')} className="flex items-center gap-1 rounded-full px-4">
                    {priceFilter} <X className="w-3 h-3" />
                  </Button>
                )}
                {(selectedCategories.length > 0 || priceFilter !== 'All') && (
                  <Button variant="ghost" size="sm" onClick={clearAllFilters} className="text-orange-600 hover:text-orange-700 font-bold">
                    Clear filters
                  </Button>
                )}
              </div>
            )}

            {/* Course List */}
            <div className="space-y-4">
              {isLoading ? (
                // Loading Skeleton
                Array(5).fill(0).map((_, i) => (
                  <div key={i} className="flex gap-4 p-4 border border-gray-100 rounded-lg animate-pulse">
                    <div className="w-64 h-40 bg-gray-200 rounded-lg" />
                    <div className="flex-1 space-y-4 py-2">
                      <div className="h-6 bg-gray-200 rounded w-3/4" />
                      <div className="h-4 bg-gray-200 rounded w-1/2" />
                      <div className="h-4 bg-gray-200 rounded w-1/2" />
                    </div>
                  </div>
                ))
              ) : sortedCourses.length > 0 ? (
                sortedCourses.map(course => (
                  <CourseCardHorizontal key={course.id} course={course} highlightTerm={initialSearch} />
                ))
              ) : (
                <div className="text-center py-20">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
                    <Filter className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">No courses found</h3>
                  <p className="text-gray-600 mb-6">Try adjusting your filters to find what you're looking for.</p>
                  <Button onClick={clearAllFilters} size="lg" className="bg-orange-500 hover:bg-orange-600">
                    Clear all filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CoursesPage;