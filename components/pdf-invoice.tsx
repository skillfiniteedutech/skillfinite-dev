"use client"

import React from "react"

interface InvoiceItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  total: number
}

interface Invoice {
  invoiceNumber: string
  invoiceDate: string
  dueDate: string
  customer: {
    name: string
    email: string
    phone: string
    address?: string
  }
  items: InvoiceItem[]
  subtotal: number
  discount: number
  tax: number
  total: number
  currency: string
  paymentMethod: string
  paymentStatus: "paid" | "pending" | "failed"
  transactionId?: string
}

interface PDFInvoiceProps {
  invoice: Invoice
}

export const PDFInvoice: React.FC<PDFInvoiceProps> = ({ invoice }) => {
  const currencySymbol = invoice.currency === 'INR' ? '$' : '$'
  const invoiceDate = new Date(invoice.invoiceDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
  const dueDate = new Date(invoice.dueDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <div id="invoice-pdf" className="bg-white p-8 max-w-4xl mx-auto" style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Header with Company Logo */}
      <div className="flex justify-between items-start mb-8 pb-6 border-b-2 border-blue-600">
        <div>
          {/* Company Logo and Name */}
          <div className="flex items-center gap-3 mb-3">
            <div className="relative w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
                Skillfinite
              </h1>
              <p className="text-xs text-gray-500">Learn. Grow. Excel.</p>
            </div>
          </div>

          {/* Company Details */}
          <div className="text-sm text-gray-600 space-y-1">
            <p className="font-semibold">Skillfinite Learning Platform</p>
            <p>123 Education Street, Tech City</p>
            <p>Mumbai, Maharashtra 400001</p>
            <p>India</p>
            <p>Email: support@skillfinite.com</p>
            <p>Phone: +91 1800-123-4567</p>
            <p>Website: www.skillfinite.com</p>
            <p className="font-semibold mt-2">GSTIN: 27AABCU9603R1ZM</p>
          </div>
        </div>

        <div className="text-right">
          <div className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg mb-4">
            <h2 className="text-2xl font-bold">INVOICE</h2>
          </div>
          <div className="text-sm text-gray-600 space-y-1">
            <p><span className="font-semibold">Invoice #:</span> {invoice.invoiceNumber}</p>
            <p><span className="font-semibold">Date:</span> {invoiceDate}</p>
            <p><span className="font-semibold">Due Date:</span> {dueDate}</p>
            {invoice.transactionId && (
              <p><span className="font-semibold">Transaction ID:</span> {invoice.transactionId}</p>
            )}
            <div className="mt-3">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${invoice.paymentStatus === 'paid'
                  ? 'bg-green-100 text-green-800'
                  : invoice.paymentStatus === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                {invoice.paymentStatus.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bill To Section */}
      <div className="mb-8">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Bill To:
          </h3>
          <div className="text-sm text-gray-700 space-y-1">
            <p className="font-semibold text-base">{invoice.customer.name}</p>
            <p>{invoice.customer.email}</p>
            <p>{invoice.customer.phone}</p>
            {invoice.customer.address && <p>{invoice.customer.address}</p>}
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="mb-8">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <th className="text-left p-3 font-semibold">#</th>
              <th className="text-left p-3 font-semibold">Description</th>
              <th className="text-right p-3 font-semibold">Qty</th>
              <th className="text-right p-3 font-semibold">Unit Price</th>
              <th className="text-right p-3 font-semibold">Total</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, index) => (
              <tr key={item.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                <td className="p-3 border-b border-gray-200">{index + 1}</td>
                <td className="p-3 border-b border-gray-200">
                  <div className="font-medium text-gray-800">{item.description}</div>
                  <div className="text-xs text-gray-500">Course Enrollment</div>
                </td>
                <td className="p-3 border-b border-gray-200 text-right">{item.quantity}</td>
                <td className="p-3 border-b border-gray-200 text-right">{currencySymbol}{item.unitPrice.toFixed(2)}</td>
                <td className="p-3 border-b border-gray-200 text-right font-semibold">{currencySymbol}{item.total.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals Section */}
      <div className="flex justify-end mb-8">
        <div className="w-64">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-medium">{currencySymbol}{invoice.subtotal.toFixed(2)}</span>
            </div>

            {invoice.discount > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Discount:</span>
                <span className="font-medium">-{currencySymbol}{invoice.discount.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tax (18% GST):</span>
              <span className="font-medium">{currencySymbol}{invoice.tax.toFixed(2)}</span>
            </div>

            <div className="border-t-2 border-gray-300 pt-2 mt-2">
              <div className="flex justify-between">
                <span className="text-lg font-bold text-gray-800">Total Amount:</span>
                <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
                  {currencySymbol}{invoice.total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Details */}
      <div className="mb-8 bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h3 className="text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">
          <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
          Payment Information
        </h3>
        <div className="text-sm text-gray-700 space-y-1">
          <p><span className="font-semibold">Payment Method:</span> {invoice.paymentMethod}</p>
          <p><span className="font-semibold">Payment Status:</span>
            <span className={`ml-2 font-semibold ${invoice.paymentStatus === 'paid' ? 'text-green-600' :
                invoice.paymentStatus === 'pending' ? 'text-yellow-600' : 'text-red-600'
              }`}>
              {invoice.paymentStatus.charAt(0).toUpperCase() + invoice.paymentStatus.slice(1)}
            </span>
          </p>
          {invoice.transactionId && (
            <p><span className="font-semibold">Reference:</span> {invoice.transactionId}</p>
          )}
        </div>
      </div>

      {/* Terms and Conditions */}
      <div className="mb-8 text-xs text-gray-600 space-y-2">
        <h3 className="font-bold text-sm text-gray-800 mb-2">Terms & Conditions:</h3>
        <ul className="list-disc list-inside space-y-1 pl-2">
          <li>All courses are delivered digitally through our online learning platform.</li>
          <li>Access to enrolled courses is lifetime unless otherwise specified.</li>
          <li>Refunds are subject to our refund policy available on our website.</li>
          <li>For support, please contact our customer service team.</li>
          <li>This is a computer-generated invoice and requires no signature.</li>
        </ul>
      </div>

      {/* Footer */}
      <div className="border-t-2 border-gray-300 pt-6">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-gray-800">Thank you for choosing Skillfinite!</p>
          </div>
          <p className="text-xs text-gray-500">
            Your learning journey matters to us. If you have any questions about this invoice,
          </p>
          <p className="text-xs text-gray-500">
            please contact us at <span className="text-blue-600 font-semibold">billing@skillfinite.com</span> or call <span className="text-blue-600 font-semibold">+91 1800-123-4567</span>
          </p>
          <p className="text-xs text-gray-400 mt-4 pt-4 border-t border-gray-200">
            © {new Date().getFullYear()} Skillfinite Learning Platform. All rights reserved.
          </p>
          <div className="flex items-center justify-center gap-4 text-xs text-gray-400 mt-2">
            <a href="#" className="hover:text-blue-600">Privacy Policy</a>
            <span>•</span>
            <a href="#" className="hover:text-blue-600">Terms of Service</a>
            <span>•</span>
            <a href="#" className="hover:text-blue-600">Help Center</a>
          </div>
        </div>
      </div>

      {/* Watermark for Paid Invoices */}
      {invoice.paymentStatus === 'paid' && (
        <div className="text-center mt-8">
          <div className="inline-block relative">
            <div className="text-green-600 opacity-20 text-6xl font-bold transform -rotate-12">
              PAID
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Function to download invoice as PDF
export const downloadInvoiceAsPDF = async (invoice: Invoice) => {
  // Create a new window with the invoice content
  const printWindow = window.open('', '_blank')

  if (!printWindow) {
    alert('Please allow popups to download the invoice')
    return
  }

  const invoiceHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Invoice ${invoice.invoiceNumber}</title>
      <meta charset="UTF-8">
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: Arial, sans-serif;
          padding: 20px;
          background: white;
        }
        .invoice-container {
          max-width: 800px;
          margin: 0 auto;
          background: white;
          padding: 40px;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 40px;
          padding-bottom: 30px;
          border-bottom: 3px solid #2563eb;
        }
        .company-logo {
          display: flex;
          align-items: center;
          gap: 15px;
        }
        .logo-icon {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .company-details {
          font-size: 12px;
          color: #6b7280;
          line-height: 1.6;
        }
        .company-name {
          font-size: 28px;
          font-weight: bold;
          background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 5px;
        }
        .invoice-title {
          background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%);
          color: white;
          padding: 15px 30px;
          border-radius: 8px;
          font-size: 24px;
          font-weight: bold;
          text-align: center;
          margin-bottom: 20px;
        }
        .invoice-details {
          font-size: 13px;
          color: #6b7280;
          line-height: 1.8;
        }
        .status-badge {
          display: inline-block;
          padding: 6px 16px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: bold;
          margin-top: 10px;
        }
        .status-paid {
          background: #d1fae5;
          color: #065f46;
        }
        .status-pending {
          background: #fef3c7;
          color: #92400e;
        }
        .bill-to {
          background: #f9fafb;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 30px;
        }
        .bill-to h3 {
          font-size: 16px;
          color: #1f2937;
          margin-bottom: 15px;
        }
        .bill-to-details {
          font-size: 13px;
          color: #4b5563;
          line-height: 1.8;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 30px;
        }
        thead {
          background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%);
          color: white;
        }
        th {
          padding: 15px;
          text-align: left;
          font-size: 13px;
          font-weight: 600;
        }
        td {
          padding: 15px;
          border-bottom: 1px solid #e5e7eb;
          font-size: 13px;
        }
        tbody tr:nth-child(even) {
          background: #f9fafb;
        }
        .totals {
          display: flex;
          justify-content: flex-end;
          margin-bottom: 30px;
        }
        .totals-table {
          width: 300px;
        }
        .totals-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          font-size: 13px;
        }
        .totals-row.total {
          border-top: 2px solid #d1d5db;
          margin-top: 10px;
          padding-top: 15px;
          font-size: 16px;
          font-weight: bold;
        }
        .payment-info {
          background: #eff6ff;
          border: 1px solid #bfdbfe;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 30px;
          font-size: 13px;
        }
        .terms {
          font-size: 11px;
          color: #6b7280;
          margin-bottom: 30px;
        }
        .terms h3 {
          font-size: 13px;
          color: #1f2937;
          margin-bottom: 10px;
        }
        .terms ul {
          padding-left: 20px;
        }
        .terms li {
          margin-bottom: 5px;
          line-height: 1.6;
        }
        .footer {
          text-align: center;
          padding-top: 30px;
          border-top: 2px solid #e5e7eb;
          font-size: 11px;
          color: #9ca3af;
        }
        .footer-highlight {
          color: #2563eb;
          font-weight: 600;
        }
        @media print {
          body {
            padding: 0;
          }
          .invoice-container {
            padding: 20px;
          }
        }
      </style>
    </head>
    <body>
      <div class="invoice-container">
        <div class="header">
          <div>
            <div class="company-logo">
              <div class="logo-icon">
                <svg width="40" height="40" fill="white" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <div class="company-name">Skillfinite</div>
                <div style="font-size: 11px; color: #9ca3af;">Learn. Grow. Excel.</div>
              </div>
            </div>
            <div class="company-details" style="margin-top: 20px;">
              <strong>Skillfinite Learning Platform</strong><br>
              123 Education Street, Tech City<br>
              Mumbai, Maharashtra 400001<br>
              India<br>
              Email: support@skillfinite.com<br>
              Phone: +91 1800-123-4567<br>
              Website: www.skillfinite.com<br>
              <strong>GSTIN: 27AABCU9603R1ZM</strong>
            </div>
          </div>
          <div style="text-align: right;">
            <div class="invoice-title">INVOICE</div>
            <div class="invoice-details">
              <strong>Invoice #:</strong> ${invoice.invoiceNumber}<br>
              <strong>Date:</strong> ${new Date(invoice.invoiceDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}<br>
              <strong>Due Date:</strong> ${new Date(invoice.dueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}<br>
              ${invoice.transactionId ? `< strong > Transaction ID:</strong> ${invoice.transactionId} <br>` : ''}
    <span class="status-badge status-${invoice.paymentStatus}">${invoice.paymentStatus.toUpperCase()}</span>
  </div>
          </div >
        </div >

  <div class="bill-to">
    <h3>Bill To:</h3>
    <div class="bill-to-details">
      <strong style="font-size: 14px;">${invoice.customer.name}</strong><br>
        ${invoice.customer.email}<br>
          ${invoice.customer.phone}<br>
            ${invoice.customer.address || ''}
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Description</th>
              <th style="text-align: right;">Qty</th>
              <th style="text-align: right;">Unit Price</th>
              <th style="text-align: right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${invoice.items.map((item, index) => `
              <tr>
                <td>${index + 1}</td>
                <td>
                  <strong>${item.description}</strong><br>
                  <span style="font-size: 11px; color: #6b7280;">Course Enrollment</span>
                </td>
                <td style="text-align: right;">${item.quantity}</td>
                <td style="text-align: right;">${invoice.currency === 'INR' ? '$' : '$'}${item.unitPrice.toFixed(2)}</td>
                <td style="text-align: right;"><strong>${invoice.currency === 'INR' ? '$' : '$'}${item.total.toFixed(2)}</strong></td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="totals">
          <div class="totals-table">
            <div class="totals-row">
              <span>Subtotal:</span>
              <span>${invoice.currency === 'INR' ? '$' : '$'}${invoice.subtotal.toFixed(2)}</span>
            </div>
            ${invoice.discount > 0 ? `
              <div class="totals-row" style="color: #059669;">
                <span>Discount:</span>
                <span>-${invoice.currency === 'INR' ? '$' : '$'}${invoice.discount.toFixed(2)}</span>
              </div>
            ` : ''}
            <div class="totals-row">
              <span>Tax (18% GST):</span>
              <span>${invoice.currency === 'INR' ? '$' : '$'}${invoice.tax.toFixed(2)}</span>
            </div>
            <div class="totals-row total">
              <span>Total Amount:</span>
              <span style="color: #2563eb;">${invoice.currency === 'INR' ? '$' : '$'}${invoice.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div class="payment-info">
          <h3 style="font-size: 13px; margin-bottom: 10px; color: #1e40af;"><strong>Payment Information</strong></h3>
          <strong>Payment Method:</strong> ${invoice.paymentMethod}<br>
            <strong>Payment Status:</strong> <span style="color: ${invoice.paymentStatus === 'paid' ? '#059669' : '#d97706'};">${invoice.paymentStatus.charAt(0).toUpperCase() + invoice.paymentStatus.slice(1)}</span><br>
              ${invoice.transactionId ? `<strong>Reference:</strong> ${invoice.transactionId}` : ''}
            </div>

            <div class="terms">
              <h3>Terms & Conditions:</h3>
              <ul>
                <li>All courses are delivered digitally through our online learning platform.</li>
                <li>Access to enrolled courses is lifetime unless otherwise specified.</li>
                <li>Refunds are subject to our refund policy available on our website.</li>
                <li>For support, please contact our customer service team.</li>
                <li>This is a computer-generated invoice and requires no signature.</li>
              </ul>
            </div>

            <div class="footer">
              <p style="font-size: 13px; font-weight: 600; color: #1f2937; margin-bottom: 10px;">Thank you for choosing Skillfinite!</p>
              <p>Your learning journey matters to us. If you have any questions about this invoice,</p>
              <p>please contact us at <span class="footer-highlight">billing@skillfinite.com</span> or call <span class="footer-highlight">+91 1800-123-4567</span></p>
              <p style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                © ${new Date().getFullYear()} Skillfinite Learning Platform. All rights reserved.
              </p>
              <p style="margin-top: 10px;">
                <a href="#" style="color: #6b7280;">Privacy Policy</a> •
                <a href="#" style="color: #6b7280;">Terms of Service</a> •
                <a href="#" style="color: #6b7280;">Help Center</a>
              </p>
            </div>
        </div>
      </body>
    </html>
    `

  printWindow.document.write(invoiceHTML)
  printWindow.document.close()

  // Wait for content to load before printing
  printWindow.onload = () => {
    setTimeout(() => {
      printWindow.print()
      // Close window after printing (optional)
      // printWindow.close()
    }, 250)
  }
}

