// app/page.tsx
import { MainNav } from "@/components/main-nav";
import MainHome from "./(main)/page";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <header className="sticky top-0 z-50 border-b bg-black w-full items-center flex justify-center">
        <div className="container flex h-16 items-center px-4 md:px-6">
          <MainNav />
        </div>
      </header>
        <main className="flex-1 w-full"><MainHome /></main>
        <Footer />
      </div>
  )
}
