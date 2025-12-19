import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"
import { AuthProvider } from "@/components/auth-context"
import { NotificationProvider } from "@/components/notification-context"
import { ThemeProvider } from "@/components/theme-provider"
import { SidebarProvider } from "@/components/ui/sidebar"
import { CartProvider } from "@/context/cart-context"
import ConditionalChatBot from "@/components/ConditionalChatBot"
import { Toaster } from "sonner"
import { WishlistProvider } from "@/context/wishlist-context"
import { EnrollmentProvider } from "@/context/enrollment-context"

export const metadata: Metadata = {
  title: "SkillFinte Dashboard",
  description: "Learning Management System",
  generator: "Skillfinite",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "Skillfinite",
    description: "Learning Management System",
    url: "https://skillfinite.com",
    siteName: "Skillfinite",
    images: ["/logo.png"],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  // Prevent layout shift by applying theme immediately
                  var theme = localStorage.getItem('skillfinite-theme');
                  var systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  var activeTheme = theme === 'system' ? systemTheme : (theme || 'light');
                  
                  if (activeTheme === 'dark') {
                    document.documentElement.classList.add('dark');
                  }
                  
                  document.documentElement.style.colorScheme = activeTheme;
                } catch (e) {}
              })();
            `,
          }}
        />
        <style
          dangerouslySetInnerHTML={{
            __html: `
              * {
                box-sizing: border-box;
              }
              
              html {
                font-family: ${GeistSans.style.fontFamily}, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
              }
              
              /* Critical: Prevent layout shift */
              html, body {
                margin: 0;
                padding: 0;
                width: 100%;
                min-height: 100vh;
                overflow-x: hidden;
                position: relative;

              }
              
              body {
                display: flex;
                flex-direction: column;
              }
              
              /* Prevent FOUC */
              html:not(.dark) {
                color-scheme: light;
              }
              
              html.dark {
                color-scheme: dark;
              }
              
              /* Ensure content is always visible during hydration */
              #__next {
                display: flex;
                flex-direction: column;
                min-height: 100vh;
                width: 100%;
              }
            `,
          }}
        />
      </head>
      <body className="bg-background text-foreground antialiased ">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
          storageKey="skillfinite-theme"
        >
          <AuthProvider>
            <CartProvider>
              <WishlistProvider>
                <EnrollmentProvider>
                  <NotificationProvider>
                    <SidebarProvider className="!flex-col w-full">
                      <div className="flex-1 min-w-0 w-full flex flex-col min-h-screen">
                        {children}
                      </div>
                    </SidebarProvider>
                  </NotificationProvider>
                </EnrollmentProvider>
              </WishlistProvider>
            </CartProvider>
          </AuthProvider>
          <ConditionalChatBot />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
