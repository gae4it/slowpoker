export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy"
      description="SlowPoker collects only the minimum data required for authentication, game persistence, and turn notifications."
      sections={[
        "Account data is managed through Clerk as the authentication provider.",
        "Games, moves, and application state are hosted on Neon PostgreSQL and served via Vercel.",
        "Browser notifications, if enabled, are used exclusively to alert you when it is your turn.",
      ]}
    />
  );
}

function LegalPage({
  title,
  description,
  sections,
}: {
  title: string;
  description: string;
  sections: string[];
}) {
  return (
    <section className="panel rounded-[2rem] p-6 sm:p-8">
      <div className="eyebrow text-xs text-white/48">Legal</div>
      <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
        {title}
      </h1>
      <p className="mt-4 max-w-3xl text-base leading-7 text-white/72">{description}</p>
      <div className="mt-8 space-y-4">
        {sections.map((section) => (
          <div
            key={section}
            className="rounded-[1.5rem] border border-white/10 bg-white/4 p-4 text-sm leading-6 text-white/72"
          >
            {section}
          </div>
        ))}
      </div>
    </section>
  );
}
