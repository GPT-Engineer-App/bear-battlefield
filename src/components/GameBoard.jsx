import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const GameBoard = ({ players }) => {
  return (
    <div className="bg-gradient-to-b from-pink-200 to-purple-200 rounded-lg p-4">
      <div className="grid grid-cols-1 gap-4">
        {players.slice().reverse().map(player => (
          <div key={player.id} className={`bg-${player.id === 1 ? 'red' : 'blue'}-100 rounded-lg p-4 shadow-md`}>
            <h3 className="text-center font-bold mb-4 text-lg">{player.name}'s Boudoir</h3>
            <div className="flex justify-center space-x-4">
              {player.field.map((card, index) => (
                <TooltipProvider key={index}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Card className="w-24 h-36 bg-white shadow-lg">
                          <CardContent className="p-2 text-xs">
                            <div className="font-bold mb-1 text-center">{card.name}</div>
                            <div className="text-center mb-1">HP: {card.hp}</div>
                            {card.ability && (
                              <div className="text-blue-600 text-center text-[8px]">{card.ability}</div>
                            )}
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
        ))}
      </div>
    </div>
  )
}

export default GameBoard
