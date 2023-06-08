"use client";

import { cn } from "@/lib/cn";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavLinkItem({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const isActive = usePathname() === href;

  return (
    <li>
      <Link
        className={cn(
          "px-3 py-2 font-medium hover:bg-gray-100 transition-colors duration-200 hover:text-primary",
          {
            "text-primary": isActive,
          }
        )}
        href={href}
      >
        {children}
      </Link>
    </li>
  );
}

export function NavLinkCTA({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <li>
      <Link
        className="px-3 py-2 font-medium bg-primary text-white hover:bg-primary-700 transition-colors duration-200"
        href={href}
      >
        {children}
      </Link>
    </li>
  );
}
