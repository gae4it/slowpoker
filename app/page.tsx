import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function HomePage() {
  const { userId } = await auth();
  if (userId) redirect("/dashboard");

  return (
    <div className="flex flex-1 flex-col items-center justify-center py-24 text-center">
      <div className="max-w-xl space-y-4">
        <div className="text-xs uppercase tracking-[0.25em] text-white/44">Correspondence poker</div>
        <h1 className="text-5xl font-semibold tracking-[-0.04em] text-white sm:text-6xl">
          SlowPoker
        </h1>
        <p className="text-base leading-7 text-white/60 sm:text-lg">
          Async heads-up Texas Hold&apos;em.<br />
          Play your move and come back when you&apos;re ready.
        </p>
        <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:justify-center">
          <Link
            href="/sign-up"
            className="rounded-full bg-white px-8 py-3 text-sm font-semibold text-black transition hover:bg-zinc-200"
          >
            Sign up
          </Link>
          <Link
            href="/sign-in"
            className="rounded-full bg-black border border-white/20 px-8 py-3 text-sm font-semibold text-white transition hover:bg-zinc-900"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
