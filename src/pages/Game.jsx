import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "sonner"
import GameBoard from "../components/GameBoard"
import PlayerHand from "../components/PlayerHand"
import { initialDeck } from "../data/cards"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

const Game = () => {
  const [players, setPlayers] = useState([
    {
      id: 1,
      name: "Player 1",
      health: 30,
      deck: [...initialDeck],
      hand: [],
      field: [],
      seductionPower: 0,
    },
    {
      id: 2,
      name: "Player 2",
      health: 30,
      deck: [...initialDeck],
      hand: [],
      field: [],
      seductionPower: 0,
    }
  ])
  const [currentPlayerId, setCurrentPlayerId] = useState(1)
  const [gamePhase, setGamePhase] = useState("setup")
  const [selectedCard, setSelectedCard] = useState(null)
  const [turnCount, setTurnCount] = useState(0)
  const [showVictoryDialog, setShowVictoryDialog] = useState(false)
  const [winner, setWinner] = useState(null)

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
    setPlayers(prevPlayers => prevPlayers.map(player => ({
      ...player,
      hand: player.deck.slice(0, 5),
      deck: player.deck.slice(5)
    })))
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
    const card = currentPlayer.hand[cardIndex]

    setPlayers(prevPlayers => prevPlayers.map(player => {
      if (player.id === currentPlayerId) {
        const [playedCard] = player.hand.splice(cardIndex, 1)
        if (playedCard.type === 'character') {
          return {
            ...player,
            field: [...player.field, playedCard],
            hand: [...player.hand],
            seductionPower: player.seductionPower + 1
          }
        } else {
          return {
            ...player,
            hand: [...player.hand]
          }
        }
      }
      return player
    }))

    if (card.type === 'character') {
      toast.success(`${currentPlayer.name} played ${card.name}. ${card.effect}`, {
        description: "Things are heating up!",
      })
    } else {
      setSelectedCard(card)
      toast.info("Select a target for the card effect", {
        description: "Choose wisely, lover boy!",
      })
    }
  }

  const applyCardEffect = (targetPlayerId) => {
    if (!selectedCard) return

    const targetPlayer = players.find(p => p.id === targetPlayerId)
    const currentPlayer = players.find(p => p.id === currentPlayerId)

    // Implement card effect logic here
    switch (selectedCard.name) {
      case "Erotic Dance":
        setPlayers(prevPlayers => prevPlayers.map(player => 
          player.id === targetPlayerId ? {...player, hand: player.hand.slice(0, player.hand.length - 2)} : player
        ))
        break
      case "Love Potion":
        setPlayers(prevPlayers => prevPlayers.map(player => 
          player.id === currentPlayerId ? {...player, health: Math.min(player.health + 3, 30), seductionPower: player.seductionPower + 1} : player
        ))
        break
      // Add more cases for other card effects
    }

    toast.success(`${currentPlayer.name} used ${selectedCard.name} on ${targetPlayer.name}. ${selectedCard.effect}`, {
      description: "The tension is palpable!",
    })
    setSelectedCard(null)
  }

  const endTurn = () => {
    setCurrentPlayerId(currentPlayerId === 1 ? 2 : 1)
    setGamePhase("draw")
    setTurnCount(prevCount => prevCount + 1)
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
        resolveBattle()
        setGamePhase("end")
        break
      case "end":
        endTurn()
        break
      default:
        break
    }
  }

  const resolveBattle = () => {
    const currentPlayer = players.find(p => p.id === currentPlayerId)
    const opponentPlayer = players.find(p => p.id !== currentPlayerId)

    const damage = currentPlayer.seductionPower - opponentPlayer.seductionPower
    if (damage > 0) {
      setPlayers(prevPlayers => prevPlayers.map(player => 
        player.id !== currentPlayerId ? {...player, health: Math.max(player.health - damage, 0)} : player
      ))
      toast.success(`${currentPlayer.name} dealt ${damage} damage to ${opponentPlayer.name}!`, {
        description: "That teddy's gonna need some stitches!",
      })
    } else {
      toast.info("No damage dealt this turn. Better luck next time!", {
        description: "Even teddy bears have off days.",
      })
    }

    // Check for game over condition
    if (opponentPlayer.health <= 0) {
      setWinner(currentPlayer)
      setShowVictoryDialog(true)
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
    <div className="min-h-screen bg-gradient-to-b from-amber-200 to-yellow-400 p-4">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-brown-800">Terrible Teddies: Naughty Bear Brawl</h1>
          <div className="flex space-x-4">
            {players.map(player => (
              <div key={player.id} className="text-brown-800">
                {player.name}: {player.health} HP | Mischief: {player.seductionPower}
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

        <div className="mt-4 text-center text-brown-800">
          Turn: {turnCount} | Current Player: {players.find(p => p.id === currentPlayerId).name}
        </div>
      </div>

      <Dialog open={showVictoryDialog} onOpenChange={setShowVictoryDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Victory!</DialogTitle>
            <DialogDescription>
              {winner && `${winner.name} has won the Naughty Bear Brawl!`}
            </DialogDescription>
          </DialogHeader>
          <Button onClick={() => window.location.reload()}>Play Again</Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Game
