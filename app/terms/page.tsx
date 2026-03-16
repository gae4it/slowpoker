export default function TermsPage() {
  return (
    <section className="panel rounded-[2rem] p-6 sm:p-8">
      <div className="eyebrow text-xs text-white/48">Legal</div>
      <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
        Terms
      </h1>
      <div className="mt-6 space-y-4 text-sm leading-6 text-white/72">
        <p>SlowPoker is a play-for-fun game. No real money gambling is involved.</p>
        <p>This application is an educational project provided without warranty of any kind.</p>
        <p>
          Users are responsible for complying with local laws concerning games of chance and online
          services.
        </p>
        <p>Liability is limited to the maximum extent permitted by applicable law.</p>
      </div>
    </section>
  );
}
