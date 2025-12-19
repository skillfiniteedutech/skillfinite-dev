/**
 * Centralized Route Management System
 * 
 * This file provides type-safe route constants and helper functions to prevent
 * routing issues between development and production environments.
 * 
 * @example
 * // Static routes
 * router.push(ROUTES.COURSES);
 * 
 * @example
 * // Dynamic routes
 * router.push(buildRoute.course(courseId));
 * router.push(buildRoute.courseLearn(courseId));
 */

// ============================================================================
// STATIC ROUTES
// ============================================================================

/**
 * Static route constants for simple navigation paths.
 * Use these for routes that don't require dynamic parameters.
 */
export const ROUTES = {
    // Core pages
    HOME: '/',
    LOGIN: '/login',
    SIGNUP: '/signup',
    LOGOUT: '/logout',
    SUPER_LOGIN: '/super-login',
    FORGOT_PASSWORD: '/forgot-password',

    // Course-related
    COURSES: '/courses',
    MY_COURSES: '/mycourses',

    // User features
    CART: '/cart',
    WISHLIST: '/wishlist',
    PROFILE: '/profile',
    SETTINGS: '/settings',

    // Community & Communication
    COMMUNITY: '/community',
    MESSAGES: '/messages',
    SCHEDULE: '/schedule',

    // Dashboard (legacy)
    DASHBOARD: '/dashboard',

    // Misc
    NOTIFICATIONS: '/notifications',
} as const;

// ============================================================================
// DYNAMIC ROUTE BUILDERS
// ============================================================================

/**
 * Type-safe builders for dynamic routes.
 * These functions ensure correct route formatting with parameters.
 */
export const buildRoute = {
    /**
     * Build route for course detail page
     * @param courseId - The course ID
     * @returns Route path: /courses/{courseId}
     * 
     * @example
     * buildRoute.course('abc-123') // '/courses/abc-123'
     */
    course: (courseId: string): string => {
        if (!courseId || courseId.trim() === '') {
            throw new Error('courseId is required for course route');
        }
        return `/courses/${courseId}`;
    },

    /**
     * Build route for course learning page
     * @param courseId - The course ID
     * @returns Route path: /courses/{courseId}/learn
     * 
     * @example
     * buildRoute.courseLearn('abc-123') // '/courses/abc-123/learn'
     */
    courseLearn: (courseId: string): string => {
        if (!courseId || courseId.trim() === '') {
            throw new Error('courseId is required for courseLearn route');
        }
        return `/courses/${courseId}/learn`;
    },

    /**
     * Build route for profile billing page
     * @returns Route path: /profile/billing
     */
    profileBilling: (): string => '/profile/billing',

    /**
     * Build route for courses with search query
     * @param searchQuery - The search term
     * @returns Route path: /courses?search={query}
     * 
     * @example
     * buildRoute.coursesSearch('react') // '/courses?search=react'
     */
    coursesSearch: (searchQuery: string): string => {
        const encoded = encodeURIComponent(searchQuery);
        return `/courses?search=${encoded}`;
    },

    /**
     * Build route for courses filtered by category
     * @param category - The category name
     * @returns Route path: /courses?category={category}
     * 
     * @example
     * buildRoute.coursesByCategory('Web Development') // '/courses?category=Web%20Development'
     */
    coursesByCategory: (category: string): string => {
        const encoded = encodeURIComponent(category);
        return `/courses?category=${encoded}`;
    },
} as const;

// ============================================================================
// API ROUTE BUILDERS
// ============================================================================

/**
 * Builders for API endpoints.
 * Note: API routes may use different naming conventions than frontend routes.
 */
export const buildApiRoute = {
    /**
     * Build API route for course enrollment access check
     * @param courseId - The course ID
     * @returns API path: /api/enrollment/course/{courseId}/access
     */
    enrollmentAccess: (courseId: string): string => {
        return `/api/enrollment/course/${courseId}/access`;
    },

    /**
     * Build API route for course enrollment status
     * @param courseId - The course ID
     * @returns API path: /api/enrollment/course/{courseId}/status
     */
    enrollmentStatus: (courseId: string): string => {
        return `/api/enrollment/course/${courseId}/status`;
    },
} as const;

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Build a query string from an object of parameters
 * @param params - Object of key-value pairs
 * @returns URL-encoded query string
 * 
 * @example
 * buildQueryString({ search: 'react', level: 'beginner' })
 * // 'search=react&level=beginner'
 */
export function buildQueryString(params: Record<string, string | number | boolean | undefined>): string {
    const entries = Object.entries(params)
        .filter(([_, value]) => value !== undefined && value !== null && value !== '')
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);

    return entries.length > 0 ? entries.join('&') : '';
}

/**
 * Append query parameters to a route
 * @param route - Base route path
 * @param params - Query parameters
 * @returns Route with query string
 * 
 * @example
 * addQueryParams('/courses', { search: 'react', page: '1' })
 * // '/courses?search=react&page=1'
 */
export function addQueryParams(
    route: string,
    params: Record<string, string | number | boolean | undefined>
): string {
    const queryString = buildQueryString(params);
    if (!queryString) return route;

    const separator = route.includes('?') ? '&' : '?';
    return `${route}${separator}${queryString}`;
}

/**
 * Check if a route is external (starts with http:// or https://)
 * @param route - Route to check
 * @returns True if external, false otherwise
 */
export function isExternalRoute(route: string): boolean {
    return route.startsWith('http://') || route.startsWith('https://');
}

/**
 * Validate that a route matches expected format
 * Throws error if route contains literal dynamic segments like [id]
 * @param route - Route to validate
 */
export function validateRoute(route: string): void {
    if (route.includes('[') || route.includes(']')) {
        throw new Error(
            `Invalid route: "${route}" contains literal dynamic segments. ` +
            `Use buildRoute helpers instead. Example: buildRoute.course(id)`
        );
    }
}

// ============================================================================
// TYPE EXPORTS
// ============================================================================

/**
 * Union type of all static route values
 */
export type StaticRoute = typeof ROUTES[keyof typeof ROUTES];

/**
 * Union type of all route builder function names
 */
export type DynamicRouteBuilder = keyof typeof buildRoute;

/**
 * All available route types
 */
export type Route = StaticRoute | ReturnType<typeof buildRoute[DynamicRouteBuilder]>;
