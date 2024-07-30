import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-400 to-pink-500 flex flex-col items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
          Sultry Seductions: Battle of Desires
        </h1>
        <svg className="mx-auto w-32 h-32 mb-8" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="30" r="20" fill="white" />
          <circle cx="40" cy="20" r="5" fill="purple" />
          <circle cx="60" cy="20" r="5" fill="purple" />
          <circle cx="50" cy="70" r="30" fill="white" />
          <path d="M40 40 Q50 50 60 40" stroke="purple" strokeWidth="3" fill="none" />
        </svg>
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
