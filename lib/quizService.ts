const getBaseUrl = () => {
    return process.env.NEXT_PUBLIC_API_URL || 'https://skillfinite-backend-47sd.onrender.com';
};

export interface QuizSubmissionData {
    quizId: string;
    answers: Record<string, string>;
}

export interface QuizSubmissionResponse {
    success: boolean;
    message: string;
    data: {
        quizId: string;
        score: number;
        totalQuestions: number;
        percentage: number;
        passed: boolean;
        progress: number;
        completedAt: string;
    };
}

export interface QuizAttemptData {
    score: number;
    totalQuestions: number;
    percentage: number;
    completedAt: string;
}

export interface QuizAttemptsResponse {
    success: boolean;
    data: {
        quizId: string;
        attempts: QuizAttemptData[];
    };
}

/**
 * Submit quiz answers to the backend
 */
export const submitQuiz = async (
    courseId: string,
    quizId: string,
    answers: Record<string, string>
): Promise<QuizSubmissionResponse> => {
    try {
        const token = localStorage.getItem('token');
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const baseUrl = getBaseUrl();
        const response = await fetch(`${baseUrl}/api/progress/${courseId}/quiz/submit`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({ quizId, answers })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to submit quiz');
        }

        return await response.json();
    } catch (error) {
        console.error('Error in submitQuiz:', error);
        throw error;
    }
};

/**
 * Get quiz attempt history
 */
export const getQuizAttempts = async (
    courseId: string,
    quizId: string
): Promise<QuizAttemptsResponse> => {
    try {
        const token = localStorage.getItem('token');
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const baseUrl = getBaseUrl();
        const response = await fetch(`${baseUrl}/api/progress/${courseId}/quiz/${quizId}/attempts`, {
            method: 'GET',
            headers: headers
        });

        if (!response.ok) {
            throw new Error('Failed to fetch quiz attempts');
        }

        return await response.json();
    } catch (error) {
        console.error('Error in getQuizAttempts:', error);
        throw error;
    }
};
