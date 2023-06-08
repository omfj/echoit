"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";

export function LogoutBox() {
  return (
    <div className="border my-auto p-10 max-w-[500px] mx-auto shadow-lg">
      <h1 className="text-3xl font-medium text-center">
        Er du sikker på at du vil logge ut?
      </h1>

      <div className="flex flex-col gap-2 mt-8">
        <button
          onClick={() => signOut()}
          className="bg-primary hover:bg-primary-700 text-white py-2 px-4"
        >
          Jeg er sikker
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
