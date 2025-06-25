import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <div className="text-center">
          <h2 className="text-lg font-semibold">Loading...</h2>
          <p className="text-sm text-muted-foreground">Please wait while we load your content</p>
        </div>
      </div>
    </div>
  )
}
