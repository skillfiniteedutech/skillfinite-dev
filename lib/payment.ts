// Re-export all payment functions from paymentService.ts
// This maintains backward compatibility while using the production-ready implementation

export {
  // Payment order creation
  createSingleOrder,
  createBulkOrder,
  
  // Payment verification
  verifyPayment,
  
  // Payment history and status
  getPaymentHistory,
  getPaymentStatus,
  
  // Refunds
  initiateRefund,
  
  // Free enrollment
  enrollFree,
  enrollBulkFree,
  
  // Cart operations
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  validateCart,
  getCartSummary,
  
  // Utility functions
  formatAmount,
  formatAmountInRupees,
  getPaymentStatusColor,
  getPaymentStatusText,
  
  // Types
  type PaymentOrder,
  type PaymentHistory,
  type PaymentStatus,
  type CartItem,
  type Cart
} from './paymentService'

// Legacy function names for backward compatibility
export { createSingleOrder as createPaymentOrder } from './paymentService'
