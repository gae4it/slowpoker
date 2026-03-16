"use server";

import { auth } from "@clerk/nextjs/server";
import { and, desc, eq, isNull } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getDb } from "@/lib/db/client";
import { cards, gamePlayers, games, moves, notifications, users } from "@/lib/db/schema";
import { syncClerkUser } from "@/lib/auth/sync-clerk-user";
import { createDeck, shuffleDeck } from "@/lib/poker/deck";
import { createInitialGameState } from "@/lib/poker/engine";
import type { CardCode } from "@/lib/poker/types";

export async function createGameAction(formData: FormData) {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const opponentId = String(formData.get("opponentId") ?? "").trim();
  if (!opponentId) {
    redirect("/new-game?error=missing-opponent");
  }

  const syncState = await syncClerkUser();
  if (!syncState || !syncState.synced || !syncState.user) {
    redirect("/new-game?error=db-sync");
  }

  const creator = syncState.user;
  const gameState = createInitialGameState({
    creatorId: creator.id,
    opponentId,
  });

  const db = getDb();

  await db.transaction(async (tx) => {
    await tx.insert(games).values({
      id: gameState.id,
      status: gameState.status,
      createdBy: creator.id,
      currentPlayerId: gameState.currentPlayerId,
      pot: gameState.pot,
      phase: gameState.phase,
    });

    await tx.insert(gamePlayers).values([
      {
        gameId: gameState.id,
        userId: gameState.players[0].userId,
        stack: gameState.players[0].stack,
        position: "small_blind",
        folded: false,
      },
      {
        gameId: gameState.id,
        userId: gameState.players[1].userId,
        stack: gameState.players[1].stack,
        position: "big_blind",
        folded: false,
      },
    ]);

    await tx.insert(cards).values([
      ...gameState.players[0].cards.map((cardCode) => ({
        gameId: gameState.id,
        playerId: gameState.players[0].userId,
        card: cardCode,
        type: "hole" as const,
      })),
      ...gameState.players[1].cards.map((cardCode) => ({
        gameId: gameState.id,
        playerId: gameState.players[1].userId,
        card: cardCode,
        type: "hole" as const,
      })),
    ]);

    await tx.insert(moves).values(
      gameState.moveHistory.map((move) => ({
        gameId: gameState.id,
        playerId: move.playerId,
        phase: "preflop" as const,
        action: move.action,
        amount: move.amount,
      })),
    );
  });

  revalidatePath("/dashboard");
  revalidatePath("/new-game");
  redirect(`/game/${gameState.id}`);
}

type MoveActionType = "check" | "bet" | "call" | "raise" | "fold";

const phaseOrder = ["preflop", "flop", "turn", "river", "showdown"] as const;

function nextPhase(phase: (typeof phaseOrder)[number]) {
  const index = phaseOrder.indexOf(phase);
  return phaseOrder[Math.min(index + 1, phaseOrder.length - 1)];
}

function pickUnusedCards(existingCards: string[], count: number) {
  const used = new Set(existingCards);
  const shuffled = shuffleDeck(createDeck());
  const picked: string[] = [];

  for (const card of shuffled) {
    if (used.has(card)) {
      continue;
    }
    picked.push(card);
    if (picked.length === count) {
      break;
    }
  }

  return picked;
}

function getRoundStarter(
  phase: "preflop" | "flop" | "turn" | "river" | "showdown",
  players: Array<{ userId: string; position: string }>,
) {
  if (phase === "preflop") {
    return players.find((player) => player.position === "small_blind")?.userId;
  }

  return players.find((player) => player.position === "big_blind")?.userId;
}

async function createNotification(
  tx: Parameters<Parameters<ReturnType<typeof getDb>["transaction"]>[0]>[0],
  userId: string,
  gameId: string,
  title: string,
  body: string,
) {
  await tx.insert(notifications).values({
    userId,
    gameId,
    type: "turn",
    title,
    body,
  });
}

async function finalizeGameWithFold(
  tx: Parameters<Parameters<ReturnType<typeof getDb>["transaction"]>[0]>[0],
  params: {
    gameId: string;
    foldedPlayerId: string;
    winnerPlayerId: string;
    pot: number;
  },
) {
  const winner = await tx
    .select({
      id: gamePlayers.id,
      stack: gamePlayers.stack,
    })
    .from(gamePlayers)
    .where(
      and(eq(gamePlayers.gameId, params.gameId), eq(gamePlayers.userId, params.winnerPlayerId)),
    )
    .limit(1);

  if (winner.length > 0) {
    await tx
      .update(gamePlayers)
      .set({ stack: winner[0].stack + params.pot })
      .where(eq(gamePlayers.id, winner[0].id));
  }

  await tx
    .update(games)
    .set({
      status: "finished",
      phase: "showdown",
      currentPlayerId: null,
      pot: 0,
      updatedAt: new Date(),
    })
    .where(eq(games.id, params.gameId));
}

