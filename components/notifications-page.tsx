"use client"
import { useState } from "react"
import { Sidebar } from "./sidebar"
import { Header } from "./header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, Check, X, Clock, BookOpen, Users, Award, MessageCircle, Calendar } from "lucide-react"

export default function NotificationsPage() {
  const [filter, setFilter] = useState("all")

  const notifications = [
    {
      id: 1,
      type: "course",
      title: "New lesson available",
      message: "React Advanced Patterns - Lesson 5 is now available",
      time: "2 minutes ago",
      read: false,
      icon: BookOpen,
      color: "bg-blue-500",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: 2,
      type: "assignment",
      title: "Assignment due soon",
      message: "UI/UX Design Project is due in 2 hours",
      time: "1 hour ago",
      read: false,
      icon: Clock,
      color: "bg-red-500",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: 3,
      type: "message",
      title: "New message from Sarah Johnson",
      message: "Great work on your React assignment! Keep it up.",
      time: "3 hours ago",
      read: true,
      icon: MessageCircle,
      color: "bg-green-500",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: 4,
      type: "achievement",
      title: "Certificate earned!",
      message: "You've completed the JavaScript Fundamentals course",
      time: "1 day ago",
      read: true,
      icon: Award,
      color: "bg-yellow-500",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: 5,
      type: "community",
      title: "New study group invitation",
      message: "You've been invited to join 'React Developers' study group",
      time: "2 days ago",
      read: false,
      icon: Users,
      color: "bg-purple-500",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: 6,
      type: "schedule",
      title: "Upcoming live session",
      message: "React Workshop starts in 30 minutes",
      time: "3 days ago",
      read: true,
      icon: Calendar,
      color: "bg-orange-500",
      avatar: "/placeholder.svg?height=32&width=32",
    },
  ]

  const filteredNotifications = notifications.filter((notification) => {
    if (filter === "all") return true
    if (filter === "unread") return !notification.read
    return notification.type === filter
  })

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Header />

      <main className="ml-44 p-4">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Notifications</h1>
            <p className="text-xs text-gray-600">
              Stay updated with your learning progress and activities
              {unreadCount > 0 && (
                <Badge className="ml-2 bg-red-500 text-white text-[9px] px-1 py-0">{unreadCount} unread</Badge>
              )}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="h-6 text-xs px-2 bg-transparent">
              <Check className="w-3 h-3 mr-1" />
              Mark all read
            </Button>
            <Button variant="outline" size="sm" className="h-6 text-xs px-2 bg-transparent">
              Settings
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
          {/* Main Content */}
          <div className="xl:col-span-3">
            <Tabs value={filter} onValueChange={setFilter} className="w-full">
              <TabsList className="grid w-full max-w-2xl grid-cols-6 mb-4 bg-white h-8">
                <TabsTrigger value="all" className="text-xs px-2 py-1">
                  All ({notifications.length})
                </TabsTrigger>
                <TabsTrigger value="unread" className="text-xs px-2 py-1">
                  Unread ({unreadCount})
                </TabsTrigger>
                <TabsTrigger value="course" className="text-xs px-2 py-1">
                  Courses
                </TabsTrigger>
                <TabsTrigger value="message" className="text-xs px-2 py-1">
                  Messages
                </TabsTrigger>
                <TabsTrigger value="assignment" className="text-xs px-2 py-1">
                  Tasks
                </TabsTrigger>
                <TabsTrigger value="achievement" className="text-xs px-2 py-1">
                  Awards
                </TabsTrigger>
              </TabsList>

              <TabsContent value={filter} className="space-y-2">
                {filteredNotifications.length === 0 ? (
                  <Card className="bg-white">
                    <CardContent className="p-8 text-center">
                      <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <h3 className="text-sm font-semibold text-gray-600 mb-1">No notifications</h3>
                      <p className="text-xs text-gray-500">You're all caught up!</p>
                    </CardContent>
                  </Card>
                ) : (
                  filteredNotifications.map((notification) => (
                    <Card
                      key={notification.id}
                      className={`bg-white hover:shadow-md transition-shadow cursor-pointer ${!notification.read ? "border-l-4 border-l-purple-500" : ""
                        }`}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-start gap-3">
                          <div className={`${notification.color} rounded-full p-1.5 flex-shrink-0`}>
                            <notification.icon className="w-3 h-3 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-1">
                              <h4
                                className={`text-xs font-medium ${!notification.read ? "text-gray-800" : "text-gray-600"
                                  }`}
                              >
                                {notification.title}
                              </h4>
                              <div className="flex items-center gap-1 ml-2">
                                <span className="text-[10px] text-gray-500 whitespace-nowrap">{notification.time}</span>
                                {!notification.read && (
                                  <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0" />
                                )}
                              </div>
                            </div>
                            <p className="text-[10px] text-gray-600 mb-2">{notification.message}</p>
                            <div className="flex items-center gap-2">
                              <Badge
                                variant="outline"
                                className="text-[8px] px-1 py-0 capitalize"
                                style={{ borderColor: notification.color.replace("bg-", "border-") }}
                              >
                                {notification.type}
                              </Badge>
                              <div className="flex gap-1 ml-auto">
                                {!notification.read && (
                                  <Button variant="ghost" size="sm" className="h-5 w-5 p-0">
                                    <Check className="w-2.5 h-2.5" />
                                  </Button>
                                )}
                                <Button variant="ghost" size="sm" className="h-5 w-5 p-0">
                                  <X className="w-2.5 h-2.5" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Quick Stats */}
            <Card className="bg-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">Notification Summary</CardTitle>
              </CardHeader>
              <CardContent className="p-3">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>Total:</span>
                    <span className="font-medium">{notifications.length}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Unread:</span>
                    <span className="font-medium text-red-600">{unreadCount}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>This week:</span>
                    <span className="font-medium">
                      {notifications.filter((n) => n.time.includes("day")).length + 3}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notification Types */}
            <Card className="bg-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">Categories</CardTitle>
              </CardHeader>
              <CardContent className="p-3">
                <div className="space-y-2">
                  {[
                    { type: "course", label: "Courses", count: 2, color: "bg-blue-500" },
                    { type: "assignment", label: "Assignments", count: 1, color: "bg-red-500" },
                    { type: "message", label: "Messages", count: 1, color: "bg-green-500" },
                    { type: "achievement", label: "Achievements", count: 1, color: "bg-yellow-500" },
                    { type: "community", label: "Community", count: 1, color: "bg-purple-500" },
                  ].map((category) => (
                    <div key={category.type} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 ${category.color} rounded-full`} />
                        <span className="text-xs text-gray-700">{category.label}</span>
                      </div>
                      <span className="text-xs text-gray-500">{category.count}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="p-3">
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full h-6 text-xs bg-transparent">
                    Notification Settings
                  </Button>
                  <Button variant="outline" size="sm" className="w-full h-6 text-xs bg-transparent">
                    Clear All
                  </Button>
                  <Button variant="outline" size="sm" className="w-full h-6 text-xs bg-transparent">
                    Export History
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
