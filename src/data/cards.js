export const initialDeck = [
  { name: "Seductive Siren", type: "character", hp: 10, ability: "Irresistible Charm", effect: "Opponent skips their next turn, mesmerized by your beauty" },
  { name: "Passionate Playboy", type: "character", hp: 8, ability: "Smooth Operator", effect: "Draw two cards and discard one" },
  { name: "Temptress Tanya", type: "character", hp: 12, ability: "Sultry Seduction", effect: "Steal one random card from opponent's hand" },
  { name: "Erotic Dance", type: "action", effect: "Opponent discards two cards, they're too distracted to focus" },
  { name: "Love Potion", type: "item", effect: "Restore 3 HP and increase charm. Side effects may include uncontrollable flirting" },
  { name: "Risqué Outfit", type: "item", effect: "+2 seduction for 2 turns. Warning: May cause spontaneous nosebleeds" },
  { name: "Red Light District", type: "environment", effect: "+1 seduction, -1 inhibition per turn. What happens here, stays here" },
  { name: "Flirtatious Fiona", type: "character", hp: 9, ability: "Teasing Touch", effect: "Opponent reveals their hand, you choose one card for them to discard" },
  { name: "Casanova Carlos", type: "character", hp: 11, ability: "Passionate Embrace", effect: "Heal 2 HP each turn. It's not the size of the boat, it's the motion of the ocean" },
  { name: "Bedroom Eyes", type: "action", effect: "Reduce opponent's defense. They can't resist your smoldering gaze" },
  { name: "Naughty Nurse", type: "character", hp: 7, ability: "Sensual Healing", effect: "Heal 1 HP for each character on your field. Time for your sponge bath!" },
  { name: "Dirty Talk", type: "action", effect: "Opponent discards their entire hand. Your words leave them speechless and flustered" },
  { name: "Strip Tease", type: "action", effect: "Draw 3 cards. For each card drawn, opponent loses 1 HP. The art of the reveal" },
  { name: "Champagne Shower", type: "item", effect: "All characters on the field gain +1 HP and become 'Tipsy' for 2 turns. Bubbly and wet, just how we like it" },
  { name: "Kamasutra Master", type: "character", hp: 10, ability: "Flexible Maneuvers", effect: "Once per turn, copy the ability of any character on the field. Imitation is the sincerest form of flattery" },
]

// Duplicate cards to reach 30
while (initialDeck.length < 30) {
  initialDeck.push(...initialDeck.slice(0, Math.min(initialDeck.length, 30 - initialDeck.length)))
}
