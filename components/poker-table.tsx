import { CommunityCards } from "@/components/community-cards";
import { PlayerHand } from "@/components/player-hand";

type PokerTableProps = {
  opponentName: string;
  opponentStack: number;
  playerStack: number;
  pot: number;
  board: string[];
  hand: string[];
  isPlayerTurn: boolean;
};

export function PokerTable({
  opponentName,
  opponentStack,
  playerStack,
  pot,
  board,
  hand,
  isPlayerTurn,
}: PokerTableProps) {
  return (
    <section className="surface-table rounded-[2rem] p-5 sm:p-8">
      <div className="grid gap-6">
        <PlayerHand title={opponentName} cards={["xx", "xx"]} stack={opponentStack} concealed />
        <div className="rounded-[1.75rem] border border-white/10 bg-black/18 p-5 text-center">
          <div className="text-xs uppercase tracking-[0.2em] text-white/42">Pot</div>
          <div className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-white">{pot}</div>
          <div className="mt-6 flex justify-center">
            <CommunityCards cards={board} />
          </div>
        </div>
        <PlayerHand title="You" cards={hand} stack={playerStack} active={isPlayerTurn} />
      </div>
    </section>
  );
}
