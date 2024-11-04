import { Button } from "@/components/ui/button"
import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
      <h1 className="text-4xl font-bold mb-4">Welcome to Crop Monitor</h1>
      <p className="text-xl mb-8 text-center max-w-2xl">
        Revolutionizing agriculture with AI-powered drone technology for precise crop monitoring and management.
      </p>
      <div className="space-x-4">
        <Button asChild>
          <Link href="/dashboard">View Dashboard</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/about">Learn More</Link>
        </Button>
      </div>
    </div>
  )
}