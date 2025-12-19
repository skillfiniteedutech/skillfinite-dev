'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, MoreVertical, PlayCircle, Clock, Trophy } from 'lucide-react';
// ...
import { Button } from '@/components/ui/button';
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import UdemyNavbar from '@/components/UdemyNavbar';
import Footer from '@/components/Footer';
import { getEnrolledCourses, EnrolledCourse } from '@/lib/enrollmentService';
import { useToast } from '@/hooks/use-toast';

interface DisplayCourse {
    id: string;
    title: string;
    instructor: string;
    image: string;
    progress: number;
    rating: number;
    lastAccessed: string;
}

const MyCoursesPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { toast } = useToast();
    const [courses, setCourses] = useState<DisplayCourse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('all');

    useEffect(() => {
        const tabParam = searchParams.get('tab');
        if (tabParam) {
            setActiveTab(tabParam);
        }
    }, [searchParams]);

    useEffect(() => {
        const fetchEnrolledCourses = async () => {
            try {
                setIsLoading(true);
                const response = await getEnrolledCourses();

                if (response.success && response.data.courses) {
                    // Transform backend data to display format
                    // Filter out enrollments where course data is null (deleted courses)
                    const transformedCourses: DisplayCourse[] = response.data.courses
                        .filter((enrollment: EnrolledCourse) => enrollment.course && enrollment.course.id)
                        .map((enrollment: EnrolledCourse) => ({
                            id: enrollment.course.id,
                            title: enrollment.course.title || 'Untitled Course',
                            instructor: enrollment.course.instructor || 'Unknown Instructor',
                            image: enrollment.course.thumbnail || '/placeholder-course.jpg',
                            progress: enrollment.progress || 0,
                            rating: enrollment.course.rating || 0,
                            lastAccessed: enrollment.lastAccessed
                                ? new Date(enrollment.lastAccessed).toLocaleDateString()
                                : new Date(enrollment.purchaseDate).toLocaleDateString()
                        }));

                    setCourses(transformedCourses);
                } else {
                    setCourses([]);
                }
            } catch (error) {
                console.error('Error fetching enrolled courses:', error);
                toast({
                    title: "Error Loading Courses",
                    description: "Failed to load your enrolled courses. Please try again.",
                    variant: "destructive"
                });
                setCourses([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchEnrolledCourses();
    }, [toast]);

    const filteredCourses = courses.filter(course =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen flex flex-col font-sans text-gray-900 bg-white">
            <UdemyNavbar />

            <div className="bg-gray-900 text-white py-12">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-4xl font-bold mb-8">My Learning</h1>

                    <div className="flex flex-col sm:flex-row gap-6 border-b border-gray-700">
                        {['All Courses', 'My Lists', 'Wishlist', 'Archived'].map((tab) => {
                            const tabKey = tab.toLowerCase().replace(' ', '');
                            const isActive = activeTab === tabKey || (tab === 'All Courses' && activeTab === 'all');

                            return (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tabKey)}
                                    className={`pb-4 text-sm font-bold transition-colors border-b-2 hover:text-white ${isActive ? 'border-white text-white' : 'border-transparent text-gray-400'}`}
                                >
                                    {tab}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Search and Filter */}
                <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                    <div className="relative w-full sm:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            placeholder="Search my courses"
                            className="pl-10 bg-white border-black rounded-none h-11"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="text-sm font-bold text-gray-700">Sort by</span>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="rounded-none border-black font-bold h-11">
                                    Recently Accessed <MoreVertical className="w-4 h-4 ml-2" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem>Recently Accessed</DropdownMenuItem>
                                <DropdownMenuItem>Recently Enrolled</DropdownMenuItem>
                                <DropdownMenuItem>Title: A-Z</DropdownMenuItem>
                                <DropdownMenuItem>Title: Z-A</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-64 bg-gray-100 animate-pulse rounded-none"></div>
                        ))}
                    </div>
                ) : filteredCourses.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredCourses.map(course => (
                            <div key={course.id} className="border border-gray-200 bg-white group hover:shadow-lg transition-shadow cursor-pointer flex flex-col h-full" onClick={() => router.push(`/courses/${course.id}/learn`)}>
                                {/* Thumbnail */}
                                <div className="relative aspect-video bg-gray-200 overflow-hidden">
                                    <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <PlayCircle className="w-12 h-12 text-white" />
                                    </div>
                                </div>

                                <div className="p-4 flex flex-col flex-grow">
                                    <h3 className="font-bold text-gray-900 line-clamp-2 mb-1 group-hover:text-indigo-600 h-12">{course.title}</h3>
                                    <p className="text-xs text-gray-500 mb-4 truncate">{course.instructor}</p>

                                    <div className="mt-auto">
                                        <div className="w-full h-1 bg-gray-200 mb-2">
                                            <div className="h-full bg-indigo-600" style={{ width: `${course.progress}%` }}></div>
                                        </div>
                                        <div className="flex justify-between items-center text-xs">
                                            <span className="text-gray-600">{course.progress}% complete</span>

                                            {course.progress === 100 ? (
                                                <div className="flex items-center gap-1 text-green-600 font-bold">
                                                    <Trophy className="w-3 h-3" />
                                                    <span>Completed</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1 text-gray-500">
                                                    <div className="flex items-center justify-center">
                                                        {[1, 2, 3, 4, 5].map(star => (
                                                            <StarComponent key={star} filled={star <= course.rating} />
                                                        ))}
                                                    </div>
                                                    <span>Leave a rating</span>
                                                </div>
                                            )}
                                        </div>

                                        {course.progress > 0 && course.progress < 100 && (
                                            <div className="mt-2 text-center">
                                                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider group-hover:hidden">Last accessed {course.lastAccessed}</span>
                                                <span className="hidden group-hover:inline-block text-xs font-bold text-gray-900 uppercase tracking-wider">Resume</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-gray-50 border border-gray-200">
                        <h3 className="text-xl font-bold mb-2">No courses found</h3>
                        <p className="text-gray-600 mb-6">Start learning today by exploring our wide range of courses.</p>
                        <Button onClick={() => router.push('/courses')} className="bg-purple-600 hover:bg-purple-700 font-bold rounded-none">
                            Browse Courses
                        </Button>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
};

const StarComponent = ({ filled }: { filled: boolean }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`w-3 h-3 ${filled ? 'fill-yellow-500 text-yellow-500' : 'fill-gray-300 text-gray-300'}`}
    >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
);

export default MyCoursesPage;
