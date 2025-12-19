"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import UdemyNavbar from "@/components/UdemyNavbar"
import Footer from "@/components/Footer"
import { useAuth } from "@/components/auth-context"
import { MessageCircle, Send, Users, Smile } from "lucide-react"
import io from 'socket.io-client'

export default function CommunityPage() {
  const router = useRouter()
  const { user, isAuthenticated, token } = useAuth()
  const [mounted, setMounted] = useState(false)

  // Chat state
  const [socket, setSocket] = useState<any>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [onlineUsers, setOnlineUsers] = useState<any[]>([])
  const [chatMessage, setChatMessage] = useState("")
  const [typingUsers, setTypingUsers] = useState<string[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Initialize socket connection
  useEffect(() => {
    if (isAuthenticated && token) {
      const newSocket = io('https://skillfinite-backend-47sd.onrender.com', {
        auth: {
          token: token
        }
      })

      newSocket.on('connect', () => {
        console.log('Connected to chat server')
        setSocket(newSocket)
      })

      newSocket.on('new_message', (message) => {
        setMessages(prev => [...prev, message])
        scrollToBottom()
      })

      newSocket.on('online_users', (users) => {
        setOnlineUsers(users)
      })

      newSocket.on('user_joined', (data) => {
        console.log('User joined:', data.user.name)
      })

      newSocket.on('user_left', (data) => {
        console.log('User left:', data.user.name)
      })

      newSocket.on('user_typing', (data) => {
        if (data.isTyping) {
          setTypingUsers(prev => [...prev.filter(name => name !== data.user.name), data.user.name])
        } else {
          setTypingUsers(prev => prev.filter(name => name !== data.user.name))
        }
      })

      newSocket.on('recent_messages', (recentMessages) => {
        setMessages(recentMessages)
        scrollToBottom()
      })

      newSocket.on('error', (error) => {
        console.error('Socket error:', error)
      })

      return () => {
        newSocket.disconnect()
      }
    }
  }, [isAuthenticated, token])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = () => {
    if (!chatMessage.trim() || !socket) return

    socket.emit('send_message', {
      content: chatMessage,
      room: 'global'
    })
    setChatMessage("")
  }

  const handleTyping = (isTyping: boolean) => {
    if (!socket) return

    socket.emit('typing', {
      isTyping,
      room: 'global'
    })
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please log in to access the community</h1>
          <Button onClick={() => router.push('/login')}>Login</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950">
      <UdemyNavbar />

      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Community
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Connect with fellow learners and share knowledge
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-4">Welcome to the Community!</h2>
                  <p className="text-slate-600 dark:text-slate-400 mb-4">
                    This is where you can connect with other learners, share your progress, and get help from the community.
                  </p>
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <h3 className="font-semibold text-blue-900 dark:text-blue-100">Share Your Learning Journey</h3>
                      <p className="text-sm text-blue-700 dark:text-blue-300">Post updates about your courses and projects</p>
                    </div>
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <h3 className="font-semibold text-green-900 dark:text-green-100">Get Help & Support</h3>
                      <p className="text-sm text-green-700 dark:text-green-300">Ask questions and get answers from the community</p>
                    </div>
                    <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <h3 className="font-semibold text-purple-900 dark:text-purple-100">Connect with Peers</h3>
                      <p className="text-sm text-purple-700 dark:text-purple-300">Find study partners and form learning groups</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Community Posts */}
              <Card>
                <CardHeader>
                  <h3 className="text-xl font-bold">Recent Community Activity</h3>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-3 mb-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>JD</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold">John Doe</p>
                          <p className="text-sm text-slate-500">2 hours ago</p>
                        </div>
                      </div>
                      <p className="text-slate-700 dark:text-slate-300">
                        Just completed the React course! 🎉 The hands-on projects really helped me understand the concepts better.
                      </p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-3 mb-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>SM</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold">Sarah Miller</p>
                          <p className="text-sm text-slate-500">4 hours ago</p>
                        </div>
                      </div>
                      <p className="text-slate-700 dark:text-slate-300">
                        Looking for a study partner for the JavaScript course. Anyone interested in forming a study group?
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              {/* Live Chat */}
              <Card className="h-[600px] flex flex-col">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MessageCircle className="h-5 w-5" />
                      <h3 className="font-bold text-lg">Live Chat</h3>
                    </div>
                    <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full">
                      <Users className="h-4 w-4" />
                      <span className="text-sm font-medium">{onlineUsers.length} online</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col p-0">
                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50 dark:bg-slate-900/50">
                    {messages.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-center">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-4">
                          <MessageCircle className="w-6 h-6 text-white" />
                        </div>
                        <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Welcome to Live Chat!</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Start a conversation with the community
                        </p>
                      </div>
                    ) : (
                      messages.map((message, index) => (
                        <div key={index} className={`flex ${message.sender?.id === user?.id ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[80%] ${message.sender?.id === user?.id ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700'} rounded-2xl p-3 shadow-sm`}>
                            <div className="flex items-center gap-2 mb-1">
                              <Avatar className="h-5 w-5">
                                <AvatarImage src={message.sender?.avatar} />
                                <AvatarFallback className="text-xs">
                                  {message.sender?.name?.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-xs font-semibold">{message.sender?.name}</span>
                            </div>
                            <p className="text-sm">{message.content}</p>
                            <span className="text-xs opacity-70">
                              {new Date(message.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                    {typingUsers.length > 0 && (
                      <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 italic">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                        <span>{typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...</span>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Chat Input */}
                  <div className="p-4 border-t bg-white dark:bg-slate-800">
                    <div className="flex gap-2">
                      <div className="flex-1 relative">
                        <Input
                          value={chatMessage}
                          onChange={(e) => {
                            setChatMessage(e.target.value)
                            handleTyping(e.target.value.length > 0)
                          }}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault()
                              handleSendMessage()
                            }
                          }}
                          placeholder="Type a message..."
                          className="pr-10"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                        >
                          <Smile className="h-4 w-4" />
                        </Button>
                      </div>
                      <Button
                        onClick={handleSendMessage}
                        disabled={!chatMessage.trim()}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-4">Quick Stats</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Active Members</span>
                      <span className="font-semibold">2,456</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Posts Today</span>
                      <span className="font-semibold">156</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Study Groups</span>
                      <span className="font-semibold">89</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Get Started */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-4">Get Started</h3>
                  <div className="space-y-3">
                    <Button className="w-full justify-start">
                      Create Your First Post
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      Join a Study Group
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      Browse Discussions
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}