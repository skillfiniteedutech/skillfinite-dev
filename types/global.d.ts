/// <reference types="next" />
/// <reference types="next/image-types/global" />

// Simple module declaration for lucide-react
declare module 'lucide-react' {
  import { FC, SVGProps } from 'react'
  
  export interface IconProps extends SVGProps<SVGSVGElement> {
    size?: number | string
    absoluteStrokeWidth?: boolean
  }
  
  // Export all the icons we're using as any to avoid type conflicts
  export const Star: any
  export const BookOpen: any
  export const Clock: any
  export const Heart: any
  export const Loader2: any
  export const Users: any
  export const Award: any
  export const Download: any
  export const MessageCircle: any
  export const Video: any
  export const RefreshCw: any
  export const AlertCircle: any
  export const Calendar: any
  export const FileText: any
  export const Library: any
  export const MessageSquare: any
  export const Settings: any
  export const Users2: any
  export const BarChart3: any
  export const LogOut: any
  export const ChevronDown: any
  export const Search: any
  export const TrendingUp: any
  export const User: any
  export const CreditCard: any
  export const HelpCircle: any
}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_API_URL?: string
      NEXT_PUBLIC_BASE_URL?: string
      NODE_ENV: 'development' | 'production' | 'test'
    }
  }
}

export {}
