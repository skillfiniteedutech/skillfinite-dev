import { Search, Bell } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function Header() {
  return (
    <header className="bg-white border-b border-gray-100 px-4 py-3 ml-44">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-gray-800">Welcome back Hari 👋</h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3" />
            <Input placeholder="Search here..." className="pl-7 w-56 bg-gray-50 border-0 h-8 text-xs" />
          </div>

          <div className="relative">
            <Bell className="w-4 h-4 text-gray-600 cursor-pointer" />
            <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-purple-500 rounded-full"></div>
          </div>

          <Avatar className="w-7 h-7">
            <AvatarImage src="/placeholder.svg?height=28&width=28" />
            <AvatarFallback className="text-xs">AN</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}
