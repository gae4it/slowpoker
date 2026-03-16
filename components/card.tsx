type CardProps = {
  card: string;
  size?: "sm" | "md" | "lg";
};

const suitMap: Record<string, { symbol: string; color: string }> = {
  s: { symbol: "♠", color: "text-slate-900" },
  h: { symbol: "♥", color: "text-red-500" },
  d: { symbol: "♦", color: "text-red-500" },
  c: { symbol: "♣", color: "text-slate-900" },
};

const sizeMap = {
  sm: "h-24 w-17 text-sm",
  md: "h-28 w-20 text-base",
  lg: "h-32 w-22 text-lg",
};

export function Card({ card, size = "md" }: CardProps) {
  const rank = card.slice(0, -1).toUpperCase();
  const suit = suitMap[card.slice(-1)] ?? suitMap.s;

  return (
    <div className={`flex ${sizeMap[size]} flex-col justify-between rounded-[1.35rem] bg-white p-3 shadow-[0_10px_25px_rgba(0,0,0,0.2)]`}>
      <div className={`font-mono leading-none ${suit.color}`}>
        <div className="text-base font-semibold">{rank}</div>
        <div className="text-lg">{suit.symbol}</div>
      </div>
      <div className={`self-center text-3xl leading-none ${suit.color}`}>{suit.symbol}</div>
      <div className={`rotate-180 self-end text-right font-mono leading-none ${suit.color}`}>
        <div className="text-base font-semibold">{rank}</div>
        <div className="text-lg">{suit.symbol}</div>
      </div>
    </div>
  );
}
