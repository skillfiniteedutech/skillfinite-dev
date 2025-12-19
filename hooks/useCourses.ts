import { useState, useEffect } from 'react';
import axios from 'axios';
import { Course } from '@/data/mockData';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'https://skillfinite-backend-47sd.onrender.com';
const API = `${BACKEND_URL}/api`;

interface UseCourseReturn {
    courses: Course[];
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
    getTrendingCourses: () => Course[];
    getTopRatedCourses: () => Course[];
    getNewCourses: () => Course[];
    getRecommendedCourses: () => Course[];
    getCoursesByCategory: (category: string) => Course[];
}

export const useCourses = (): UseCourseReturn => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCourses = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.get(`${API}/courses`);

            if (response.data.success && response.data.data.courses) {
                const mappedCourses: Course[] = response.data.data.courses.map((c: any) => ({
                    id: c.id,
                    title: c.title || 'Untitled Course',
                    duration: calculateDuration(c) || '22 Hrs',
                    enrolled: `${c.enrolledStudents || 0}`,
                    price: c.free ? 'Free' : `$${c.price?.toLocaleString() || 0}`,
                    mode: c.settings?.access?.enrollmentType === 'invite-only' ? 'Invite Only' : 'Online',
                    image: c.thumbnail || '/placeholder-course.jpg',
                    tag: c.tags?.[0] || 'New',
                    category: c.category || 'Uncategorized',
                    rating: calculateRating(c),
                    reviews: c.enrolledStudents || 0,
                    level: c.level || 'Beginner',
                    lectures: calculateLectures(c),
                    instructor: 'Hari Haran', // TODO: Fetch from instructor data
                    bestseller: c.tags?.includes('Best Seller') || c.enrolledStudents > 10000,
                    description: c.description || c.subtitle || 'No description available'
                }));

                setCourses(mappedCourses);
            } else {
                setError('Invalid response format from server');
            }
        } catch (err: any) {
            console.error('Failed to fetch courses:', err);
            setError(err.response?.data?.message || 'Failed to fetch courses from server');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    // Helper functions
    const calculateDuration = (course: any): string => {
        // Calculate from curriculum if available
        if (course.curriculum?.length > 0) {
            const totalLessons = course.curriculum.reduce(
                (sum: number, module: any) => sum + (module.lessons?.length || 0),
                0
            );
            return `${Math.max(totalLessons * 2, 10)} Hrs`;
        }
        return '22 Hrs';
    };

    const calculateRating = (course: any): number => {
        // Mock rating based on enrollment (in real app, fetch from reviews)
        const enrolled = course.enrolledStudents || 0;
        if (enrolled > 20000) return 4.8;
        if (enrolled > 10000) return 4.6;
        if (enrolled > 5000) return 4.5;
        if (enrolled > 1000) return 4.3;
        return 4.0;
    };

    const calculateLectures = (course: any): number => {
        if (course.curriculum?.length > 0) {
            return course.curriculum.reduce(
                (sum: number, module: any) => sum + (module.lessons?.length || 0),
                0
            );
        }
        return 0;
    };

    // Filter functions
    const getTrendingCourses = (): Course[] => {
        const trendingTags = ['Trending', 'Hot', 'Popular', 'Best Seller'];
        return courses
            .filter(course => trendingTags.some(tag => course.tag.includes(tag)))
            .slice(0, 12);
    };

    const getTopRatedCourses = (): Course[] => {
        return courses
            .filter(course => course.rating >= 4.5)
            .sort((a, b) => b.rating - a.rating)
            .slice(0, 12);
    };

    const getNewCourses = (): Course[] => {
        // Return the last 5-12 courses (newest)
        return courses.slice(-12);
    };

    const getRecommendedCourses = (): Course[] => {
        const recommendedTags = ['Essential', 'Foundation', 'Career', 'Strategic', 'Certification'];
        return courses
            .filter(course => recommendedTags.some(tag => course.tag.includes(tag)))
            .slice(0, 8);
    };

    const getCoursesByCategory = (category: string): Course[] => {
        if (category === 'All Courses') return courses;
        return courses.filter(c => c.category === category);
    };

    return {
        courses,
        loading,
        error,
        refetch: fetchCourses,
        getTrendingCourses,
        getTopRatedCourses,
        getNewCourses,
        getRecommendedCourses,
        getCoursesByCategory
    };
};
