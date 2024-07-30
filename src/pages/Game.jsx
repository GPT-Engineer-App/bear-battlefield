import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "sonner"
import { useQuery } from "@tanstack/react-query"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, Zap, Heart, Droplet, Shield, Clock, ArrowRight, Music, Volume2 } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import GameBoard from "../components/GameBoard"
import PlayerHand from "../components/PlayerHand"
import GameStats from "../components/GameStats"
import GameLog from "../components/GameLog"
import { initialDeck } from "../data/cards"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { run_game_development } from "../ai/game_development"

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
      defense: 0,
      avatar: "/placeholder.svg",
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
      defense: 0,
      avatar: "/placeholder.svg",
    }
  ])
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [musicVolume, setMusicVolume] = useState(50)
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
    seductionPowerGained: 0,
  })
  const [turnTimer, setTurnTimer] = useState(60)
  const [gameLog, setGameLog] = useState([])
  const logRef = useRef(null)

  useEffect(() => {
    if (gamePhase === "setup") {
      setupGame()
    }
  }, [gamePhase])

  useEffect(() => {
    let timer
    if (gamePhase === "play") {
      timer = setInterval(() => {
        setTurnTimer((prevTimer) => {
          if (prevTimer <= 0) {
            clearInterval(timer)
            handlePhaseChange()
            return 60
          }
          return prevTimer - 1
        })
      }, 1000)
    }
    return () => clearInterval(timer)
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
  }, [])

  const addToGameLog = useCallback((message) => {
    setGameLog(prevLog => [...prevLog, message])
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight
    }
  }, [])

  const applyCardEffect = (targetPlayerId) => {
    if (!selectedCard) return

    const targetPlayer = players.find(p => p.id === targetPlayerId)
    const currentPlayer = players.find(p => p.id === currentPlayerId)

    setPlayers(prevPlayers => {
      let updatedPlayers = [...prevPlayers]

      switch (selectedCard.name) {
        case "Pillow Talk":
          updatedPlayers = updatedPlayers.map(player =>
            player.id === targetPlayerId ? {...player, hand: player.hand.slice(0, player.hand.length - 2)} : player
          )
          break
        case "Spiked Honey":
          updatedPlayers = updatedPlayers.map(player =>
            player.id === currentPlayerId ? {...player, health: Math.min(player.health + 3, 30), seductionPower: player.seductionPower + 1} : player
          )
          break
        case "Party Hat":
          updatedPlayers = updatedPlayers.map(player =>
            player.id === currentPlayerId ? {...player, seductionPower: player.seductionPower + 2} : player
          )
          break
        case "Teddy Nightclub":
          updatedPlayers = updatedPlayers.map(player => ({
            ...player,
            seductionPower: player.seductionPower + 1,
            mana: Math.max(player.mana - 1, 0)
          }))
          break
        case "Puppy Dog Eyes":
          updatedPlayers = updatedPlayers.map(player =>
            player.id === targetPlayerId ? {...player, seductionPower: Math.max(player.seductionPower - 2, 0)} : player
          )
          break
        case "Silly Jokes":
          updatedPlayers = updatedPlayers.map(player =>
            player.id === targetPlayerId ? {...player, hand: []} : player
          )
          break
        case "Dance-Off":
          const drawnCards = currentPlayer.deck.slice(0, 3)
          updatedPlayers = updatedPlayers.map(player => {
            if (player.id === currentPlayerId) {
              return {
                ...player,
                hand: [...player.hand, ...drawnCards],
                deck: player.deck.slice(3)
              }
            } else {
              return {
                ...player,
                health: Math.max(player.health - drawnCards.length, 0)
              }
            }
          })
          break
        case "Tea Party":
          updatedPlayers = updatedPlayers.map(player => ({
            ...player,
            field: player.field.map(card => ({...card, hp: card.hp + 1}))
          }))
          break
      }

      return updatedPlayers
    })

    toast.success(`${currentPlayer.name} used ${selectedCard.name} on ${targetPlayer.name}. ${selectedCard.effect}`, {
      description: "The tension is palpable!",
    })
    setSelectedCard(null)
    addToGameLog(`${currentPlayer.name} used ${selectedCard.name} on ${targetPlayer.name}`)
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

    let damage = currentPlayer.seductionPower - opponentPlayer.seductionPower

    // Apply character abilities
    currentPlayer.field.forEach(card => {
      switch (card.ability) {
        case "Seductive Wink":
          damage += 2
          addToGameLog(`${card.name} increased damage by 2`)
          break
        case "Lingerie Charm":
          opponentPlayer.seductionPower = Math.max(opponentPlayer.seductionPower - 2, 0)
          addToGameLog(`${card.name} reduced opponent's seduction power by 2`)
          break
        case "Bondage Trap":
          opponentPlayer.mana = Math.max(opponentPlayer.mana - 2, 0)
          addToGameLog(`${card.name} reduced opponent's mana by 2`)
          break
        case "Tickle Attack":
          if (opponentPlayer.hand.length > 0) {
            const discardIndex = Math.floor(Math.random() * opponentPlayer.hand.length)
            opponentPlayer.hand.splice(discardIndex, 1)
          }
          break
        case "Bear Hug":
          currentPlayer.health = Math.min(currentPlayer.health + 2, 30)
          break
        case "Fluffy Healing":
          const healAmount = currentPlayer.field.length
          currentPlayer.health = Math.min(currentPlayer.health + healAmount, 30)
          break
        case "Mimic Master":
          // Implement copying ability logic here
          break
      }
    })

    if (damage > 0) {
      const actualDamage = Math.max(damage - opponentPlayer.defense, 0)
      setPlayers(prevPlayers => prevPlayers.map(player => 
        player.id !== currentPlayerId ? {...player, health: Math.max(player.health - actualDamage, 0), defense: 0} : player
      ))
      setGameStats(prevStats => ({
        ...prevStats,
        damageDealt: prevStats.damageDealt + actualDamage
      }))
      toast.success(`${currentPlayer.name} dealt ${actualDamage} damage to ${opponentPlayer.name}!`, {
        description: `${opponentPlayer.defense > 0 ? `${opponentPlayer.name}'s defense absorbed ${damage - actualDamage} damage!` : "That teddy's gonna need some stitches!"}`,
      })
      addToGameLog(`${currentPlayer.name} dealt ${actualDamage} damage to ${opponentPlayer.name}`)
    } else {
      toast.info("No damage dealt this turn. Better luck next time!", {
        description: "Even teddy bears have off days.",
      })
      addToGameLog("No damage dealt this turn")
    }

    // Reset defense at the end of the turn
    setPlayers(prevPlayers => prevPlayers.map(player => ({...player, defense: 0})))

    // Check for game over condition
    if (opponentPlayer.health <= 0) {
      setWinner(currentPlayer)
      setShowVictoryDialog(true)
      addToGameLog(`${currentPlayer.name} has won the game!`)
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

  const { data: aiSuggestion, isLoading, error } = useQuery({
    queryKey: ['aiSuggestion', currentPlayerId, gamePhase],
    queryFn: () => run_game_development(),
    enabled: gamePhase === 'play',
  })

  useEffect(() => {
    if (aiSuggestion) {
      toast.info("AI Suggestion", {
        description: aiSuggestion,
      })
    }
    if (error) {
      console.error("Error fetching AI suggestion:", error)
    }
  }, [aiSuggestion, error])

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-200 to-purple-300 p-4">
      <div className="max-w-7xl mx-auto">
        {isLoading && <p className="text-center text-white">AI is thinking...</p>}
        {error && <p className="text-center text-red-500">Error: {error.message}</p>}
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-purple-800 font-serif">Sultry Seductions: Battle of Desires</h1>
          <div className="flex space-x-6">
            {players.map(player => (
              <TooltipProvider key={player.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <motion.div
                      className={`text-purple-800 bg-white rounded-xl p-4 shadow-lg ${currentPlayerId === player.id ? 'ring-4 ring-pink-400' : ''}`}
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className="flex items-center mb-2">
                        <img src={player.avatar} alt={player.name} className="w-10 h-10 rounded-full mr-2" />
                        <div className="font-bold text-lg">{player.name}</div>
                      </div>
                      <div className="flex items-center space-x-2 mb-2">
                        <Heart className="text-red-500" />
                        <Progress value={(player.health / 30) * 100} className="w-32" />
                        <span className="text-sm font-bold">{player.health}/30</span>
                      </div>
                      <div className="flex items-center space-x-2 mb-2">
                        <Droplet className="text-blue-500" />
                        <Progress value={(player.mana / player.maxMana) * 100} className="w-32" />
                        <span className="text-sm font-bold">{player.mana}/{player.maxMana}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Sparkles className="text-yellow-500" />
                        <span className="text-sm font-bold">{player.seductionPower}</span>
                      </div>
                      <div className="flex items-center space-x-2 mt-2">
                        <Zap className="text-purple-500" />
                        <span className="text-sm font-bold">{player.deck.length}</span>
                      </div>
                      <div className="flex items-center space-x-2 mt-2">
                        <Shield className="text-green-500" />
                        <span className="text-sm font-bold">{player.defense}</span>
                      </div>
                    </motion.div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Health: {player.health}/30</p>
                    <p>Mana: {player.mana}/{player.maxMana}</p>
                    <p>Seduction Power: {player.seductionPower}</p>
                    <p>Cards in Deck: {player.deck.length}</p>
                    <p>Defense: {player.defense}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        </header>
        <div className="flex justify-end mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Volume2 className="mr-2" />
              <Switch
                checked={soundEnabled}
                onCheckedChange={setSoundEnabled}
              />
            </div>
            <div className="flex items-center">
              <Music className="mr-2" />
              <Slider
                value={[musicVolume]}
                onValueChange={(value) => setMusicVolume(value[0])}
                max={100}
                step={1}
                className="w-32"
              />
            </div>
          </div>
        </div>
        <div className="mb-4 flex justify-center items-center">
          <Badge variant="secondary" className="text-lg px-4 py-2">
            <Clock className="mr-2" />
            Turn: {turnCount} | Current Player: {players.find(p => p.id === currentPlayerId).name} | Phase: {gamePhase} | Time Left: {turnTimer}s
          </Badge>
        </div>

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

        <div className="mt-8 flex justify-center">
          <img src="/placeholder.svg" alt="Game Atmosphere" className="mx-auto object-cover w-full h-48 rounded-lg shadow-lg" />
        </div>

        <div className="mt-12 flex justify-between items-start">
          <GameStats stats={gameStats} />
          <div className="text-center">
            <Button 
              onClick={handlePhaseChange} 
              variant="secondary" 
              className="text-lg px-6 py-3 transition-all duration-300 hover:bg-pink-500 hover:text-white"
            >
              {gamePhase === "end" ? (
                <>End Turn <ArrowRight className="ml-2 inline" /></>
              ) : (
                <>Next Phase ({gamePhase}) <ArrowRight className="ml-2 inline" /></>
              )}
            </Button>
            <Progress 
              value={(turnTimer / 60) * 100} 
              className="w-full mt-2" 
              indicatorClassName={`${turnTimer <= 10 ? 'animate-pulse bg-red-500' : 'bg-green-500'}`}
            />
          </div>
          <GameLog log={gameLog} logRef={logRef} />
        </div>
      </div>

      <Dialog open={showVictoryDialog} onOpenChange={setShowVictoryDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Victory!</DialogTitle>
            <DialogDescription>
              {winner && (
                <div className="text-center">
                  <img src={winner.avatar} alt={winner.name} className="w-24 h-24 rounded-full mx-auto mb-4" />
                  <p className="text-xl font-bold">{winner.name} has won the Naughty Bear Brawl!</p>
                  <p className="mt-2">Final Score: {gameStats.cardsPlayed} cards played, {gameStats.damageDealt} damage dealt</p>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center space-x-4">
            <Button onClick={() => window.location.reload()}>Play Again</Button>
            <Button variant="outline" onClick={() => setShowVictoryDialog(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Game
