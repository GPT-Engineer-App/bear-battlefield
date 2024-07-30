import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

const GameStats = ({ stats }) => {
  const maxValue = Math.max(stats.cardsPlayed, stats.damageDealt, stats.healingDone, stats.seductionPowerGained);

  return (
    <Card className="mt-8 bg-gradient-to-r from-pink-100 to-purple-100">
      <CardHeader>
        <CardTitle className="text-center text-2xl font-bold text-purple-800">Naughty Stats</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <StatItem label="Cards Played" value={stats.cardsPlayed} maxValue={maxValue} />
          <StatItem label="Damage Dealt" value={stats.damageDealt} maxValue={maxValue} />
          <StatItem label="Healing Done" value={stats.healingDone} maxValue={maxValue} />
          <StatItem label="Seduction Power Gained" value={stats.seductionPowerGained} maxValue={maxValue} />
        </div>
      </CardContent>
    </Card>
  );
};

const StatItem = ({ label, value, maxValue }) => (
  <div>
    <div className="flex justify-between items-center mb-1">
      <p className="text-sm font-medium">{label}</p>
      <p className="text-sm font-bold">{value}</p>
    </div>
    <Progress value={(value / maxValue) * 100} className="h-2" />
  </div>
);

export default GameStats;
