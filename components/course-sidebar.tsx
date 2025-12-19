"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Play, CheckCircle, FileText, HelpCircle, Clock, Download, Lock } from "lucide-react"
import type { CourseDetails, CurriculumModule, CurriculumLesson, EnrollmentProgress } from "@/types/course"

interface CourseSidebarProps {
  course: CourseDetails
  progress?: EnrollmentProgress | null
  currentVideoId?: string
  onVideoSelect?: (videoId: string) => void
  onQuizStart?: (quizId: string) => void
  className?: string
}

export function CourseSidebar({
  course,
  progress,
  currentVideoId,
  onVideoSelect,
  onQuizStart,
  className = "",
}: CourseSidebarProps) {
  const [activeModule, setActiveModule] = useState<string>("")

  const isVideoCompleted = (videoId: string) => {
    return progress?.completedVideos?.includes(videoId) || false
  }

  const isDocumentCompleted = (documentId: string) => {
    return progress?.completedDocuments?.includes(documentId) || false
  }

  const isQuizCompleted = (quizId: string) => {
    return progress?.completedQuizzes?.includes(quizId) || false
  }

  const getResourceById = (resourceId: string, type: "video" | "document" | "quiz") => {
    if (type === "video") {
      return course.videos?.find((v) => v.id === resourceId)
    } else if (type === "document") {
      return course.documents?.find((d) => d.id === resourceId)
    } else if (type === "quiz") {
      return course.quizzes?.find((q) => q.id === resourceId)
    }
    return null
  }

  const formatFileSize = (bytes: number) => {
    const sizes = ["Bytes", "KB", "MB", "GB"]
    if (bytes === 0) return "0 Bytes"
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i]
  }

  const formatDuration = (duration: string | number) => {
    if (typeof duration === "string") return duration
    const minutes = Math.floor(duration / 60)
    const seconds = Math.floor(duration % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const calculateModuleProgress = (module: CurriculumModule) => {
    const totalLessons = module.lessons?.length || 0
    if (totalLessons === 0) return 0

    let completedLessons = 0
    module.lessons?.forEach((lesson) => {
      if (lesson.type === "video" && isVideoCompleted(lesson.resourceId)) {
        completedLessons++
      } else if (lesson.type === "document" && isDocumentCompleted(lesson.resourceId)) {
        completedLessons++
      } else if (lesson.type === "quiz" && isQuizCompleted(lesson.resourceId)) {
        completedLessons++
      }
    })

    return Math.round((completedLessons / totalLessons) * 100)
  }

  const isLessonAccessible = (lesson: CurriculumLesson, moduleIndex: number, lessonIndex: number) => {
    // First lesson is always accessible
    if (moduleIndex === 0 && lessonIndex === 0) return true

    // Check if previous lessons are completed
    const allModules = course.curriculum || []
    for (let i = 0; i <= moduleIndex; i++) {
      const module = allModules[i]
      const lessonsToCheck = i === moduleIndex ? lessonIndex : module.lessons?.length || 0

      for (let j = 0; j < lessonsToCheck; j++) {
        const prevLesson = module.lessons?.[j]
        if (!prevLesson) continue

        if (prevLesson.type === "video" && !isVideoCompleted(prevLesson.resourceId)) {
          return false
        } else if (prevLesson.type === "document" && !isDocumentCompleted(prevLesson.resourceId)) {
          return false
        } else if (prevLesson.type === "quiz" && !isQuizCompleted(prevLesson.resourceId)) {
          return false
        }
      }
    }

    return true
  }

  return (
    <Card className={`sticky top-4 ${className}`}>
      <CardHeader>
        <CardTitle className="text-lg">Course Content</CardTitle>
        {progress && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Overall Progress</span>
              <span>{progress.progress}%</span>
            </div>
            <Progress value={progress.progress} className="h-2" />
          </div>
        )}
      </CardHeader>

      <CardContent className="p-0">
        <div className="max-h-[600px] overflow-y-auto">
          {course.curriculum && course.curriculum.length > 0 ? (
            <Accordion type="single" collapsible value={activeModule} onValueChange={setActiveModule}>
              {course.curriculum
                .sort((a, b) => a.order - b.order)
                .map((module, moduleIndex) => {
                  const moduleProgress = calculateModuleProgress(module)

                  return (
                    <AccordionItem key={module.moduleId} value={module.moduleId} className="border-b-0">
                      <AccordionTrigger className="px-4 py-3 hover:no-underline">
                        <div className="flex items-center justify-between w-full mr-2">
                          <div className="text-left">
                            <p className="font-medium">{module.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {module.lessons?.length || 0} lessons • {moduleProgress}% complete
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Progress value={moduleProgress} className="w-16 h-1" />
                            {moduleProgress === 100 && <CheckCircle className="h-4 w-4 text-primary" />}
                          </div>
                        </div>
                      </AccordionTrigger>

                      <AccordionContent className="px-4 pb-4">
                        <div className="space-y-2">
                          {module.lessons
                            ?.sort((a, b) => a.order - b.order)
                            .map((lesson, lessonIndex) => {
                              const resource = getResourceById(lesson.resourceId, lesson.type)
                              if (!resource) return null

                              const isAccessible = isLessonAccessible(lesson, moduleIndex, lessonIndex)
                              const isActive = lesson.type === "video" && currentVideoId === lesson.resourceId

                              if (lesson.type === "video") {
                                const video = resource as any
                                const isCompleted = isVideoCompleted(video.id)

                                return (
                                  <Button
                                    key={lesson.lessonId}
                                    variant={isActive ? "default" : "ghost"}
                                    className={`w-full justify-start p-3 h-auto ${isActive ? "bg-primary text-primary-foreground" : ""
                                      } ${!isAccessible ? "opacity-50" : ""}`}
                                    onClick={() => isAccessible && onVideoSelect?.(video.id)}
                                    disabled={!isAccessible}
                                  >
                                    <div className="flex items-center gap-3 w-full">
                                      <div className="flex-shrink-0">
                                        {!isAccessible ? (
                                          <Lock className="h-4 w-4" />
                                        ) : isCompleted ? (
                                          <CheckCircle className="h-4 w-4 text-primary" />
                                        ) : (
                                          <Play className="h-4 w-4" />
                                        )}
                                      </div>
                                      <div className="flex-1 text-left min-w-0">
                                        <p className="font-medium text-sm truncate">{lesson.title}</p>
                                        <div className="flex items-center gap-2 text-xs opacity-70">
                                          <Clock className="h-3 w-3" />
                                          <span>{video.duration || "0:00"}</span>
                                          {isCompleted && (
                                            <Badge variant="secondary" className="text-xs px-1 py-0">
                                              Completed
                                            </Badge>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </Button>
                                )
                              } else if (lesson.type === "document") {
                                const document = resource as any
                                const isCompleted = isDocumentCompleted(document.id)

                                return (
                                  <div
                                    key={lesson.lessonId}
                                    className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${!isAccessible ? "opacity-50" : "hover:bg-muted/50"
                                      }`}
                                  >
                                    <div className="flex-shrink-0">
                                      {!isAccessible ? (
                                        <Lock className="h-4 w-4" />
                                      ) : isCompleted ? (
                                        <CheckCircle className="h-4 w-4 text-primary" />
                                      ) : (
                                        <FileText className="h-4 w-4" />
                                      )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="font-medium text-sm truncate">{lesson.title}</p>
                                      <p className="text-xs text-muted-foreground">{formatFileSize(document.size)}</p>
                                    </div>
                                    {course.settings?.features?.downloadable && isAccessible && (
                                      <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                                        <Download className="h-3 w-3" />
                                      </Button>
                                    )}
                                  </div>
                                )
                              } else if (lesson.type === "quiz") {
                                const quiz = resource as any
                                const isCompleted = isQuizCompleted(quiz.id)

                                return (
                                  <Button
                                    key={lesson.lessonId}
                                    variant="ghost"
                                    className={`w-full justify-start p-3 h-auto ${!isAccessible ? "opacity-50" : ""}`}
                                    onClick={() => isAccessible && onQuizStart?.(quiz.id)}
                                    disabled={!isAccessible}
                                  >
                                    <div className="flex items-center gap-3 w-full">
                                      <div className="flex-shrink-0">
                                        {!isAccessible ? (
                                          <Lock className="h-4 w-4" />
                                        ) : isCompleted ? (
                                          <CheckCircle className="h-4 w-4 text-primary" />
                                        ) : (
                                          <HelpCircle className="h-4 w-4" />
                                        )}
                                      </div>
                                      <div className="flex-1 text-left min-w-0">
                                        <p className="font-medium text-sm truncate">{lesson.title}</p>
                                        <div className="flex items-center gap-2 text-xs opacity-70">
                                          <span>{quiz.questions?.length || 0} questions</span>
                                          {quiz.timeLimit && (
                                            <>
                                              <span>•</span>
                                              <Clock className="h-3 w-3" />
                                              <span>{Math.round(quiz.timeLimit / 60)} min</span>
                                            </>
                                          )}
                                          {isCompleted && (
                                            <Badge variant="secondary" className="text-xs px-1 py-0">
                                              Passed
                                            </Badge>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </Button>
                                )
                              }
                              return null
                            })}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  )
                })}
            </Accordion>
          ) : (
            <div className="p-4 text-center text-muted-foreground">
              <p>No course content available</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
