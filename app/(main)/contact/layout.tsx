import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contact Us - Sarvha | Get in Touch with Our Team",
  description: "Contact Sarvha for support, partnerships, or inquiries. Multiple ways to reach us including email, phone, and our contact form. We're here to help!",
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
