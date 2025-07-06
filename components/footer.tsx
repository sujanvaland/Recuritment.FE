import Link from "next/link"
import { Briefcase } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-black text-white w-full justify-center">
      <div className="container px-4 py-14 md:px-6" style={{ maxWidth: 1400, margin: "0 auto" }}>
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Logo and Description */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <Briefcase className="h-7 w-7 text-white" />
              <span className="font-bold text-lg">Job</span>
            </div>
            <p className="text-base text-gray-300 font-semibold max-w-xs">
              Quis enim pellentesque viverra tellus eget malesuada facilisis. Congue nibh vivamus aliquet nunc mauris d...
            </p>
          </div>
          {/* Company Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Company</h3>
            <ul className="space-y-2 text-base">
              <li><Link href="/about" className="hover:underline">About Us</Link></li>
              <li><Link href="/team" className="hover:underline">Our Team</Link></li>
              <li><Link href="/partners" className="hover:underline">Partners</Link></li>
              <li><Link href="/candidates" className="hover:underline">For Candidates</Link></li>
              <li><Link href="/employers" className="hover:underline">For Employers</Link></li>
            </ul>
          </div>
          {/* Job Categories */}
          <div>
            <h3 className="text-lg font-bold mb-4">Job Categories</h3>
            <ul className="space-y-2 text-base">
              <li>Telecomunications</li>
              <li>Hotels & Tourism</li>
              <li>Construction</li>
              <li>Education</li>
              <li>Financial Services</li>
            </ul>
          </div>
          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-bold mb-4">Newsletter</h3>
            <p className="text-gray-300 mb-4 text-base">Eu nunc pretium vitae platea. Non netus elementum vulputate</p>
            <form className="flex flex-col gap-4">
              <input
                type="email"
                placeholder="Email Address"
                className="rounded-md border border-gray-400 bg-transparent px-4 py-3 text-white placeholder-gray-400 focus:outline-none"
              />
              <button
                type="submit"
                className="bg-[#309689] hover:bg-emerald-600 text-white font-semibold py-3 rounded-md transition"
              >
                Subscribe now
              </button>
            </form>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-gray-400">
          <p className="mb-4 md:mb-0">
            © Copyright Job Portal {new Date().getFullYear()}. Designed by Figma.guru
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="underline hover:text-white">Privacy Policy</Link>
            <Link href="/terms" className="underline hover:text-white">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
