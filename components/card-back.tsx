type CardBackProps = {
  size?: "sm" | "md" | "lg";
};

const sizeMap = {
  sm: "h-24 w-17",
  md: "h-28 w-20",
  lg: "h-32 w-22",
};

export function CardBack({ size = "md" }: CardBackProps) {
  return (
    <div
      className={`${sizeMap[size]} rounded-[1.35rem] border border-white/12 bg-[linear-gradient(135deg,rgba(255,255,255,0.16),rgba(255,255,255,0.06))] p-2 shadow-[0_10px_25px_rgba(0,0,0,0.25)]`}
    >
      <div className="flex h-full w-full items-center justify-center rounded-[1rem] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.1),transparent_40%),linear-gradient(180deg,#111827,#09090b)] text-white/35">
        <div className="grid grid-cols-4 gap-1 text-[10px] leading-none">
          {Array.from({ length: 16 }).map((_, index) => (
            <span key={index}>░</span>
          ))}
        </div>
      </div>
    </div>
  );
}
