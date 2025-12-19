'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Star, Globe, AlertCircle, PlayCircle, Check,
    ChevronDown, ChevronUp, Lock, Monitor, Download,
    Trophy, Smartphone, Share2, Heart, MoreHorizontal, Loader2
} from 'lucide-react';
import { CourseDetail, getCourseDetail } from '@/data/mockData';
import UdemyNavbar from '@/components/UdemyNavbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { useCart } from '@/context/cart-context';
import { toast } from 'sonner';
import { useEnrollment } from '@/context/enrollment-context';
import { useWishlist } from '@/context/wishlist-context';
import { useRazorpay } from '@/hooks/use-razorpay';
import { createSingleOrder, verifyPayment } from '@/lib/paymentService';

interface CourseDetailPageProps {
    courseId: string;
}

const CourseDetailPage: React.FC<CourseDetailPageProps> = ({ courseId }) => {
    const [course, setCourse] = useState<CourseDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isEnrolling, setIsEnrolling] = useState(false); // New state for free enrollment
    const router = useRouter();
    const { addToCart, isInCart } = useCart();
    const { isEnrolled, enrollCourse } = useEnrollment();
    const { isInWishlist, toggleWishlist } = useWishlist();
    const { ready: razorpayReady } = useRazorpay();
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "https://skillfinite-backend-47sd.onrender.com";

    useEffect(() => {
        const fetchCourseDetail = async () => {
            try {
                setIsLoading(true);
                const token = localStorage.getItem('token');
                const response = await fetch(`${apiBaseUrl}/api/courses/${courseId}`, {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        ...(token && { 'Authorization': `Bearer ${token}` })
                    }
                });

                if (!response.ok) {
                    throw new Error(`Failed to fetch course: ${response.status}`);
                }

                const apiResponse = await response.json();
                console.log('📚 Course data received from API:', apiResponse);

                // Extract the actual course data (handle both direct and nested response)
                const data = apiResponse.data || apiResponse;

                // Helper function to parse double-encoded JSON strings
                const parseJsonField = (field: any): any[] => {
                    if (!field) return [];
                    if (Array.isArray(field)) {
                        // If it's an array with a stringified JSON, parse it
                        if (field.length > 0 && typeof field[0] === 'string') {
                            try {
                                return JSON.parse(field[0]);
                            } catch {
                                return field;
                            }
                        }
                        return field;
                    }
                    if (typeof field === 'string') {
                        try {
                            return JSON.parse(field);
                        } catch {
                            return [field];
                        }
                    }
                    return [];
                };

                // Parse learning objectives and tags
                const learningObjectives = parseJsonField(data.learningObjectives);
                const tags = parseJsonField(data.tags);

                const transformedCourse: CourseDetail = {
                    id: data.id || data._id,
                    title: data.title,
                    subtitle: data.subtitle || '',
                    description: data.description || '',
                    category: data.category || 'Uncategorized',
                    level: data.level || 'Beginner',
                    price: data.settings?.pricing?.type === 'free' ? 'Free' : `$${data.settings?.pricing?.price || 0}`,
                    rating: data.rating || 4.5,
                    reviews: data.studentsEnrolled || 0,
                    duration: data.duration || '10 hours',
                    image: data.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800',
                    instructor: data.instructorId || 'Expert Instructor',
                    enrolled: (data.studentsEnrolled || 0).toLocaleString(),
                    mode: data.settings?.access?.enrollmentType || 'open',
                    tag: tags[0] || '',
                    bestseller: (data.studentsEnrolled || 0) > 500,
                    lectures: data.curriculum?.length || parseInt(data.duration) * 2 || 20,
                    updatedAt: data.updatedAt ? new Date(data.updatedAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Recently',
                    language: data.language || 'English',
                    captions: data.captions || ['English [Auto]'],
                    longDescription: data.description || `<p>Learn ${data.title} and master the essential skills.</p>`,
                    learningPoints: learningObjectives.length > 0 ? learningObjectives : [
                        `Master the core concepts of ${data.category}`,
                        "Build real-world projects from scratch",
                        "Understand best practices and industry standards",
                        "Debug and troubleshoot common issues",
                        "Prepare for technical interviews",
                        "Apply knowledge to real-world scenarios"
                    ],
                    requirements: data.requirements || [
                        "No prior experience needed - we will teach you everything from scratch",
                        "A computer with internet access",
                        "A passion for learning!"
                    ],
                    curriculum: data.curriculum?.map((section: any, idx: number) => ({
                        id: idx + 1,
                        title: section.title || `Section ${idx + 1}`,
                        items: section.lessons?.map((lesson: any, lessonIdx: number) => ({
                            id: lessonIdx + 1,
                            title: lesson.title || `Lesson ${lessonIdx + 1}`,
                            duration: lesson.duration || '10:00',
                            videoUrl: lesson.videoUrl,
                            preview: lesson.isFree || false
                        })) || []
                    })) || [
                            {
                                id: 1,
                                title: "Introduction",
                                items: [
                                    { id: 101, title: "Welcome to the Course", duration: "05:20", preview: true },
                                    { id: 102, title: "Setting up your environment", duration: "12:15", preview: true },
                                    { id: 103, title: "Course Overview", duration: "08:30", preview: false }
                                ]
                            }
                        ],
                    reviewsList: data.reviews?.map((review: any, idx: number) => ({
                        id: idx + 1,
                        user: review.userName || 'Anonymous',
                        avatar: '',
                        rating: review.rating || 5,
                        date: review.createdAt ? new Date(review.createdAt).toLocaleDateString() : 'Recently',
                        comment: review.comment || ''
                    })) || []
                };

                setCourse(transformedCourse);
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching course details:", error);
                setCourse(null);
                setIsLoading(false);
            }
        };

        fetchCourseDetail();
    }, [courseId, apiBaseUrl]);

    const handleAddToCart = () => {
        if (course) {
            addToCart(course);
            toast.success("Added to cart!", {
                description: `${course.title} has been added to your cart.`,
            });
        }
    };

    const handleEnroll = async (type: 'free' | 'paid') => {
        if (!course) return;

        setIsEnrolling(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error("Authentication required", {
                    description: "Please log in to enroll in this course."
                });
                router.push('/login');
                return;
            }

            // For free courses, directly enroll
            if (type === 'free') {
                const response = await fetch(`${apiBaseUrl}/api/enrollments/free`, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ courseId: String(course.id) })
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || "Failed to enroll in free course");
                }

                enrollCourse(String(course.id)); // Update enrollment context
                toast.success("Enrollment Successful! 🎉", {
                    description: `You've successfully enrolled in ${course.title}.`,
                });
                router.push(`/courses/${course.id}/learn`);
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Enrollment failed";
            toast.error("Enrollment Failed", {
                description: errorMessage,
            });
        } finally {
            setIsEnrolling(false);
        }
    };

    const handleBuyNow = async () => {
        if (!course) return;

        setIsProcessing(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error("Authentication required", {
                    description: "Please log in to purchase this course."
                });
                router.push('/login');
                return;
            }

            // Check if Razorpay is ready
            if (!razorpayReady || typeof window === 'undefined' || !window.Razorpay) {
                toast.error("Payment gateway not ready", {
                    description: "Please wait a moment and try again."
                });
                setIsProcessing(false);
                return;
            }

            const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
            if (!razorpayKey || razorpayKey.includes('xxxxxxxxxxxxx')) {
                toast.error("Payment gateway not configured", {
                    description: "Please contact support."
                });
                setIsProcessing(false);
                return;
            }

            // Create single order
            const order = await createSingleOrder(String(course.id));
            if (!order.ok || !order.data) {
                throw new Error(order.error || "Failed to create order");
            }

            // Initialize Razorpay
            const rzpOptions: any = {
                key: razorpayKey,
                amount: order.data.amount,
                currency: order.data.currency,
                order_id: order.data.orderId,
                name: "Skillfinite",
                description: course.title,
                image: "/logo.png",
                handler: async (response: any) => {
                    try {
                        const verify = await verifyPayment({
                            orderId: response.razorpay_order_id,
                            paymentId: response.razorpay_payment_id,
                            signature: response.razorpay_signature,
                            courseId: String(course.id)
                        });

                        if (verify.ok) {
                            enrollCourse(String(course.id)); // Update enrollment context
                            toast.success("Payment Successful! 🎉", {
                                description: `You've successfully purchased ${course.title}.`,
                            });

                            router.push('/mycourses');
                        } else {
                            throw new Error(verify.error || "Payment verification failed");
                        }
                    } catch (error) {
                        const errorMessage = error instanceof Error ? error.message : "Payment verification failed";
                        toast.error("Payment Verification Failed", {
                            description: errorMessage,
                        });
                    } finally {
                        setIsProcessing(false);
                    }
                },
                theme: {
                    color: "#7c3aed",
                },
                modal: {
                    ondismiss: () => {
                        setIsProcessing(false);
                        toast.info("Payment Cancelled", {
                            description: "You can try again anytime.",
                        });
                    },
                },
                prefill: {
                    name: "Student Name",
                    email: "student@example.com",
                },
            };

            const rzp = new window.Razorpay(rzpOptions);
            rzp.open();
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Payment failed";
            toast.error("Payment Failed", {
                description: errorMessage,
            });
            setIsProcessing(false);
        }
    };

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    if (!course) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <h1 className="text-2xl font-bold mb-4">Course not found</h1>
                <Button onClick={() => router.push('/courses')}>Browse Courses</Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col font-sans bg-white">
            <UdemyNavbar />

            {/* Dark Hero Section */}
            <div className="bg-gray-900 text-white py-8 lg:py-12">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <div className="lg:w-2/3 pr-0 lg:pr-8">
                        {/* Breadcrumbs */}
                        <div className="text-sm font-semibold text-orange-300 flex items-center gap-2 mb-4">
                            <span className="cursor-pointer hover:text-orange-200" onClick={() => router.push('/courses')}>Courses</span>
                            <span>{'>'}</span>
                            <span className="cursor-pointer hover:text-orange-200">{course.category}</span>
                            <span>{'>'}</span>
                            <span className="truncate max-w-[200px]">{course.title}</span>
                        </div>

                        <h1 className="text-3xl sm:text-4xl font-bold mb-4 leading-tight">
                            {course.title}
                        </h1>
                        <p className="text-lg text-gray-200 mb-6">
                            {course.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-4 text-sm mb-6">
                            {course.bestseller && (
                                <span className="bg-yellow-200 text-gray-900 px-2 py-0.5 font-bold rounded-sm text-xs">
                                    Bestseller
                                </span>
                            )}
                            <div className="flex items-center gap-1 text-yellow-500">
                                <span className="font-bold text-white mr-1">{course.rating.toFixed(1)}</span>
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star key={star} className={`w-3.5 h-3.5 ${star <= Math.round(course.rating) ? 'fill-current' : 'text-gray-500'}`} />
                                ))}
                            </div>
                            <span className="text-indigo-200 underline">({course.reviews} ratings)</span>
                            <span className="text-white">{course.enrolled} students</span>
                        </div>

                        <div className="flex flex-wrap items-center gap-6 text-sm text-gray-200 mb-2">
                            <span>Created by <a href="#" className="text-indigo-200 underline hover:text-indigo-100">{course.instructor}</a></span>
                        </div>

                        <div className="flex flex-wrap items-center gap-6 text-sm text-gray-200">
                            <div className="flex items-center gap-2">
                                <AlertCircle className="w-4 h-4" />
                                <span>Last updated {course.updatedAt}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Globe className="w-4 h-4" />
                                <span>{course.language}</span>
                            </div>

                            {/* Wishlist Button */}
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    toggleWishlist(String(course.id));
                                }}
                                className="flex items-center gap-2 px-3 py-1 border border-white/30 rounded hover:bg-white/10 transition-colors"
                            >
                                <Heart
                                    className={`w-4 h-4 ${isInWishlist(String(course.id))
                                        ? 'fill-red-500 text-red-500'
                                        : 'text-white'
                                        }`}
                                />
                                <span>{isInWishlist(String(course.id)) ? 'Wishlisted' : 'Add to Wishlist'}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Main Content Column */}
                    <div className="lg:w-2/3 space-y-12">

                        {/* What you'll learn */}
                        <div className="border border-gray-200 p-6 rounded-none bg-gray-50">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">What you'll learn</h2>
                            <div className="grid sm:grid-cols-2 gap-4">
                                {course.learningPoints && course.learningPoints.map((point, index) => (
                                    <div key={index} className="flex gap-3 items-start">
                                        <Check className="w-4 h-4 text-gray-800 flex-shrink-0 mt-1" />
                                        <span className="text-sm text-gray-700">{point}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Course Content / Curriculum */}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Course content</h2>
                            <div className="flex justify-between items-center mb-2 text-sm text-gray-600">
                                <span>{course.curriculum ? course.curriculum.length : 0} sections • {course.lectures} lectures • {course.duration} total length</span>
                                <button className="text-indigo-600 font-bold hover:text-indigo-800">Expand all sections</button>
                            </div>
                            <div className="border border-gray-200 rounded-sm">
                                <Accordion type="single" collapsible className="w-full">
                                    {course.curriculum && course.curriculum.map((section) => (
                                        <AccordionItem key={section.id} value={`section-${section.id}`}>
                                            <AccordionTrigger className="bg-gray-50 px-4 py-3 hover:bg-gray-100">
                                                <div className="flex justify-between w-full pr-4">
                                                    <span className="font-bold text-gray-900 text-left">{section.title}</span>
                                                    <span className="text-sm text-gray-500 font-normal">{section.items.length} lectures</span>
                                                </div>
                                            </AccordionTrigger>
                                            <AccordionContent className="bg-white">
                                                <ul className="divide-y divide-gray-100">
                                                    {section.items.map((item) => (
                                                        <li key={item.id} className="flex items-center justify-between px-4 py-3 hover:bg-gray-50">
                                                            <div className="flex items-center gap-3">
                                                                {item.videoUrl ? (
                                                                    <PlayCircle className="w-4 h-4 text-gray-400" />
                                                                ) : (
                                                                    <FileText className="w-4 h-4 text-gray-400" />
                                                                )}
                                                                <span className={`text-sm ${item.preview ? 'text-indigo-600 underline cursor-pointer' : 'text-gray-700'}`}>
                                                                    {item.title}
                                                                </span>
                                                                {item.preview && (
                                                                    <span className="text-xs text-gray-500 hidden sm:inline-block">/ Preview</span>
                                                                )}
                                                            </div>
                                                            <div className="flex items-center gap-4">
                                                                {item.preview && <span className="text-indigo-600 text-xs font-bold sm:hidden">Preview</span>}
                                                                <span className="text-sm text-gray-500">{item.duration}</span>
                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </div>
                        </div>

                        {/* Requirements */}
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Requirements</h2>
                            <ul className="list-disc pl-5 space-y-2">
                                {course.requirements && course.requirements.map((req, i) => (
                                    <li key={i} className="text-gray-700">{req}</li>
                                ))}
                            </ul>
                        </div>

                        {/* Description */}
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Description</h2>
                            <div
                                className="prose prose-sm max-w-none text-gray-700"
                                dangerouslySetInnerHTML={{ __html: course.longDescription }}
                            />
                        </div>

                        {/* Instructor */}
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Instructor</h2>
                            <div className="mb-4">
                                <h3 className="text-lg font-bold text-indigo-600 underline cursor-pointer">{course.instructor}</h3>
                                <p className="text-gray-600">Senior Software Engineer & Instructor</p>
                            </div>
                            <div className="flex items-start gap-4 mb-4">
                                <div className="w-24 h-24 bg-gray-200 rounded-full overflow-hidden flex-shrink-0">
                                    <img src="https://ui-avatars.com/api/?name=Sarah+Johnson&background=random" alt={course.instructor} className="w-full h-full object-cover" />
                                </div>
                                <div className="space-y-1 text-sm text-gray-700">
                                    <div className="flex items-center gap-2"><Star className="w-4 h-4 fill-current text-gray-900" /> 4.8 Instructor Rating</div>
                                    <div className="flex items-center gap-2"><Award className="w-4 h-4 text-gray-900" /> 12,345 Reviews</div>
                                    <div className="flex items-center gap-2"><Users className="w-4 h-4 text-gray-900" /> 50,000 Students</div>
                                    <div className="flex items-center gap-2"><PlayCircle className="w-4 h-4 text-gray-900" /> 12 Courses</div>
                                </div>
                            </div>
                            <p className="text-sm text-gray-700">
                                Dr. Sarah Johnson is a specialized instructor in Web Development and Data Science. With over 10 years of industry experience...
                            </p>
                        </div>

                        {/* Reviews */}
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Reviews</h2>
                            <div className="space-y-6">
                                {course.reviewsList && course.reviewsList.map(review => (
                                    <div key={review.id} className="border-b border-gray-200 pb-6">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center text-white font-bold">
                                                    {review.user.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-gray-900">{review.user}</div>
                                                    <div className="flex gap-1">
                                                        {[1, 2, 3, 4, 5].map((star) => (
                                                            <Star key={star} className={`w-3 h-3 ${star <= review.rating ? 'fill-orange-400 text-orange-400' : 'fill-gray-200 text-gray-200'}`} />
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                            <span className="text-sm text-gray-500">{review.date}</span>
                                        </div>
                                        <p className="text-gray-700 text-sm">
                                            {review.comment}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>

                    {/* Sidebar - Floating on Desktop */}
                    <div className="lg:w-1/3 lg:relative">
                        <div className="sticky top-24 bg-white shadow-xl border border-gray-200 rounded-none overflow-hidden z-20">
                            {/* Video Preview */}
                            <div className="relative h-48 bg-gray-900 cursor-pointer group">
                                <img src={course.image} alt="Preview" className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="bg-white rounded-full p-3 shadow-lg group-hover:scale-110 transition-transform">
                                        <PlayCircle className="w-8 h-8 text-black fill-current" />
                                    </div>
                                </div>
                                <div className="absolute bottom-4 left-0 right-0 text-center text-white font-bold text-lg">Preview this course</div>
                            </div>

                            <div className="p-6">
                                <div className="flex items-center gap-4 mb-4">
                                    <span className="text-3xl font-bold text-gray-900">{course.price === 'Free' ? 'Free' : course.price}</span>
                                    {course.price !== 'Free' && (
                                        <span className="text-gray-500 line-through text-lg">${(parseInt(course.price.replace(/[^0-9]/g, '')) * 5).toLocaleString('en-IN')}</span>
                                    )}
                                    {course.price !== 'Free' && (
                                        <span className="text-gray-900 text-sm">80% off</span>
                                    )}
                                </div>

                                <div className="flex items-center gap-2 mb-4 text-red-600 text-sm">
                                    <AlertCircle className="w-4 h-4" />
                                    <span className="font-bold">2 days left at this price!</span>
                                </div>

                                <div className="space-y-3 mb-4">
                                    {/* Show different buttons based on enrollment status */}
                                    {isEnrolled(String(course.id)) ? (
                                        <>
                                            {/* Already Enrolled - Show "Go to Course" */}
                                            <Button
                                                onClick={() => router.push(`/courses/${course.id}/learn`)}
                                                className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-lg font-bold shadow-lg"
                                            >
                                                Go to Course →
                                            </Button>
                                            <p className="text-center text-green-600 font-semibold">
                                                ✓ You're enrolled in this course
                                            </p>
                                        </>
                                    ) : course.price === 'Free' ? (
                                        /* Free course - Show Enroll for Free button */
                                        <Button
                                            onClick={() => handleEnroll('free')}
                                            disabled={isEnrolling}
                                            className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-lg font-bold shadow-lg"
                                        >
                                            {isEnrolling ? 'Enrolling...' : 'Enroll for Free'}
                                        </Button>
                                    ) : (
                                        /* Paid course - Show Add to Cart / Buy Now */
                                        <>
                                            <Button
                                                className={`w-full font-bold py-6 text-lg rounded-none ${isInCart(course.id) ? 'bg-green-600 hover:bg-green-700' : 'bg-purple-600 hover:bg-purple-700'} text-white`}
                                                onClick={() => {
                                                    if (isInCart(course.id)) {
                                                        router.push('/cart');
                                                    } else {
                                                        addToCart(course);
                                                    }
                                                }}
                                            >
                                                {isInCart(course.id) ? 'Go to Cart' : 'Add to cart'}
                                            </Button>
                                            <Button
                                                onClick={handleBuyNow}
                                                disabled={isProcessing || !razorpayReady}
                                                variant="outline"
                                                className="w-full border-gray-900 text-gray-900 font-bold py-6 text-lg rounded-none hover:bg-gray-100"
                                            >
                                                {isProcessing ? (
                                                    <>
                                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                        Processing...
                                                    </>
                                                ) : (
                                                    'Buy now'
                                                )}
                                            </Button>
                                        </>
                                    )}
                                </div>

                                <div className="text-center text-xs text-gray-500 mb-4">
                                    30-Day Money-Back Guarantee
                                </div>

                                <div className="space-y-3 mb-6">
                                    <h3 className="font-bold text-gray-900">This course includes:</h3>
                                    <div className="space-y-2 text-sm text-gray-600">
                                        <div className="flex items-center gap-3">
                                            <Monitor className="w-4 h-4" />
                                            <span>{course.duration} on-demand video</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Download className="w-4 h-4" />
                                            <span>10 downloadable resources</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Smartphone className="w-4 h-4" />
                                            <span>Access on mobile and TV</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Trophy className="w-4 h-4" />
                                            <span>Certificate of completion</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-between text-sm font-bold underline cursor-pointer">
                                    <span className="hover:text-gray-600">Share</span>
                                    <span className="hover:text-gray-600">Gift this course</span>
                                    <span className="hover:text-gray-600">Apply Coupon</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

// Missing icons mock
const FileText = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /></svg>
);
const Award = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="8" r="7" /><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" /></svg>
);
const Users = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
);

export default CourseDetailPage;
