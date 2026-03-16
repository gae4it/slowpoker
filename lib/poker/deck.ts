import { randomInt } from "node:crypto";
import type { CardCode, Rank, Suit } from "@/lib/poker/types";

const suits: Suit[] = ["s", "h", "d", "c"];
const ranks: Rank[] = ["A", "K", "Q", "J", "T", "9", "8", "7", "6", "5", "4", "3", "2"];

export function createDeck(): CardCode[] {
  return suits.flatMap((suit) => ranks.map((rank) => `${rank}${suit}` as CardCode));
}

export function shuffleDeck(deck: CardCode[]): CardCode[] {
  const shuffled = [...deck];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = randomInt(0, index + 1);
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }

  return shuffled;
}

export function dealCards(deck: CardCode[], count: number) {
  return {
    cards: deck.slice(0, count),
    remainingDeck: deck.slice(count),
  };
}
