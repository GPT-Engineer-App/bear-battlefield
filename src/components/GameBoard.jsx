import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Heart, Zap, Sparkles } from "lucide-react"

const GameBoard = ({ players }) => {
  return (
    <div className="bg-gradient-to-b from-pink-200 to-purple-200 rounded-lg p-4">
      <div className="grid grid-cols-1 gap-4">
        {players.slice().reverse().map(player => (
          <div key={player.id} className={`bg-${player.id === 1 ? 'red' : 'blue'}-100 rounded-lg p-4 shadow-md`}>
            <div className="flex items-center justify-center mb-4">
              <img src={player.avatar} alt={player.name} className="w-10 h-10 rounded-full mr-2" />
              <h3 className="font-bold text-lg">{player.name}'s Boudoir</h3>
            </div>
            <div className="flex justify-center space-x-4">
              {player.field.map((card, index) => (
                <TooltipProvider key={index}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
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
                            <div className="absolute bottom-1 left-1 bg-yellow-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
                              <Sparkles className="w-3 h-3" />
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
                      <p className="font-bold">{card.name}</p>
                      <p>{card.effect}</p>
                      {card.ability && <p className="italic mt-1">Ability: {card.ability}</p>}
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
