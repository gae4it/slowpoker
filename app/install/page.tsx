import { InstallAppButton } from "@/components/install-app-button";

const steps = {
  android: [
    "Open SlowPoker in Chrome.",
    'Tap the three-dot menu in the top right corner.',
    'Select "Add to Home Screen".',
    'Tap "Install" in the confirmation dialog.',
    "SlowPoker will appear on your home screen like a native app.",
  ],
  ios: [
    "Open SlowPoker in Safari.",
    'Tap the Share button (the square with an arrow pointing up) at the bottom of the screen.',
    'Scroll down and tap "Add to Home Screen".',
    'Confirm by tapping "Add" in the top right corner.',
    "SlowPoker will appear on your home screen.",
  ],
  desktop: [
    "Open SlowPoker in Chrome or Edge.",
    'Look for the install icon (⊕) in the address bar on the right side.',
    'Click it and select "Install".',
    "SlowPoker will open as a standalone window.",
  ],
};

function StepList({ items }: { items: string[] }) {
  return (
    <ol className="mt-4 space-y-3">
      {items.map((step, i) => (
        <li key={i} className="flex items-start gap-3 text-sm leading-6 text-white/72">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/6 text-xs font-semibold text-white/60">
            {i + 1}
          </span>
          {step}
        </li>
      ))}
    </ol>
  );
}

export default function InstallPage() {
  return (
    <div className="space-y-6">
      <section className="panel rounded-2rem p-6 sm:p-8">
        <div className="eyebrow text-xs text-white/48">Progressive Web App</div>
        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
          Install SlowPoker
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-white/65">
          SlowPoker is a PWA — you can install it on your device and use it like a native app, with no App Store required. It works offline, loads fast, and stays in your home screen.
        </p>
        <div className="mt-6">
          <InstallAppButton />
        </div>
      </section>

      <div className="grid gap-6 sm:grid-cols-3">
        <section className="panel rounded-2rem p-6">
          <div className="eyebrow text-xs text-white/48">Android · Chrome</div>
          <h2 className="mt-3 text-lg font-semibold text-white">Install on Android</h2>
          <StepList items={steps.android} />
        </section>

        <section className="panel rounded-2rem p-6">
          <div className="eyebrow text-xs text-white/48">iPhone · Safari</div>
          <h2 className="mt-3 text-lg font-semibold text-white">Install on iOS</h2>
          <StepList items={steps.ios} />
        </section>

        <section className="panel rounded-2rem p-6">
          <div className="eyebrow text-xs text-white/48">Chrome · Edge</div>
          <h2 className="mt-3 text-lg font-semibold text-white">Install on Desktop</h2>
          <StepList items={steps.desktop} />
        </section>
      </div>

      <section className="panel rounded-2rem p-6 sm:p-8">
        <h2 className="text-lg font-semibold text-white">Why install?</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {[
            { title: "Home screen shortcut", body: "Launch instantly without opening a browser." },
            { title: "Full-screen experience", body: "No browser chrome — feels like a native app." },
            { title: "Push notifications", body: "Get notified when it's your turn, even when the app is closed." },
          ].map(({ title, body }) => (
            <div key={title} className="rounded-1.5rem border border-white/10 bg-white/4 p-4">
              <div className="text-sm font-semibold text-white">{title}</div>
              <p className="mt-1 text-sm leading-6 text-white/60">{body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