async function finalizeGameWithShowdown(
  tx: Parameters<Parameters<ReturnType<typeof getDb>["transaction"]>[0]>[0],
  params: {
    gameId: string;
    pot: number;
    players: Array<{ id: string; userId: string; stack: number }>;
  },
) {
  const { findShowdownWinners } = await import("@/lib/poker/hand-eval");

  const board = await tx
    .select({ card: cards.card })
    .from(cards)
    .where(and(eq(cards.gameId, params.gameId), isNull(cards.playerId)));

  const playerCards = await tx
    .select({
      playerId: cards.playerId,
      card: cards.card,
    })
    .from(cards)
    .where(and(eq(cards.gameId, params.gameId), eq(cards.type, "hole")));

  const boardCards = board.map((entry) => entry.card as CardCode);
  const playerHands = params.players.map((player) => ({
    playerId: player.userId,
    holeCards: playerCards
      .filter((entry) => entry.playerId === player.userId)
      .map((entry) => entry.card as CardCode),
  }));

  const winnerUserIds = findShowdownWinners(playerHands, boardCards);
  const winners = params.players.filter((p) => winnerUserIds.includes(p.userId));
  const splitAmount = Math.floor(params.pot / (winners.length || 1));
  const remainder = params.pot % (winners.length || 1);

  for (const [index, winner] of winners.entries()) {
    const bonus = index === 0 ? remainder : 0;
    await tx
      .update(gamePlayers)
      .set({ stack: winner.stack + splitAmount + bonus })
      .where(eq(gamePlayers.id, winner.id));
  }

  await tx
    .update(games)
    .set({
      status: "finished",
      phase: "showdown",
      currentPlayerId: null,
      pot: 0,
      updatedAt: new Date(),
    })
    .where(eq(games.id, params.gameId));
}

