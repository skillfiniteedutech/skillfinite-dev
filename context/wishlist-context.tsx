'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { addToWishlist, removeFromWishlist, getWishlist } from '@/lib/wishlistService'
import { toast } from 'sonner'

interface WishlistContextType {
    wishlistItems: string[]
    isInWishlist: (courseId: string) => boolean
    toggleWishlist: (courseId: string) => Promise<void>
    loadWishlist: () => Promise<void>
    isLoading: boolean
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: ReactNode }) {
    const [wishlistItems, setWishlistItems] = useState<string[]>([])
    const [isLoading, setIsLoading] = useState(false)

    const loadWishlist = async () => {
        try {
            setIsLoading(true)
            const wishlist = await getWishlist()
            const courseIds = wishlist.map((item: any) => item.id)
            setWishlistItems(courseIds)
        } catch (error) {
            console.error('Failed to load wishlist:', error)
            // Silently fail - user might not be logged in
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        loadWishlist()
    }, [])

    const isInWishlist = (courseId: string): boolean => {
        return wishlistItems.includes(courseId)
    }

    const toggleWishlist = async (courseId: string) => {
        const wasInWishlist = isInWishlist(courseId)

        // Optimistic update
        if (wasInWishlist) {
            setWishlistItems(prev => prev.filter(id => id !== courseId))
        } else {
            setWishlistItems(prev => [...prev, courseId])
        }

        try {
            if (wasInWishlist) {
                await removeFromWishlist(courseId)
                toast.success('Removed from wishlist')
            } else {
                await addToWishlist(courseId)
                toast.success('Added to wishlist')
            }
        } catch (error) {
            // Revert on error
            if (wasInWishlist) {
                setWishlistItems(prev => [...prev, courseId])
            } else {
                setWishlistItems(prev => prev.filter(id => id !== courseId))
            }
            toast.error(wasInWishlist ? 'Failed to remove from wishlist' : 'Failed to add to wishlist')
            console.error('Error toggling wishlist:', error)
        }
    }

    return (
        <WishlistContext.Provider
            value={{
                wishlistItems,
                isInWishlist,
                toggleWishlist,
                loadWishlist,
                isLoading
            }}
        >
            {children}
        </WishlistContext.Provider>
    )
}

export function useWishlist() {
    const context = useContext(WishlistContext)
    if (context === undefined) {
        throw new Error('useWishlist must be used within a WishlistProvider')
    }
    return context
}
