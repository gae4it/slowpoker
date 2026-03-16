import Hand from "pokersolver";
import type { CardCode } from "@/lib/poker/types";

function toPokerSolverCard(card: CardCode) {
  const rank = card[0] === "T" ? "10" : card[0];
  return `${rank}${card[1]}`;
}

export function evaluateHoldemHand(cards: CardCode[]) {
  return Hand.solve(cards.map(toPokerSolverCard));
}

/**
 * Returns the player IDs of the showdown winner(s).
 * Handles split pots when two hands are equal strength.
 */
export function findShowdownWinners(
  players: Array<{ playerId: string; holeCards: CardCode[] }>,
  boardCards: CardCode[],
): string[] {
  const evaluated = players.map((p) => ({
    playerId: p.playerId,
    hand: Hand.solve([...p.holeCards, ...boardCards].map(toPokerSolverCard)),
  }));

  // pokersolver types are incomplete — winners() exists at runtime but is not declared
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const winningHands = (Hand as any).winners(evaluated.map((e) => e.hand)) as object[];

  return evaluated
    .filter((e) => winningHands.includes(e.hand))
    .map((e) => e.playerId);
}
