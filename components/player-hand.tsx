import { Card } from "@/components/card";
import { CardBack } from "@/components/card-back";

type PlayerHandProps = {
  title: string;
  cards: string[];
  stack: number;
  concealed?: boolean;
  active?: boolean;
};

export function PlayerHand({
  title,
  cards,
  stack,
  concealed = false,
  active = false,
}: PlayerHandProps) {
  return (
    <div
      className={`rounded-[1.75rem] border p-4 ${active ? "border-emerald-400/30 bg-emerald-400/8" : "border-white/10 bg-white/4"}`}
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-sm text-white/52">{title}</div>
          <div className="mt-1 text-lg font-semibold text-white">Stack {stack}</div>
        </div>
        {active ? (
          <span className="rounded-full bg-emerald-400/14 px-3 py-1 text-xs text-emerald-300">
            Current turn
          </span>
        ) : null}
      </div>
      <div className="mt-4 flex gap-3">
        {cards.map((card, index) =>
          concealed ? (
            <CardBack key={`${card}-${index}`} />
          ) : (
            <Card key={`${card}-${index}`} card={card} />
          ),
        )}
      </div>
    </div>
  );
}
