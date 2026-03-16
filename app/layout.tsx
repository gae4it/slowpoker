import type { Metadata } from "next";
import Link from "next/link";
import { IBM_Plex_Mono, Space_Grotesk } from "next/font/google";
import { ServiceWorkerRegistration } from "@/components/service-worker-registration";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "SlowPoker",
  description: "Asynchronous heads-up Texas Hold'em built as a PWA.",
  applicationName: "SlowPoker",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "SlowPoker",
  },
  icons: {
    icon: "/icons/icon-192.svg",
    apple: "/icons/icon-192.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body className={`${spaceGrotesk.variable} ${ibmPlexMono.variable}`}>
        <div className="grain" />
        <div className="page-shell relative flex min-h-screen flex-col">
          <header className="sticky top-0 z-20 border-b border-white/8 bg-black/30 backdrop-blur-xl">
            <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
              <Link href="/" className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-sm font-semibold tracking-[0.3em] text-white">
                  SP
                </span>
                <div>
                  <div className="text-sm font-semibold tracking-[0.2em] text-white/90 uppercase">
                    SlowPoker
                  </div>
                  <div className="text-xs text-white/55">Async Texas Hold&apos;em</div>
                </div>
              </Link>
              <nav className="flex items-center gap-3 text-sm text-white/72">
                <Link href="/dashboard" className="rounded-full border border-white/10 px-4 py-2 transition hover:border-white/25 hover:text-white">
                  Dashboard
                </Link>
                <Link href="/new-game" className="rounded-full bg-white px-4 py-2 font-medium text-black transition hover:bg-zinc-200">
                  New Game
                </Link>
              </nav>
            </div>
          </header>
          <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-6 sm:px-6 lg:px-8">
            {children}
          </main>
          <footer className="border-t border-white/8 bg-black/25">
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-6 text-sm text-white/58 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
              <p>SlowPoker is a play-for-fun game. No real money gambling is involved.</p>
              <div className="flex flex-wrap gap-4">
                <Link href="/privacy">Privacy</Link>
                <Link href="/terms">Terms</Link>
                <Link href="/imprint">Contact</Link>
              </div>
            </div>
          </footer>
        </div>
        <ServiceWorkerRegistration />
      </body>
    </html>
  );
}
