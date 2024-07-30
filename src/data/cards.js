export const initialDeck = [
  { name: "Seductive Siren", type: "character", hp: 10, ability: "Irresistible Charm" },
  { name: "Passionate Playboy", type: "character", hp: 8, ability: "Smooth Operator" },
  { name: "Temptress Tanya", type: "character", hp: 12, ability: "Sultry Seduction" },
  { name: "Erotic Dance", type: "action", effect: "Stun opponent for 1 turn" },
  { name: "Love Potion", type: "item", effect: "Restore 3 HP and increase charm" },
  { name: "Risqué Outfit", type: "item", effect: "+2 seduction for 2 turns" },
  { name: "Red Light District", type: "environment", effect: "+1 seduction, -1 inhibition per turn" },
  { name: "Flirtatious Fiona", type: "character", hp: 9, ability: "Teasing Touch" },
  { name: "Casanova Carlos", type: "character", hp: 11, ability: "Passionate Embrace" },
  { name: "Bedroom Eyes", type: "action", effect: "Reduce opponent's defense" },
]

// Duplicate cards to reach 30
while (initialDeck.length < 30) {
  initialDeck.push(...initialDeck.slice(0, Math.min(initialDeck.length, 30 - initialDeck.length)))
}
