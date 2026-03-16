import { auth } from "@clerk/nextjs/server";
import { GameCard } from "@/components/game-card";
import { syncClerkUser } from "@/lib/auth/sync-clerk-user";
import type { DashboardGroups } from "@/lib/db/queries";
import type { DashboardGame } from "@/lib/db/queries";
import { getDashboardGroups, getUnreadNotifications } from "@/lib/db/queries";

const fallbackGroups: DashboardGroups = {
  yourTurn: [
    {
      id: "g-1024",
      opponentName: "Alex",
      pot: 120,
      phase: "Flop: K♠ 8♥ 3♦",
      lastMove: "Alex called 20",
      statusLabel: "Your turn",
      href: "/game/g-1024",
    },
    {
      id: "g-2048",
      opponentName: "Jade",
      pot: 60,
      phase: "Preflop",
      lastMove: "Small blind posted",
      statusLabel: "Your turn",
      href: "/game/g-2048",
    },
  ],
  waiting: [
    {
      id: "g-4096",
      opponentName: "Maria",
      pot: 80,
      phase: "Turn: 7♣",
      lastMove: "Waiting for opponent",
      statusLabel: "Waiting",
      href: "/game/g-4096",
    },
  ],
  finished: [
    {
      id: "g-8192",
      opponentName: "Noah",
      pot: 240,
      phase: "Showdown",
      lastMove: "You won with two pair",
      statusLabel: "Finished",
      href: "/game/g-8192",
    },
  ],
};

export default async function DashboardPage() {
  const [{ userId }, syncState] = await Promise.all([auth(), syncClerkUser()]);
  const groupsPromise =
    syncState && syncState.synced && syncState.user
      ? getDashboardGroups(syncState.user.id).catch(() => fallbackGroups)
      : Promise.resolve(fallbackGroups);
  const notificationsPromise =
    syncState && syncState.synced && syncState.user
      ? getUnreadNotifications(syncState.user.id).catch(() => ({ count: 0, items: [] }))
      : Promise.resolve({ count: 0, items: [] });

  const [groups, notificationState] = await Promise.all([groupsPromise, notificationsPromise]);

  return (
    <div className="space-y-6">
      <section className="panel rounded-[2rem] p-6 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="eyebrow text-xs text-white/48">Game queue</div>
            <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
              Gestisci tutte le partite senza perdere il turno importante.
            </h1>
            <p className="mt-2 text-sm text-white/58">
              Signed in as {syncState && "user" in syncState ? syncState.user?.username : userId ?? "player"}
            </p>
            {syncState?.synced ? (
              <p className="mt-1 text-xs text-emerald-300/90">Profilo applicativo sincronizzato su database.</p>
            ) : (
              <p className="mt-1 text-xs text-amber-300/90">
                Database non configurato: sincronizzazione utente in fallback locale.
              </p>
            )}
          </div>
          <div className="grid grid-cols-3 gap-3 text-center text-sm sm:min-w-[280px]">
            <div className="rounded-[1.25rem] border border-white/10 bg-white/4 px-4 py-3">
              <div className="text-lg font-semibold text-white">{groups.yourTurn.length}</div>
              <div className="text-white/54">Your Turn</div>
            </div>
            <div className="rounded-[1.25rem] border border-white/10 bg-white/4 px-4 py-3">
              <div className="text-lg font-semibold text-white">{groups.waiting.length}</div>
              <div className="text-white/54">Waiting</div>
            </div>
            <div className="rounded-[1.25rem] border border-white/10 bg-white/4 px-4 py-3">
              <div className="text-lg font-semibold text-white">{groups.finished.length}</div>
              <div className="text-white/54">Finished</div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <GameCardGroup title="Your Turn" games={groups.yourTurn} />
        <GameCardGroup title="Waiting" games={groups.waiting} />
        <GameCardGroup title="Finished" games={groups.finished} />
      </section>

      <section className="panel rounded-[2rem] p-6 sm:p-8">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Notifications</h2>
          <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/55">
            Unread {notificationState.count}
          </span>
        </div>
        <div className="mt-4 space-y-3">
          {notificationState.items.length > 0 ? (
            notificationState.items.map((item) => (
              <div key={item.id} className="rounded-2xl border border-white/10 bg-white/4 p-4">
                <div className="text-sm font-medium text-white">{item.title}</div>
                <div className="mt-1 text-sm text-white/65">{item.body}</div>
              </div>
            ))
          ) : (
            <div className="rounded-2xl border border-white/10 bg-white/4 p-4 text-sm text-white/65">
              Nessuna notifica non letta.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

type GameCardGroupProps = {
  title: string;
  games: DashboardGame[];
};

function GameCardGroup({ title, games }: GameCardGroupProps) {
  return (
    <div className="panel rounded-[2rem] p-5 sm:p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">{title}</h2>
        <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/55">
          {games.length}
        </span>
      </div>
      <div className="mt-5 space-y-4">
        {games.map((game) => (
          <GameCard key={game.id} {...game} />
        ))}
      </div>
    </div>
  );
}
