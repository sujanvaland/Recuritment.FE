import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"

import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/contexts/auth-context"
import { Toaster } from "sonner"; // or your toast library's provider


import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "JobConnect - Find Your Dream Job",
  description: "Connect with top employers and discover opportunities that match your skills and aspirations.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light">
          <AuthProvider>{children}  <Toaster position="top-center" richColors /> {/* Sonner example */}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
