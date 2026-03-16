"use client";

import { useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

export function useInstallPrompt() {
  const [event, setEvent] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setEvent(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const prompt = async () => {
    if (!event) return;
    await event.prompt();
    setEvent(null);
  };

  return { canInstall: !!event, prompt };
}

export function InstallAppButton() {
  const { canInstall, prompt } = useInstallPrompt();

  if (!canInstall) return null;

  return (
    <button
      type="button"
      className="rounded-full border border-white/14 px-5 py-3 text-sm font-medium text-white transition hover:border-white/30"
      onClick={prompt}
    >
      Install App
    </button>
  );
}
