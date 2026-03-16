import Hand from "pokersolver";
import { evalHand } from "poker-evaluator";
import type { CardCode } from "@/lib/poker/types";

function toPokerSolverCard(card: CardCode) {
  const rank = card[0] === "T" ? "10" : card[0];
  return `${rank}${card[1]}`;
}

function toEvaluatorCard(card: CardCode) {
  return card.toLowerCase();
}

export function evaluateHoldemHand(cards: CardCode[]) {
  return Hand.solve(cards.map(toPokerSolverCard));
}

export function scoreHoldemHand(cards: CardCode[]) {
  return evalHand(cards.map(toEvaluatorCard));
}
