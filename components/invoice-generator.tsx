"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Download, FileText, CheckCircle2 } from "lucide-react"

interface InvoiceData {
  invoiceNumber: string
  invoiceDate: string
  dueDate: string
  customer: {
    name: string
    email: string
    phone: string
    address?: string
  }
  items: Array<{
    id: string
    description: string
    quantity: number
    unitPrice: number
    total: number
  }>
  subtotal: number
  discount: number
  tax: number
  total: number
  currency: string
  paymentMethod: string
  paymentStatus: "paid" | "pending" | "failed"
  transactionId?: string
}

interface InvoiceGeneratorProps {
  invoiceData: InvoiceData
  onDownload?: () => void
}

export function InvoiceGenerator({ invoiceData, onDownload }: InvoiceGeneratorProps) {
  const formatCurrency = (amount: number) => {
    return `${invoiceData.currency === 'INR' ? '$' : '$'}${amount.toFixed(2)}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const downloadInvoice = () => {
    // Create invoice HTML
    const invoiceHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invoice ${invoiceData.invoiceNumber}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, sans-serif; padding: 40px; color: #333; }
    .invoice-container { max-width: 800px; margin: 0 auto; background: white; padding: 40px; box-shadow: 0 0 20px rgba(0,0,0,0.1); }
    .invoice-header { display: flex; justify-content: space-between; align-items: start; margin-bottom: 40px; border-bottom: 3px solid #4F46E5; padding-bottom: 20px; }
    .company-info h1 { color: #4F46E5; font-size: 28px; margin-bottom: 5px; }
    .company-info p { color: #666; font-size: 14px; }
    .invoice-details { text-align: right; }
    .invoice-details h2 { font-size: 24px; color: #333; margin-bottom: 10px; }
    .invoice-details p { color: #666; font-size: 14px; margin: 5px 0; }
    .status-badge { display: inline-block; padding: 5px 15px; background: #10B981; color: white; border-radius: 20px; font-size: 12px; font-weight: bold; margin-top: 10px; }
    .billing-info { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 40px; }
    .billing-section h3 { color: #4F46E5; font-size: 14px; margin-bottom: 10px; text-transform: uppercase; }
    .billing-section p { color: #666; font-size: 14px; line-height: 1.6; }
    .items-table { width: 100%; margin-bottom: 30px; border-collapse: collapse; }
    .items-table thead { background: #F3F4F6; }
    .items-table th { padding: 12px; text-align: left; color: #4F46E5; font-size: 12px; text-transform: uppercase; border-bottom: 2px solid #E5E7EB; }
    .items-table td { padding: 12px; border-bottom: 1px solid #E5E7EB; }
    .items-table tbody tr:hover { background: #F9FAFB; }
    .totals { margin-left: auto; width: 300px; }
    .totals-row { display: flex; justify-content: space-between; padding: 10px 0; font-size: 14px; }
    .totals-row.subtotal { color: #666; }
    .totals-row.discount { color: #10B981; }
    .totals-row.total { font-size: 18px; font-weight: bold; color: #4F46E5; border-top: 2px solid #E5E7EB; padding-top: 15px; margin-top: 10px; }
    .payment-info { background: #F9FAFB; padding: 20px; border-radius: 8px; margin-top: 30px; }
    .payment-info h3 { color: #4F46E5; font-size: 14px; margin-bottom: 10px; }
    .payment-info p { color: #666; font-size: 14px; margin: 5px 0; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #E5E7EB; text-align: center; color: #999; font-size: 12px; }
    @media print { body { padding: 0; } .invoice-container { box-shadow: none; } }
  </style>
</head>
<body>
  <div class="invoice-container">
    <div class="invoice-header">
      <div class="company-info">
        <h1>Skillfinite</h1>
        <p>Premium E-Learning Platform</p>
        <p>support@skillfinite.com</p>
        <p>www.skillfinite.com</p>
      </div>
      <div class="invoice-details">
        <h2>INVOICE</h2>
        <p><strong>Invoice #:</strong> ${invoiceData.invoiceNumber}</p>
        <p><strong>Date:</strong> ${formatDate(invoiceData.invoiceDate)}</p>
        <p><strong>Due Date:</strong> ${formatDate(invoiceData.dueDate)}</p>
        <span class="status-badge">${invoiceData.paymentStatus.toUpperCase()}</span>
      </div>
    </div>

    <div class="billing-info">
      <div class="billing-section">
        <h3>Bill To:</h3>
        <p><strong>${invoiceData.customer.name}</strong></p>
        <p>${invoiceData.customer.email}</p>
        <p>${invoiceData.customer.phone}</p>
        ${invoiceData.customer.address ? `<p>${invoiceData.customer.address}</p> ` : ''}
      </div>
      <div class="billing-section">
        <h3>Payment Details:</h3>
        <p><strong>Method:</strong> ${invoiceData.paymentMethod}</p>
        ${invoiceData.transactionId ? `< p > <strong>Transaction ID:</strong> ${invoiceData.transactionId}</p > ` : ''}
        <p><strong>Status:</strong> ${invoiceData.paymentStatus === 'paid' ? 'Paid in Full' : 'Pending'}</p>
      </div>
    </div>

    <table class="items-table">
      <thead>
        <tr>
          <th>Description</th>
          <th style="text-align: center;">Qty</th>
          <th style="text-align: right;">Unit Price</th>
          <th style="text-align: right;">Total</th>
        </tr>
      </thead>
      <tbody>
        ${invoiceData.items.map(item => `
      < tr >
            <td>${item.description}</td>
            <td style="text-align: center;">${item.quantity}</td>
            <td style="text-align: right;">${formatCurrency(item.unitPrice)}</td>
            <td style="text-align: right;">${formatCurrency(item.total)}</td>
          </tr >
    `).join('')}
      </tbody>
    </table>

    <div class="totals">
      <div class="totals-row subtotal">
        <span>Subtotal</span>
        <span>${formatCurrency(invoiceData.subtotal)}</span>
      </div>
      ${invoiceData.discount > 0 ? `
    < div class="totals-row discount" >
        <span>Discount</span>
        <span>-${formatCurrency(invoiceData.discount)}</span>
      </div >
    ` : ''}
      <div class="totals-row subtotal">
        <span>Tax</span>
        <span>${formatCurrency(invoiceData.tax)}</span>
      </div>
      <div class="totals-row total">
        <span>TOTAL</span>
        <span>${formatCurrency(invoiceData.total)}</span>
      </div>
    </div>

    <div class="payment-info">
      <h3>Thank you for your purchase!</h3>
      <p>Your courses are now available in your dashboard. Start learning today!</p>
      <p><strong>Need help?</strong> Contact us at support@skillfinite.com</p>
    </div>

    <div class="footer">
      <p>This is a computer-generated invoice. No signature is required.</p>
      <p>&copy; ${new Date().getFullYear()} Skillfinite. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
    `

    // Create blob and download
    const blob = new Blob([invoiceHTML], { type: 'text/html' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `Invoice-${invoiceData.invoiceNumber}.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)

    if (onDownload) {
      onDownload()
    }
  }

  return (
    <Card className="border-2 border-blue-200 dark:border-blue-800">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-full">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Invoice #{invoiceData.invoiceNumber}</h3>
              <p className="text-sm text-muted-foreground">
                {formatDate(invoiceData.invoiceDate)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {invoiceData.paymentStatus === 'paid' && (
              <div className="flex items-center gap-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-3 py-1 rounded-full">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-sm font-semibold">Paid</span>
              </div>
            )}
            <Button onClick={downloadInvoice} size="sm" className="bg-blue-600 hover:bg-blue-700">
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <h4 className="font-semibold mb-2 text-sm text-muted-foreground">Bill To:</h4>
            <p className="font-medium">{invoiceData.customer.name}</p>
            <p className="text-sm text-muted-foreground">{invoiceData.customer.email}</p>
            <p className="text-sm text-muted-foreground">{invoiceData.customer.phone}</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2 text-sm text-muted-foreground">Payment Details:</h4>
            <p className="text-sm">Method: <span className="font-medium">{invoiceData.paymentMethod}</span></p>
            {invoiceData.transactionId && (
              <p className="text-sm">Transaction: <span className="font-medium">{invoiceData.transactionId}</span></p>
            )}
          </div>
        </div>

        <Separator className="my-4" />

        <div className="space-y-2">
          {invoiceData.items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span>{item.description} (x{item.quantity})</span>
              <span className="font-medium">{formatCurrency(item.total)}</span>
            </div>
          ))}
        </div>

        <Separator className="my-4" />

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>{formatCurrency(invoiceData.subtotal)}</span>
          </div>
          {invoiceData.discount > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span>Discount</span>
              <span>-{formatCurrency(invoiceData.discount)}</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span>Tax</span>
            <span>{formatCurrency(invoiceData.tax)}</span>
          </div>
          <Separator />
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span className="text-blue-600">{formatCurrency(invoiceData.total)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

