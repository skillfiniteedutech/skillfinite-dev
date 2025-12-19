// Base API configuration
const getBaseUrl = () => {
    return process.env.NEXT_PUBLIC_API_URL || 'https://skillfinite-backend-47sd.onrender.com';
};

interface EnrolledCourse {
    enrollmentId: string;
    course: {
        id: string;
        title: string;
        description: string;
        instructor: string;
        thumbnail: string;
        rating: number;
        reviews: number;
        duration: string;
        lectures: number;
        level: string;
        price: number;
        currency: string;
    };
    purchaseDate: string;
    isFree: boolean;
    paymentId: string;
    price: number;
    progress?: number;
    lastAccessed?: string;
}

interface EnrolledCoursesResponse {
    success: boolean;
    message: string;
    data: {
        totalCourses: number;
        courses: EnrolledCourse[];
    };
}

/**
 * Fetch all enrolled courses for the current user
 */
export const getEnrolledCourses = async (): Promise<EnrolledCoursesResponse> => {
    try {
        const token = localStorage.getItem('token');

        if (!token) {
            // Return empty response when not authenticated
            return {
                success: true,
                message: 'Not authenticated',
                data: {
                    totalCourses: 0,
                    courses: []
                }
            };
        }

        const baseUrl = getBaseUrl();
        const response = await fetch(`${baseUrl}/api/enrollment/student/courses`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch enrolled courses');
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error('Error fetching enrolled courses:', error);
        throw error;
    }
};

/**
 * Check if user has access to a specific course
 */
export const checkCourseAccess = async (courseId: string): Promise<boolean> => {
    try {
        const token = localStorage.getItem('token');

        if (!token) {
            return false;
        }

        const baseUrl = getBaseUrl();
        const response = await fetch(`${baseUrl}/api/enrollment/course/${courseId}/access`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            return data.data?.hasAccess || false;
        }

        return false;

    } catch (error) {
        console.error('Error checking course access:', error);
        return false;
    }
};

/**
 * Get enrollment status for a specific course
 */
export const getEnrollmentStatus = async (courseId: string) => {
    try {
        console.log('[EnrollmentService] Getting enrollment status...');
        const token = localStorage.getItem('token');

        if (!token) {
            throw new Error('No authentication token found');
        }

        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };

        const baseUrl = getBaseUrl();
        console.log('[EnrollmentService] Making request to:', `${baseUrl}/api/enrollment/course/${courseId}/status`);
        console.log('[EnrollmentService] Token exists:', !!token);

        const response = await fetch(`${baseUrl}/api/enrollment/course/${courseId}/status`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        console.log('[EnrollmentService] Response status:', response.status);
        console.log('[EnrollmentService] Response ok:', response.ok);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('[EnrollmentService] Error response:', errorText);
            throw new Error(`Failed to fetch enrollment status: ${response.status}`);
        }

        const data = await response.json();
        console.log('[EnrollmentService] Response data:', data);
        return data;

    } catch (error) {
        console.error('[EnrollmentService] Error in getEnrollmentStatus:', error);
        throw error;
    }
};

// Alias for compatibility
export const getStudentCourses = getEnrolledCourses;

export type { EnrolledCourse, EnrolledCoursesResponse };
