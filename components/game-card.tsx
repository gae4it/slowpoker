import Link from "next/link";

type GameCardProps = {
  opponentName: string;
  pot: number;
  phase: string;
  lastMove: string;
  statusLabel: string;
  href: string;
};

export function GameCard({ opponentName, pot, phase, lastMove, statusLabel, href }: GameCardProps) {
  return (
    <Link
      href={href}
      className="block rounded-[1.5rem] border border-white/10 bg-white/4 p-4 transition hover:border-white/24 hover:bg-white/6"
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-sm text-white/50">Game vs {opponentName}</div>
          <div className="mt-1 text-lg font-semibold text-white">{statusLabel}</div>
        </div>
        <div className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/55">
          Pot {pot}
        </div>
      </div>
      <div className="mt-4 text-sm text-white/72">{phase}</div>
      <div className="mt-2 text-sm text-white/55">{lastMove}</div>
    </Link>
  );
}
