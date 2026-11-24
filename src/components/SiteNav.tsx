import Link from "next/link";

export function SiteNav() {
  return (
    <header className="absolute inset-x-0 top-0 z-20">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <a
          href="#top"
          className="font-[family-name:var(--font-syne)] text-lg font-bold tracking-tight text-cream"
        >
          FYMIE
        </a>
        <div className="flex items-center gap-4 sm:gap-6">
          <a
            href="#waitlist"
            className="hidden text-sm font-medium text-fog/90 transition-colors hover:text-cream sm:inline"
          >
            Waitlist
          </a>
          <Link
            href="/login"
            className="text-sm font-medium text-fog/90 transition-colors hover:text-cream"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="rounded-xl bg-copper px-3.5 py-2 text-sm font-semibold text-ink transition-colors hover:bg-amber"
          >
            Get started
          </Link>
        </div>
      </nav>
    </header>
  );
}
