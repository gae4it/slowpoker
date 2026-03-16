import type { GameEngineState, MoveAction } from "@/lib/poker/types";

type MoveInput = {
  action: MoveAction;
  amount?: number;
};

export function validateMove(state: GameEngineState, playerId: string, move: MoveInput) {
  if (state.currentPlayerId !== playerId) {
    throw new Error("It is not this player's turn.");
  }

  const player = state.players.find((entry) => entry.userId === playerId);
  if (!player) {
    throw new Error("Unknown player.");
  }

  if (player.folded) {
    throw new Error("Folded player cannot act.");
  }

  if ((move.action === "bet" || move.action === "raise") && (!move.amount || move.amount <= 0)) {
    throw new Error("Bet and raise require a positive amount.");
  }

  if (move.amount && move.amount > player.stack) {
    throw new Error("Move exceeds current stack.");
  }

  return true;
}

export function getNextPlayerId(state: GameEngineState, playerId: string) {
  const opponent = state.players.find((entry) => entry.userId !== playerId);
  if (!opponent) {
    throw new Error("Opponent not found.");
  }
  return opponent.userId;
}
