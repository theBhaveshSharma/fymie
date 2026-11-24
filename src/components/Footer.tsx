export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-ink-elevated">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-10 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-[family-name:var(--font-syne)] text-lg font-bold text-cream">
            FYMIE
          </p>
          <p className="mt-1 text-sm text-mist">
            Find Your Match in the Event
          </p>
        </div>
        <p className="text-sm text-mist/70">
          © {new Date().getFullYear()} FYMIE. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
