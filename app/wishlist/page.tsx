'use client'

import { useState, useEffect } from 'react'
import { getWishlist } from '@/lib/wishlistService'
import { Heart, X, Loader2, ShoppingCart, Sparkles, ArrowRight, Home, BookOpen } from 'lucide-react'
import { useWishlist } from '@/context/wishlist-context'
import { useCart } from '@/context/cart-context'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import UdemyNavbar from '@/components/UdemyNavbar'
import Footer from '@/components/Footer'

export default function WishlistPage() {
    const [courses, setCourses] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const { toggleWishlist, isInWishlist } = useWishlist()
    const { addToCart } = useCart()

    useEffect(() => {
        loadWishlistCourses()
    }, [])

    const loadWishlistCourses = async () => {
        try {
            setLoading(true)
            const wishlistData = await getWishlist()
            setCourses(wishlistData)
        } catch (error) {
            console.error('Failed to load wishlist:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleRemove = async (courseId: string) => {
        await toggleWishlist(courseId)
        setCourses(prev => prev.filter(course => course.id !== courseId))
    }

    const handleAddToCart = async (course: any) => {
        try {
            addToCart({
                id: String(course.id),
                title: course.title,
                price: course.settings?.pricing?.type === 'free' ? 'Free' : `$${course.settings?.pricing?.price}`,
                image: course.thumbnail || '/placeholder-course.jpg',
                instructor: course.instructorId || 'Instructor',
                rating: 4.5,
                reviews: 1200,
                duration: '10 hours',
                lectures: 50,
                level: course.level || 'All Levels',
                enrolled: '1000',
                mode: 'Online',
                tag: 'Popular',
                category: course.category || 'General',
                bestseller: false,
                description: course.subtitle || 'Learn this amazing course and enhance your skills'
            })
            toast.success('Course added to cart')
        } catch (error) {
            toast.error('Failed to add to cart')
        }
    }

    const handleAddAllToCart = () => {
        courses.forEach(course => handleAddToCart(course))
        toast.success(`${courses.length} courses added to cart`)
    }

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col">
                <UdemyNavbar />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <Loader2 className="w-12 h-12 animate-spin text-orange-500 mx-auto mb-4" />
                        <p className="text-gray-600">Loading your wishlist...</p>
                    </div>
                </div>
            </div>
        )
    }

    if (courses.length === 0) {
        return (
            <div className="min-h-screen flex flex-col bg-gradient-to-br from-orange-50 via-white to-purple-50">
                <UdemyNavbar />
                <div className="flex-1 flex items-center justify-center px-4 py-40">
                    <div className="text-center max-w-md">
                        <div className="mb-6 relative inline-block mx-auto">
                            <div className="w-24 h-24 bg-gradient-to-br from-orange-100 to-purple-100 rounded-full flex items-center justify-center">
                                <Heart className="w-12 h-12 text-orange-500" />
                            </div>
                            <div className="absolute -top-2 -right-2 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center animate-bounce">
                                <Sparkles className="w-4 h-4 text-white" />
                            </div>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-3">Your Wishlist is Empty</h2>

                        <Link href="/courses">
                            <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group">
                                <BookOpen className="w-5 h-5 mr-2" />
                                Explore Courses
                                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                    </div>
                </div>
                <Footer />
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <UdemyNavbar />

            {/* Hero Header Section */}
            <div className="bg-gradient-to-r from-orange-500 via-orange-600 to-purple-600 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    {/* Breadcrumbs */}
                    <nav className="flex items-center text-sm mb-6 text-orange-100">
                        <Link href="/" className="hover:text-white transition-colors flex items-center">
                            <Home className="w-4 h-4 mr-1" />
                            Home
                        </Link>
                        <span className="mx-2">/</span>
                        <span className="text-white font-medium">My Wishlist</span>
                    </nav>

                    {/* Header Content */}
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center mb-3">
                                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mr-4">
                                    <Heart className="w-6 h-6 fill-white" />
                                </div>
                                <div>
                                    <h1 className="text-4xl font-bold mb-1">My Wishlist</h1>
                                    <p className="text-orange-100">
                                        {courses.length} {courses.length === 1 ? 'course' : 'courses'} saved for later
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="hidden md:flex gap-3">
                            <Button
                                onClick={handleAddAllToCart}
                                className="bg-white text-orange-600 hover:bg-orange-50 border-2 border-white shadow-lg"
                            >
                                <ShoppingCart className="w-4 h-4 mr-2" />
                                Add All to Cart
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
                {/* Mobile Action Button */}
                <div className="md:hidden mb-6">
                    <Button
                        onClick={handleAddAllToCart}
                        className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md"
                    >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Add All to Cart ({courses.length})
                    </Button>
                </div>

                {/* Courses Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {courses.map((course) => (
                        <div
                            key={course.id}
                            className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100"
                        >
                            {/* Course Image */}
                            <Link href={`/courses/${course.id}`}>
                                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                                    <Image
                                        src={course.thumbnail || '/placeholder-course.jpg'}
                                        alt={course.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                                    />

                                    {/* Remove Button */}
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault()
                                            handleRemove(course.id)
                                        }}
                                        className="absolute top-3 right-3 z-10 bg-white/95 backdrop-blur-sm rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-50 hover:scale-110"
                                        title="Remove from wishlist"
                                    >
                                        <X className="w-4 h-4 text-red-600" />
                                    </button>

                                    {/* Price Badge */}
                                    <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full shadow-lg">
                                        <span className="text-sm font-bold text-orange-600">
                                            {course.settings?.pricing?.type === 'free' ? 'FREE' : `$${course.settings?.pricing?.price}`}
                                        </span>
                                    </div>
                                </div>
                            </Link>

                            {/* Course Details */}
                            <div className="p-5">
                                <Link href={`/courses/${course.id}`}>
                                    <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 hover:text-orange-600 transition-colors min-h-[3rem]">
                                        {course.title}
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-4 line-clamp-2 min-h-[2.5rem]">
                                        {course.subtitle || 'Learn this amazing course and enhance your skills'}
                                    </p>
                                </Link>

                                {/* Tags */}
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="text-xs bg-orange-50 text-orange-700 px-2.5 py-1 rounded-full font-medium">
                                        {course.category}
                                    </span>
                                    <span className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full font-medium">
                                        {course.level || 'All Levels'}
                                    </span>
                                </div>

                                {/* Add to Cart Button */}
                                <Button
                                    onClick={() => handleAddToCart(course)}
                                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
                                >
                                    <ShoppingCart className="w-4 h-4 mr-2" />
                                    Add to Cart
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom CTA */}
                <div className="mt-12 text-center">
                    <div className="inline-flex flex-col items-center p-8 bg-gradient-to-br from-orange-50 to-purple-50 rounded-2xl border border-orange-100">
                        <Sparkles className="w-8 h-8 text-orange-500 mb-3" />
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Looking for more courses?</h3>
                        <p className="text-gray-600 mb-4">Explore thousands of courses across all categories</p>
                        <Link href="/courses">
                            <Button variant="outline" className="border-orange-500 text-orange-600 hover:bg-orange-50">
                                Browse All Courses
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
