"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { CheckCircle, XCircle, Clock, Award, RotateCcw } from "lucide-react"
import type { CourseQuiz, QuizAttempt } from "@/types/course"

interface QuizComponentProps {
  quiz: CourseQuiz
  onQuizComplete?: (attempt: QuizAttempt) => void
  className?: string
}

export function QuizComponent({ quiz, onQuizComplete, className = "" }: QuizComponentProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [timeLeft, setTimeLeft] = useState(quiz.timeLimit || 600) // Default 10 minutes
  const [isCompleted, setIsCompleted] = useState(false)
  const [score, setScore] = useState(0)
  const [showResults, setShowResults] = useState(false)
  const [startTime] = useState(Date.now())

  const currentQuestion = quiz.questions[currentQuestionIndex]
  const totalQuestions = quiz.questions.length
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100

  // Timer effect
  useEffect(() => {
    if (isCompleted || timeLeft <= 0) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleQuizSubmit()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isCompleted, timeLeft])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const handleAnswerSelect = (questionIndex: number, answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionIndex]: answer,
    }))
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
    } else {
      handleQuizSubmit()
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1)
    }
  }

  const calculateScore = () => {
    let correctAnswers = 0
    let totalPoints = 0

    quiz.questions.forEach((question, index) => {
      totalPoints += question.points
      if (answers[index] === question.correctAnswer) {
        correctAnswers += question.points
      }
    })

    return {
      score: correctAnswers,
      totalPoints,
      percentage: Math.round((correctAnswers / totalPoints) * 100),
    }
  }

  const handleQuizSubmit = () => {
    const { score: finalScore, percentage } = calculateScore()
    const timeSpent = Math.round((Date.now() - startTime) / 1000)
    const passed = percentage >= (quiz.passingScore || 70)

    const attempt: QuizAttempt = {
      id: `attempt_${Date.now()}`,
      quizId: quiz.id,
      userId: "current_user", // This would come from auth context
      answers,
      score: percentage,
      passed,
      completedAt: new Date().toISOString(),
      timeSpent,
    }

    setScore(percentage)
    setIsCompleted(true)
    setShowResults(true)
    onQuizComplete?.(attempt)
  }

  const handleRetakeQuiz = () => {
    setCurrentQuestionIndex(0)
    setAnswers({})
    setTimeLeft(quiz.timeLimit || 600)
    setIsCompleted(false)
    setScore(0)
    setShowResults(false)
  }

  if (showResults) {
    const passed = score >= (quiz.passingScore || 70)

    return (
      <Card className={className}>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            {passed ? (
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-primary" />
              </div>
            ) : (
              <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center">
                <XCircle className="h-8 w-8 text-destructive" />
              </div>
            )}
          </div>
          <CardTitle className="text-2xl">{passed ? "Congratulations!" : "Quiz Not Passed"}</CardTitle>
          <p className="text-muted-foreground">
            {passed
              ? "You have successfully completed the quiz."
              : `You need ${quiz.passingScore || 70}% to pass. You can retake the quiz.`}
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">{score}%</div>
            <p className="text-muted-foreground">Your Score</p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-4 bg-muted rounded-lg">
              <div className="text-2xl font-semibold">{Object.keys(answers).length}</div>
              <p className="text-sm text-muted-foreground">Questions Answered</p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <div className="text-2xl font-semibold">{totalQuestions}</div>
              <p className="text-sm text-muted-foreground">Total Questions</p>
            </div>
          </div>

          <div className="flex gap-3 justify-center">
            {!passed && (
              <Button onClick={handleRetakeQuiz} variant="outline">
                <RotateCcw className="h-4 w-4 mr-2" />
                Retake Quiz
              </Button>
            )}
            {passed && (
              <Button className="bg-primary hover:bg-primary/90">
                <Award className="h-4 w-4 mr-2" />
                Continue Learning
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{quiz.title}</CardTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{formatTime(timeLeft)}</span>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>
              Question {currentQuestionIndex + 1} of {totalQuestions}
            </span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">{currentQuestion.question}</h3>

          <RadioGroup
            value={answers[currentQuestionIndex] || ""}
            onValueChange={(value) => handleAnswerSelect(currentQuestionIndex, value)}
            className="space-y-3"
          >
            {currentQuestion.options.map((option, index) => (
              <div
                key={index}
                className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
              >
                <RadioGroupItem value={option} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={handlePreviousQuestion} disabled={currentQuestionIndex === 0}>
            Previous
          </Button>

          <Button
            onClick={handleNextQuestion}
            disabled={!answers[currentQuestionIndex]}
            className="bg-primary hover:bg-primary/90"
          >
            {currentQuestionIndex === totalQuestions - 1 ? "Submit Quiz" : "Next Question"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
