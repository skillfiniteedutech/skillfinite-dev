"use client"
import NoSSR from "./no-ssr"
import { useState } from "react"
import { Sidebar } from "./sidebar"
import { Header } from "./header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Send, Paperclip, Smile, Phone, Video, MoreVertical, Star } from "lucide-react"

export default function MessagesPage() {
  const [selectedChat, setSelectedChat] = useState(0)
  const [message, setMessage] = useState("")

  const conversations = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Instructor",
      avatar: "/placeholder.svg?height=32&width=32",
      lastMessage: "Great work on your React assignment! Keep it up.",
      time: "2m ago",
      unread: 2,
      online: true,
    },
    {
      id: 2,
      name: "Study Group - UI/UX",
      role: "Group Chat",
      avatar: "/placeholder.svg?height=32&width=32",
      lastMessage: "Mike: Anyone free for the design review tomorrow?",
      time: "15m ago",
      unread: 5,
      online: false,
    },
    {
      id: 3,
      name: "Mike Chen",
      role: "Student",
      avatar: "/placeholder.svg?height=32&width=32",
      lastMessage: "Thanks for sharing the Figma resources!",
      time: "1h ago",
      unread: 0,
      online: true,
    },
    {
      id: 4,
      name: "Emma Wilson",
      role: "Instructor",
      avatar: "/placeholder.svg?height=32&width=32",
      lastMessage: "Your marketing presentation was excellent.",
      time: "3h ago",
      unread: 0,
      online: false,
    },
    {
      id: 5,
      name: "Alex Rodriguez",
      role: "Student",
      avatar: "/placeholder.svg?height=32&width=32",
      lastMessage: "Can you help me with the Python exercise?",
      time: "1d ago",
      unread: 1,
      online: false,
    },
  ]

  const messages = [
    {
      id: 1,
      sender: "Sarah Johnson",
      content: "Hi Anna! I've reviewed your React assignment and I'm really impressed with your progress.",
      time: "10:30 AM",
      isOwn: false,
    },
    {
      id: 2,
      sender: "You",
      content: "Thank you so much! I really enjoyed working on the hooks section.",
      time: "10:32 AM",
      isOwn: true,
    },
    {
      id: 3,
      sender: "Sarah Johnson",
      content:
        "That's great to hear! Your implementation of useEffect was particularly well done. Have you started working on the context API section yet?",
      time: "10:35 AM",
      isOwn: false,
    },
    {
      id: 4,
      sender: "You",
      content: "I'm planning to start that this evening. Do you have any specific resources you'd recommend?",
      time: "10:37 AM",
      isOwn: true,
    },
    {
      id: 5,
      sender: "Sarah Johnson",
      content: "Great work on your React assignment! Keep it up.",
      time: "10:40 AM",
      isOwn: false,
    },
  ]

  return (
    <NoSSR>
      <div className="min-h-screen bg-gray-50">
        {/* <Sidebar /> */}
        <Header />

        <main className="ml-44 p-4">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-bold text-gray-800">Messages</h1>
              <p className="text-xs text-gray-600">Connect with instructors and classmates</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[calc(100vh-200px)]">
            {/* Conversations List */}
            <div className="lg:col-span-1">
              <Card className="bg-white h-full">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-semibold">Conversations</CardTitle>
                    <Button variant="outline" size="sm" className="h-6 w-6 p-0 bg-transparent">
                      <MoreVertical className="w-3 h-3" />
                    </Button>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3" />
                    <Input placeholder="Search messages..." className="pl-7 h-7 text-xs" />
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="space-y-0">
                    {conversations.map((conversation, index) => (
                      <div
                        key={conversation.id}
                        className={`p-3 cursor-pointer hover:bg-gray-50 border-b border-gray-100 ${selectedChat === index ? "bg-purple-50 border-r-2 border-r-purple-500" : ""
                          }`}
                        onClick={() => setSelectedChat(index)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={conversation.avatar || "/placeholder.svg"} />
                              <AvatarFallback className="text-xs">{conversation.name[0]}</AvatarFallback>
                            </Avatar>
                            {conversation.online && (
                              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border border-white" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-0.5">
                              <h4 className="text-xs font-medium text-gray-800 truncate">{conversation.name}</h4>
                              <span className="text-[10px] text-gray-500">{conversation.time}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <p className="text-[10px] text-gray-600 truncate">{conversation.lastMessage}</p>
                              {conversation.unread > 0 && (
                                <Badge className="bg-purple-500 text-white text-[8px] px-1 py-0 min-w-[16px] h-4">
                                  {conversation.unread}
                                </Badge>
                              )}
                            </div>
                            <Badge variant="outline" className="text-[8px] px-1 py-0 mt-0.5">
                              {conversation.role}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Chat Area */}
            <div className="lg:col-span-2">
              <Card className="bg-white h-full flex flex-col">
                {/* Chat Header */}
                <CardHeader className="pb-2 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={conversations[selectedChat]?.avatar || "/placeholder.svg"} />
                          <AvatarFallback className="text-xs">{conversations[selectedChat]?.name[0]}</AvatarFallback>
                        </Avatar>
                        {conversations[selectedChat]?.online && (
                          <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border border-white" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-gray-800">{conversations[selectedChat]?.name}</h3>
                        <p className="text-[10px] text-gray-600">
                          {conversations[selectedChat]?.online ? "Online" : "Last seen 2h ago"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="outline" size="sm" className="h-6 w-6 p-0 bg-transparent">
                        <Phone className="w-3 h-3" />
                      </Button>
                      <Button variant="outline" size="sm" className="h-6 w-6 p-0 bg-transparent">
                        <Video className="w-3 h-3" />
                      </Button>
                      <Button variant="outline" size="sm" className="h-6 w-6 p-0 bg-transparent">
                        <Star className="w-3 h-3" />
                      </Button>
                      <Button variant="outline" size="sm" className="h-6 w-6 p-0 bg-transparent">
                        <MoreVertical className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                {/* Messages */}
                <CardContent className="flex-1 p-3 overflow-y-auto">
                  <div className="space-y-3">
                    {messages.map((msg, index) => (
                      <div key={msg.id} className={`flex ${msg.isOwn ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-xs lg:max-w-md ${msg.isOwn ? "order-2" : "order-1"}`}>
                          <div
                            className={`p-2 rounded-lg ${msg.isOwn ? "bg-purple-500 text-white" : "bg-gray-100 text-gray-800"
                              }`}
                          >
                            <p className="text-xs">{msg.content}</p>
                          </div>
                          <p className={`text-[10px] text-gray-500 mt-1 ${msg.isOwn ? "text-right" : "text-left"}`}>
                            {msg.time}
                          </p>
                        </div>
                        {!msg.isOwn && (
                          <Avatar className="w-6 h-6 order-1 mr-2">
                            <AvatarImage src={conversations[selectedChat]?.avatar || "/placeholder.svg"} />
                            <AvatarFallback className="text-[8px]">{conversations[selectedChat]?.name[0]}</AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>

                {/* Message Input */}
                <div className="p-3 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="h-7 w-7 p-0 bg-transparent">
                      <Paperclip className="w-3 h-3" />
                    </Button>
                    <div className="flex-1 relative">
                      <Input
                        placeholder="Type a message..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="pr-8 h-7 text-xs"
                      />
                      <Button variant="ghost" size="sm" className="absolute right-1 top-0.5 h-6 w-6 p-0">
                        <Smile className="w-3 h-3" />
                      </Button>
                    </div>
                    <Button className="bg-purple-600 hover:bg-purple-700 h-7 w-7 p-0">
                      <Send className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </NoSSR>
  )
}
