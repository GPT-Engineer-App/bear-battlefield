import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

const Rules = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-400 to-pink-500 p-4 flex flex-col items-center justify-center">
      <div className="bg-white rounded-lg p-8 max-w-2xl w-full">
        <h1 className="text-3xl font-bold mb-6 text-center">Game Rules</h1>
        <div className="space-y-4 mb-6">
          <p>1. Each player starts with a hand of 5 seduction cards.</p>
          <p>2. Players take turns playing cards to seduce or charm their opponent.</p>
          <p>3. Cards have seduction and resistance values, along with special abilities.</p>
          <p>4. The goal is to reduce your opponent's willpower to zero.</p>
          <p>5. Be prepared for steamy encounters and passionate twists!</p>
        </div>
        <div className="text-center">
          <Button asChild>
            <Link to="/">Back to Main Menu</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Rules
