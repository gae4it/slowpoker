const registeredUsers = [
  { id: "u-1", username: "alex" },
  { id: "u-2", username: "maria" },
  { id: "u-3", username: "jade" },
];

export default function NewGamePage() {
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
      <section className="panel rounded-[2rem] p-6 sm:p-8">
        <div className="eyebrow text-xs text-white/48">Create game</div>
        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
          Avvia una nuova partita heads-up con blinds standard.
        </h1>
        <form className="mt-8 space-y-6">
          <label className="block space-y-2">
            <span className="text-sm text-white/72">Opponent</span>
            <select className="w-full rounded-[1.25rem] border border-white/10 bg-black/25 px-4 py-3 text-white outline-none transition focus:border-white/30">
              {registeredUsers.map((user) => (
                <option key={user.id} value={user.id} className="bg-zinc-950">
                  {user.username}
                </option>
              ))}
            </select>
          </label>
          <label className="block space-y-2">
            <span className="text-sm text-white/72">Invite link</span>
            <input
              readOnly
              value="https://slowpoker.app/invite/demo-hand-001"
              className="w-full rounded-[1.25rem] border border-white/10 bg-black/25 px-4 py-3 text-white/70 outline-none"
            />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <SettingCard label="Variant" value="Texas Hold'em" />
            <SettingCard label="Blinds" value="10 / 20" />
            <SettingCard label="Players" value="2" />
            <SettingCard label="Stack" value="2,000 chips" />
          </div>
          <button
            type="button"
            className="w-full rounded-full bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-zinc-200 sm:w-auto"
          >
            Create Game
          </button>
        </form>
      </section>

      <section className="panel rounded-[2rem] p-6 sm:p-8">
        <div className="eyebrow text-xs text-white/48">Validation rules</div>
        <ul className="mt-5 space-y-4 text-sm leading-6 text-white/72">
          <li>Tutto il deck viene generato sul server e mai nel client.</li>
          <li>Le mosse sono validate in base a currentPlayerId, fase e importi disponibili.</li>
          <li>Il link di invito puo&apos; essere usato per agganciare il secondo player a una partita in attesa.</li>
        </ul>
      </section>
    </div>
  );
}

function SettingCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-white/4 p-4">
      <div className="text-xs uppercase tracking-[0.2em] text-white/44">{label}</div>
      <div className="mt-2 text-lg font-semibold text-white">{value}</div>
    </div>
  );
}
