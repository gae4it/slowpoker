import { GameCard } from "@/components/game-card";

const groups = {
  yourTurn: [
    {
      id: "g-1024",
      opponentName: "Alex",
      pot: 120,
      phase: "Flop: K♠ 8♥ 3♦",
      lastMove: "Alex called 20",
      statusLabel: "Your turn",
      href: "/game/g-1024",
    },
    {
      id: "g-2048",
      opponentName: "Jade",
      pot: 60,
      phase: "Preflop",
      lastMove: "Small blind posted",
      statusLabel: "Your turn",
      href: "/game/g-2048",
    },
  ],
  waiting: [
    {
      id: "g-4096",
      opponentName: "Maria",
      pot: 80,
      phase: "Turn: 7♣",
      lastMove: "Waiting for opponent",
      statusLabel: "Waiting",
      href: "/game/g-4096",
    },
  ],
  finished: [
    {
      id: "g-8192",
      opponentName: "Noah",
      pot: 240,
      phase: "Showdown",
      lastMove: "You won with two pair",
      statusLabel: "Finished",
      href: "/game/g-8192",
    },
  ],
};

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <section className="panel rounded-[2rem] p-6 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="eyebrow text-xs text-white/48">Game queue</div>
            <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
              Gestisci tutte le partite senza perdere il turno importante.
            </h1>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center text-sm sm:min-w-[280px]">
            <div className="rounded-[1.25rem] border border-white/10 bg-white/4 px-4 py-3">
              <div className="text-lg font-semibold text-white">2</div>
              <div className="text-white/54">Your Turn</div>
            </div>
            <div className="rounded-[1.25rem] border border-white/10 bg-white/4 px-4 py-3">
              <div className="text-lg font-semibold text-white">1</div>
              <div className="text-white/54">Waiting</div>
            </div>
            <div className="rounded-[1.25rem] border border-white/10 bg-white/4 px-4 py-3">
              <div className="text-lg font-semibold text-white">1</div>
              <div className="text-white/54">Finished</div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <GameCardGroup title="Your Turn" games={groups.yourTurn} />
        <GameCardGroup title="Waiting" games={groups.waiting} />
        <GameCardGroup title="Finished" games={groups.finished} />
      </section>
    </div>
  );
}

type GameCardGroupProps = {
  title: string;
  games: {
    id: string;
    opponentName: string;
    pot: number;
    phase: string;
    lastMove: string;
    statusLabel: string;
    href: string;
  }[];
};

function GameCardGroup({ title, games }: GameCardGroupProps) {
  return (
    <div className="panel rounded-[2rem] p-5 sm:p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">{title}</h2>
        <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/55">
          {games.length}
        </span>
      </div>
      <div className="mt-5 space-y-4">
        {games.map((game) => (
          <GameCard key={game.id} {...game} />
        ))}
      </div>
    </div>
  );
}
