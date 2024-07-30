import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

const GameStats = ({ stats }) => {
  const maxValue = Math.max(stats.cardsPlayed, stats.damageDealt, stats.healingDone);

  return (
    <Card className="mt-8 bg-gradient-to-r from-pink-100 to-purple-100">
      <CardHeader>
        <CardTitle className="text-center text-2xl font-bold text-purple-800">Naughty Stats</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1">
              <p className="text-sm font-medium">Cards Played</p>
              <p className="text-sm font-bold">{stats.cardsPlayed}</p>
            </div>
            <Progress value={(stats.cardsPlayed / maxValue) * 100} className="h-2" />
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <p className="text-sm font-medium">Damage Dealt</p>
              <p className="text-sm font-bold">{stats.damageDealt}</p>
            </div>
            <Progress value={(stats.damageDealt / maxValue) * 100} className="h-2" />
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <p className="text-sm font-medium">Healing Done</p>
              <p className="text-sm font-bold">{stats.healingDone}</p>
            </div>
            <Progress value={(stats.healingDone / maxValue) * 100} className="h-2" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GameStats;
