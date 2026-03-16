import { Card } from "@/components/card";

type CommunityCardsProps = {
  cards: string[];
};

export function CommunityCards({ cards }: CommunityCardsProps) {
  return (
    <div>
      <div className="text-xs uppercase tracking-[0.2em] text-white/44">Board</div>
      <div className="mt-4 flex flex-wrap gap-3">
        {cards.length > 0 ? cards.map((card) => <Card key={card} card={card} />) : <EmptyBoardSlots />}
      </div>
    </div>
  );
}

function EmptyBoardSlots() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="h-28 w-20 rounded-[1.35rem] border border-dashed border-white/10 bg-black/15"
        />
      ))}
    </>
  );
}
