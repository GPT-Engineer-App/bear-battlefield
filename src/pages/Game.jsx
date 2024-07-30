import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "sonner"
import GameBoard from "../components/GameBoard"
import PlayerHand from "../components/PlayerHand"
import { initialDeck } from "../data/cards"

const Game = () => {
  const [players, setPlayers] = useState([
    {
      id: 1,
      name: "Player 1",
      health: 30,
      deck: [...initialDeck],
      hand: [],
      field: [],
    },
    {
      id: 2,
      name: "Player 2",
      health: 30,
      deck: [...initialDeck],
      hand: [],
      field: [],
    }
  ])
  const [currentPlayerId, setCurrentPlayerId] = useState(1)
  const [gamePhase, setGamePhase] = useState("setup")
  const [selectedCard, setSelectedCard] = useState(null)

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

  const drawCard = (playerId) => {
    setPlayers(prevPlayers => prevPlayers.map(player => {
      if (player.id === playerId && player.deck.length > 0) {
        const [drawnCard, ...remainingDeck] = player.deck
        return {
          ...player,
          hand: [...player.hand, drawnCard],
          deck: remainingDeck
        }
      }
      return player
    }))
  }

  const playCard = (cardIndex) => {
    const currentPlayer = players.find(p => p.id === currentPlayerId)
    if (currentPlayer.hand[cardIndex].type === 'character') {
      setPlayers(prevPlayers => prevPlayers.map(player => {
        if (player.id === currentPlayerId) {
          const [playedCard] = player.hand.splice(cardIndex, 1)
          return {
            ...player,
            field: [...player.field, playedCard],
            hand: [...player.hand]
          }
        }
        return player
      }))
      toast.success(`${currentPlayer.name} played ${currentPlayer.hand[cardIndex].name}`)
    } else {
      setSelectedCard(currentPlayer.hand[cardIndex])
      toast.info("Select a target for the card effect")
    }
  }

  const applyCardEffect = (targetPlayerId) => {
    if (!selectedCard) return

    // Implement card effect logic here
    toast.success(`Applied ${selectedCard.name} to ${players.find(p => p.id === targetPlayerId).name}`)
    setSelectedCard(null)
  }

  const endTurn = () => {
    setCurrentPlayerId(currentPlayerId === 1 ? 2 : 1)
    setGamePhase("draw")
  }

  const handlePhaseChange = () => {
    switch (gamePhase) {
      case "draw":
        drawCard(currentPlayerId)
        setGamePhase("play")
        break
      case "play":
        setGamePhase("battle")
        break
      case "battle":
        // Implement battle logic here
        setGamePhase("end")
        break
      case "end":
        endTurn()
        break
      default:
        break
    }
  }

  const handleCardClick = (cardIndex) => {
    if (gamePhase === "play") {
      playCard(cardIndex)
    }
  }

  const handlePlayerClick = (playerId) => {
    if (selectedCard) {
      applyCardEffect(playerId)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-400 to-pink-500 p-4">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-white">Sultry Seductions</h1>
          <div className="flex space-x-4">
            {players.map(player => (
              <div key={player.id} className="text-white">
                {player.name}: {player.health} HP
              </div>
            ))}
          </div>
        </header>

        <div className="grid grid-cols-3 gap-4">
          <PlayerHand
            player={players[0]}
            isCurrentPlayer={currentPlayerId === players[0].id}
            onCardClick={handleCardClick}
            onPlayerClick={() => handlePlayerClick(players[0].id)}
          />
          <GameBoard players={players} />
          <PlayerHand
            player={players[1]}
            isCurrentPlayer={currentPlayerId === players[1].id}
            onCardClick={handleCardClick}
            onPlayerClick={() => handlePlayerClick(players[1].id)}
          />
        </div>

        <div className="mt-8 text-center">
          <Button onClick={handlePhaseChange} variant="secondary">
            {gamePhase === "end" ? "End Turn" : `Next Phase (${gamePhase})`}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Game
