'use client'

import { useEffect, useState } from 'react'

export function useRazorpay() {
  const [ready, setReady] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.Razorpay) {
      setReady(true)
      return
    }

    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    script.onload = () => setReady(true)
    script.onerror = () => setError(new Error('Failed to load Razorpay SDK'))
    document.body.appendChild(script)
  }, [])

  return { ready, error }
}
