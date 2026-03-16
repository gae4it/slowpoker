import { aliasedTable, and, asc, desc, eq, inArray, isNull, ne } from "drizzle-orm";
import { getDb } from "@/lib/db/client";
import { cards, gamePlayers, games, moves, notifications, users } from "@/lib/db/schema";

export type DashboardGame = {
  id: string;
  opponentName: string;
  pot: number;
  phase: string;
  lastMove: string;
  statusLabel: "Your turn" | "Waiting" | "Finished";
  href: string;
};

export type DashboardGroups = {
  yourTurn: DashboardGame[];
  waiting: DashboardGame[];
  finished: DashboardGame[];
};

export type GameDetail = {
  id: string;
  status: "waiting" | "active" | "finished";
  phase: string;
  pot: number;
  isPlayerTurn: boolean;
  opponentName: string;
  playerStack: number;
  opponentStack: number;
  playerCards: string[];
  opponentCards: string[];
  revealOpponentCards: boolean;
  boardCards: string[];
  lastMove: string;
  moveHistory: Array<{
    action: string;
    amount: number;
    createdAt: Date;
    playerName: string;
  }>;
};

export type NotificationItem = {
  id: string;
  title: string;
  body: string;
  createdAt: Date;
  gameId: string | null;
};

const phaseLabel: Record<string, string> = {
  preflop: "Preflop",
  flop: "Flop",
  turn: "Turn",
  river: "River",
  showdown: "Showdown",
};

const actionLabel: Record<string, string> = {
  check: "checked",
  bet: "bet",
  call: "called",
  raise: "raised",
  fold: "folded",
};

export async function listOpponents(currentUserId: string) {
  const db = getDb();

  return db
    .select({
      id: users.id,
      username: users.username,
    })
    .from(users)
    .where(ne(users.id, currentUserId))
    .orderBy(users.username);
}

export async function getDashboardGroups(currentUserId: string): Promise<DashboardGroups> {
  const db = getDb();

  const me = aliasedTable(gamePlayers, "me");
  const opp = aliasedTable(gamePlayers, "opp");
  const oppUser = aliasedTable(users, "opp_user");

  const baseRows = await db
    .select({
      gameId: games.id,
      status: games.status,
      phase: games.phase,
      pot: games.pot,
      currentPlayerId: games.currentPlayerId,
      opponentName: oppUser.username,
    })
    .from(me)
    .innerJoin(games, eq(me.gameId, games.id))
    .innerJoin(opp, and(eq(opp.gameId, games.id), ne(opp.userId, currentUserId)))
    .innerJoin(oppUser, eq(oppUser.id, opp.userId))
    .where(eq(me.userId, currentUserId))
    .orderBy(desc(games.updatedAt));

  if (baseRows.length === 0) {
    return { yourTurn: [], waiting: [], finished: [] };
  }

  const gameIds = baseRows.map((row) => row.gameId);
  const latestMoves = await db
    .select({
      gameId: moves.gameId,
      action: moves.action,
      amount: moves.amount,
      playerId: moves.playerId,
    })
    .from(moves)
    .where(inArray(moves.gameId, gameIds))
    .orderBy(desc(moves.createdAt));

  const latestMoveByGame = new Map<string, (typeof latestMoves)[number]>();
  for (const move of latestMoves) {
    if (!latestMoveByGame.has(move.gameId)) {
      latestMoveByGame.set(move.gameId, move);
    }
  }

  const groups: DashboardGroups = {
    yourTurn: [],
    waiting: [],
    finished: [],
  };

  for (const row of baseRows) {
    const latestMove = latestMoveByGame.get(row.gameId);
    const moveText = latestMove
      ? `${actionLabel[latestMove.action] ?? latestMove.action}${latestMove.amount > 0 ? ` ${latestMove.amount}` : ""}`
      : "No moves yet";

    const game: DashboardGame = {
      id: row.gameId,
      opponentName: row.opponentName,
      pot: row.pot,
      phase: phaseLabel[row.phase] ?? row.phase,
      lastMove: moveText,
      statusLabel:
        row.status === "finished"
          ? "Finished"
          : row.currentPlayerId === currentUserId
            ? "Your turn"
            : "Waiting",
      href: `/game/${row.gameId}`,
    };

    if (game.statusLabel === "Finished") {
      groups.finished.push(game);
      continue;
    }

    if (game.statusLabel === "Your turn") {
      groups.yourTurn.push(game);
      continue;
    }

    groups.waiting.push(game);
  }

  return groups;
}

