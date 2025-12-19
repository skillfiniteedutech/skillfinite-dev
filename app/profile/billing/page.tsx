"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { InvoiceGenerator } from "@/components/invoice-generator"
import { PDFInvoice, downloadInvoiceAsPDF } from "@/components/pdf-invoice"
import UdemyNavbar from "@/components/UdemyNavbar"
import Footer from "@/components/Footer"
import {
  FileText,
  Download,
  Search,
  Filter,
  Calendar,
  CreditCard,
  CheckCircle2,
  Clock,
  XCircle,
  TrendingUp,
  DollarSign,
  Receipt,
  ArrowLeft,
  Eye,
  Printer
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface Invoice {
  id: string
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

export default function BillingHistoryPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)

  useEffect(() => {
    fetchInvoices()
  }, [])

  const fetchInvoices = async () => {
    try {
      setLoading(true)

      // Try to get from localStorage first (for demo purposes)
      const savedInvoices = localStorage.getItem('skillfinite-invoices')
      if (savedInvoices) {
        setInvoices(JSON.parse(savedInvoices))
      } else {
        // Mock data for demonstration
        const mockInvoices: Invoice[] = [
          {
            id: "1",
            invoiceNumber: "INV-2025-001",
            invoiceDate: new Date().toISOString(),
            dueDate: new Date().toISOString(),
            customer: {
              name: "John Doe",
              email: "john.doe@example.com",
              phone: "+91 9876543210"
            },
            items: [
              {
                id: "1",
                description: "Complete Python Bootcamp",
                quantity: 1,
                unitPrice: 479,
                total: 479
              }
            ],
            subtotal: 799,
            discount: 320,
            tax: 0,
            total: 479,
            currency: "INR",
            paymentMethod: "Razorpay",
            paymentStatus: "paid",
            transactionId: "pay_123456789"
          }
        ]
        setInvoices(mockInvoices)
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load billing history"
      })
    } finally {
      setLoading(false)
    }
  }

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.customer.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterStatus === "all" || invoice.paymentStatus === filterStatus
    return matchesSearch && matchesFilter
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid": return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
      case "pending": return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300"
      case "failed": return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
      default: return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid": return <CheckCircle2 className="w-4 h-4" />
      case "pending": return <Clock className="w-4 h-4" />
      case "failed": return <XCircle className="w-4 h-4" />
      default: return null
    }
  }

  const getTotalSpent = () => {
    return invoices
      .filter(inv => inv.paymentStatus === "paid")
      .reduce((sum, inv) => sum + inv.total, 0)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <UdemyNavbar />
        <div className="pt-16 max-w-7xl mx-auto px-4 py-12">
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <UdemyNavbar />

      <main className="pt-16 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => router.push('/profile')}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Profile
            </Button>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent mb-2">
              Billing & Invoices
            </h1>
            <p className="text-muted-foreground">
              View and download your payment history and invoices
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
                <DollarSign className="w-4 h-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">${getTotalSpent().toFixed(2)}</div>
                <p className="text-xs text-muted-foreground mt-1">All-time spending</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
                <Receipt className="w-4 h-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{invoices.length}</div>
                <p className="text-xs text-muted-foreground mt-1">Generated invoices</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Payment Success Rate</CardTitle>
                <TrendingUp className="w-4 h-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">
                  {invoices.length > 0
                    ? Math.round((invoices.filter(inv => inv.paymentStatus === "paid").length / invoices.length) * 100)
                    : 0}%
                </div>
                <p className="text-xs text-muted-foreground mt-1">Successful payments</p>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Filter Invoices
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search by invoice number or name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Invoices List */}
          {selectedInvoice ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <Button
                  variant="outline"
                  onClick={() => setSelectedInvoice(null)}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to List
                </Button>
                <Button
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  onClick={async () => {
                    await downloadInvoiceAsPDF(selectedInvoice)
                    toast({
                      title: "Invoice Downloaded! 📄",
                      description: "Your invoice PDF is ready for download."
                    })
                  }}
                >
                  <Printer className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
              </div>

              {/* PDF Preview */}
              <Card>
                <CardContent className="p-0">
                  <PDFInvoice invoice={selectedInvoice} />
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredInvoices.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No invoices found</h3>
                    <p className="text-muted-foreground mb-4">
                      {searchQuery || filterStatus !== "all"
                        ? "Try adjusting your search or filters"
                        : "You don't have any invoices yet"
                      }
                    </p>
                    {!searchQuery && filterStatus === "all" && (
                      <Button onClick={() => router.push('/courses')}>
                        Browse Courses
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ) : (
                filteredInvoices.map((invoice) => (
                  <Card key={invoice.id} className="hover:shadow-lg transition-all duration-200">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-2">
                            <h3 className="font-bold text-lg">{invoice.invoiceNumber}</h3>
                            <Badge className={getStatusColor(invoice.paymentStatus)}>
                              {getStatusIcon(invoice.paymentStatus)}
                              <span className="ml-1 capitalize">{invoice.paymentStatus}</span>
                            </Badge>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              {new Date(invoice.invoiceDate).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-2">
                              <CreditCard className="w-4 h-4" />
                              {invoice.paymentMethod}
                            </div>
                            <div className="flex items-center gap-2">
                              <DollarSign className="w-4 h-4" />
                              <span className="font-semibold text-foreground">
                                {invoice.currency === 'INR' ? '$' : '$'}{invoice.total.toFixed(2)}
                              </span>
                            </div>
                          </div>
                          <div className="mt-2 text-sm">
                            <p className="text-muted-foreground">
                              {invoice.items.length} item{invoice.items.length > 1 ? 's' : ''}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedInvoice(invoice)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </Button>
                          <Button
                            size="sm"
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                            onClick={async () => {
                              await downloadInvoiceAsPDF(invoice)
                              toast({
                                title: "Invoice Ready! 📄",
                                description: "Your invoice is being prepared for download."
                              })
                            }}
                          >
                            <Download className="w-4 h-4 mr-2" />
                            PDF
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
