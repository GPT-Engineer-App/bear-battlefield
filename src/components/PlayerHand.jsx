import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { motion } from "framer-motion"

const PlayerHand = ({ player, isCurrentPlayer, onCardClick, onPlayerClick }) => {
  return (
    <div
      className={`bg-white rounded-lg p-4 ${isCurrentPlayer ? 'border-4 border-yellow-400' : ''}`}
      onClick={onPlayerClick}
    >
      <div className="flex items-center mb-4">
        <span className="font-semibold">{player.name}</span>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {player.hand.map((card, index) => (
          <TooltipProvider key={index}>
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Card
                    className="w-32 h-48 cursor-pointer hover:bg-gray-100 transition-colors relative overflow-hidden"
                    onClick={() => isCurrentPlayer && onCardClick(index)}
                  >
                    <CardContent className="p-2 text-xs">
                      <div className="font-bold mb-1 text-center">{card.name}</div>
                      <div className="text-center mb-1">{card.type}</div>
                      {card.type === 'character' && (
                        <div className="text-center mb-1">HP: {card.hp}</div>
                      )}
                      {card.ability && (
                        <div className="text-blue-600 text-center mb-1">{card.ability}</div>
                      )}
                      <div className="absolute top-1 right-1 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                        {card.manaCost}
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-gray-200 p-1 text-center">
                        {card.effect}
                      </div>
                    </CardContent>
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
