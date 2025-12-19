/**
 * Example usage of the centralized route management system.
 * 
 * This file demonstrates various ways to use route helpers in your components.
 * Copy these patterns when implementing navigation in your application.
 */

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ROUTES, buildRoute, addQueryParams } from '@/lib/routes';

// ============================================================================
// EXAMPLE 1: Basic Navigation with Static Routes
// ============================================================================

export function BasicNavigationExample() {
    const router = useRouter();

    return (
        <div>
            <h2>Static Routes</h2>

            {/* Using router.push */}
            <button onClick={() => router.push(ROUTES.COURSES)}>
                View All Courses
            </button>

            {/* Using Link component */}
            <Link href={ROUTES.MY_COURSES}>
                My Learning
            </Link>

            <Link href={ROUTES.CART}>
                Shopping Cart
            </Link>
        </div>
    );
}

// ============================================================================
// EXAMPLE 2: Dynamic Routes - Course Navigation
// ============================================================================

interface CourseCardProps {
    courseId: string;
    courseTitle: string;
    isEnrolled: boolean;
}

export function CourseCardExample({ courseId, courseTitle, isEnrolled }: CourseCardProps) {
    const router = useRouter();

    const handleViewCourse = () => {
        // Navigate to course detail page
        router.push(buildRoute.course(courseId));
    };

    const handleStartLearning = () => {
        // Navigate to course learning page
        router.push(buildRoute.courseLearn(courseId));
    };

    return (
        <div className="course-card">
            <h3>{courseTitle}</h3>

            {/* View course details */}
            <Link href={buildRoute.course(courseId)}>
                View Details
            </Link>

            {/* Conditional navigation based on enrollment */}
            {isEnrolled ? (
                <button onClick={handleStartLearning}>
                    Continue Learning
                </button>
            ) : (
                <button onClick={handleViewCourse}>
                    Learn More
                </button>
            )}
        </div>
    );
}

// ============================================================================
// EXAMPLE 3: Search and Filtering
// ============================================================================

export function CourseSearchExample() {
    const router = useRouter();

    const handleSearch = (query: string) => {
        // Navigate to courses with search query
        router.push(buildRoute.coursesSearch(query));
    };

    const handleCategoryFilter = (category: string) => {
        // Navigate to courses filtered by category
        router.push(buildRoute.coursesByCategory(category));
    };

    const handleAdvancedFilter = () => {
        // Navigate with multiple query parameters
        const route = addQueryParams(ROUTES.COURSES, {
            level: 'beginner',
            price: 'free',
            duration: 'short',
        });
        router.push(route);
    };

    return (
        <div>
            <input
                type="text"
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search courses..."
            />

            <button onClick={() => handleCategoryFilter('Web Development')}>
                Web Development
            </button>

            <button onClick={handleAdvancedFilter}>
                Beginner Free Short Courses
            </button>
        </div>
    );
}

// ============================================================================
// EXAMPLE 4: Payment Flow with Redirect
// ============================================================================

export function PaymentSuccessExample({ courseId }: { courseId: string }) {
    const router = useRouter();

    const handlePaymentSuccess = () => {
        // Show success message
        console.log('Payment successful!');

        // Redirect to the course page
        router.push(buildRoute.course(courseId));
    };

    const handleEnrollmentSuccess = () => {
        // After free enrollment, go directly to learning page
        router.push(buildRoute.courseLearn(courseId));
    };

    return (
        <div>
            <button onClick={handlePaymentSuccess}>
                Simulate Payment Success
            </button>

            <button onClick={handleEnrollmentSuccess}>
                Simulate Free Enrollment
            </button>
        </div>
    );
}

// ============================================================================
// EXAMPLE 5: Navigation Menu
// ============================================================================

