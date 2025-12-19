# Razorpay Setup Guide

## ✅ Environment Configuration

The `.env.local` file has been created with test Razorpay configuration. 

## 🔧 Getting Your Razorpay Test Keys

1. **Sign up for Razorpay**: Go to [https://razorpay.com](https://razorpay.com) and create an account
2. **Access Dashboard**: Log in to your Razorpay dashboard
3. **Get Test Keys**: 
   - Go to Settings → API Keys
   - Copy your **Test Key ID** and **Test Key Secret**
4. **Update Environment**: Replace the values in `.env.local`:
   ```
   NEXT_PUBLIC_RAZORPAY_KEY_ID=your_actual_test_key_id
   NEXT_PUBLIC_RAZORPAY_KEY_SECRET=your_actual_test_secret
   ```

## 🧪 Test Payment Flow

1. **Test Cards**: Use these test card numbers:
   - **Success**: `4111 1111 1111 1111`
   - **Failure**: `4000 0000 0000 0002`
   - **CVV**: Any 3 digits
   - **Expiry**: Any future date

2. **Test UPI**: Use `success@razorpay` for successful payments

## 🚀 Testing the Complete Flow

1. **Browse Courses**: Go to `/courses`
2. **Add to Cart**: Click "Add to Cart" on any course
3. **Review Cart**: Go to `/cart` to review items
4. **Checkout**: Click "Proceed to Checkout"
5. **Payment**: Complete payment with test credentials
6. **Enrollment**: Check `/mycourses` to see enrolled courses

## 🔍 Troubleshooting

- **"Payment gateway not configured"**: Check your `.env.local` file
- **"Razorpay is not ready"**: Refresh the page and try again
- **Payment fails**: Use the test card numbers above

## 📱 Mobile Testing

- Use Razorpay's test UPI apps
- Test with different payment methods
- Verify responsive design on mobile devices

## 🎯 Production Setup

For production:
1. Get live Razorpay keys
2. Update environment variables
3. Test with real payment methods
4. Configure webhooks for payment verification

