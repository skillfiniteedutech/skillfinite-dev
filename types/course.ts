export interface CourseVideo {
  id: string
  title: string
  description?: string
  url: string
  duration?: string
  size?: number
  uploadedAt?: string
  order?: number
  isCompleted?: boolean
}

export interface CourseDocument {
  id: string
  title: string
  description: string
  url: string
  fileName: string
  size: number
  uploadedAt: string
}

export interface QuizQuestion {
  question: string
  type: string
  options: string[]
  correctAnswer: string
  points: number
}

export interface CourseQuiz {
  id: string
  title: string
  description: string
  questions: QuizQuestion[]
  timeLimit?: number
  passingScore?: number
  createdAt?: string
}

export interface CurriculumLesson {
  lessonId: string
  title: string
  type: "video" | "document" | "quiz"
  resourceId: string
  order: number
}

export interface CurriculumModule {
  moduleId: string
  title: string
  description?: string
  order: number
  lessons: CurriculumLesson[]
}

export interface CourseDetails {
  _id: string
  id: string
  title: string
  subtitle: string
  description: string
  category: string
  level: string
  language: string
  thumbnail: string
  instructorId: string
  status: string
  videos: CourseVideo[]
  documents: CourseDocument[]
  curriculum: CurriculumModule[]
  quizzes: CourseQuiz[]
  learningObjectives: string[]
  tags: string[]
  settings?: {
    pricing: {
      type: string
      price: number
      currency: string
      discountPrice?: number
      discountEndDate?: string
    }
    access: {
      enrollmentType: string
      lifetime: boolean
      maxStudents?: number
      startDate?: string
      endDate?: string
    }
    features: {
      downloadable: boolean
      certificate: boolean
      discussions: boolean
      assignments: boolean
      liveSession: boolean
    }
  }
  createdAt: string
  updatedAt: string
  publishedAt?: string
}

export interface EnrollmentProgress {
  enrollmentId: string
  courseId: string
  progress: number
  completedVideos: string[]
  completedDocuments: string[]
  completedQuizzes: string[]
  lastAccessed: string
  enrolledAt: string
}

export interface QuizAttempt {
  id: string
  quizId: string
  userId: string
  answers: Record<string, string>
  score: number
  passed: boolean
  completedAt: string
  timeSpent: number
}
