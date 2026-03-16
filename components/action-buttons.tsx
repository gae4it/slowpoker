type ActionButton = {
  label: string;
  action: string;
  tone?: "default" | "danger";
};

type ActionButtonsProps = {
  actions: ActionButton[];
  disabled?: boolean;
};

export function ActionButtons({ actions, disabled = false }: ActionButtonsProps) {
  return (
    <div className="panel rounded-[2rem] p-6">
      <div className="eyebrow text-xs text-white/48">Actions</div>
      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-5">
        {actions.map((button) => (
          <button
            key={button.action}
            type="button"
            disabled={disabled}
            className={`rounded-[1.25rem] px-4 py-3 text-sm font-medium transition ${
              button.tone === "danger"
                ? "border border-red-500/30 bg-red-500/10 text-red-300 hover:bg-red-500/15"
                : "border border-white/10 bg-white/5 text-white hover:border-white/22 hover:bg-white/8"
            } ${disabled ? "cursor-not-allowed opacity-45" : ""}`}
          >
            {button.label}
          </button>
        ))}
      </div>
    </div>
  );
}
