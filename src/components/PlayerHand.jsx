import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { motion } from "framer-motion"
import { Heart, Zap } from "lucide-react"

const PlayerHand = ({ player, isCurrentPlayer, onCardClick, onPlayerClick }) => {
  const canPlayCard = (card) => {
    return isCurrentPlayer && player.mana >= card.manaCost;
  };

  const cardVariants = {
    hover: { scale: 1.05, rotate: 5, transition: { duration: 0.2 } },
    tap: { scale: 0.95, rotate: -2, transition: { duration: 0.1 } },
  };
  return (
    <div
      className={`bg-white rounded-xl p-6 shadow-lg ${isCurrentPlayer ? 'ring-4 ring-pink-400' : ''}`}
      onClick={onPlayerClick}
    >
      <div className="flex items-center mb-6">
        <span className="font-bold text-xl text-purple-800">{player.name}'s Hand</span>
      </div>
      <div className="flex flex-wrap justify-center gap-4">
        {player.hand.map((card, index) => (
          <TooltipProvider key={index}>
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.div
                  variants={cardVariants}
                  whileHover="hover"
                  whileTap="tap"
                  animate={canPlayCard(card) ? "idle" : "disabled"}
                >
                  <Card
                    className={`w-36 h-52 cursor-pointer hover:shadow-xl transition-all duration-300 relative overflow-hidden bg-gradient-to-br from-pink-100 to-purple-100 ${
                      !canPlayCard(card) ? 'opacity-50 grayscale' : 'hover:from-pink-200 hover:to-purple-200'
                    }`}
                    onClick={() => canPlayCard(card) && onCardClick(index)}
                  >
                    <CardContent className="p-3 text-xs">
                      <div className="font-bold mb-2 text-center text-sm">{card.name}</div>
                      <div className="text-center mb-2 text-purple-600">{card.type}</div>
                      {card.type === 'character' && (
                        <div className="flex items-center justify-center mb-2">
                          <Heart className="w-4 h-4 text-red-500 mr-1" />
                          <span>{card.hp}</span>
                        </div>
                      )}
                      {card.ability && (
                        <div className="text-blue-600 text-center mb-2 italic">{card.ability}</div>
                      )}
                      <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full w-7 h-7 flex items-center justify-center">
                        <Zap className="w-4 h-4" />
                        <span className="ml-1">{card.manaCost}</span>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-purple-200 p-2 text-center text-[10px]">
                        {card.effect}
                      </div>
                    </CardContent>
                    <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="50" cy="30" r="20" fill="currentColor" />
                      <circle cx="40" cy="20" r="5" fill="white" />
                      <circle cx="60" cy="20" r="5" fill="white" />
                      <circle cx="50" cy="70" r="30" fill="currentColor" />
                    </svg>
                  </Card>
                </motion.div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{card.effect}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    </div>
  )
}

export default PlayerHand
