import React from "react"
import { Card, CardContent } from "@/components/ui/card"

const PlayerHand = ({ player, isCurrentPlayer }) => {
  return (
    <div className={`bg-white rounded-lg p-4 ${isCurrentPlayer ? 'border-4 border-yellow-400' : ''}`}>
      <div className="flex items-center mb-4">
        <span className="font-semibold">{player.name}</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {player.hand.map((card, index) => (
          <Card key={index} className="h-24">
            <CardContent className="p-2 text-xs">
              {card.name}
              <br />
              Type: {card.type}
              {card.type === 'character' && (
                <>
                  <br />
                  HP: {card.hp}
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default PlayerHand