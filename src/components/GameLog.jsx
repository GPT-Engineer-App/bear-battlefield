import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area"

const GameLog = ({ log, logRef }) => {
  return (
    <div className="w-64 bg-white rounded-lg p-4 shadow-md">
      <h3 className="font-bold mb-2">Game Log</h3>
      <ScrollArea className="h-40" ref={logRef}>
        {log.map((entry, index) => (
          <p key={index} className="text-sm mb-1">{entry}</p>
        ))}
      </ScrollArea>
    </div>
  );
};

export default GameLog;
