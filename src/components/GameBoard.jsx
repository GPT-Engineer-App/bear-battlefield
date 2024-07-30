import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Heart, Zap } from "lucide-react"

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
                        <Card className="w-24 h-36 bg-gradient-to-br from-pink-100 to-purple-100 shadow-lg relative overflow-hidden">
                          <CardContent className="p-2 text-xs">
                            <div className="font-bold mb-1 text-center text-purple-800">{card.name}</div>
                            <div className="flex justify-center items-center mb-1">
                              <Heart className="w-3 h-3 text-red-500 mr-1" />
                              <span>{card.hp}</span>
                            </div>
                            {card.ability && (
                              <div className="text-blue-600 text-center text-[8px] italic">{card.ability}</div>
                            )}
                            <div className="absolute top-1 right-1 bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
                              <Zap className="w-3 h-3" />
                            </div>
                          </CardContent>
                          <img src="/placeholder.svg" alt={card.name} className="absolute inset-0 w-full h-full object-cover opacity-10" />
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
