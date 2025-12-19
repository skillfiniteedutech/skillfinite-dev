"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Calendar, Clock, Plus, Trash2, ChevronLeft, ChevronRight } from "lucide-react"

interface Event {
  id: string
  title: string
  date: Date
  time: string
  description?: string
  type: "meeting" | "task" | "reminder" | "appointment"
}

export default function SchedulePage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date())
  const [events, setEvents] = useState<Event[]>([
    {
      id: "1",
      title: "Team Meeting",
      date: new Date(),
      time: "10:00 AM",
      description: "Weekly team sync",
      type: "meeting",
    },
    {
      id: "2",
      title: "Project Review",
      date: new Date(Date.now() + 86400000),
      time: "2:00 PM",
      description: "Review project progress",
      type: "meeting",
    },
    {
      id: "3",
      title: "Doctor Appointment",
      date: new Date(Date.now() + 172800000),
      time: "11:30 AM",
      type: "appointment",
    },
  ])
  const [isAddEventOpen, setIsAddEventOpen] = useState(false)
  const [newEvent, setNewEvent] = useState({
    title: "",
    time: "",
    description: "",
    type: "meeting" as Event["type"],
  })

  const addEvent = () => {
    if (!newEvent.title || !newEvent.time) return

    const event: Event = {
      id: Date.now().toString(),
      title: newEvent.title,
      date: selectedDate,
      time: newEvent.time,
      description: newEvent.description,
      type: newEvent.type,
    }

    setEvents([...events, event])
    setNewEvent({ title: "", time: "", description: "", type: "meeting" })
    setIsAddEventOpen(false)
  }

  const deleteEvent = (eventId: string) => {
    setEvents(events.filter((event) => event.id !== eventId))
  }

  const getEventsForDate = (date: Date) => {
    return events.filter((event) => event.date.toDateString() === date.toDateString())
  }

  const getUpcomingEvents = () => {
    const today = new Date()
    return events
      .filter((event) => event.date >= today)
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .slice(0, 5)
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }

    return days
  }

  const navigateMonth = (direction: "prev" | "next") => {
    const newMonth = new Date(currentMonth)
    if (direction === "prev") {
      newMonth.setMonth(newMonth.getMonth() - 1)
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1)
    }
    setCurrentMonth(newMonth)
  }

  const getEventTypeColor = (type: Event["type"]) => {
    switch (type) {
      case "meeting":
        return "bg-blue-500"
      case "task":
        return "bg-green-500"
      case "reminder":
        return "bg-yellow-500"
      case "appointment":
        return "bg-purple-500"
      default:
        return "bg-gray-500"
    }
  }

  const getEventTypeBadgeColor = (type: Event["type"]) => {
    switch (type) {
      case "meeting":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "task":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "reminder":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "appointment":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  return (
    <SidebarInset className="flex-1 flex flex-col">
      {/* Header */}
      <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border bg-background">
        <div className="flex items-center gap-2 px-4 flex-1">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/mycourses">My Learning</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Schedule</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="ml-auto">
            <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Event
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Event</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Event Title</Label>
                    <Input
                      id="title"
                      value={newEvent.title}
                      onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                      placeholder="Enter event title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="time">Time</Label>
                    <Input
                      id="time"
                      value={newEvent.time}
                      onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                      placeholder="e.g., 10:00 AM"
                    />
                  </div>
                  <div>
                    <Label htmlFor="type">Event Type</Label>
                    <Select
                      value={newEvent.type}
                      onValueChange={(value: Event["type"]) => setNewEvent({ ...newEvent, type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="meeting">Meeting</SelectItem>
                        <SelectItem value="task">Task</SelectItem>
                        <SelectItem value="reminder">Reminder</SelectItem>
                        <SelectItem value="appointment">Appointment</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Textarea
                      id="description"
                      value={newEvent.description}
                      onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                      placeholder="Add event details"
                    />
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button onClick={addEvent} className="flex-1">
                      Add Event
                    </Button>
                    <Button variant="outline" onClick={() => setIsAddEventOpen(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Main Calendar */}
        <main className="flex-1 p-6 sm:p-8 lg:p-12 overflow-auto bg-background">
          <div className="max-w-6xl mx-auto">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-foreground mb-2">My Schedule</h1>
              <p className="text-muted-foreground">Manage your appointments, events, and daily tasks</p>
            </div>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl">
                    {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => navigateMonth("prev")}>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => navigateMonth("next")}>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-1 mb-4">
                  {dayNames.map((day) => (
                    <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                      {day}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {getDaysInMonth(currentMonth).map((day, index) => {
                    if (!day) {
                      return <div key={index} className="p-2 h-24" />
                    }

                    const dayEvents = getEventsForDate(day)
                    const isSelected = selectedDate.toDateString() === day.toDateString()
                    const isToday = new Date().toDateString() === day.toDateString()

                    return (
                      <div
                        key={day.toISOString()}
                        className={`p-2 h-24 border rounded-lg cursor-pointer transition-colors hover:bg-muted/50 ${isSelected ? "bg-primary/10 border-primary" : "border-border"
                          } ${isToday ? "bg-accent" : ""}`}
                        onClick={() => setSelectedDate(day)}
                      >
                        <div className={`text-sm font-medium mb-1 ${isToday ? "text-primary" : "text-foreground"}`}>
                          {day.getDate()}
                        </div>
                        <div className="space-y-1">
                          {dayEvents.slice(0, 2).map((event) => (
                            <div
                              key={event.id}
                              className={`text-xs p-1 rounded text-white truncate ${getEventTypeColor(event.type)}`}
                            >
                              {event.title}
                            </div>
                          ))}
                          {dayEvents.length > 2 && (
                            <div className="text-xs text-muted-foreground">+{dayEvents.length - 2} more</div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>

        {/* Sidebar */}
        <aside className="hidden lg:block w-80 border-l border-border bg-card p-6 overflow-auto">
          <div className="space-y-6">
            {/* Selected Date Events */}
            <div>
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {selectedDate.toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </h3>
              <div className="space-y-2">
                {getEventsForDate(selectedDate).length === 0 ? (
                  <p className="text-sm text-muted-foreground">No events scheduled</p>
                ) : (
                  getEventsForDate(selectedDate).map((event) => (
                    <Card key={event.id} className="p-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-sm">{event.title}</h4>
                            <Badge className={`text-xs ${getEventTypeBadgeColor(event.type)}`}>{event.type}</Badge>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                            <Clock className="h-3 w-3" />
                            {event.time}
                          </div>
                          {event.description && <p className="text-xs text-muted-foreground">{event.description}</p>}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteEvent(event.id)}
                          className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </div>

            {/* Upcoming Events */}
            <div>
              <h3 className="font-semibold text-foreground mb-3">Upcoming Events</h3>
              <div className="space-y-2">
                {getUpcomingEvents().length === 0 ? (
                  <p className="text-sm text-muted-foreground">No upcoming events</p>
                ) : (
                  getUpcomingEvents().map((event) => (
                    <Card key={event.id} className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{event.title}</h4>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{event.date.toLocaleDateString()}</span>
                            <span>•</span>
                            <span>{event.time}</span>
                          </div>
                        </div>
                        <Badge className={`text-xs ${getEventTypeBadgeColor(event.type)}`}>{event.type}</Badge>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </SidebarInset>
  )
}
