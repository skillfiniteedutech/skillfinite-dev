"use client"
import { useState } from "react"
import { Sidebar } from "./sidebar"
import { Header } from "./header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, BookOpen, Clock, Award, Target } from "lucide-react"

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("7d")

  const stats = [
    { title: "Total Study Time", value: "47h 32m", change: "+12%", trend: "up", icon: Clock },
    { title: "Courses Completed", value: "8", change: "+3", trend: "up", icon: BookOpen },
    { title: "Average Score", value: "87%", change: "+5%", trend: "up", icon: Target },
    { title: "Certificates Earned", value: "5", change: "+2", trend: "up", icon: Award },
  ]

  const weeklyActivity = [
    { day: "Mon", hours: 3.5, completed: 2 },
    { day: "Tue", hours: 2.8, completed: 1 },
    { day: "Wed", hours: 4.2, completed: 3 },
    { day: "Thu", hours: 1.5, completed: 1 },
    { day: "Fri", hours: 5.1, completed: 4 },
    { day: "Sat", hours: 3.8, completed: 2 },
    { day: "Sun", hours: 2.2, completed: 1 },
  ]

  const courseProgress = [
    { name: "React Development", progress: 85, timeSpent: "12h 30m", status: "In Progress" },
    { name: "UI/UX Design", progress: 100, timeSpent: "8h 45m", status: "Completed" },
    { name: "Python Basics", progress: 45, timeSpent: "6h 15m", status: "In Progress" },
    { name: "Digital Marketing", progress: 100, timeSpent: "10h 20m", status: "Completed" },
  ]

  const skillsData = [
    { skill: "Frontend Development", level: 85, color: "bg-blue-500" },
    { skill: "UI/UX Design", level: 78, color: "bg-purple-500" },
    { skill: "Data Analysis", level: 62, color: "bg-green-500" },
    { skill: "Digital Marketing", level: 71, color: "bg-orange-500" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Header />

      <main className="ml-44 p-4">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Analytics</h1>
            <p className="text-xs text-gray-600">Track your learning progress and performance</p>
          </div>
          <div className="flex gap-2">
            {["7d", "30d", "90d", "1y"].map((range) => (
              <Button
                key={range}
                variant={timeRange === range ? "default" : "outline"}
                size="sm"
                className={`h-6 text-xs px-2 ${timeRange === range ? "bg-purple-600 hover:bg-purple-700" : "bg-transparent"
                  }`}
                onClick={() => setTimeRange(range)}
              >
                {range}
              </Button>
            ))}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-white">
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-lg font-bold text-gray-800">{stat.value}</p>
                    <div className="flex items-center gap-1 mt-1">
                      {stat.trend === "up" ? (
                        <TrendingUp className="w-2.5 h-2.5 text-green-500" />
                      ) : (
                        <TrendingDown className="w-2.5 h-2.5 text-red-500" />
                      )}
                      <span className={`text-xs ${stat.trend === "up" ? "text-green-500" : "text-red-500"}`}>
                        {stat.change}
                      </span>
                    </div>
                  </div>
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <stat.icon className="w-4 h-4 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          {/* Left Column - 2/3 width */}
          <div className="xl:col-span-2 space-y-4">
            {/* Weekly Activity Chart */}
            <Card className="bg-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">Weekly Activity</CardTitle>
              </CardHeader>
              <CardContent className="p-3">
                <div className="h-32 flex items-end justify-between gap-2">
                  {weeklyActivity.map((day, index) => (
                    <div key={index} className="flex flex-col items-center gap-1 flex-1">
                      <div className="text-xs text-gray-600">{day.completed}</div>
                      <div
                        className="w-full bg-purple-500 rounded-t"
                        style={{ height: `${(day.hours / 6) * 100}%`, minHeight: "8px" }}
                      />
                      <div className="text-xs text-gray-500">{day.day}</div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>Hours studied</span>
                  <span>Tasks completed</span>
                </div>
              </CardContent>
            </Card>

            {/* Course Progress */}
            <Card className="bg-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">Course Progress</CardTitle>
              </CardHeader>
              <CardContent className="p-3">
                <div className="space-y-3">
                  {courseProgress.map((course, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-xs font-medium text-gray-800">{course.name}</h4>
                          <Badge
                            variant={course.status === "Completed" ? "default" : "secondary"}
                            className={`text-[10px] px-1.5 py-0 ${course.status === "Completed" ? "bg-green-500" : "bg-gray-200 text-gray-700"
                              }`}
                          >
                            {course.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 mb-1">
                          <Progress value={course.progress} className="flex-1 h-1.5" />
                          <span className="text-xs text-gray-600">{course.progress}%</span>
                        </div>
                        <p className="text-[10px] text-gray-500">{course.timeSpent} spent</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - 1/3 width */}
          <div className="space-y-4">
            {/* Skills Overview */}
            <Card className="bg-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">Skills Overview</CardTitle>
              </CardHeader>
              <CardContent className="p-3">
                <div className="space-y-3">
                  {skillsData.map((skill, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-700">{skill.skill}</span>
                        <span className="text-xs text-gray-600">{skill.level}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div
                          className={`${skill.color} h-1.5 rounded-full transition-all duration-300`}
                          style={{ width: `${skill.level}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Learning Goals */}
            <Card className="bg-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">Learning Goals</CardTitle>
              </CardHeader>
              <CardContent className="p-3">
                <div className="space-y-3">
                  <div className="p-2 bg-purple-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Target className="w-3 h-3 text-purple-600" />
                      <span className="text-xs font-medium">Complete 3 courses</span>
                    </div>
                    <Progress value={67} className="h-1.5 mb-1" />
                    <p className="text-[10px] text-gray-600">2 of 3 completed</p>
                  </div>
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="w-3 h-3 text-blue-600" />
                      <span className="text-xs font-medium">Study 50 hours</span>
                    </div>
                    <Progress value={85} className="h-1.5 mb-1" />
                    <p className="text-[10px] text-gray-600">42.5 of 50 hours</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
