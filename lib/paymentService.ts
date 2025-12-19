'use client'

export type PaymentOrder = {
  orderId: string
  amount: number
  currency: string
  courseId?: string
  courseTitle?: string
  coursePrice?: number
  courseCount?: number
  courses?: Array<{
    courseId: string
    courseTitle: string
    price: number
    quantity: number
  }>
  paymentId: string
}

export type PaymentHistory = {
  id: string
  razorpayPaymentId: string
  amount: number
  currency: string
  status: 'pending' | 'captured' | 'failed' | 'refunded' | 'partially_refunded' | 'cancelled'
  courses: Array<{
    courseId: string
    courseTitle: string
    price: number
    quantity: number
  }>
  createdAt: string
  capturedAt?: string
  totalRefunded: number
  remainingAmount: number
}

export type PaymentStatus = {
  id: string
  razorpayOrderId: string
  razorpayPaymentId?: string
  amount: number
  currency: string
  status: string
  courses: Array<{
    courseId: string
    courseTitle: string
    price: number
    quantity: number
  }>
  createdAt: string
  capturedAt?: string
  failedAt?: string
  refunds: Array<{
    refundId: string
    amount: number
    reason: string
    status: string
    processedAt?: string
    createdAt: string
  }>
}

export type CartItem = {
  courseId: string
  courseTitle: string
  coursePrice: number
  quantity: number
  addedAt: string
  course: {
    title: string
    subtitle: string
    thumbnail: string
    instructor: string
    category: string
    level: string
  }
}

export type Cart = {
  id: string
  totalItems: number
  totalAmount: number
  currency: string
  items: CartItem[]
  expiresAt: string
  lastAccessedAt: string
}

// Base API configuration
const getBaseUrl = () => {
  return process.env.NEXT_PUBLIC_API_URL || 'https://skillfinite-backend-47sd.onrender.com'
}

const getAuthToken = async (): Promise<string | null> => {
  if (typeof window === 'undefined') return null

  // Try localStorage first
  const localToken = localStorage.getItem('token')
  if (localToken) return localToken

  // Fallback to session check
  try {
    const baseUrl = getBaseUrl()
    const res = await fetch(`${baseUrl}/api/auth/session`, {
      method: 'GET',
      credentials: 'include'
    })
    if (!res.ok) return null

    const data = await res.json()
    if (data?.token) {
      try {
        localStorage.setItem('token', data.token)
      } catch { }
      return data.token
    }
    return null
  } catch {
    return null
  }
}

const makeRequest = async (url: string, options: RequestInit = {}) => {
  const token = await getAuthToken()

  console.log('🔍 Making request to:', url)
  console.log('🔑 Token available:', !!token)

  if (!token) {
    console.error('❌ No authentication token found')
    throw new Error('Authentication required. Please log in to continue.')
  }

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    ...options.headers
  }

  console.log('📤 Request headers:', { ...headers, Authorization: 'Bearer [REDACTED]' })

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include'
  })

  console.log('📥 Response status:', response.status, response.statusText)

  if (!response.ok) {
    const text = await response.text()
    console.error('❌ Request failed:', response.status, response.statusText, text)

    // Handle specific error cases
    if (response.status === 401) {
      // Clear invalid token
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token')
      }
      console.error('🔑 Authentication failed, token cleared')
      throw new Error('Authentication failed. Please log in again.')
    }

    if (response.status === 500) {
      console.error('🖥️ Server error occurred')
      throw new Error('Server error. Please try again later.')
    }

    throw new Error(`Request failed: ${response.status} ${response.statusText} - ${text}`)
  }

  const data = await response.json()
  console.log('✅ Request successful:', data)
  return data
}

// Single Course Payment
export async function createSingleOrder(courseId: string): Promise<{ ok: boolean; data?: PaymentOrder; error?: string }> {
  try {
    console.log('🔍 Creating single order for course:', courseId)
    const baseUrl = getBaseUrl()
    const data = await makeRequest(`${baseUrl}/api/payment/create-order`, {
      method: 'POST',
      body: JSON.stringify({ courseId })
    })

    if (!data.success || !data.data) {
      console.error('❌ Order creation failed:', data.message)
      return { ok: false, error: data.message || 'Order creation failed' }
    }

    console.log('✅ Single order created successfully:', data.data)
    return { ok: true, data: data.data }
  } catch (error) {
    console.error('❌ Error creating single order:', error)
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Network error creating order'
    }
  }
}

