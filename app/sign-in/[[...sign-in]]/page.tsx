"use client";

import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <section className="panel flex min-h-[70vh] items-center justify-center rounded-[2rem] p-6 sm:p-8">
      <SignIn
        path="/sign-in"
        appearance={{
          variables: {
            colorBackground: "#09090b",
            colorInputBackground: "#18181b",
            colorText: "#fafafa",
            colorPrimary: "#f4f4f5",
            colorTextOnPrimaryBackground: "#09090b",
          },
        }}
      />
    </section>
  );
}
