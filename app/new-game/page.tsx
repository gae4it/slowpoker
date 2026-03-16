import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { createGameAction } from "@/app/actions/games";
import { syncClerkUser } from "@/lib/auth/sync-clerk-user";
import { listOpponents } from "@/lib/db/queries";

export default async function NewGamePage() {
  const { userId } = await auth();

  if (!userId) {
    return (
      <section className="panel rounded-[2rem] p-6 sm:p-8">
        <div className="eyebrow text-xs text-white/48">Authentication required</div>
        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
          You need to sign in to create a new game.
        </h1>
        <Link
          href="/sign-in"
          className="mt-8 inline-flex rounded-full border border-white/10 px-5 py-3 text-sm text-white transition hover:border-white/25"
        >
          Go to sign in
        </Link>
      </section>
    );
  }

  const syncState = await syncClerkUser();
  const opponents =
    syncState && syncState.synced && syncState.user
      ? await listOpponents(syncState.user.id)
      : [];

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
      <section className="panel rounded-[2rem] p-6 sm:p-8">
        <div className="eyebrow text-xs text-white/48">Create game</div>
        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
          Start a new heads-up game with standard blinds.
        </h1>
        <form action={createGameAction} className="mt-8 space-y-6">
          <label className="block space-y-2">
            <span className="text-sm text-white/72">Opponent</span>
            <select
              name="opponentId"
              required
              disabled={opponents.length === 0}
              className="w-full rounded-[1.25rem] border border-white/10 bg-black/25 px-4 py-3 text-white outline-none transition focus:border-white/30 disabled:opacity-60"
            >
              {opponents.map((user) => (
                <option key={user.id} value={user.id} className="bg-zinc-950">
                  {user.username}
                </option>
              ))}
            </select>
            {opponents.length === 0 ? (
              <span className="text-xs text-amber-300/80">
                No opponents available: the second account must open the app at least once to be synced into the database.
              </span>
            ) : null}
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
            type="submit"
            disabled={opponents.length === 0}
            className="w-full rounded-full bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-zinc-200 sm:w-auto"
          >
            Create Game
          </button>
        </form>
      </section>

      <section className="panel rounded-[2rem] p-6 sm:p-8">
        <div className="eyebrow text-xs text-white/48">Validation rules</div>
        <ul className="mt-5 space-y-4 text-sm leading-6 text-white/72">
          <li>The full deck is generated server-side and never in the client.</li>
          <li>Moves are validated against currentPlayerId, phase, and available amounts.</li>
          <li>The invite link can be used to attach the second player to a pending game.</li>
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
