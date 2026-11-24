"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { FEATURES } from "@/lib/features";

const links = [
  { href: "/events", label: "Events" },
  ...(FEATURES.destinations
    ? [{ href: "/destinations", label: "Destinations" }]
    : []),
  ...(FEATURES.circles ? [{ href: "/circles", label: "Circles" }] : []),
  { href: "/matches", label: "Matches" },
  { href: "/chat", label: "Chats" },
  { href: "/listings", label: "Listings" },
  { href: "/profile", label: "Profile" },
];

export function AppNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-30 border-b border-white/5 bg-ink/90 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <Link
          href="/events"
          className="font-[family-name:var(--font-syne)] text-lg font-bold tracking-tight text-cream"
        >
          FYMIE
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          {links.map((link) => {
            const active = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-lg px-2.5 py-1.5 text-sm font-medium transition-colors sm:px-3 ${
                  active
                    ? "bg-white/10 text-cream"
                    : "text-mist hover:text-cream"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <Link
            href="/events/new"
            className="ml-1 hidden rounded-lg bg-copper px-3 py-1.5 text-sm font-semibold text-ink transition-colors hover:bg-amber sm:inline-flex"
          >
            List event
          </Link>
          {user ? (
            <button
              type="button"
              onClick={() => {
                signOut();
                router.push("/");
              }}
              className="ml-1 rounded-lg px-2.5 py-1.5 text-sm font-medium text-mist transition-colors hover:text-cream sm:ml-2"
            >
              Sign out
            </button>
          ) : null}
        </div>
      </nav>
    </header>
  );
}
