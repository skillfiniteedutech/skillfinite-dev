export {}

declare global {
  interface RazorpayPaymentResponse {
    razorpay_payment_id: string
    razorpay_order_id: string
    razorpay_signature: string
  }

  interface RazorpayOptions {
    key: string
    amount: number
    currency: string
    order_id: string
    name?: string
    description?: string
    handler: (response: RazorpayPaymentResponse) => void
    prefill?: {
      name?: string
      email?: string
      contact?: string
    }
    theme?: {
      color?: string
    }
    notes?: Record<string, string>
    modal?: {
      ondismiss?: () => void
    }
  }

  interface RazorpayInstance {
    open: () => void
    on: (event: string, cb: (data: unknown) => void) => void
  }

  interface RazorpayConstructor {
    new (options: RazorpayOptions): RazorpayInstance
  }

  interface Window {
    Razorpay?: RazorpayConstructor
  }
}
