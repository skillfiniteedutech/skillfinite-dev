import { MoreHorizontal, FileText, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface CourseCardProps {
  title: string
  level: string
  date: string
  badge: string
  badgeColor: string
  participants: number
  progress: number
  files: number
  tasks: number
  bgColor: string
  avatars: string[]
}

export function CourseCard({
  title,
  level,
  date,
  badge,
  badgeColor,
  participants,
  progress,
  files,
  tasks,
  bgColor,
  avatars,
}: CourseCardProps) {
  return (
    <div className={`${bgColor} rounded-xl p-4 relative`}>
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold text-gray-800 mb-0.5 text-sm">{title}</h3>
          <p className="text-xs text-gray-600">{date}</p>
        </div>
        <Button variant="ghost" size="sm" className="p-0.5 h-auto">
          <MoreHorizontal className="w-3 h-3" />
        </Button>
      </div>

      <div className="flex gap-1.5 mb-3">
        <span className="text-[10px] px-1.5 py-0.5 bg-white rounded-full text-gray-600">{level}</span>
        <span className={`text-[10px] px-1.5 py-0.5 rounded-full text-white ${badgeColor}`}>{badge}</span>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <p className="text-[10px] text-gray-600 mb-0.5">Participants:</p>
          <div className="flex items-center gap-1.5">
            <div className="flex -space-x-1">
              {avatars.map((avatar, index) => (
                <Avatar key={index} className="w-4 h-4 border border-white">
                  <AvatarImage src={avatar || "/placeholder.svg"} />
                  <AvatarFallback className="text-[8px]">U</AvatarFallback>
                </Avatar>
              ))}
            </div>
            <span className="text-xs font-medium">{participants}</span>
          </div>
        </div>
        <div>
          <p className="text-[10px] text-gray-600 mb-0.5">Progress:</p>
          <div className="flex items-center gap-1.5">
            <Progress value={progress} className="flex-1 h-1.5" />
            <span className="text-xs font-medium">{progress}%</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-center gap-1.5">
          <FileText className="w-3 h-3 text-purple-500" />
          <span className="text-xs text-gray-600">{files}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3 h-3 text-purple-500" />
          <span className="text-xs text-gray-600">{tasks}</span>
        </div>
      </div>
    </div>
  )
}
