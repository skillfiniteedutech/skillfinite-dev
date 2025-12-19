'use client'

import { usePathname } from 'next/navigation'
import ChatBot from './ChatBot'

export default function ConditionalChatBot() {
    const pathname = usePathname()

    // Only show ChatBot on the landing page (home page)
    const isLandingPage = pathname === '/'

    if (!isLandingPage) {
        return null
    }

    return <ChatBot />
}
