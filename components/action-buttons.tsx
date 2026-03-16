type ActionButton = {
  label: string;
  action: "check" | "bet" | "call" | "raise" | "fold";
  amount?: number;
  tone?: "default" | "danger";
};

type ActionButtonsProps = {
  gameId: string;
  formAction: (formData: FormData) => Promise<void>;
  actions: ActionButton[];
  disabled?: boolean;
};

export function ActionButtons({ gameId, formAction, actions, disabled = false }: ActionButtonsProps) {
  return (
    <div className="panel rounded-[2rem] p-6">
      <div className="eyebrow text-xs text-white/48">Actions</div>
      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-5">
        {actions.map((button) => (
          <form key={button.action} action={formAction}>
            <input type="hidden" name="gameId" value={gameId} />
            <input type="hidden" name="action" value={button.action} />
            <input type="hidden" name="amount" value={button.amount ?? 0} />
            <button
              type="submit"
              disabled={disabled}
              className={`w-full rounded-[1.25rem] px-4 py-3 text-sm font-medium transition ${
                button.tone === "danger"
                  ? "border border-red-500/30 bg-red-500/10 text-red-300 hover:bg-red-500/15"
                  : "border border-white/10 bg-white/5 text-white hover:border-white/22 hover:bg-white/8"
              } ${disabled ? "cursor-not-allowed opacity-45" : ""}`}
            >
              {button.label}
            </button>
          </form>
        ))}
      </div>
    </div>
  );
}
