import { teddyBears } from './teddyBears';

export const initialDeck = [
  { name: teddyBears[0].name, type: "character", hp: 10, manaCost: 3, ability: "Seductive Wink", effect: teddyBears[0].description },
  { name: teddyBears[1].name, type: "character", hp: 8, manaCost: 2, ability: "Lingerie Charm", effect: teddyBears[1].description },
  { name: teddyBears[2].name, type: "character", hp: 12, manaCost: 4, ability: "Bondage Trap", effect: teddyBears[2].description },
  { name: "Pillow Talk", type: "action", manaCost: 2, effect: "Opponent discards two cards, they're too distracted by your smooth talking" },
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