export function NavigationMenuExample() {
    const menuItems = [
        { label: 'Home', route: ROUTES.HOME },
        { label: 'Courses', route: ROUTES.COURSES },
        { label: 'My Learning', route: ROUTES.MY_COURSES },
        { label: 'Community', route: ROUTES.COMMUNITY },
        { label: 'Messages', route: ROUTES.MESSAGES },
        { label: 'Profile', route: ROUTES.PROFILE },
    ];

    return (
        <nav>
            {menuItems.map((item) => (
                <Link key={item.route} href={item.route}>
                    {item.label}
                </Link>
            ))}
        </nav>
    );
}

// ============================================================================
// EXAMPLE 6: Conditional Redirects
// ============================================================================

interface ConditionalRedirectProps {
    isAuthenticated: boolean;
    isEnrolled: boolean;
    courseId: string;
}

export function ConditionalRedirectExample({
    isAuthenticated,
    isEnrolled,
    courseId
}: ConditionalRedirectProps) {
    const router = useRouter();

    const handleAccessCourse = () => {
        // Check authentication
        if (!isAuthenticated) {
            router.push(ROUTES.LOGIN);
            return;
        }

        // Check enrollment
        if (!isEnrolled) {
            router.push(buildRoute.course(courseId));
            return;
        }

        // User is authenticated and enrolled, go to learning page
        router.push(buildRoute.courseLearn(courseId));
    };

    return (
        <button onClick={handleAccessCourse}>
            Access Course
        </button>
    );
}

// ============================================================================
// EXAMPLE 7: Breadcrumb Navigation
// ============================================================================

interface BreadcrumbProps {
    courseId: string;
    courseTitle: string;
}

export function BreadcrumbExample({ courseId, courseTitle }: BreadcrumbProps) {
    return (
        <nav aria-label="breadcrumb">
            <ol>
                <li>
                    <Link href={ROUTES.HOME}>Home</Link>
                </li>
                <li>
                    <Link href={ROUTES.COURSES}>Courses</Link>
                </li>
                <li>
                    <Link href={buildRoute.course(courseId)}>
                        {courseTitle}
                    </Link>
                </li>
                <li aria-current="page">Learn</li>
            </ol>
        </nav>
    );
}

// ============================================================================
// EXAMPLE 8: Programmatic Navigation with Callbacks
// ============================================================================

interface CourseActionsProps {
    courseId: string;
    onNavigate?: () => void;
}

export function CourseActionsExample({ courseId, onNavigate }: CourseActionsProps) {
    const router = useRouter();

    const navigateToCourse = () => {
        // Execute callback before navigation
        onNavigate?.();

        // Navigate to course
        router.push(buildRoute.course(courseId));
    };

    return (
        <button onClick={navigateToCourse}>
            View Course
        </button>
    );
}

// ============================================================================
// EXAMPLE 9: Wishlist and Cart Actions
// ============================================================================

export function WishlistCartExample({ courseId }: { courseId: string }) {
    const router = useRouter();

    const addToCartAndNavigate = () => {
        // Add to cart logic here
        console.log(`Added course ${courseId} to cart`);

        // Navigate to cart
        router.push(ROUTES.CART);
    };

    const viewInWishlist = () => {
        router.push(ROUTES.WISHLIST);
    };

    return (
        <div>
            <button onClick={addToCartAndNavigate}>
                Add to Cart & Checkout
            </button>

            <button onClick={viewInWishlist}>
                View Wishlist
            </button>
        </div>
    );
}

// ============================================================================
// EXAMPLE 10: Error Handling
// ============================================================================

export function SafeNavigationExample({ courseId }: { courseId: string | null }) {
    const router = useRouter();

    const handleNavigation = () => {
        try {
            // buildRoute.course will throw error if courseId is empty
            if (!courseId) {
                console.error('Course ID is required');
                return;
            }

            const route = buildRoute.course(courseId);
            router.push(route);
        } catch (error) {
            console.error('Navigation error:', error);
            // Fallback to courses list
            router.push(ROUTES.COURSES);
        }
    };

    return (
        <button onClick={handleNavigation}>
            View Course (Safe)
        </button>
    );
}
