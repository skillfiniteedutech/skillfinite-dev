'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { getStudentCourses } from '@/lib/enrollmentService'

interface EnrollmentContextType {
    enrolledCourseIds: string[]
    isEnrolled: (courseId: string) => boolean
    enrollCourse: (courseId: string) => void
    loadEnrollments: () => Promise<void>
    isLoading: boolean
}

const EnrollmentContext = createContext<EnrollmentContextType | undefined>(undefined)

export function EnrollmentProvider({ children }: { children: ReactNode }) {
    const [enrolledCourseIds, setEnrolledCourseIds] = useState<string[]>([])
    const [isLoading, setIsLoading] = useState(false)

    const loadEnrollments = async () => {
        try {
            console.log('[EnrollmentContext] Starting to load enrollments...');
            setIsLoading(true)
            
            // Check if user is authenticated first
            const token = localStorage.getItem('token');
            if (!token) {
                console.log('[EnrollmentContext] No token found, user not authenticated');
                setEnrolledCourseIds([])
                return;
            }
            
            const response = await getStudentCourses()
            console.log('[EnrollmentContext] Raw response:', response);
            
            if (response.success && response.data?.courses) {
                const courseIds = response.data.courses
                    .map((enrollment: any) => enrollment.course?.id)
                    .filter(Boolean)
                
                console.log('[EnrollmentContext] Extracted course IDs:', courseIds);
                setEnrolledCourseIds(courseIds)
            } else {
                console.log('[EnrollmentContext] Invalid response format');
                setEnrolledCourseIds([])
            }
        } catch (error) {
            console.error('Failed to load enrollments:', error)
            // Silently fail - user might not be logged in
            setEnrolledCourseIds([])
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        loadEnrollments()
    }, [])

    const isEnrolled = (courseId: string): boolean => {
        console.log(`[EnrollmentContext] isEnrolled called with courseId: ${courseId}`);
        console.log(`[EnrollmentContext] Current enrolledCourseIds:`, enrolledCourseIds);
        const result = enrolledCourseIds.includes(courseId);
        console.log(`[EnrollmentContext] isEnrolled result: ${result}`);
        return result
    }

    const enrollCourse = (courseId: string) => {
        if (!enrolledCourseIds.includes(courseId)) {
            setEnrolledCourseIds(prev => [...prev, courseId])
        }
    }

    return (
        <EnrollmentContext.Provider
            value={{
                enrolledCourseIds,
                isEnrolled,
                enrollCourse,
                loadEnrollments,
                isLoading
            }}
        >
            {children}
        </EnrollmentContext.Provider>
    )
}

export function useEnrollment() {
    const context = useContext(EnrollmentContext)
    if (context === undefined) {
        throw new Error('useEnrollment must be used within an EnrollmentProvider')
    }
    return context
}
