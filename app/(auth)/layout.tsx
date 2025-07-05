import type React from "react"
import Link from "next/link"
import { Briefcase } from "lucide-react"

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="w-full flex justify-center">
      <div className="container flex h-screen w-screen flex-col items-center justify-center">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
          <div className="flex flex-col space-y-2 text-center">
            <Link href="/" className="mx-auto flex items-center justify-center space-x-2">
              <Briefcase className="h-6 w-6" />
              <span className="font-bold">Sarvha</span>
            </Link>
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}
