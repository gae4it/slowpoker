import { ActionButtons } from "@/components/action-buttons";
import { PokerTable } from "@/components/poker-table";

const mockState = {
  opponentName: "Alex",
  opponentStack: 1780,
  playerStack: 1760,
  pot: 120,
  board: ["Ks", "8h", "3d"],
  hand: ["As", "Ad"],
  isPlayerTurn: true,
  lastMove: "Alex called 20",
  phaseLabel: "Flop",
};

export default async function GamePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="space-y-6">
      <section className="panel rounded-[2rem] p-6 sm:p-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="eyebrow text-xs text-white/48">Game detail</div>
            <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
              Tavolo asincrono contro {mockState.opponentName}
            </h1>
            <p className="mt-2 text-sm text-white/60">Game ID: {id}</p>
          </div>
          <div className="rounded-full border border-emerald-400/25 bg-emerald-400/12 px-4 py-2 text-sm text-emerald-300">
            {mockState.phaseLabel} • {mockState.isPlayerTurn ? "Your turn" : "Waiting"}
          </div>
        </div>
      </section>

      <PokerTable
        opponentName={mockState.opponentName}
        opponentStack={mockState.opponentStack}
        playerStack={mockState.playerStack}
        pot={mockState.pot}
        board={mockState.board}
        hand={mockState.hand}
        isPlayerTurn={mockState.isPlayerTurn}
      />

      <section className="grid gap-6 lg:grid-cols-[1fr_0.7fr]">
        <ActionButtons
          actions={[
            { label: "Check", action: "check" },
            { label: "Bet", action: "bet" },
            { label: "Call", action: "call" },
            { label: "Raise", action: "raise" },
            { label: "Fold", action: "fold", tone: "danger" },
          ]}
          disabled={!mockState.isPlayerTurn}
        />
        <div className="panel rounded-[2rem] p-6">
          <div className="eyebrow text-xs text-white/48">Move log</div>
          <div className="mt-4 rounded-[1.5rem] border border-white/10 bg-black/20 p-4 text-sm text-white/70">
            <div>Last move: {mockState.lastMove}</div>
            <div className="mt-2">Next step: server action per validare la prossima mossa e aggiornare il board.</div>
          </div>
        </div>
      </section>
    </div>
  );
}
