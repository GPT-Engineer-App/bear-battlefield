import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/components/ui/use-toast"
import { generateDeck } from "@/lib/cards"

const INITIAL_HP = 30
const DECK_SIZE = 30

const Game = () => {
  const [player1, setPlayer1] = useState({
    hp: INITIAL_HP,
    deck: [],
    hand: [],
    field: [],
  })
  const [player2, setPlayer2] = useState({
    hp: INITIAL_HP,
    deck: [],
    hand: [],
    field: [],
  })
  const [currentPlayer, setCurrentPlayer] = useState(1)
  const [gamePhase, setGamePhase] = useState("setup")
  const { toast } = useToast()

  useEffect(() => {
    initializeGame()
  }, [])

  const initializeGame = () => {
    const player1Deck = generateDeck(DECK_SIZE)
    const player2Deck = generateDeck(DECK_SIZE)
    setPlayer1({ ...player1, deck: player1Deck, hand: player1Deck.slice(0, 5) })
    setPlayer2({ ...player2, deck: player2Deck, hand: player2Deck.slice(0, 5) })
    setGamePhase("draw")
  }

  const drawCard = (player) => {
    if (player.deck.length === 0) {
      toast({
        title: `Player ${currentPlayer} has no more cards to draw!`,
        description: "The game will end soon if no action is taken.",
      })
      return player
    }
    const [drawnCard, ...remainingDeck] = player.deck
    return {
      ...player,
      hand: [...player.hand, drawnCard],
      deck: remainingDeck,
    }
  }

  const playCard = (cardIndex) => {
    const currentPlayerObj = currentPlayer === 1 ? player1 : player2
    const [playedCard, ...remainingHand] = currentPlayerObj.hand.splice(cardIndex, 1)
    
    if (playedCard.type === "character") {
      currentPlayerObj.field.push(playedCard)
    } else {
      // Handle effects of action, item, and environment cards
      handleCardEffect(playedCard)
    }

    currentPlayerObj.hand = remainingHand
    if (currentPlayer === 1) {
      setPlayer1(currentPlayerObj)
    } else {
      setPlayer2(currentPlayerObj)
    }
  }

  const handleCardEffect = (card) => {
    switch (card.type) {
      case "action":
        // Implement action card effects
        toast({
          title: `${card.name} played`,
          description: card.effect,
        })
        break
      case "item":
        // Implement item card effects
        toast({
          title: `${card.name} used`,
          description: card.effect,
        })
        break
      case "environment":
        // Implement environment card effects
        toast({
          title: `${card.name} activated`,
          description: card.effect,
        })
        break
      default:
        break
    }
  }

  const endTurn = () => {
    setCurrentPlayer(currentPlayer === 1 ? 2 : 1)
    setGamePhase("draw")
  }

  const handlePhase = () => {
    switch (gamePhase) {
      case "draw":
        if (currentPlayer === 1) {
          setPlayer1(drawCard(player1))
        } else {
          setPlayer2(drawCard(player2))
        }
        setGamePhase("play")
        break
      case "play":
        // The play phase is handled by the playCard function
        setGamePhase("battle")
        break
      case "battle":
        handleBattlePhase()
        break
      case "end":
        endTurn()
        break
      default:
        break
    }
  }

  const handleBattlePhase = () => {
    // Implement battle logic here
    const attacker = currentPlayer === 1 ? player1 : player2
    const defender = currentPlayer === 1 ? player2 : player1

    attacker.field.forEach(attackingCard => {
      if (defender.field.length > 0) {
        const targetCard = defender.field[Math.floor(Math.random() * defender.field.length)]
        targetCard.hp -= 1 // Simple attack logic, can be expanded
        if (targetCard.hp <= 0) {
          defender.field = defender.field.filter(card => card.id !== targetCard.id)
        }
      } else {
        defender.hp -= 1
      }
    })

    setPlayer1(currentPlayer === 1 ? attacker : defender)
    setPlayer2(currentPlayer === 2 ? attacker : defender)

    if (player1.hp <= 0 || player2.hp <= 0) {
      endGame()
    } else {
      setGamePhase("end")
    }
  }

  const endGame = () => {
    const winner = player1.hp > 0 ? "Player 1" : "Player 2"
    toast({
      title: "Game Over",
      description: `${winner} wins!`,
    })
    // Implement any end game logic here
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-400 to-pink-500 p-4">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-white">Terrible Teddies</h1>
          <div className="flex space-x-4">
            <div className="text-white">Player 1 HP: {player1.hp}</div>
            <div className="text-white">Player 2 HP: {player2.hp}</div>
          </div>
        </header>

        <div className="grid grid-cols-3 gap-4">
          <PlayerArea player={player1} playCard={playCard} isCurrentPlayer={currentPlayer === 1} />
          <GameBoard player1Field={player1.field} player2Field={player2.field} />
          <PlayerArea player={player2} playCard={playCard} isCurrentPlayer={currentPlayer === 2} />
        </div>

        <div className="mt-8 text-center">
          <Button onClick={handlePhase} variant="secondary">
            {gamePhase === "end" ? "End Turn" : `Next Phase (${gamePhase})`}
          </Button>
        </div>
      </div>
    </div>
  )
}

const PlayerArea = ({ player, playCard, isCurrentPlayer }) => (
  <div className="bg-white rounded-lg p-4">
    <div className="flex items-center mb-4">
      <Avatar>
        <AvatarImage src="/placeholder.svg" alt="Player" />
        <AvatarFallback>P</AvatarFallback>
      </Avatar>
      <span className="ml-2 font-semibold">Player {isCurrentPlayer ? "(Current)" : ""}</span>
    </div>
    <div className="grid grid-cols-2 gap-2">
      {player.hand.map((card, index) => (
        <Card key={card.id} className="h-24 cursor-pointer" onClick={() => isCurrentPlayer && playCard(index)}>
          <CardContent className="flex flex-col items-center justify-center h-full">
            <div>{card.name}</div>
            <div className="text-xs">({card.type})</div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
)

const GameBoard = ({ player1Field, player2Field }) => (
  <div className="bg-green-100 rounded-lg p-4">
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-blue-200 rounded p-2">
        <h3 className="text-center mb-2">Player 1 Field</h3>
        {player1Field.map((card) => (
          <Card key={card.id} className="mb-2">
            <CardContent>
              <div>{card.name}</div>
              <div className="text-xs">HP: {card.hp}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="bg-red-200 rounded p-2">
        <h3 className="text-center mb-2">Player 2 Field</h3>
        {player2Field.map((card) => (
          <Card key={card.id} className="mb-2">
            <CardContent>
              <div>{card.name}</div>
              <div className="text-xs">HP: {card.hp}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </div>
)

export default Game