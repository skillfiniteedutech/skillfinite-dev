"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Gift, Loader2 } from "lucide-react"

interface Course {
  title: string
  subtitle: string
  thumbnail: string
  category: string
  level: string
  price: number
}

interface EnrollmentModalProps {
  isOpen: boolean
  onClose: () => void
  course: Course
  onEnroll: () => void
  isEnrolling: boolean
}

export function EnrollmentModal({ isOpen, onClose, course, onEnroll, isEnrolling }: EnrollmentModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-green-600" />
            Enroll in Free Course
          </DialogTitle>
          <DialogDescription>
            You're about to enroll in this free course. You'll get instant access to all course materials.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex gap-4 p-4 bg-gray-50 rounded-lg">
            <img
              src={course.thumbnail || "/placeholder.svg"}
              alt={course.title}
              className="w-16 h-16 rounded object-cover"
            />
            <div className="flex-1">
              <h3 className="font-medium text-sm">{course.title}</h3>
              <p className="text-xs text-gray-600 mb-2">{course.subtitle}</p>
              <div className="flex gap-2">
                <Badge variant="secondary" className="text-xs">
                  {course.category}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {course.level}
                </Badge>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium text-sm">What you'll get:</h4>
            <div className="space-y-2">
              {[
                "Lifetime access to course content",
                "Downloadable resources",
                "Certificate of completion",
                "Access to discussion forum",
              ].map((benefit, index) => (
                <div key={`benefit-${benefit.replace(/\s+/g, '-').toLowerCase()}`} className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Cancel
            </Button>
            <Button onClick={onEnroll} disabled={isEnrolling} className="flex-1">
              {isEnrolling ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Gift className="h-4 w-4 mr-2" />}
              {isEnrolling ? "Enrolling..." : "Enroll Now"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
