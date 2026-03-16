export type Suit = "s" | "h" | "d" | "c";
export type Rank = "A" | "K" | "Q" | "J" | "T" | "9" | "8" | "7" | "6" | "5" | "4" | "3" | "2";
export type CardCode = `${Rank}${Suit}`;

export type GamePhase = "preflop" | "flop" | "turn" | "river" | "showdown";
export type GameStatus = "waiting" | "active" | "finished";
export type MoveAction = "check" | "bet" | "call" | "raise" | "fold";

export type PlayerState = {
  userId: string;
  stack: number;
  folded: boolean;
  cards: CardCode[];
};

export type GameEngineState = {
  id: string;
  status: GameStatus;
  phase: GamePhase;
  currentPlayerId: string;
  players: [PlayerState, PlayerState];
  communityCards: CardCode[];
  pot: number;
  blindAmount: number;
  moveHistory: Array<{
    playerId: string;
    action: MoveAction;
    amount: number;
  }>;
};
