export const initialDeck = [
  { name: "Drunken Dave", type: "character", hp: 10, ability: "Stumble Strike" },
  { name: "Seductive Sally", type: "character", hp: 8, ability: "Charm Offensive" },
  { name: "Rebellious Randy", type: "character", hp: 12, ability: "Tantrum Toss" },
  { name: "Seductive Dance", type: "action", effect: "Stun opponent" },
  { name: "Spiked Honey", type: "item", effect: "Restore 3 HP" },
  { name: "Naughty Lingerie", type: "item", effect: "+2 attack for 1 turn" },
  { name: "Nightclub", type: "environment", effect: "+1 attack, -1 HP per turn" },
  // Add more cards to reach a total of 30
  // Duplicate some of the above cards or add new ones
]

// Duplicate cards to reach 30
while (initialDeck.length < 30) {
  initialDeck.push(...initialDeck.slice(0, Math.min(initialDeck.length, 30 - initialDeck.length)))
}