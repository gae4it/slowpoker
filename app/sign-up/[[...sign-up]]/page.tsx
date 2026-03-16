import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <section className="panel flex min-h-[70vh] items-center justify-center rounded-[2rem] p-6 sm:p-8">
      <SignUp
        path="/sign-up"
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
