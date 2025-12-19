"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"

export default function NewsletterSection() {
  const [email, setEmail] = useState("")

  return (
    <section className="py-12 bg-blue-600 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-3">Join 5000+ Learners</h2>
        <p className="text-lg mb-6 opacity-90">Stay updated with the latest insights and resources.</p>
        <p className="mb-6 opacity-75 text-sm">We respect your privacy. Read our policy for details.</p>
        <div className="flex justify-center max-w-sm mx-auto">
          <div className="flex w-full">
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="rounded-r-none bg-white text-gray-900 border-white text-sm py-2"
              suppressHydrationWarning
            />
            <Button
              className="rounded-l-none bg-blue-600 hover:bg-blue-700 border-blue-600 text-sm py-2"
              suppressHydrationWarning
            >
              Subscribe
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
