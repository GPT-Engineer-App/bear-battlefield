export const initialDeck = [
  { name: "Drunken Dave", type: "character", hp: 10, manaCost: 3, ability: "Stumble Strike", effect: "Deals 2 damage to an opponent's character but has a 50% chance to deal 1 damage to itself" },
  { name: "Rebellious Randy", type: "character", hp: 8, manaCost: 2, ability: "Mischief Maker", effect: "Draw two cards and discard one" },
  { name: "Troublemaker Tina", type: "character", hp: 12, manaCost: 4, ability: "Sneaky Swipe", effect: "Steal one random card from opponent's hand" },
  { name: "Pillow Fight", type: "action", manaCost: 2, effect: "Opponent discards two cards, they're too busy dodging pillows to focus" },
  { name: "Spiked Honey", type: "item", manaCost: 3, effect: "Restore 3 HP and increase mischief. Side effects may include uncontrollable giggles" },
  { name: "Party Hat", type: "item", manaCost: 1, effect: "+2 mischief for 2 turns. Warning: May cause spontaneous dance parties" },
  { name: "Teddy Nightclub", type: "environment", manaCost: 5, effect: "+1 mischief, -1 inhibition per turn. What happens at the club, stays at the club" },
  { name: "Prankster Polly", type: "character", hp: 9, manaCost: 3, ability: "Tickle Attack", effect: "Opponent reveals their hand, you choose one card for them to discard" },
  { name: "Charming Charlie", type: "character", hp: 11, manaCost: 4, ability: "Bear Hug", effect: "Heal 2 HP each turn. It's not the size of the bear, it's the warmth of the hug" },
  { name: "Puppy Dog Eyes", type: "action", manaCost: 1, effect: "Reduce opponent's defense. They can't resist your adorable gaze" },
  { name: "Doctor Cuddles", type: "character", hp: 7, manaCost: 2, ability: "Fluffy Healing", effect: "Heal 1 HP for each character on your field. Time for your check-up!" },
  { name: "Silly Jokes", type: "action", manaCost: 3, effect: "Opponent discards their entire hand. Your puns leave them groaning and distracted" },
  { name: "Dance-Off", type: "action", manaCost: 4, effect: "Draw 3 cards. For each card drawn, opponent loses 1 HP. Show off those moves!" },
  { name: "Tea Party", type: "item", manaCost: 2, effect: "All characters on the field gain +1 HP and become 'Caffeinated' for 2 turns. Pinkies up!" },
  { name: "Copycat Carl", type: "character", hp: 10, manaCost: 5, ability: "Mimic Master", effect: "Once per turn, copy the ability of any character on the field. Imitation is the sincerest form of flattery" },
]

// Duplicate cards to reach 30
while (initialDeck.length < 30) {
  initialDeck.push(...initialDeck.slice(0, Math.min(initialDeck.length, 30 - initialDeck.length)))
}
