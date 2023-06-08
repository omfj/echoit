"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

export function LoginBox() {
  const params = useSearchParams();

  const returnTo = params.get("returnTo") ?? "/";

  return (
    <div className="border my-auto p-10 max-w-[500px] mx-auto shadow-lg">
      <h1 className="text-3xl font-medium text-center">
        Velg en måte å logge inn på
      </h1>

      <div className="flex flex-col gap-2 mt-8">
        <button
          onClick={() => signIn("github", { callbackUrl: returnTo })}
          className="bg-primary hover:bg-primary-700 text-white py-2 px-4"
        >
          Fortsett med Github
        </button>
      </div>

      <div className="mt-8">
        <p className="text-center">
          Tilbake til hovedsiden?{" "}
          <Link className="underline hover:no-underline" href="/">
            Klikk her
          </Link>
        </p>
      </div>
    </div>
  );
}
