import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const Game = () => {
  const [player1Score, setPlayer1Score] = useState(0)
  const [player2Score, setPlayer2Score] = useState(0)

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-400 to-pink-500 p-4">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-white">Terrible Teddies</h1>
          <div className="flex space-x-4">
            <div className="text-white">Player 1: {player1Score}</div>
            <div className="text-white">Player 2: {player2Score}</div>
          </div>
        </header>

        <div className="grid grid-cols-3 gap-4">
          <PlayerArea player="Player 1" />
          <GameBoard />
          <PlayerArea player="Player 2" />
        </div>

        <div className="mt-8 text-center">
          <Button variant="secondary">End Turn</Button>
        </div>
      </div>
    </div>
  )
}

const PlayerArea = ({ player }) => (
  <div className="bg-white rounded-lg p-4">
    <div className="flex items-center mb-4">
      <Avatar>
        <AvatarImage src="/placeholder.svg" alt={player} />
        <AvatarFallback>{player[0]}</AvatarFallback>
      </Avatar>
      <span className="ml-2 font-semibold">{player}</span>
    </div>
    <div className="grid grid-cols-2 gap-2">
      {[1, 2, 3, 4].map((card) => (
        <Card key={card} className="h-24">
          <CardContent className="flex items-center justify-center h-full">
            Card {card}
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
)

const GameBoard = () => (
  <div className="bg-green-100 rounded-lg p-4">
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-blue-200 rounded h-40 flex items-center justify-center">
        Player 1 Area
      </div>
      <div className="bg-red-200 rounded h-40 flex items-center justify-center">
        Player 2 Area
      </div>
    </div>
  </div>
)

export default Game