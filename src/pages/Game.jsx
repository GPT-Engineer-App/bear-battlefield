import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "sonner"
import GameBoard from "../components/GameBoard"
import PlayerHand from "../components/PlayerHand"
import GameStats from "../components/GameStats"
import GameLog from "../components/GameLog"
import { initialDeck } from "../data/cards"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { motion, AnimatePresence } from "framer-motion"

const Game = () => {
  const [players, setPlayers] = useState([
    {
      id: 1,
      name: "Player 1",
      health: 30,
      mana: 1,
      deck: [...initialDeck],
      hand: [],
      field: [],
      seductionPower: 0,
    },
    {
      id: 2,
      name: "Player 2",
      health: 30,
      mana: 1,
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
  const [gameStats, setGameStats] = useState({
    cardsPlayed: 0,
    damageDealt: 0,
    healingDone: 0,
  })
  const [gameLog, setGameLog] = useState([])
  const logRef = useRef(null)

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

    if (currentPlayer.mana < card.manaCost) {
      toast.error("Not enough mana to play this card!", {
        description: "Try another card or end your turn.",
      })
      return
    }

    setPlayers(prevPlayers => prevPlayers.map(player => {
      if (player.id === currentPlayerId) {
        const [playedCard] = player.hand.splice(cardIndex, 1)
        if (playedCard.type === 'character') {
          return {
            ...player,
            field: [...player.field, playedCard],
            hand: [...player.hand],
            seductionPower: player.seductionPower + 1,
            mana: player.mana - playedCard.manaCost
          }
        } else {
          return {
            ...player,
            hand: [...player.hand],
            mana: player.mana - playedCard.manaCost
          }
        }
      }
      return player
    }))

    setGameStats(prevStats => ({
      ...prevStats,
      cardsPlayed: prevStats.cardsPlayed + 1
    }))

    addToGameLog(`${currentPlayer.name} played ${card.name}`)

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

  const addToGameLog = (message) => {
    setGameLog(prevLog => [...prevLog, message])
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight
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
      setGameStats(prevStats => ({
        ...prevStats,
        damageDealt: prevStats.damageDealt + damage
      }))
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
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-brown-800">Terrible Teddies: Naughty Bear Brawl</h1>
          <div className="flex space-x-4">
            {players.map(player => (
              <motion.div
                key={player.id}
                className="text-brown-800"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {player.name}: {player.health} HP | Mischief: {player.seductionPower} | Mana: {player.mana}
              </motion.div>
            ))}
          </div>
        </header>

        <div className="grid grid-cols-4 gap-4">
          <AnimatePresence>
            <motion.div
              key="player1"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="col-span-1"
            >
              <PlayerHand
                player={players[0]}
                isCurrentPlayer={currentPlayerId === players[0].id}
                onCardClick={handleCardClick}
                onPlayerClick={() => handlePlayerClick(players[0].id)}
              />
            </motion.div>
            <motion.div
              key="gameboard"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.5 }}
              className="col-span-2"
            >
              <GameBoard players={players} />
            </motion.div>
            <motion.div
              key="player2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.5 }}
              className="col-span-1"
            >
              <PlayerHand
                player={players[1]}
                isCurrentPlayer={currentPlayerId === players[1].id}
                onCardClick={handleCardClick}
                onPlayerClick={() => handlePlayerClick(players[1].id)}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-8 flex justify-between items-start">
          <GameStats stats={gameStats} />
          <div className="text-center">
            <Button onClick={handlePhaseChange} variant="secondary">
              {gamePhase === "end" ? "End Turn" : `Next Phase (${gamePhase})`}
            </Button>
            <div className="mt-2 text-brown-800">
              Turn: {turnCount} | Current Player: {players.find(p => p.id === currentPlayerId).name}
            </div>
          </div>
          <GameLog log={gameLog} logRef={logRef} />
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
