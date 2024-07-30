import React from "react"
import { Card, CardContent } from "@/components/ui/card"

const GameBoard = ({ players }) => {
  return (
    <div className="bg-green-100 rounded-lg p-4">
      <div className="grid grid-cols-1 gap-4">
        {players.slice().reverse().map(player => (
          <div key={player.id} className={`bg-${player.id === 1 ? 'red' : 'blue'}-200 rounded p-2`}>
            <h3 className="text-center font-bold mb-2">{player.name} Field</h3>
            <div className="flex justify-center space-x-2">
              {player.field.map((card, index) => (
                <Card key={index} className="w-16 h-24">
                  <CardContent className="p-2 text-xs">
                    {card.name}
                    <br />
                    HP: {card.hp}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default GameBoard
