import { randomUUID } from "node:crypto";
import { createDeck, dealCards, shuffleDeck } from "@/lib/poker/deck";
import { getNextPlayerId, validateMove } from "@/lib/poker/moves";
import type { CardCode, GameEngineState, MoveAction } from "@/lib/poker/types";

type CreateGameInput = {
  creatorId: string;
  opponentId: string;
  blindAmount?: number;
  stackSize?: number;
};

export function createInitialGameState({
  creatorId,
  opponentId,
  blindAmount = 20,
  stackSize = 2000,
}: CreateGameInput): GameEngineState {
  const shuffledDeck = shuffleDeck(createDeck());
  const firstDeal = dealCards(shuffledDeck, 2);
  const secondDeal = dealCards(firstDeal.remainingDeck, 2);

  return {
    id: randomUUID(),
    status: "active",
    phase: "preflop",
    currentPlayerId: creatorId,
    players: [
      {
        userId: creatorId,
        stack: stackSize - blindAmount / 2,
        folded: false,
        cards: firstDeal.cards as CardCode[],
      },
      {
        userId: opponentId,
        stack: stackSize - blindAmount,
        folded: false,
        cards: secondDeal.cards as CardCode[],
      },
    ],
    communityCards: [],
    pot: blindAmount + blindAmount / 2,
    blindAmount,
    moveHistory: [
      { playerId: creatorId, action: "bet", amount: blindAmount / 2 },
      { playerId: opponentId, action: "bet", amount: blindAmount },
    ],
  };
}

export function applyMove(
  state: GameEngineState,
  playerId: string,
  action: MoveAction,
  amount = 0,
): GameEngineState {
  validateMove(state, playerId, { action, amount });

  const players = state.players.map((player) => {
    if (player.userId !== playerId) {
      return player;
    }

    if (action === "fold") {
      return { ...player, folded: true };
    }

    if (action === "bet" || action === "raise" || action === "call") {
      return { ...player, stack: player.stack - amount };
    }

    return player;
  }) as GameEngineState["players"];

  return {
    ...state,
    currentPlayerId: getNextPlayerId(state, playerId),
    pot: state.pot + amount,
    players,
    moveHistory: [...state.moveHistory, { playerId, action, amount }],
  };
}
