"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Search, Send, MoreVertical, Phone, Video, Paperclip, Smile } from "lucide-react"

interface Message {
  id: string
  senderId: string
  senderName: string
  content: string
  timestamp: Date
  isOwn: boolean
}

interface Conversation {
  id: string
  name: string
  avatar?: string
  lastMessage: string
  timestamp: string
  unread: number
  online: boolean
}

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState<string | null>("1")
  const [messageInput, setMessageInput] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  const conversations: Conversation[] = [
    {
      id: "1",
      name: "Sarah Johnson",
      avatar: "/placeholder-user.jpg",
      lastMessage: "Thanks for the help with the project!",
      timestamp: "2m ago",
      unread: 2,
      online: true,
    },
    {
      id: "2",
      name: "Mike Chen",
      avatar: "/placeholder-user.jpg",
      lastMessage: "Can we schedule a meeting?",
      timestamp: "1h ago",
      unread: 0,
      online: true,
    },
    {
      id: "3",
      name: "Emily Davis",
      avatar: "/placeholder-user.jpg",
      lastMessage: "Great work on the presentation!",
      timestamp: "3h ago",
      unread: 1,
      online: false,
    },
    {
      id: "4",
      name: "John Smith",
      avatar: "/placeholder-user.jpg",
      lastMessage: "See you tomorrow",
      timestamp: "1d ago",
      unread: 0,
      online: false,
    },
    {
      id: "5",
      name: "Lisa Anderson",
      avatar: "/placeholder-user.jpg",
      lastMessage: "The files are ready for review",
      timestamp: "2d ago",
      unread: 0,
      online: true,
    },
  ]

  const messages: Message[] = [
    {
      id: "1",
      senderId: "1",
      senderName: "Sarah Johnson",
      content: "Hey! How are you doing?",
      timestamp: new Date(Date.now() - 3600000),
      isOwn: false,
    },
    {
      id: "2",
      senderId: "me",
      senderName: "You",
      content: "I'm doing great! How about you?",
      timestamp: new Date(Date.now() - 3500000),
      isOwn: true,
    },
    {
      id: "3",
      senderId: "1",
      senderName: "Sarah Johnson",
      content: "I'm good! I wanted to ask about the project deadline.",
      timestamp: new Date(Date.now() - 3400000),
      isOwn: false,
    },
    {
      id: "4",
      senderId: "me",
      senderName: "You",
      content: "The deadline is next Friday. We're on track to finish on time.",
      timestamp: new Date(Date.now() - 3300000),
      isOwn: true,
    },
    {
      id: "5",
      senderId: "1",
      senderName: "Sarah Johnson",
      content: "Thanks for the help with the project!",
      timestamp: new Date(Date.now() - 120000),
      isOwn: false,
    },
  ]

  const handleSendMessage = () => {
    if (!messageInput.trim()) return
    // Add message logic here
    setMessageInput("")
  }

  const filteredConversations = conversations.filter((conv) =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const selectedConv = conversations.find((c) => c.id === selectedConversation)

  return (
    <SidebarInset className="flex-1 flex flex-col h-screen">
      {/* Header */}
      <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border bg-background">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/mycourses" className="text-muted-foreground hover:text-foreground">
                  My Learning
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-foreground">Messages</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Conversations List */}
        <aside className="w-80 border-r border-border bg-background overflow-auto">
          <div className="p-6 border-b border-border">
            <h2 className="text-lg font-bold text-foreground mb-4">Messages</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-background border-border"
              />
            </div>
          </div>

          <div>
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => setSelectedConversation(conversation.id)}
                className={`px-6 py-4 cursor-pointer transition-colors hover:bg-muted/50 border-b border-border ${selectedConversation === conversation.id ? "bg-muted" : ""
                  }`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={conversation.avatar} alt={conversation.name} />
                      <AvatarFallback className="bg-muted text-foreground">{conversation.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {conversation.online && (
                      <div className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-green-500 rounded-full border-2 border-background" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <h3 className="font-semibold text-sm text-foreground truncate">
                        {conversation.name}
                      </h3>
                      <span className="text-xs text-muted-foreground ml-2">{conversation.timestamp}</span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs text-muted-foreground truncate flex-1">{conversation.lastMessage}</p>
                      {conversation.unread > 0 && (
                        <Badge className="h-5 min-w-[20px] flex items-center justify-center bg-primary text-primary-foreground text-xs px-1.5">
                          {conversation.unread}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Chat Area */}
        <main className="flex-1 flex flex-col bg-background">
          {selectedConv ? (
            <>
              {/* Chat Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-background">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={selectedConv.avatar} alt={selectedConv.name} />
                      <AvatarFallback className="bg-muted text-foreground">{selectedConv.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {selectedConv.online && (
                      <div className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-green-500 rounded-full border-2 border-background" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-foreground">{selectedConv.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {selectedConv.online ? "Active now" : "Offline"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-9 w-9">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-9 w-9">
                    <Video className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-9 w-9">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-auto px-6 py-4 space-y-3">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isOwn ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`flex gap-2 max-w-[75%] ${message.isOwn ? "flex-row-reverse" : ""}`}>
                      {!message.isOwn && (
                        <Avatar className="h-8 w-8 flex-shrink-0">
                          <AvatarImage src={selectedConv.avatar} alt={message.senderName} />
                          <AvatarFallback className="bg-muted text-foreground text-xs">{message.senderName.charAt(0)}</AvatarFallback>
                        </Avatar>
                      )}
                      <div className="flex flex-col gap-1">
                        <div
                          className={`rounded-2xl px-4 py-2 ${message.isOwn
                            ? "bg-primary text-primary-foreground rounded-br-sm"
                            : "bg-muted text-foreground rounded-bl-sm"
                            }`}
                        >
                          <p className="text-sm leading-relaxed">{message.content}</p>
                        </div>
                        <p className={`text-[10px] text-muted-foreground px-1 ${message.isOwn ? "text-right" : ""}`}>
                          {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="px-6 py-4 border-t border-border bg-background">
                <div className="flex items-center gap-3">
                  <Button variant="ghost" size="icon" className="h-9 w-9 flex-shrink-0">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Input
                    placeholder="Type a message..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    className="flex-1 bg-background border-border h-10"
                  />
                  <Button variant="ghost" size="icon" className="h-9 w-9 flex-shrink-0">
                    <Smile className="h-4 w-4" />
                  </Button>
                  <Button onClick={handleSendMessage} size="icon" className="bg-primary text-primary-foreground h-9 w-9 flex-shrink-0">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="h-20 w-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">No conversation selected</h3>
                <p className="text-muted-foreground">Choose a conversation from the list to start messaging</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </SidebarInset>
  )
}
