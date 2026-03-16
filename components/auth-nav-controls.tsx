"use client";

import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

export function AuthNavControls() {
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);

  if (!mounted) {
    return <div className="h-10 w-[190px]" aria-hidden />;
  }

  return (
    <>
      <Show when="signed-out">
        <SignInButton mode="modal">
          <button
            type="button"
            className="rounded-full border border-white/10 px-4 py-2 text-white transition hover:border-white/25"
          >
            Sign in
          </button>
        </SignInButton>
        <SignUpButton mode="modal">
          <button
            type="button"
            className="rounded-full border border-white/10 px-4 py-2 text-white transition hover:border-white/25"
          >
            Sign up
          </button>
        </SignUpButton>
      </Show>
      <Show when="signed-in">
        <UserButton
          appearance={{
            elements: {
              avatarBox: "h-10 w-10 border border-white/20",
            },
          }}
        />
      </Show>
    </>
  );
}