export async function getGameDetail(gameId: string, currentUserId: string): Promise<GameDetail | null> {
  const db = getDb();

  const me = aliasedTable(gamePlayers, "me_game");
  const opp = aliasedTable(gamePlayers, "opp_game");
  const oppUser = aliasedTable(users, "opp_user_game");

  const [base] = await db
    .select({
      gameId: games.id,
      status: games.status,
      phase: games.phase,
      pot: games.pot,
      currentPlayerId: games.currentPlayerId,
      opponentName: oppUser.username,
      playerStack: me.stack,
      opponentStack: opp.stack,
    })
    .from(me)
    .innerJoin(games, eq(me.gameId, games.id))
    .innerJoin(opp, and(eq(opp.gameId, games.id), ne(opp.userId, currentUserId)))
    .innerJoin(oppUser, eq(oppUser.id, opp.userId))
    .where(and(eq(games.id, gameId), eq(me.userId, currentUserId)))
    .limit(1);

  if (!base) {
    return null;
  }

  const [playerCards, opponentCards, boardCards, lastMoveRow, moveRows] = await Promise.all([
    db
      .select({ card: cards.card })
      .from(cards)
      .where(and(eq(cards.gameId, gameId), eq(cards.playerId, currentUserId), eq(cards.type, "hole")))
      .orderBy(asc(cards.createdAt)),
    db
      .select({ card: cards.card })
      .from(cards)
      .where(and(eq(cards.gameId, gameId), ne(cards.playerId, currentUserId), eq(cards.type, "hole")))
      .orderBy(asc(cards.createdAt)),
    db
      .select({ card: cards.card })
      .from(cards)
      .where(
        and(eq(cards.gameId, gameId), inArray(cards.type, ["flop", "turn", "river"]), isNull(cards.playerId)),
      )
      .orderBy(asc(cards.createdAt)),
    db
      .select({
        action: moves.action,
        amount: moves.amount,
      })
      .from(moves)
      .where(eq(moves.gameId, gameId))
      .orderBy(desc(moves.createdAt))
      .limit(1),
    db
      .select({
        action: moves.action,
        amount: moves.amount,
        createdAt: moves.createdAt,
        playerName: users.username,
      })
      .from(moves)
      .innerJoin(users, eq(users.id, moves.playerId))
      .where(eq(moves.gameId, gameId))
      .orderBy(desc(moves.createdAt))
      .limit(12),
  ]);

  const lastMove =
    lastMoveRow.length === 0
      ? "No moves yet"
      : `${actionLabel[lastMoveRow[0].action] ?? lastMoveRow[0].action}${
          lastMoveRow[0].amount > 0 ? ` ${lastMoveRow[0].amount}` : ""
        }`;

  return {
    id: base.gameId,
    status: base.status,
    phase: phaseLabel[base.phase] ?? base.phase,
    pot: base.pot,
    isPlayerTurn: base.currentPlayerId === currentUserId,
    opponentName: base.opponentName,
    playerStack: base.playerStack,
    opponentStack: base.opponentStack,
    playerCards: playerCards.map((row) => row.card),
    opponentCards: opponentCards.map((row) => row.card),
    revealOpponentCards: base.status === "finished",
    boardCards: boardCards.map((row) => row.card),
    lastMove,
    moveHistory: moveRows.map((row) => ({
      action: row.action,
      amount: row.amount,
      createdAt: row.createdAt,
      playerName: row.playerName,
    })),
  };
}

export async function getUnreadNotifications(currentUserId: string) {
  const db = getDb();

  const rows = await db
    .select({
      id: notifications.id,
      title: notifications.title,
      body: notifications.body,
      createdAt: notifications.createdAt,
      gameId: notifications.gameId,
    })
    .from(notifications)
    .where(and(eq(notifications.userId, currentUserId), isNull(notifications.readAt)))
    .orderBy(desc(notifications.createdAt))
    .limit(6);

  return {
    count: rows.length,
    items: rows as NotificationItem[],
  };
}

