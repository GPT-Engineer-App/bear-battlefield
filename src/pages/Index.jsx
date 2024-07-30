import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-400 to-pink-500 flex flex-col items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
          Sultry Seductions: Battle of Desires
        </h1>
        <img src="/placeholder.svg" alt="Silhouette Logo" className="mx-auto object-cover w-32 h-32 mb-8" />
        <div className="space-y-4">
          <Button asChild className="w-full max-w-xs text-lg">
            <Link to="/game">Start New Game</Link>
          </Button>
          <Button asChild variant="secondary" className="w-full max-w-xs text-lg">
            <Link to="/rules">View Rules</Link>
          </Button>
          <Button asChild variant="outline" className="w-full max-w-xs text-lg">
            <Link to="/settings">Settings</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Index
