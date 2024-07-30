import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import GameBoard from "../components/GameBoard"
import PlayerHand from "../components/PlayerHand"
import { initialDeck } from "../data/cards"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import GameBoard from "../components/GameBoard"
import PlayerHand from "../components/PlayerHand"
import { initialDeck } from "../data/cards"
import { run_game_development } from "../ai/game_development"

const Game = () => {
  const [player1, setPlayer1] = useState({
    name: "Player 1",
    health: 30,
    deck: [...initialDeck],
    hand: [],
    field: [],
  })
  const [aiResult, setAiResult] = useState(null)
  const [player2, setPlayer2] = useState({
    name: "Player 2",
    health: 30,
    deck: [...initialDeck],
    hand: [],
    field: [],
  })
  const [currentPlayer, setCurrentPlayer] = useState(1)
  const [gamePhase, setGamePhase] = useState("setup")

  useEffect(() => {
    if (gamePhase === "setup") {
      setupGame()
    }
  }, [gamePhase])

  const setupGame = () => {
    drawInitialHands()
    setGamePhase("draw")
  }

  const drawInitialHands = () => {
    setPlayer1(prev => ({ ...prev, hand: prev.deck.slice(0, 5), deck: prev.deck.slice(5) }))
    setPlayer2(prev => ({ ...prev, hand: prev.deck.slice(0, 5), deck: prev.deck.slice(5) }))
  }

  const drawCard = (player) => {
    if (player === 1) {
      if (player1.deck.length > 0) {
        const [drawnCard, ...remainingDeck] = player1.deck
        setPlayer1(prev => ({
          ...prev,
          hand: [...prev.hand, drawnCard],
          deck: remainingDeck
        }))
      }
    } else {
      if (player2.deck.length > 0) {
        const [drawnCard, ...remainingDeck] = player2.deck
        setPlayer2(prev => ({
          ...prev,
          hand: [...prev.hand, drawnCard],
          deck: remainingDeck
        }))
      }
    }
  }

  const endTurn = () => {
    setCurrentPlayer(currentPlayer === 1 ? 2 : 1)
    setGamePhase("draw")
  }

  const handlePhaseChange = () => {
    switch (gamePhase) {
      case "draw":
        drawCard(currentPlayer)
        setGamePhase("play")
        break
      case "play":
        setGamePhase("battle")
        break
      case "battle":
        setGamePhase("end")
        break
      case "end":
        endTurn()
        break
      default:
        break
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-400 to-pink-500 p-4">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-white">Sultry Seductions</h1>
          <div className="flex space-x-4">
            <div className="text-white">Player 1: {player1.health} HP</div>
            <div className="text-white">Player 2: {player2.health} HP</div>
          </div>
        </header>

        <div className="grid grid-cols-3 gap-4">
          <PlayerHand player={player1} isCurrentPlayer={currentPlayer === 1} />
          <GameBoard player1={player1} player2={player2} />
          <PlayerHand player={player2} isCurrentPlayer={currentPlayer === 2} />
        </div>

        <div className="mt-8 text-center space-y-4">
          <Button onClick={handlePhaseChange} variant="secondary">
            {gamePhase === "end" ? "End Turn" : `Next Phase (${gamePhase})`}
          </Button>
          <Button onClick={handleAiDevelopment} variant="primary" disabled={aiResult !== null}>
            {aiResult ? "AI Development Complete" : "Run AI Game Development"}
          </Button>
          {aiResult && (
            <Card className="mt-4">
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold mb-2">AI Development Result:</h3>
                <p className="whitespace-pre-wrap">{aiResult}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

const handleAiDevelopment = async () => {
  try {
    const result = await run_game_development()
    setAiResult(result)
  } catch (error) {
    console.error("Error running AI game development:", error)
    setAiResult("An error occurred while running AI game development.")
  }
}

export default Game
