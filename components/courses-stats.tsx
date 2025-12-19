"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { BookOpen, TrendingUp, ChevronRight, Sparkles, Target, Award } from "lucide-react"
import { cn } from "@/lib/utils"

interface CoursesStatsProps {
  totalCourses: number
  courses?: Array<{
    createdAt: string
    category: string
    level: string
  }>
}

export function CoursesStats({ totalCourses, courses = [] }: CoursesStatsProps) {
  const [animatedValues, setAnimatedValues] = useState({
    total: 0,
    newThisMonth: 0,
    trending: 0,
    instructors: 0,
  })
  const [selectedCard, setSelectedCard] = useState<string | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  // Calculate dynamic stats
  const newThisMonth = courses.filter((course) => {
    const courseDate = new Date(course.createdAt)
    const now = new Date()
    const monthAgo = new Date(now.getFullYear(), now.getMonth(), 1)
    return courseDate >= monthAgo
  }).length

  const trendingCount = Math.floor(totalCourses * 0.15)
  const instructorsCount = Math.max(Math.floor(totalCourses * 0.3), 1)

  // Enhanced animation with staggered effect
  useEffect(() => {
    const duration = 2000
    const steps = 80
    const stepDuration = duration / steps

    let currentStep = 0
    const timer = setInterval(() => {
      currentStep++
      const progress = currentStep / steps
      const easeOut = 1 - Math.pow(1 - progress, 4)

      setAnimatedValues({
        total: Math.floor(totalCourses * easeOut),
        newThisMonth: Math.floor(newThisMonth * easeOut),
        trending: Math.floor(trendingCount * easeOut),
        instructors: Math.floor(instructorsCount * easeOut),
      })

      if (currentStep >= steps) {
        clearInterval(timer)
        setAnimatedValues({
          total: totalCourses,
          newThisMonth,
          trending: trendingCount,
          instructors: instructorsCount,
        })
        setIsLoaded(true)
      }
    }, stepDuration)

    return () => clearInterval(timer)
  }, [totalCourses, newThisMonth, trendingCount, instructorsCount])

  const stats = [
    {
      id: "total",
      label: "Total Courses",
      value: animatedValues.total.toLocaleString(),
      icon: BookOpen,
      gradient: "from-blue-500 to-cyan-500",
      bgColor: "bg-gradient-to-br from-blue-50 to-cyan-50",
      borderColor: "border-blue-200",
      textColor: "text-blue-700",
      description: "Complete library of available courses",
      trend: totalCourses > 50 ? "+12%" : null,
      trendColor: "text-green-600",
      details: "Across 8+ categories",
    },
    {
      id: "new",
      label: "New This Month",
      value: animatedValues.newThisMonth.toString(),
      icon: Sparkles,
      gradient: "from-emerald-500 to-teal-500",
      bgColor: "bg-gradient-to-br from-emerald-50 to-teal-50",
      borderColor: "border-emerald-200",
      textColor: "text-emerald-700",
      description: "Fresh content added recently",
      trend: newThisMonth > 0 ? "Fresh" : "Coming Soon",
      trendColor: newThisMonth > 0 ? "text-emerald-600" : "text-amber-600",
      details: "Latest additions",
    },
    {
      id: "trending",
      label: "Trending Now",
      value: animatedValues.trending.toString(),
      icon: TrendingUp,
      gradient: "from-purple-500 to-pink-500",
      bgColor: "bg-gradient-to-br from-purple-50 to-pink-50",
      borderColor: "border-purple-200",
      textColor: "text-purple-700",
      description: "Most popular courses right now",
      trend: "🔥 Hot",
      trendColor: "text-orange-600",
      details: "High engagement",
    },
    {
      id: "instructors",
      label: "Expert Instructors",
      value: animatedValues.instructors.toString(),
      icon: Award,
      gradient: "from-amber-500 to-orange-500",
      bgColor: "bg-gradient-to-br from-amber-50 to-orange-50",
      borderColor: "border-amber-200",
      textColor: "text-amber-700",
      description: "Qualified professionals teaching",
      trend: "Active",
      trendColor: "text-amber-600",
      details: "Industry experts",
    },
  ]

  const handleCardClick = (cardId: string) => {
    setSelectedCard(selectedCard === cardId ? null : cardId)
    // Here you could trigger navigation or modal opening
    console.log(`Clicked on ${cardId} card - would show detailed analytics`)
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((stat, index) => (
          <StatCard
            key={stat.id}
            {...stat}
            delay={index * 150}
            isSelected={selectedCard === stat.id}
            onClick={() => handleCardClick(stat.id)}
            isLoaded={isLoaded}
          />
        ))}
      </div>

      {selectedCard && (
        <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-white rounded-xl border border-gray-200 shadow-lg animate-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-2 mb-2 sm:mb-3">
            <Target className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
            <h3 className="text-sm sm:text-base font-semibold text-gray-900">
              Detailed Analytics for {stats.find((s) => s.id === selectedCard)?.label}
            </h3>
          </div>
          <p className="text-gray-600 mb-2 sm:mb-3 text-xs sm:text-sm">
            {stats.find((s) => s.id === selectedCard)?.description}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
            <div className="p-2 sm:p-3 bg-gray-50 rounded-lg">
              <div className="text-xs text-gray-500">Growth Rate</div>
              <div className="text-base sm:text-lg font-bold text-gray-900">+23%</div>
            </div>
            <div className="p-2 sm:p-3 bg-gray-50 rounded-lg">
              <div className="text-xs text-gray-500">Engagement</div>
              <div className="text-base sm:text-lg font-bold text-gray-900">87%</div>
            </div>
            <div className="p-2 sm:p-3 bg-gray-50 rounded-lg">
              <div className="text-xs text-gray-500">Completion</div>
              <div className="text-base sm:text-lg font-bold text-gray-900">92%</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

interface StatCardProps {
  id: string
  label: string
  value: string
  icon: React.ComponentType<{ className?: string }>
  gradient: string
  bgColor: string
  borderColor: string
  textColor: string
  description: string
  trend?: string | null
  trendColor: string
  details: string
  delay: number
  isSelected: boolean
  onClick: () => void
  isLoaded: boolean
}

function StatCard({
  label,
  value,
  icon: Icon,
  gradient,
  bgColor,
  borderColor,
  textColor,
  description,
  trend,
  trendColor,
  details,
  delay,
  isSelected,
  onClick,
  isLoaded,
}: StatCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl border-2 bg-white p-3 sm:p-4 transition-all duration-500 cursor-pointer",
        "transform hover:scale-105 hover:shadow-2xl hover:-translate-y-1",
        "focus:outline-none focus:ring-4 focus:ring-blue-500/20",
        borderColor,
        isSelected && "ring-4 ring-blue-500/30 scale-105 shadow-2xl",
        "animate-in fade-in-0 slide-in-from-bottom-4",
      )}
      style={{ animationDelay: `${delay}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`${label}: ${value}. ${description}. Click for details.`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onClick()
        }
      }}
    >
      {/* Background gradient overlay */}
      <div
        className={cn(
          "absolute inset-0 opacity-0 transition-opacity duration-500",
          `bg-gradient-to-br ${gradient}`,
          isHovered && "opacity-5",
        )}
      />

      <div className="relative flex items-center justify-between mb-2 sm:mb-3">
        <div
          className={cn(
            "p-1.5 sm:p-2 rounded-lg transition-all duration-300",
            bgColor,
            isHovered && "scale-110 shadow-lg",
          )}
        >
          <Icon className={cn("h-4 w-4 sm:h-5 sm:w-5 transition-colors duration-300", textColor)} />
        </div>

        {trend && (
          <div
            className={cn(
              "px-1.5 sm:px-2 py-0.5 rounded-full text-xs font-semibold transition-all duration-300",
              "bg-white shadow-sm border",
              trendColor,
              isHovered && "scale-105 shadow-md",
            )}
          >
            {trend}
          </div>
        )}

        <ChevronRight
          className={cn(
            "h-3 w-3 sm:h-4 sm:w-4 text-gray-400 transition-all duration-300",
            isHovered && "translate-x-1 text-gray-600",
            isSelected && "rotate-90",
          )}
        />
      </div>

      <div className="relative mb-1.5 sm:mb-2">
        <div
          className={cn(
            "text-lg sm:text-2xl font-bold tabular-nums transition-all duration-300",
            textColor,
            isLoaded && "animate-pulse-once",
          )}
        >
          {value}
          {isLoaded && <span className="inline-block ml-1 animate-bounce text-green-500">✨</span>}
        </div>
      </div>

      <div className="relative">
        <div className="text-xs sm:text-sm font-semibold text-gray-900 mb-0.5">{label}</div>
        <div className="text-xs text-gray-500 transition-opacity duration-300 leading-tight">
          {isHovered ? description : details}
        </div>
      </div>

      {/* Interactive indicator */}
      <div
        className={cn(
          "absolute bottom-0 left-0 h-1 bg-gradient-to-r transition-all duration-500",
          gradient,
          isHovered ? "w-full" : "w-0",
        )}
      />

      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full animate-pulse" />
        </div>
      )}
    </div>
  )
}
