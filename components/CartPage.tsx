'use client';

import React, { useState } from 'react';
import { useCart } from '@/context/cart-context';
import { useWishlist } from '@/context/wishlist-context';
import { useRouter } from 'next/navigation';
import { X, Star, Tag, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { toast as sonnerToast } from 'sonner';
import UdemyNavbar from '@/components/UdemyNavbar';
import Footer from '@/components/Footer';
import { useRazorpay } from '@/hooks/use-razorpay';
import { createBulkOrder, verifyPayment, enrollBulkFree } from '@/lib/paymentService';

const CartPage = () => {
    const { cartItems, removeFromCart, totalPrice, discountedTotal, clearCart } = useCart();
    const { toggleWishlist } = useWishlist();
    const [isProcessing, setIsProcessing] = useState(false);
    const { toast } = useToast();
    const { ready: razorpayReady } = useRazorpay();
    const router = useRouter();

    const handleMoveToWishlist = async (courseId: string | number) => {
        try {
            await toggleWishlist(String(courseId));
            removeFromCart(courseId);
            sonnerToast.success('Course moved to wishlist');
        } catch (error) {
            sonnerToast.error('Failed to move to wishlist');
            console.error('Error moving to wishlist:', error);
        }
    };

    const calculateSavings = () => {
        return discountedTotal - totalPrice;
    }

    const handleCheckout = async () => {
        if (cartItems.length === 0) {
            toast({
                title: "Cart is empty",
                description: "Please add courses to your cart before checkout",
                variant: "destructive"
            });
            return;
        }

        setIsProcessing(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast({
                    title: "Authentication required",
                    description: "Please log in to complete your purchase",
                    variant: "destructive"
                });
                router.push('/login');
                return;
            }

            // Get course IDs from cart
            const courseIds = cartItems.map(item => String(item.id));

            // Handle Free Cart (Total Price = 0)
            if (totalPrice === 0) {
                const result = await enrollBulkFree(courseIds);
                if (result.ok) {
                    clearCart();
                    localStorage.removeItem('skillfinite-cart');
                    toast({
                        title: "Enrollment Successful! 🎉",
                        description: `You have successfully enrolled in ${cartItems.length} free course(s).`,
                    });
                    router.push('/mycourses');
                } else {
                    throw new Error(result.error || "Enrollment failed");
                }
                setIsProcessing(false);
                return;
            }

            // Check if Razorpay is ready
            if (!razorpayReady || typeof window === 'undefined' || !window.Razorpay) {
                toast({
                    title: "Payment gateway not ready",
                    description: "Please wait a moment and try again",
                    variant: "destructive"
                });
                setIsProcessing(false);
                return;
            }

            const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
            if (!razorpayKey || razorpayKey.includes('xxxxxxxxxxxxx')) {
                toast({
                    title: "Payment gateway not configured",
                    description: "Please contact support",
                    variant: "destructive"
                });
                setIsProcessing(false);
                return;
            }

            // Create bulk order
            const order = await createBulkOrder(courseIds);
            if (!order.ok || !order.data) {
                throw new Error(order.error || "Failed to create order");
            }

            // Initialize Razorpay
            const rzpOptions: any = {
                key: razorpayKey,
                amount: order.data.amount,
                currency: order.data.currency,
                order_id: order.data.orderId,
                name: "Skillfinite",
                description: `Payment for ${cartItems.length} course(s)`,
                image: "/logo.png",
                handler: async (response: any) => {
                    try {
                        const verify = await verifyPayment({
                            orderId: response.razorpay_order_id,
                            paymentId: response.razorpay_payment_id,
                            signature: response.razorpay_signature,
                        });

                        if (verify.ok) {
                            // Clear cart after successful payment
                            clearCart();
                            localStorage.removeItem('skillfinite-cart');

                            toast({
                                title: "Payment Successful! 🎉",
                                description: `You've successfully purchased ${cartItems.length} course(s)`,
                            });

                            router.push('/mycourses');
                        } else {
                            throw new Error(verify.error || "Payment verification failed");
                        }
                    } catch (error) {
                        const errorMessage = error instanceof Error ? error.message : "Payment verification failed";
                        toast({
                            variant: "destructive",
                            title: "Payment Verification Failed",
                            description: errorMessage,
                        });
                    } finally {
                        setIsProcessing(false);
                    }
                },
                theme: {
                    color: "#7c3aed",
                },
                modal: {
                    ondismiss: () => {
                        setIsProcessing(false);
                        toast({
                            title: "Payment Cancelled",
                            description: "You can try again anytime",
                        });
                    },
                },
                prefill: {
                    name: "Student Name",
                    email: "student@example.com",
                },
            };

            const rzp = new window.Razorpay(rzpOptions);
            rzp.open();
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Checkout failed";
            toast({
                title: "Checkout Failed",
                description: errorMessage,
                variant: "destructive"
            });
            setIsProcessing(false);
        }
    };

    const savings = calculateSavings();
    // Assuming mock simplified logic where "discountedTotal" is original price sum and "totalPrice" is current price sum.

    return (
        <div className="min-h-screen flex flex-col font-sans text-gray-900 bg-white">
            <UdemyNavbar />

            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

                {cartItems.length > 0 ? (
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Cart Items List */}
                        <div className="flex-1">
                            <div className="text-gray-700 font-bold mb-2">{cartItems.length} Course{cartItems.length > 1 ? 's' : ''} in Cart</div>
                            <div className="border-t border-gray-200">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="flex gap-4 py-4 border-b border-gray-200 group">
                                        <div className="w-24 h-24 sm:w-32 sm:h-24 bg-gray-200 flex-shrink-0 cursor-pointer" onClick={() => router.push(`/courses/${item.id}`)}>
                                            <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 flex flex-col sm:flex-row justify-between gap-4">
                                            <div className="flex-1">
                                                <h3 className="font-bold text-gray-900 line-clamp-2 cursor-pointer hover:underline" onClick={() => router.push(`/courses/${item.id}`)}>
                                                    {item.title}
                                                </h3>
                                                <div className="text-xs text-gray-600 mb-1">By {item.instructor}</div>
                                                <div className="flex items-center gap-1 text-xs text-yellow-600 font-bold mb-1">
                                                    <span>{item.rating.toFixed(1)}</span>
                                                    <div className="flex">
                                                        {[1, 2, 3, 4, 5].map(star => (
                                                            <Star key={star} className={`w-3 h-3 ${star <= Math.round(item.rating) ? 'fill-yellow-500' : 'text-gray-300 fill-gray-300'}`} />
                                                        ))}
                                                    </div>
                                                    <span className="text-gray-500 font-normal">({item.reviews} ratings)</span>
                                                </div>
                                                <div className="flex gap-2 text-xs text-gray-500">
                                                    <span>{item.duration} total hours</span>
                                                    <span>•</span>
                                                    <span>{item.lectures} lectures</span>
                                                    <span>•</span>
                                                    <span>{item.level}</span>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end gap-1">
                                                <div className="text-sm font-bold text-purple-600 cursor-pointer hover:text-purple-700" onClick={() => removeFromCart(item.id)}>Remove</div>
                                                <div className="text-sm text-gray-600 cursor-pointer hover:text-gray-900" onClick={() => handleMoveToWishlist(item.id)}>Move to Wishlist</div>

                                                <div className="mt-2 text-right">
                                                    <div className="font-bold text-lg text-purple-700">{item.price === 'Free' ? 'Free' : item.price}</div>
                                                    {item.price !== 'Free' && (
                                                        <div className="text-sm text-gray-500 line-through">${(parseInt(item.price.replace(/[^0-9]/g, '')) * 5).toLocaleString('en-IN')}</div>
                                                    )}
                                                </div>
                                                {/* Hidden remove button overlaid for better clickable area if needed, but simplistic link above works */}
                                                <button onClick={() => removeFromCart(item.id)} className="absolute hidden">Remove</button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Checkout Sidebar */}
                        <div className="lg:w-1/3">
                            <div className="bg-white p-0">
                                <div className="text-gray-500 font-bold mb-2">Total:</div>
                                <div className="text-3xl font-bold text-gray-900 mb-4">
                                    ${totalPrice.toLocaleString('en-IN')}
                                </div>
                                {savings > 0 && (
                                    <div className="text-gray-500 line-through mb-1">
                                        ${discountedTotal.toLocaleString('en-IN')}
                                    </div>
                                )}
                                {savings > 0 && (
                                    <div className="text-gray-500 mb-6">
                                        80% off
                                    </div>
                                )}

                                <Button
                                    onClick={handleCheckout}
                                    disabled={isProcessing || !razorpayReady}
                                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 text-lg rounded-none mb-4"
                                >
                                    {isProcessing ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        'Checkout'
                                    )}
                                </Button>

                                <div className="border-t border-gray-200 pt-4">
                                    <h4 className="font-bold text-gray-700 mb-2">Promotions</h4>
                                    <div className="flex gap-2">
                                        <input type="text" placeholder="Enter Coupon" className="border border-gray-400 px-3 py-2 w-full text-sm rounded-none border-dashed" />
                                        <Button variant="secondary" className="bg-purple-600 text-white hover:bg-purple-700 rounded-none font-bold">Apply</Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-12 border border-gray-200 bg-gray-50">
                        <div className="flex justify-center mb-6">
                            <div className="bg-white p-6 rounded-full shadow-sm">
                                <Tag className="w-12 h-12 text-gray-300" />
                            </div>
                        </div>
                        <p className="text-gray-600 mb-6">Your cart is empty. Keep shopping to find a course!</p>
                        <Button onClick={() => router.push('/courses')} className="bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-none">
                            Keep Shopping
                        </Button>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
};

export default CartPage;
