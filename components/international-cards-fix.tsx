"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  AlertCircle, 
  CheckCircle2, 
  CreditCard, 
  Globe,
  Shield,
  Phone,
  Mail,
  ExternalLink
} from "lucide-react"

export function InternationalCardsFix() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card className="border-red-200 bg-red-50 dark:bg-red-900/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-800 dark:text-red-200">
            <AlertCircle className="w-5 h-5" />
            International Cards Not Supported
          </CardTitle>
          <CardDescription className="text-red-700 dark:text-red-300">
            Your Razorpay account is configured for Indian cards only
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-red-200">
              <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">
                Error Message:
              </h4>
              <p className="text-sm text-red-700 dark:text-red-300 font-mono bg-red-100 dark:bg-red-900/30 p-2 rounded">
                "International cards are not supported. Please contact our support team for help"
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  ✅ What Works
                </h4>
                <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                  <li>• Indian Visa cards (4111 1111 1111 1111)</li>
                  <li>• Indian Mastercard (5555 5555 5555 4444)</li>
                  <li>• RuPay cards (6070 0000 0000 0000)</li>
                  <li>• INR currency only</li>
                  <li>• UPI payments (if enabled)</li>
                </ul>
              </div>

              <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200">
                <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  ❌ What Doesn't Work
                </h4>
                <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                  <li>• International Visa/Mastercard</li>
                  <li>• USD currency payments</li>
                  <li>• Foreign bank cards</li>
                  <li>• Non-Indian issued cards</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-blue-600" />
            Quick Fix - Use Indian Test Cards
          </CardTitle>
          <CardDescription>
            Use these Indian test cards for successful payments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 border border-green-200 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <h4 className="font-semibold text-green-800 dark:text-green-200 mb-3">
                ✅ Success Test Card
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Card Number:</span>
                  <span className="font-mono bg-white dark:bg-gray-800 px-2 py-1 rounded">4111 1111 1111 1111</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Expiry:</span>
                  <span className="font-mono bg-white dark:bg-gray-800 px-2 py-1 rounded">12/25</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">CVV:</span>
                  <span className="font-mono bg-white dark:bg-gray-800 px-2 py-1 rounded">123</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Type:</span>
                  <Badge className="bg-blue-100 text-blue-800">Visa (India)</Badge>
                </div>
              </div>
            </div>

            <div className="p-4 border border-red-200 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <h4 className="font-semibold text-red-800 dark:text-red-200 mb-3">
                ❌ Failure Test Card
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Card Number:</span>
                  <span className="font-mono bg-white dark:bg-gray-800 px-2 py-1 rounded">4000 0000 0000 0002</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Expiry:</span>
                  <span className="font-mono bg-white dark:bg-gray-800 px-2 py-1 rounded">12/25</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">CVV:</span>
                  <span className="font-mono bg-white dark:bg-gray-800 px-2 py-1 rounded">123</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Type:</span>
                  <Badge className="bg-red-100 text-red-800">Visa (India)</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-purple-600" />
            Enable International Cards (Optional)
          </CardTitle>
          <CardDescription>
            Steps to enable international card support in your Razorpay account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                📋 Steps to Enable International Cards:
              </h4>
              <ol className="text-sm text-blue-700 dark:text-blue-300 space-y-2 list-decimal list-inside">
                <li>Log into your Razorpay Dashboard</li>
                <li>Go to <strong>Account & Settings</strong></li>
                <li>Navigate to <strong>Payment Methods</strong></li>
                <li>Look for <strong>International Cards</strong> option</li>
                <li>Enable international card processing</li>
                <li>Complete any required verification</li>
                <li>Contact Razorpay support if option is not available</li>
              </ol>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
                <Phone className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                <h5 className="font-semibold text-sm">Phone Support</h5>
                <p className="text-xs text-muted-foreground">+91 80 4718 4477</p>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
                <Mail className="w-6 h-6 mx-auto mb-2 text-green-600" />
                <h5 className="font-semibold text-sm">Email Support</h5>
                <p className="text-xs text-muted-foreground">support@razorpay.com</p>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
                <ExternalLink className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                <h5 className="font-semibold text-sm">Help Center</h5>
                <p className="text-xs text-muted-foreground">razorpay.com/support</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-600" />
            Current Account Status
          </CardTitle>
          <CardDescription>
            Your Razorpay account configuration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-semibold text-green-600">✅ Supported Features</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Indian Visa/Mastercard/RuPay</li>
                <li>• INR currency payments</li>
                <li>• UPI payments (if enabled)</li>
                <li>• Net Banking</li>
                <li>• Digital Wallets</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-red-600">❌ Not Supported</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• International cards</li>
                <li>• USD/EUR currency</li>
                <li>• Foreign bank cards</li>
                <li>• Cross-border payments</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
