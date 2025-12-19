"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { useRazorpay } from "@/hooks/use-razorpay"
import { createSingleOrder, verifyPayment, enrollFree } from "@/lib/paymentService"
import { Loader2, Lock, CreditCard, CheckCircle2 } from "lucide-react"

interface PaymentButtonProps {
  courseId: string
  courseTitle: string
  price: number
  currency?: string
  isFree?: boolean
  isEnrolled?: boolean
  className?: string
  size?: "sm" | "default" | "lg"
  variant?: "default" | "outline" | "secondary" | "destructive" | "ghost" | "link"
  showPrice?: boolean
  onPaymentSuccess?: () => void
  onPaymentError?: (error: string) => void
}

export function PaymentButton({
  courseId,
  courseTitle,
  price,
  currency = "USD",
  isFree = false,
  isEnrolled = false,
  className = "",
  size = "default",
  variant = "default",
  showPrice = true,
  onPaymentSuccess,
  onPaymentError
}: PaymentButtonProps) {
  const router = useRouter()
  const { toast } = useToast()
  const { ready: razorpayReady } = useRazorpay()
  const [processing, setProcessing] = useState(false)

  // Get environment variables
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://skillfinite-backend-47sd.onrender.com"
  const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID

  // Get auth token
  const getToken = useCallback(async (): Promise<string | null> => {
    if (typeof window === "undefined") return null
    const localToken = localStorage.getItem("token")
    if (localToken) return localToken
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://skillfinite-backend-47sd.onrender.com'
      const res = await fetch(`${baseUrl}/api/auth/session`, { method: "GET", credentials: "include" })
      if (!res.ok) return null
      const data = await res.json()
      if (data?.token) {
        try {
          localStorage.setItem("token", data.token)
        } catch { }
        return data.token as string
      }
      return null
    } catch {
      return null
    }
  }, [])

  const handleFreeEnrollment = useCallback(async () => {
    setProcessing(true)
    try {
      const token = await getToken()
      if (!token) {
        throw new Error("Please log in to enroll in this course")
      }

      const result = await enrollFree(courseId)
      if (!result.ok) {
        throw new Error(result.error || "Failed to enroll in free course")
      }

      toast({
        title: "Enrolled Successfully! 🎉",
        description: `You've been enrolled in ${courseTitle}`,
      })

      onPaymentSuccess?.()
      router.push(`/courses/${courseId}`)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to enroll"
      toast({
        variant: "destructive",
        title: "Enrollment Failed",
        description: errorMessage,
      })
      onPaymentError?.(errorMessage)
    } finally {
      setProcessing(false)
    }
  }, [courseId, courseTitle, baseUrl, getToken, toast, onPaymentSuccess, onPaymentError, router])

  const handlePaidPayment = useCallback(async () => {
    setProcessing(true)
    try {
      const token = await getToken()
      if (!token) {
        throw new Error("Please log in to purchase this course")
      }

      // Create payment order
      const order = await createSingleOrder(courseId)
      if (!order.ok || !order.data) {
        throw new Error(order.error || "Failed to create payment order")
      }

      // Check if Razorpay is ready
      if (!razorpayReady || typeof window === "undefined" || !window.Razorpay) {
        throw new Error("Payment gateway is not ready. Please try again in a moment.")
      }

      if (!razorpayKey || razorpayKey.includes("xxxxxxxxxxxxx")) {
        throw new Error("Payment gateway not configured properly")
      }

      // Initialize Razorpay with UPI support
      const rzpOptions: any = {
        key: razorpayKey,
        amount: order.data.amount,
        currency: order.data.currency,
        order_id: order.data.orderId,
        name: "Skillfinite",
        description: `Payment for ${order.data.courseTitle}`,
        image: "/logo.png",
        handler: async (response: any) => {
          try {
            const verify = await verifyPayment({
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
              courseId: order.data!.courseId || courseId,
            })

            if (verify.ok) {
              // Clear cart after successful payment
              localStorage.removeItem('skillfinite-cart');

              toast({
                title: "Payment Successful! 🎉",
                description: `You've successfully purchased ${courseTitle}`,
              })
              onPaymentSuccess?.()
              router.push(`/courses/${courseId}`)
            } else {
              throw new Error(verify.error || "Payment verification failed")
            }
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Payment verification failed"
            toast({
              variant: "destructive",
              title: "Payment Verification Failed",
              description: errorMessage,
            })
            onPaymentError?.(errorMessage)
          }
        },
        theme: {
          color: "#7c3aed",
        },
        modal: {
          ondismiss: () => {
            setProcessing(false)
            toast({
              title: "Payment Cancelled",
              description: "You can try again anytime",
            })
          },
        },
        prefill: {
          name: "Student Name",
          email: "student@example.com",
        },
      }

      // Configure payment methods for INR currency
      if (order.data.currency === "INR") {
        rzpOptions.method = {
          netbanking: {},
          wallet: {},
          card: {},
          upi: {
            flow: "collect",
            vpa: "",
            apps: ["phonepe", "gpay", "paytm", "bhim"]
          }
        }
      } else {
        // For non-INR currencies, only cards
        rzpOptions.method = {
          card: {}
        }
      }

      const rzp = new window.Razorpay(rzpOptions)
      rzp.open()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Payment failed"
      toast({
        variant: "destructive",
        title: "Payment Failed",
        description: errorMessage,
      })
      onPaymentError?.(errorMessage)
      setProcessing(false)
    }
  }, [
    courseId,
    courseTitle,
    price,
    currency,
    baseUrl,
    razorpayReady,
    razorpayKey,
    getToken,
    toast,
    onPaymentSuccess,
    onPaymentError,
    router
  ])

  const handleClick = useCallback(() => {
    if (isEnrolled) {
      router.push(`/courses/${courseId}`)
      return
    }

    if (isFree) {
      handleFreeEnrollment()
    } else {
      handlePaidPayment()
    }
  }, [isEnrolled, isFree, courseId, handleFreeEnrollment, handlePaidPayment, router])

  const formatPrice = (amount: number, curr: string) => {
    const symbol = curr === "INR" ? "$" : "$"
    return `${symbol}${amount.toFixed(2)}`
  }

  const getButtonText = () => {
    if (processing) {
      return "Processing..."
    }

    if (isEnrolled) {
      return "View Course"
    }

    if (isFree) {
      return "Enroll Free"
    }

    if (showPrice) {
      return `Complete Purchase - ${formatPrice(price, currency)}`
    }

    return "Purchase Course"
  }

  const getButtonIcon = () => {
    if (processing) {
      return <Loader2 className="w-4 h-4 animate-spin" />
    }

    if (isEnrolled) {
      return <CheckCircle2 className="w-4 h-4" />
    }

    if (isFree) {
      return <CheckCircle2 className="w-4 h-4" />
    }

    return <Lock className="w-4 h-4" />
  }

  const getButtonVariant = () => {
    if (isEnrolled) {
      return "secondary"
    }
    return variant
  }

  const getButtonClassName = () => {
    const baseClasses = "transition-all duration-300 hover:scale-105 active:scale-95"

    if (isEnrolled) {
      return `${baseClasses} bg-green-600 hover:bg-green-700 text-white ${className}`
    }

    if (isFree) {
      return `${baseClasses} bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white ${className}`
    }

    return `${baseClasses} bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl ${className}`
  }

  return (
    <Button
      onClick={handleClick}
      disabled={processing}
      size={size}
      variant={getButtonVariant()}
      className={getButtonClassName()}
    >
      {getButtonIcon()}
      <span className="ml-2">{getButtonText()}</span>
    </Button>
  )
}

// Example usage component
export function PaymentButtonExample() {
  return (
    <div className="space-y-4 p-6">
      <h3 className="text-lg font-semibold">Payment Button Examples</h3>

      {/* Free Course */}
      <PaymentButton
        courseId="course-1"
        courseTitle="Free Web Development Course"
        price={0}
        currency="USD"
        isFree={true}
        showPrice={false}
      />

      {/* Paid Course */}
      <PaymentButton
        courseId="course-2"
        courseTitle="Advanced React Course"
        price={332.74}
        currency="USD"
        showPrice={true}
      />

      {/* Enrolled Course */}
      <PaymentButton
        courseId="course-3"
        courseTitle="JavaScript Fundamentals"
        price={99.99}
        currency="USD"
        isEnrolled={true}
        showPrice={false}
      />
    </div>
  )
}
