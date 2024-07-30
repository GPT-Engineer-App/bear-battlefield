import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const GameStats = ({ stats }) => {
  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Game Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-sm font-medium">Cards Played</p>
            <p className="text-2xl font-bold">{stats.cardsPlayed}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Damage Dealt</p>
            <p className="text-2xl font-bold">{stats.damageDealt}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Healing Done</p>
            <p className="text-2xl font-bold">{stats.healingDone}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GameStats;
