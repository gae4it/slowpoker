import Link from "next/link";
import { InstallAppButton } from "@/components/install-app-button";

const highlights = [
  "Partite heads-up asincrone su più giorni",
  "Dashboard con code Your Turn, Waiting e Finished",
  "Motore di gioco server-side con stato persistito",
];

export default function HomePage() {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr] lg:gap-8">
      <section className="panel fade-up rounded-[2rem] p-6 sm:p-8">
        <div className="eyebrow text-xs text-white/48">Correspondence poker</div>
        <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl lg:text-6xl">
          Un tavolo Texas Hold&apos;em pensato per turni lenti, non per sessioni live.
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-white/68 sm:text-lg">
          SlowPoker e&apos; una Progressive Web App mobile-first: crei una partita, giochi la tua mossa,
          chiudi e torni quando tocca di nuovo a te.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/dashboard" className="rounded-full bg-white px-5 py-3 text-center text-sm font-medium text-black transition hover:bg-zinc-200">
            Open Dashboard
          </Link>
          <Link href="/new-game" className="rounded-full border border-white/14 px-5 py-3 text-center text-sm font-medium text-white transition hover:border-white/30">
            Start New Game
          </Link>
          <InstallAppButton />
        </div>
        <div className="mt-10 grid gap-3 sm:grid-cols-3">
          {highlights.map((item) => (
            <div key={item} className="rounded-[1.5rem] border border-white/10 bg-white/4 p-4 text-sm text-white/72">
              {item}
            </div>
          ))}
        </div>
      </section>

      <section className="panel fade-up-delay rounded-[2rem] p-6 sm:p-8">
        <div className="eyebrow text-xs text-white/48">Execution focus</div>
        <div className="mt-5 space-y-4">
          <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-4">
            <div className="text-xs uppercase tracking-[0.2em] text-white/44">MVP Scope</div>
            <p className="mt-2 text-sm leading-6 text-white/72">
              Heads-up only, blinds fisse, piu&apos; partite concorrenti, notifiche in-app e base pronta per browser push.
            </p>
          </div>
          <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-4">
            <div className="text-xs uppercase tracking-[0.2em] text-white/44">Current Build</div>
            <p className="mt-2 text-sm leading-6 text-white/72">
              Questa prima implementazione imposta shell PWA, route principali, componenti tavolo e fondamenta dati.
            </p>
          </div>
          <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-4">
            <div className="text-xs uppercase tracking-[0.2em] text-white/44">Next Up</div>
            <p className="mt-2 text-sm leading-6 text-white/72">
              Clerk, Drizzle su Neon e le Server Actions che faranno girare il game loop reale.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
