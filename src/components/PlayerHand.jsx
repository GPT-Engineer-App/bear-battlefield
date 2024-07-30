import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const PlayerHand = ({ player, isCurrentPlayer, onCardClick, onPlayerClick }) => {
  return (
    <div
      className={`bg-white rounded-lg p-4 ${isCurrentPlayer ? 'border-4 border-yellow-400' : ''}`}
      onClick={onPlayerClick}
    >
      <div className="flex items-center mb-4">
        <span className="font-semibold">{player.name}</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {player.hand.map((card, index) => (
          <TooltipProvider key={index}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Card
                  className="h-32 cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => isCurrentPlayer && onCardClick(index)}
                >
                  <CardContent className="p-2 text-xs">
                    <div className="font-bold mb-1">{card.name}</div>
                    <div>Type: {card.type}</div>
                    {card.type === 'character' && (
                      <div>HP: {card.hp}</div>
                    )}
                    {card.ability && (
                      <div className="text-blue-600">Ability: {card.ability}</div>
                    )}
                  </CardContent>
                </Card>
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
