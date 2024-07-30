export const exampleCards = [
  {
    type: "character",
    name: "Drunken Dave",
    hp: 10,
    ability: "Stumble Strike",
    abilityDescription: "Deals 2 damage to an opponent's character but has a 50% chance to deal 1 damage to itself.",
    flavorText: "Dave's been hitting the honey a bit too hard!"
  },
  {
    type: "action",
    name: "Seductive Dance",
    effect: "Choose an opponent's character. That character cannot attack during their next turn.",
    flavorText: "Sally's moves are mesmerizing!"
  },
  {
    type: "item",
    name: "Spiked Honey",
    effect: "Restore 3 HP to one of your characters.",
    flavorText: "A sweet treat with a kick!"
  },
  {
    type: "environment",
    name: "Nightclub",
    effect: "All characters gain +1 attack but lose 1 HP at the end of each turn.",
    flavorText: "The party never stops, but neither does the hangover."
  }
]

export const generateDeck = (size = 30) => {
  const deck = []
  for (let i = 0; i < size; i++) {
    const randomCard = exampleCards[Math.floor(Math.random() * exampleCards.length)]
    deck.push({ ...randomCard, id: `card-${i}` })
  }
  return deck
}