// Sync cart to backend
export async function syncCartToBackend(cartItems: any[]): Promise<{ ok: boolean; data?: any; error?: string }> {
  try {
    const baseUrl = getBaseUrl()
    const data = await makeRequest(`${baseUrl}/api/cart/sync`, {
      method: 'POST',
      body: JSON.stringify({ items: cartItems })
    })

    if (!data.success) {
      return { ok: false, error: data.message || 'Cart sync failed' }
    }

    return { ok: true, data: data.data }
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Network error syncing cart'
    }
  }
}

// Bulk/Cart Payment
export async function createBulkOrder(courseIds: string[]): Promise<{ ok: boolean; data?: PaymentOrder; error?: string }> {
  try {
    const baseUrl = getBaseUrl()
    const data = await makeRequest(`${baseUrl}/api/payment/create-bulk-order`, {
      method: 'POST',
      body: JSON.stringify({ courseIds })
    })

    if (!data.success || !data.data) {
      return { ok: false, error: data.message || 'Bulk order creation failed' }
    }

    return { ok: true, data: data.data }
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Network error creating bulk order'
    }
  }
}

// Verify Payment
export async function verifyPayment(paymentData: {
  orderId: string
  paymentId: string
  signature: string
  courseId?: string
}): Promise<{ ok: boolean; data?: any; error?: string }> {
  try {
    const baseUrl = getBaseUrl()
    const data = await makeRequest(`${baseUrl}/api/payment/verify`, {
      method: 'POST',
      body: JSON.stringify(paymentData)
    })

    if (!data.success) {
      return { ok: false, error: data.message || 'Payment verification failed' }
    }

    return { ok: true, data: data.data }
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Network error verifying payment'
    }
  }
}

// Get Payment History
export async function getPaymentHistory(page = 1, limit = 10, status?: string): Promise<{ ok: boolean; data?: { payments: PaymentHistory[]; pagination: any }; error?: string }> {
  try {
    const baseUrl = getBaseUrl()
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(status && { status })
    })

    const data = await makeRequest(`${baseUrl}/api/payment/history?${params}`)

    if (!data.success || !data.data) {
      return { ok: false, error: data.message || 'Failed to fetch payment history' }
    }

    return { ok: true, data: data.data }
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Network error fetching payment history'
    }
  }
}

// Get Payment Status
export async function getPaymentStatus(orderId: string): Promise<{ ok: boolean; data?: PaymentStatus; error?: string }> {
  try {
    const baseUrl = getBaseUrl()
    const data = await makeRequest(`${baseUrl}/api/payment/status/${orderId}`)

    if (!data.success || !data.data) {
      return { ok: false, error: data.message || 'Failed to fetch payment status' }
    }

    return { ok: true, data: data.data }
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Network error fetching payment status'
    }
  }
}

// Initiate Refund
export async function initiateRefund(paymentId: string, amount: number, reason: string): Promise<{ ok: boolean; data?: any; error?: string }> {
  try {
    const baseUrl = getBaseUrl()
    const data = await makeRequest(`${baseUrl}/api/payment/refund/${paymentId}`, {
      method: 'POST',
      body: JSON.stringify({ amount, reason })
    })

    if (!data.success) {
      return { ok: false, error: data.message || 'Refund initiation failed' }
    }

    return { ok: true, data: data.data }
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Network error initiating refund'
    }
  }
}

// Free Course Enrollment
export async function enrollFree(courseId: string): Promise<{ ok: boolean; data?: any; error?: string }> {
  try {
    const baseUrl = getBaseUrl()
    const data = await makeRequest(`${baseUrl}/api/enrollment/enroll/free`, {
      method: 'POST',
      body: JSON.stringify({ courseId })
    })

    if (!data.success) {
      return { ok: false, error: data.message || 'Free enrollment failed' }
    }

    return { ok: true, data: data.data }
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Network error enrolling in free course'
    }
  }
}

// Bulk Free Enrollment
export async function enrollBulkFree(courseIds: string[]): Promise<{ ok: boolean; data?: any; error?: string }> {
  try {
    const baseUrl = getBaseUrl()
    const data = await makeRequest(`${baseUrl}/api/enrollment/bulk-enroll/free`, {
      method: 'POST',
      body: JSON.stringify({ courseIds })
    })

    if (!data.success) {
      return { ok: false, error: data.message || 'Bulk free enrollment failed' }
    }

    return { ok: true, data: data.data }
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Network error enrolling in free courses'
    }
  }
}

