import { Metadata } from "next"

export const metadata: Metadata = {
  title: "About Us - Sarvha | Connecting Talent with Opportunity",
  description: "Learn about Sarvha's mission to revolutionize recruitment. Discover our story, values, and the passionate team working to transform the future of work.",
}

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
