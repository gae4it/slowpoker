declare module "pokersolver" {
  const Hand: {
    solve: (cards: string[]) => {
      name: string;
      descr: string;
      cards: string[];
      cardPool: string[];
      rank: number;
      toString: () => string;
    };
  };

  export default Hand;
}

declare module "poker-evaluator" {
  export function evalHand(cards: string[]): {
    handName: string;
    handRank: number;
    value: number;
  };
}
