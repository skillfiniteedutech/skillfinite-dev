
import { getAuthHeaders } from './utils';

const getBaseUrl = () => {
    return process.env.NEXT_PUBLIC_API_URL || 'https://skillfinite-backend-47sd.onrender.com';
};

export interface Video {
    id: string;
    title: string;
    description: string;
    url: string;
    duration: string;
    size: number;
    uploadedAt: string;
}

export interface Document {
    id: string;
    title: string;
    description: string;
    url: string;
    fileName: string;
    size: number;
    uploadedAt: string;
}

export interface Lesson {
    lessonId: string;
    title: string;
    type: 'video' | 'audio' | 'quiz' | 'document';
    resourceId: string;
    order: number;
}

export interface Module {
    moduleId: string;
    title: string;
    description: string;
    order: number;
    lessons: Lesson[];
}

export interface QuizQuestion {
    question: string;
    type: string;
    options: string[];
    correctAnswer: string;
    points: number;
}

export interface Quiz {
    id: string;
    title: string;
    description: string;
    questions: QuizQuestion[];
    timeLimit?: number;
    passingScore?: number;
    createdAt?: string;
}

export interface HelperCourse {
    id: string;
    title: string;
    description: string;
    instructorId: string; // The ID of the instructor
    instructor?: string; // Derived or fetched separately if needed
    category: string;
    level: string;
    thumbnail: string;
    curriculum: Module[];
    videos: Video[];
    documents: Document[];
    quizzes: Quiz[];
    lectures: number; // Calculated field
    duration: string; // Calculated field
}

export interface CourseProgress {
    courseId: string;
    completedLessons: string[];
    lastAccessedLessonId: string | null;
    lastAccessedAt: string;
    completedAt: string | null;
    progressPercent: number;
}

export const getCourseProgress = async (courseId: string): Promise<CourseProgress> => {
    try {
        const headers = getAuthHeaders();
        const baseUrl = getBaseUrl();
        const response = await fetch(`${baseUrl}/api/progress/${courseId}`, {
            method: 'GET',
            headers: headers
        });

        if (!response.ok) {
            throw new Error('Failed to fetch progress');
        }

        return await response.json();
    } catch (error) {
        console.error('Error in getCourseProgress:', error);
        throw error;
    }
};

export const updateCourseProgress = async (courseId: string, lessonId: string, completed: boolean): Promise<any> => {
    try {
        const headers = getAuthHeaders();
        const baseUrl = getBaseUrl();
        const response = await fetch(`${baseUrl}/api/progress/${courseId}`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({ lessonId, completed })
        });

        if (!response.ok) {
            throw new Error('Failed to update progress');
        }

        return await response.json();
    } catch (error) {
        console.error('Error in updateCourseProgress:', error);
        throw error;
    }
};

export const getCourseById = async (courseId: string): Promise<HelperCourse> => {
    try {
        const headers = getAuthHeaders();
        console.log(`Fetching course with ID: ${courseId}`);
        const baseUrl = getBaseUrl();
        const response = await fetch(`${baseUrl}/api/courses/${courseId}`, {
            method: 'GET',
            headers: headers
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Failed to fetch course data:', errorData);
            throw new Error(errorData.message || 'Failed to fetch course');
        }

        const data = await response.json();
        console.log('Course data fetched successfully:', data);

        // Transform the dictionary response into our helper type
        // Assuming data.data is the course object
        return data.data;

    } catch (error) {
        console.error('Error in getCourseById:', error);
        throw error;
    }
};
