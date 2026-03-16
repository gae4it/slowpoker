"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignedIn, SignedOut, useClerk } from "@clerk/nextjs";
import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

function IconDashboard({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}

function IconNewGame({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <line x1="12" y1="8" x2="12" y2="16" />
      <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  );
}

function IconProfile({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  );
}

function ProfileButton() {
  const { openUserProfile } = useClerk();
  return (
    <button
      type="button"
      onClick={() => openUserProfile()}
      className="flex flex-1 flex-col items-center justify-center gap-1 py-3 text-[10px] font-medium text-white/45 transition hover:text-white/70"
    >
      <IconProfile active={false} />
      Profile
    </button>
  );
}

export function BottomNav() {
  const pathname = usePathname();
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);

  const isActive = (href: string) => pathname.startsWith(href);

  return (
    <nav className="fixed bottom-0 inset-x-0 z-30 flex sm:hidden border-t border-white/8 bg-black/70 backdrop-blur-xl pb-[env(safe-area-inset-bottom)]">
      <Link
        href="/dashboard"
        className={`flex flex-1 flex-col items-center justify-center gap-1 py-3 text-[10px] font-medium transition ${isActive("/dashboard") ? "text-white" : "text-white/45 hover:text-white/70"}`}
      >
        <IconDashboard active={isActive("/dashboard")} />
        Dashboard
      </Link>

      <Link
        href="/new-game"
        className={`flex flex-1 flex-col items-center justify-center gap-1 py-3 text-[10px] font-medium transition ${isActive("/new-game") ? "text-white" : "text-white/45 hover:text-white/70"}`}
      >
        <IconNewGame active={isActive("/new-game")} />
        New Game
      </Link>

      {mounted && (
        <>
          <SignedIn>
            <ProfileButton />
          </SignedIn>
          <SignedOut>
            <Link
              href="/sign-in"
              className={`flex flex-1 flex-col items-center justify-center gap-1 py-3 text-[10px] font-medium transition ${isActive("/sign-in") ? "text-white" : "text-white/45 hover:text-white/70"}`}
            >
              <IconProfile active={isActive("/sign-in")} />
              Sign in
            </Link>
          </SignedOut>
        </>
      )}
    </nav>
  );
}
