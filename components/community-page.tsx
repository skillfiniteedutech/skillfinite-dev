"use client"
import { useState } from "react"
import { Sidebar } from "./sidebar"
import { Header } from "./header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  Plus,
  Heart,
  MessageCircle,
  Share,
  Bookmark,
  TrendingUp,
  Users,
  Calendar,
  MapPin,
  MoreHorizontal,
} from "lucide-react"
import NoSSR from "./no-ssr"

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState("feed")

  const posts = [
    {
      id: 1,
      author: "Sarah Johnson",
      role: "Instructor",
      avatar: "/placeholder.svg?height=32&width=32",
      time: "2h ago",
      content:
        "Just finished creating a new React tutorial series! 🚀 It covers everything from basics to advanced patterns. What topics would you like to see covered next?",
      likes: 24,
      comments: 8,
      shares: 3,
      tags: ["React", "Tutorial", "JavaScript"],
    },
    {
      id: 2,
      author: "Mike Chen",
      role: "Student",
      avatar: "/placeholder.svg?height=32&width=32",
      time: "4h ago",
      content:
        "Looking for study partners for the upcoming UI/UX certification exam. Anyone interested in forming a study group? 📚",
      likes: 15,
      comments: 12,
      shares: 2,
      tags: ["StudyGroup", "UIUX", "Certification"],
    },
    {
      id: 3,
      author: "Emma Wilson",
      role: "Instructor",
      avatar: "/placeholder.svg?height=32&width=32",
      time: "6h ago",
      content:
        "Excited to announce our new Digital Marketing workshop series starting next week! Early bird registration is now open. Limited seats available! 🎯",
      likes: 31,
      comments: 5,
      shares: 7,
      tags: ["Marketing", "Workshop", "Registration"],
    },
  ]

  const studyGroups = [
    {
      id: 1,
      name: "React Developers",
      members: 156,
      description: "A community for React enthusiasts to share knowledge and collaborate",
      category: "Development",
      isJoined: true,
    },
    {
      id: 2,
      name: "UI/UX Designers",
      members: 89,
      description: "Design discussions, critiques, and resource sharing",
      category: "Design",
      isJoined: false,
    },
    {
      id: 3,
      name: "Data Science Hub",
      members: 203,
      description: "Python, R, machine learning, and data analysis discussions",
      category: "Data Science",
      isJoined: true,
    },
  ]

  const events = [
    {
      id: 1,
      title: "React Workshop: Advanced Patterns",
      date: "Jan 20, 2024",
      time: "2:00 PM",
      location: "Online",
      attendees: 45,
      category: "Workshop",
    },
    {
      id: 2,
      title: "Design System Meetup",
      date: "Jan 25, 2024",
      time: "6:00 PM",
      location: "Design Lab",
      attendees: 28,
      category: "Meetup",
    },
  ]

  return (
    <NoSSR>
      <div className="min-h-screen bg-gray-50">
        <Header />

        <main className="ml-44 p-4">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-bold text-gray-800">Community</h1>
              <p className="text-xs text-gray-600">Connect, share, and learn with fellow students</p>
            </div>
            <Button className="bg-purple-600 hover:bg-purple-700 text-xs h-6 px-3">
              <Plus className="w-3 h-3 mr-1" />
              Create Post
            </Button>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-4 mb-4 bg-white h-8">
              <TabsTrigger value="feed" className="text-xs px-2 py-1">
                Feed
              </TabsTrigger>
              <TabsTrigger value="groups" className="text-xs px-2 py-1">
                Groups
              </TabsTrigger>
              <TabsTrigger value="events" className="text-xs px-2 py-1">
                Events
              </TabsTrigger>
              <TabsTrigger value="trending" className="text-xs px-2 py-1">
                Trending
              </TabsTrigger>
            </TabsList>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
              {/* Main Content */}
              <div className="xl:col-span-3">
                <TabsContent value="feed" className="space-y-4">
                  {/* Create Post */}
                  <Card className="bg-white">
                    <CardContent className="p-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src="/placeholder.svg?height=32&width=32" />
                          <AvatarFallback className="text-xs">AN</AvatarFallback>
                        </Avatar>
                        <Input placeholder="Share your thoughts with the community..." className="flex-1 h-8 text-xs" />
                        <Button className="bg-purple-600 hover:bg-purple-700 text-xs h-6 px-3">Post</Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Posts */}
                  {posts.map((post) => (
                    <Card key={post.id} className="bg-white">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={post.avatar || "/placeholder.svg"} />
                            <AvatarFallback className="text-xs">{post.author[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <div>
                                <h4 className="text-sm font-medium text-gray-800">{post.author}</h4>
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline" className="text-[9px] px-1 py-0">
                                    {post.role}
                                  </Badge>
                                  <span className="text-[10px] text-gray-500">{post.time}</span>
                                </div>
                              </div>
                              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                <MoreHorizontal className="w-3 h-3" />
                              </Button>
                            </div>

                            <p className="text-xs text-gray-700 mb-2">{post.content}</p>

                            <div className="flex flex-wrap gap-1 mb-3">
                              {post.tags.map((tag, index) => (
                                <Badge
                                  key={index}
                                  variant="secondary"
                                  className="text-[9px] px-1 py-0 bg-purple-100 text-purple-700"
                                >
                                  #{tag}
                                </Badge>
                              ))}
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                              <div className="flex items-center gap-4">
                                <Button variant="ghost" size="sm" className="h-6 px-2 text-xs text-gray-600">
                                  <Heart className="w-3 h-3 mr-1" />
                                  {post.likes}
                                </Button>
                                <Button variant="ghost" size="sm" className="h-6 px-2 text-xs text-gray-600">
                                  <MessageCircle className="w-3 h-3 mr-1" />
                                  {post.comments}
                                </Button>
                                <Button variant="ghost" size="sm" className="h-6 px-2 text-xs text-gray-600">
                                  <Share className="w-3 h-3 mr-1" />
                                  {post.shares}
                                </Button>
                              </div>
                              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                <Bookmark className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>

                <TabsContent value="groups" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {studyGroups.map((group) => (
                      <Card key={group.id} className="bg-white">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="text-sm font-semibold text-gray-800">{group.name}</h3>
                              <Badge variant="outline" className="text-[9px] px-1 py-0 mt-1">
                                {group.category}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-gray-600">
                              <Users className="w-3 h-3" />
                              {group.members}
                            </div>
                          </div>
                          <p className="text-xs text-gray-600 mb-3">{group.description}</p>
                          <Button
                            variant={group.isJoined ? "outline" : "default"}
                            size="sm"
                            className={`w-full h-6 text-xs ${group.isJoined ? "bg-transparent" : "bg-purple-600 hover:bg-purple-700"
                              }`}
                          >
                            {group.isJoined ? "Joined" : "Join Group"}
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="events" className="space-y-4">
                  {events.map((event) => (
                    <Card key={event.id} className="bg-white">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-sm font-semibold text-gray-800 mb-1">{event.title}</h3>
                            <div className="space-y-1 mb-3">
                              <div className="flex items-center gap-2 text-xs text-gray-600">
                                <Calendar className="w-3 h-3" />
                                <span>
                                  {event.date} at {event.time}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-gray-600">
                                <MapPin className="w-3 h-3" />
                                <span>{event.location}</span>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-gray-600">
                                <Users className="w-3 h-3" />
                                <span>{event.attendees} attending</span>
                              </div>
                            </div>
                            <Badge variant="secondary" className="text-[9px] px-1 py-0">
                              {event.category}
                            </Badge>
                          </div>
                          <Button className="bg-purple-600 hover:bg-purple-700 text-xs h-6 px-3">Join Event</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>

                <TabsContent value="trending" className="space-y-4">
                  <Card className="bg-white">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-semibold flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        Trending Topics
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-3">
                      <div className="space-y-2">
                        {["#ReactHooks", "#UIUXTrends", "#PythonTips", "#WebDevelopment", "#DesignSystems"].map(
                          (topic, index) => (
                            <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                              <span className="text-xs font-medium text-purple-600">{topic}</span>
                              <span className="text-[10px] text-gray-500">
                                {Math.floor(Math.random() * 100) + 50} posts
                              </span>
                            </div>
                          ),
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </div>

              {/* Sidebar */}
              <div className="space-y-4">
                {/* Search */}
                <Card className="bg-white">
                  <CardContent className="p-3">
                    <div className="relative">
                      <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3" />
                      <Input placeholder="Search community..." className="pl-7 h-7 text-xs" />
                    </div>
                  </CardContent>
                </Card>

                {/* Active Groups */}
                <Card className="bg-white">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-semibold">Your Groups</CardTitle>
                  </CardHeader>
                  <CardContent className="p-3">
                    <div className="space-y-2">
                      {studyGroups
                        .filter((g) => g.isJoined)
                        .map((group) => (
                          <div key={group.id} className="flex items-center gap-2 p-1 hover:bg-gray-50 rounded">
                            <div className="w-6 h-6 bg-purple-100 rounded flex items-center justify-center">
                              <span className="text-[8px] font-bold text-purple-600">{group.name[0]}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-gray-800 truncate">{group.name}</p>
                              <p className="text-[10px] text-gray-500">{group.members} members</p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Suggested Connections */}
                <Card className="bg-white">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-semibold">Suggested Connections</CardTitle>
                  </CardHeader>
                  <CardContent className="p-3">
                    <div className="space-y-2">
                      {["Alex Rodriguez", "Lisa Park", "David Kim"].map((name, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Avatar className="w-6 h-6">
                            <AvatarImage src="/placeholder.svg?height=24&width=24" />
                            <AvatarFallback className="text-[8px]">{name[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-gray-800">{name}</p>
                            <p className="text-[10px] text-gray-500">Student</p>
                          </div>
                          <Button variant="outline" size="sm" className="h-5 text-[9px] px-1 bg-transparent">
                            Connect
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </Tabs>
        </main>
      </div>
    </NoSSR>
  )
}
