import Link from "next/link"
import { Briefcase } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="container px-4 py-12 md:px-6">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Briefcase className="h-6 w-6" />
              <span className="font-bold">JobConnect</span>
            </div>
            <p className="text-sm text-gray-500">
              Connecting talented professionals with their dream jobs and helping employers find the perfect candidates.
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-bold">For Job Seekers</h3>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>
                <Link href="/jobs" className="hover:underline">
                  Browse Jobs
                </Link>
              </li>
              <li>
                <Link href="/profile" className="hover:underline">
                  Create Profile
                </Link>
              </li>
              <li>
                <Link href="/saved-jobs" className="hover:underline">
                  Saved Jobs
                </Link>
              </li>
              <li>
                <Link href="/job-alerts" className="hover:underline">
                  Job Alerts
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-bold">For Employers</h3>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>
                <Link href="/employers" className="hover:underline">
                  Post a Job
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:underline">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/employer-resources" className="hover:underline">
                  Resources
                </Link>
              </li>
              <li>
                <Link href="/employer-faq" className="hover:underline">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Company</h3>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>
                <Link href="/about" className="hover:underline">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:underline">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:underline">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:underline">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t pt-8 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} JobConnect. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
