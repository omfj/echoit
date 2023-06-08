import Image from "next/image";
import Link from "next/link";
import { NavLinkItem, NavLinkCTA } from "./nav-link";
import { getSession } from "@/lib/session";

export async function Header() {
  const session = await getSession();

  return (
    <div>
      <header className="flex items-center px-5 py-3">
        <div>
          <Link href="/">
            <Image
              src="/logo.svg"
              alt="echoit!"
              width={125}
              height={125}
              quality={100}
            />
            <span className="sr-only">echoit!</span>
          </Link>
        </div>

        <div className="flex-1" />

        <nav>
          <ul className="flex items-center gap-2">
            <NavLinkItem href="/">Home</NavLinkItem>
            <NavLinkItem href="/feed">Feed</NavLinkItem>
            {session && <NavLinkItem href="/create">Create</NavLinkItem>}
            {session ? (
              <NavLinkCTA href="/api/auth/signout">Logout</NavLinkCTA>
            ) : (
              <NavLinkCTA href="/login">Login</NavLinkCTA>
            )}
          </ul>
        </nav>
      </header>
    </div>
  );
}
