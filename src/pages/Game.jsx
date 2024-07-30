import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "sonner"
import { useQuery } from "@tanstack/react-query"
import GameBoard from "../components/GameBoard"
import PlayerHand from "../components/PlayerHand"
import GameStats from "../components/GameStats"
import GameLog from "../components/GameLog"
import { initialDeck } from "../data/cards"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { motion, AnimatePresence } from "framer-motion"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Heart, Droplet, Sparkles } from "lucide-react"

const Game = () => {
  const [players, setPlayers] = useState([
    {
      id: 1,
      name: "Player 1",
      health: 30,
      mana: 1,
      maxMana: 1,
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
      maxMana: 1,
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

  const setupGame = useCallback(() => {
    console.log("Setting up game...")
    drawInitialHands()
    setGamePhase("draw")
  }, [])

  useEffect(() => {
    console.log("Game phase changed:", gamePhase)
  }, [gamePhase])

  useEffect(() => {
    console.log("Current player changed:", currentPlayerId)
  }, [currentPlayerId])

  const drawInitialHands = () => {
    setPlayers(prevPlayers => prevPlayers.map(player => ({
      ...player,
      hand: player.deck.slice(0, 5),
      deck: player.deck.slice(5)
    })))
  }

  const drawCard = useCallback((playerId) => {
    console.log(`Drawing card for player ${playerId}`)
    setPlayers(prevPlayers => {
      const updatedPlayers = prevPlayers.map(player => {
        if (player.id === playerId && player.deck.length > 0) {
          const [drawnCard, ...remainingDeck] = player.deck
          console.log(`Player ${playerId} drew:`, drawnCard)
          return {
            ...player,
            hand: [...player.hand, drawnCard],
            deck: remainingDeck
          }
        }
        return player
      })
      console.log("Updated players state:", updatedPlayers)
      return updatedPlayers
    })
  }, [])

  const playCard = useCallback((cardIndex) => {
    console.log(`Playing card at index ${cardIndex}`)
    const currentPlayer = players.find(p => p.id === currentPlayerId)
    const card = currentPlayer.hand[cardIndex]

    console.log("Current player:", currentPlayer)
    console.log("Card being played:", card)

    if (currentPlayer.mana < card.manaCost) {
      console.log("Not enough mana to play this card")
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
    setPlayers(prevPlayers => prevPlayers.map(player => ({
      ...player,
      maxMana: Math.min(player.maxMana + 1, 10),
      mana: Math.min(player.maxMana + 1, 10)
    })))
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

  // Debug query
  const { data: debugData, isLoading, error } = useQuery({
    queryKey: ['debugData'],
    queryFn: () => Promise.resolve({ message: "Debug data loaded successfully" }),
  })

  useEffect(() => {
    if (debugData) {
      console.log("Debug data:", debugData)
    }
    if (error) {
      console.error("Error fetching debug data:", error)
    }
  }, [debugData, error])

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-200 to-purple-300 p-4">
      <div className="max-w-7xl mx-auto">
        {isLoading && <p>Loading debug data...</p>}
        {error && <p>Error: {error.message}</p>}
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-purple-800 font-serif">Sultry Seductions: Battle of Desires</h1>
          <div className="flex space-x-6">
            {players.map(player => (
              <motion.div
                key={player.id}
                className="text-purple-800 bg-white rounded-xl p-4 shadow-lg"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="font-bold mb-2 text-lg">{player.name}</div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center space-x-2 mb-2">
                        <Heart className="text-red-500" />
                        <Progress value={(player.health / 30) * 100} className="w-32" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Health: {player.health}/30</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <div className="flex items-center space-x-2 mb-2">
                  <Droplet className="text-blue-500" />
                  <span>{player.mana}/{player.maxMana}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Sparkles className="text-yellow-500" />
                  <span>{player.seductionPower}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </header>

        <div className="grid grid-cols-4 gap-6">
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

        <div className="mt-12 flex justify-between items-start">
          <GameStats stats={gameStats} />
          <div className="text-center">
            <Button onClick={handlePhaseChange} variant="secondary" className="text-lg px-6 py-3">
              {gamePhase === "end" ? "End Turn" : `Next Phase (${gamePhase})`}
            </Button>
            <div className="mt-4 text-purple-800 font-semibold">
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