// Cart Operations
export async function getCart(): Promise<{ ok: boolean; data?: { cart: Cart }; error?: string }> {
  try {
    const baseUrl = getBaseUrl()
    const data = await makeRequest(`${baseUrl}/api/cart`)

    if (!data.success || !data.data) {
      return { ok: false, error: data.message || 'Failed to fetch cart' }
    }

    return { ok: true, data: data.data }
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Network error fetching cart'
    }
  }
}

export async function addToCart(courseId: string, quantity = 1): Promise<{ ok: boolean; data?: { cart: Cart }; error?: string }> {
  try {
    const baseUrl = getBaseUrl()
    const data = await makeRequest(`${baseUrl}/api/cart/add`, {
      method: 'POST',
      body: JSON.stringify({ courseId, quantity })
    })

    if (!data.success || !data.data) {
      return { ok: false, error: data.message || 'Failed to add to cart' }
    }

    return { ok: true, data: data.data }
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Network error adding to cart'
    }
  }
}

export async function updateCartItem(courseId: string, quantity: number): Promise<{ ok: boolean; data?: { cart: Cart }; error?: string }> {
  try {
    const baseUrl = getBaseUrl()
    const data = await makeRequest(`${baseUrl}/api/cart/update`, {
      method: 'PUT',
      body: JSON.stringify({ courseId, quantity })
    })

    if (!data.success || !data.data) {
      return { ok: false, error: data.message || 'Failed to update cart' }
    }

    return { ok: true, data: data.data }
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Network error updating cart'
    }
  }
}

export async function removeFromCart(courseId: string): Promise<{ ok: boolean; data?: { cart: Cart }; error?: string }> {
  try {
    const baseUrl = getBaseUrl()
    const data = await makeRequest(`${baseUrl}/api/cart/remove/${courseId}`, {
      method: 'DELETE'
    })

    if (!data.success || !data.data) {
      return { ok: false, error: data.message || 'Failed to remove from cart' }
    }

    return { ok: true, data: data.data }
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Network error removing from cart'
    }
  }
}

export async function clearCart(): Promise<{ ok: boolean; data?: { cart: Cart }; error?: string }> {
  try {
    const baseUrl = getBaseUrl()
    const data = await makeRequest(`${baseUrl}/api/cart/clear`, {
      method: 'DELETE'
    })

    if (!data.success || !data.data) {
      return { ok: false, error: data.message || 'Failed to clear cart' }
    }

    return { ok: true, data: data.data }
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Network error clearing cart'
    }
  }
}

export async function validateCart(): Promise<{ ok: boolean; data?: { isValid: boolean; errors: any[]; cart: any }; error?: string }> {
  try {
    const baseUrl = getBaseUrl()
    const data = await makeRequest(`${baseUrl}/api/cart/validate`)

    if (!data.success || !data.data) {
      return { ok: false, error: data.message || 'Failed to validate cart' }
    }

    return { ok: true, data: data.data }
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Network error validating cart'
    }
  }
}

export async function getCartSummary(): Promise<{ ok: boolean; data?: { cart: Cart }; error?: string }> {
  try {
    const baseUrl = getBaseUrl()
    const data = await makeRequest(`${baseUrl}/api/cart/summary`)

    if (!data.success || !data.data) {
      return { ok: false, error: data.message || 'Failed to get cart summary' }
    }

    return { ok: true, data: data.data }
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Network error getting cart summary'
    }
  }
}

// Utility functions
export const formatAmount = (amount: number, currency: string = 'INR'): string => {
  const symbol = currency === 'INR' ? '$' : '$'
  return `${symbol}${(amount / 100).toFixed(2)}`
}

export const formatAmountInRupees = (amount: number): string => {
  return `$${amount.toFixed(2)}`
}

export const getPaymentStatusColor = (status: string): string => {
  switch (status) {
    case 'captured':
      return 'text-green-600 bg-green-100'
    case 'pending':
      return 'text-yellow-600 bg-yellow-100'
    case 'failed':
      return 'text-red-600 bg-red-100'
    case 'refunded':
      return 'text-blue-600 bg-blue-100'
    case 'partially_refunded':
      return 'text-orange-600 bg-orange-100'
    case 'cancelled':
      return 'text-gray-600 bg-gray-100'
    default:
      return 'text-gray-600 bg-gray-100'
  }
}

export const getPaymentStatusText = (status: string): string => {
  switch (status) {
    case 'captured':
      return 'Completed'
    case 'pending':
      return 'Pending'
    case 'failed':
      return 'Failed'
    case 'refunded':
      return 'Refunded'
    case 'partially_refunded':
      return 'Partially Refunded'
    case 'cancelled':
      return 'Cancelled'
    default:
      return 'Unknown'
  }
}
