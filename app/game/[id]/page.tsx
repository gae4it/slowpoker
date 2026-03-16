import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { submitMoveAction } from "@/app/actions/games";
import { ActionButtons } from "@/components/action-buttons";
import { PokerTable } from "@/components/poker-table";
import { syncClerkUser } from "@/lib/auth/sync-clerk-user";
import { getGameDetail } from "@/lib/db/queries";

export default async function GamePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const { id } = await params;
  const { error } = await searchParams;
  const syncState = await syncClerkUser();

  if (!syncState || !syncState.synced || !syncState.user) {
    return (
      <section className="panel rounded-[2rem] p-6 sm:p-8">
        <div className="eyebrow text-xs text-white/48">Game detail</div>
        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
          Database non configurato o utente non sincronizzato.
        </h1>
      </section>
    );
  }

  const game = await getGameDetail(id, syncState.user.id);

  if (!game) {
    return (
      <section className="panel rounded-[2rem] p-6 sm:p-8">
        <div className="eyebrow text-xs text-white/48">Game detail</div>
        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
          Partita non trovata o non accessibile.
        </h1>
        <p className="mt-3 text-sm text-white/68">Controlla il link o torna alla dashboard.</p>
      </section>
    );
  }

  return (
    <div className="space-y-6">
      <section className="panel rounded-[2rem] p-6 sm:p-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="eyebrow text-xs text-white/48">Game detail</div>
            <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
              Tavolo asincrono contro {game.opponentName}
            </h1>
            <p className="mt-2 text-sm text-white/60">Game ID: {id}</p>
          </div>
          <div className="rounded-full border border-emerald-400/25 bg-emerald-400/12 px-4 py-2 text-sm text-emerald-300">
            {game.phase} •{" "}
            {game.status === "finished" ? "Finished" : game.isPlayerTurn ? "Your turn" : "Waiting"}
          </div>
        </div>
      </section>

      <PokerTable
        opponentName={game.opponentName}
        opponentStack={game.opponentStack}
        opponentCards={game.opponentCards}
        revealOpponentCards={game.revealOpponentCards}
        playerStack={game.playerStack}
        pot={game.pot}
        board={game.boardCards}
        hand={game.playerCards}
        isPlayerTurn={game.isPlayerTurn && game.status === "active"}
      />

      {error ? (
        <section className="rounded-[1.5rem] border border-amber-400/30 bg-amber-400/10 p-4 text-sm text-amber-200">
          Mossa non valida: {error}
        </section>
      ) : null}

      <section className="grid gap-6 lg:grid-cols-[1fr_0.7fr]">
        <ActionButtons
          gameId={game.id}
          formAction={submitMoveAction}
          actions={[
            { label: "Check", action: "check" },
            { label: "Bet 20", action: "bet", amount: 20 },
            { label: "Call", action: "call" },
            { label: "Raise 40", action: "raise", amount: 40 },
            { label: "Fold", action: "fold", tone: "danger" },
          ]}
          disabled={!game.isPlayerTurn || game.status !== "active"}
        />
        <div className="panel rounded-[2rem] p-6">
          <div className="eyebrow text-xs text-white/48">Move log</div>
          <div className="mt-4 rounded-[1.5rem] border border-white/10 bg-black/20 p-4 text-sm text-white/70">
            <div>Last move: {game.lastMove}</div>
            <div className="mt-2">Moves disponibili MVP: check, bet, call, raise, fold.</div>
          </div>
          <div className="mt-4 space-y-2 text-sm text-white/65">
            {game.moveHistory.map((move) => (
              <div
                key={`${move.createdAt.toISOString()}-${move.playerName}-${move.action}`}
                className="rounded-xl border border-white/8 bg-white/4 px-3 py-2"
              >
                <span className="font-medium text-white/82">{move.playerName}</span> {move.action}
                {move.amount > 0 ? ` ${move.amount}` : ""}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