export async function submitMoveAction(formData: FormData) {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const gameId = String(formData.get("gameId") ?? "").trim();
  const action = String(formData.get("action") ?? "").trim() as MoveActionType;
  const requestedAmount = Number(formData.get("amount") ?? "0");

  if (!gameId || !["check", "bet", "call", "raise", "fold"].includes(action)) {
    redirect(`/dashboard?error=invalid-move`);
  }

  const syncState = await syncClerkUser();
  if (!syncState || !syncState.synced || !syncState.user) {
    redirect(`/game/${gameId}?error=db-sync`);
  }

  const actorId = syncState.user.id;
  const db = getDb();

  try {
    await db.transaction(async (tx) => {
      const [game] = await tx
        .select({
          id: games.id,
          status: games.status,
          currentPlayerId: games.currentPlayerId,
          pot: games.pot,
          phase: games.phase,
        })
        .from(games)
        .where(eq(games.id, gameId))
        .limit(1);

      if (!game) {
        throw new Error("missing-game");
      }
      if (game.status !== "active") {
        throw new Error("finished-game");
      }
      if (game.currentPlayerId !== actorId) {
        throw new Error("not-your-turn");
      }

      const players = await tx
        .select({
          id: gamePlayers.id,
          userId: gamePlayers.userId,
          stack: gamePlayers.stack,
          position: gamePlayers.position,
          folded: gamePlayers.folded,
        })
        .from(gamePlayers)
        .where(eq(gamePlayers.gameId, gameId));

      const playerUsers = await tx
        .select({ id: users.id, username: users.username })
        .from(users)
        .where(eq(users.id, actorId));

      const actor = players.find((player) => player.userId === actorId);
      const opponent = players.find((player) => player.userId !== actorId);

      if (!actor || !opponent) {
        throw new Error("missing-players");
      }
      if (actor.folded) {
        throw new Error("already-folded");
      }

      const phaseMoves = await tx
        .select({
          playerId: moves.playerId,
          action: moves.action,
          amount: moves.amount,
        })
        .from(moves)
        .where(and(eq(moves.gameId, gameId), eq(moves.phase, game.phase)))
        .orderBy(desc(moves.createdAt));

      const latestAggressiveMove = phaseMoves.find(
        (move) => move.action === "bet" || move.action === "raise",
      );
      const hasOutstandingBet =
        Boolean(latestAggressiveMove) && latestAggressiveMove?.playerId !== actor.userId;

      if (action === "check" && hasOutstandingBet) {
        throw new Error("cannot-check");
      }
      if (action === "call" && !hasOutstandingBet) {
        throw new Error("cannot-call");
      }
      if (action === "bet" && hasOutstandingBet) {
        throw new Error("cannot-bet");
      }
      if (action === "raise" && !hasOutstandingBet) {
        throw new Error("cannot-raise");
      }

      let amount = 0;

      if (action === "call") {
        amount = Math.min(actor.stack, latestAggressiveMove?.amount ?? 0);
      }

      if (action === "bet") {
        const normalized =
          Number.isFinite(requestedAmount) && requestedAmount > 0 ? requestedAmount : 20;
        amount = Math.min(actor.stack, normalized);
      }

      if (action === "raise") {
        const baseline = latestAggressiveMove?.amount ?? 20;
        const normalized =
          Number.isFinite(requestedAmount) && requestedAmount > baseline
            ? requestedAmount
            : baseline * 2;
        amount = Math.min(actor.stack, normalized);
      }

      await tx.insert(moves).values({
        gameId,
        playerId: actor.userId,
        phase: game.phase,
        action,
        amount,
      });

      await tx
        .update(gamePlayers)
        .set({
          stack: actor.stack - amount,
          folded: action === "fold" ? true : actor.folded,
        })
        .where(eq(gamePlayers.id, actor.id));

      const [freshActor] = await tx
        .select({
          userId: gamePlayers.userId,
          stack: gamePlayers.stack,
        })
        .from(gamePlayers)
        .where(eq(gamePlayers.id, actor.id))
        .limit(1);

      const updatedPhaseMoves = [
        {
          playerId: actor.userId,
          action,
          amount,
        },
        ...phaseMoves,
      ];

      const lastTwo = updatedPhaseMoves.slice(0, 2);
      const roundClosedByChecks =
        lastTwo.length === 2 &&
        lastTwo[0].action === "check" &&
        lastTwo[1].action === "check" &&
        lastTwo[0].playerId !== lastTwo[1].playerId;
      const roundClosedByCall = action === "call" && hasOutstandingBet;

      let phaseToSet: "preflop" | "flop" | "turn" | "river" | "showdown" = game.phase;
      let currentPlayerToSet: string | null = opponent.userId;

      if (action === "fold") {
        await finalizeGameWithFold(tx, {
          gameId,
          foldedPlayerId: actor.userId,
          winnerPlayerId: opponent.userId,
          pot: game.pot + amount,
        });

        await createNotification(
          tx,
          opponent.userId,
          gameId,
          "Hand finished",
          `${playerUsers[0]?.username ?? "Opponent"} folded. You won the pot.`,
        );

        await createNotification(tx, actor.userId, gameId, "Hand finished", "You folded the hand.");

        return;
      } else if (roundClosedByChecks || roundClosedByCall) {
        const advanced = nextPhase(game.phase);
        phaseToSet = advanced;

        if (advanced === "showdown") {
          await finalizeGameWithShowdown(tx, {
            gameId,
            pot: game.pot + amount,
            players: players.map((player) => ({
              id: player.id,
              userId: player.userId,
              stack: player.stack - (player.userId === actor.userId ? amount : 0),
            })),
          });

          await createNotification(
            tx,
            actor.userId,
            gameId,
            "Showdown completed",
            "The hand reached showdown. Open the game to see the result.",
          );
          await createNotification(
            tx,
            opponent.userId,
            gameId,
            "Showdown completed",
            "The hand reached showdown. Open the game to see the result.",
          );

          return;
        } else {
          currentPlayerToSet = getRoundStarter(advanced, players) ?? opponent.userId;

          const existingCards = await tx
            .select({
              card: cards.card,
              type: cards.type,
            })
            .from(cards)
            .where(eq(cards.gameId, gameId));

          const allCards = existingCards.map((entry) => entry.card);
          const hasFlop = existingCards.some((entry) => entry.type === "flop");
          const hasTurn = existingCards.some((entry) => entry.type === "turn");
          const hasRiver = existingCards.some((entry) => entry.type === "river");

          if (advanced === "flop" && !hasFlop) {
            const flopCards = pickUnusedCards(allCards, 3);
            await tx.insert(cards).values(
              flopCards.map((cardCode) => ({
                gameId,
                playerId: null,
                card: cardCode,
                type: "flop" as const,
              })),
            );
          }

          if (advanced === "turn" && !hasTurn) {
            const [turnCard] = pickUnusedCards(allCards, 1);
            await tx.insert(cards).values({
              gameId,
              playerId: null,
              card: turnCard,
              type: "turn",
            });
          }

          if (advanced === "river" && !hasRiver) {
            const [riverCard] = pickUnusedCards(allCards, 1);
            await tx.insert(cards).values({
              gameId,
              playerId: null,
              card: riverCard,
              type: "river",
            });
          }
        }
      }

      await tx
        .update(games)
        .set({
          pot: game.pot + amount,
          currentPlayerId: currentPlayerToSet,
          status: game.status,
          phase: phaseToSet,
          updatedAt: new Date(),
        })
        .where(eq(games.id, gameId));

      if (currentPlayerToSet) {
        await createNotification(
          tx,
          currentPlayerToSet,
          gameId,
          "Your turn",
          `It is your turn in SlowPoker vs ${playerUsers[0]?.username ?? "opponent"}.`,
        );
      }

      if (freshActor && freshActor.stack < 0) {
        throw new Error("negative-stack");
      }
    });
  } catch (error) {
    const reason = error instanceof Error ? error.message : "unknown";
    redirect(`/game/${gameId}?error=${reason}`);
  }

  revalidatePath("/dashboard");
  revalidatePath(`/game/${gameId}`);
  redirect(`/game/${gameId}`);
}
