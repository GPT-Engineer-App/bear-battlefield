import React from "react"
import { Card, CardContent } from "@/components/ui/card"

const GameBoard = ({ player1, player2 }) => {
  return (
    <div className="bg-green-100 rounded-lg p-4">
      <div className="grid grid-cols-1 gap-4">
        <div className="bg-blue-200 rounded p-2">
          <h3 className="text-center font-bold mb-2">Player 2 Field</h3>
          <div className="flex justify-center space-x-2">
            {player2.field.map((card, index) => (
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
        <div className="bg-red-200 rounded p-2">
          <h3 className="text-center font-bold mb-2">Player 1 Field</h3>
          <div className="flex justify-center space-x-2">
            {player1.field.map((card, index) => (
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
      </div>
    </div>
  )
}

export default GameBoard