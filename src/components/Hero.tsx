import { AppImage as Image } from "@/components/AppImage";

export function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden"
    >
      <Image
        src="/hero-event.jpg"
        alt="Hikers on a mountain trail at golden hour"
        fill
        priority
        className="object-cover object-[center_40%]"
        sizes="100vw"
      />

      <div
        className="absolute inset-0 bg-gradient-to-t from-ink via-ink/75 to-ink/35"
        aria-hidden
      />
      <div
        className="animate-ambient pointer-events-none absolute -left-1/4 top-1/4 h-[55vmin] w-[55vmin] rounded-full bg-copper/25 blur-[100px]"
        aria-hidden
      />
      <div
        className="animate-ambient pointer-events-none absolute -right-[20%] bottom-1/3 h-[40vmin] w-[40vmin] rounded-full bg-mint/15 blur-[90px] [animation-delay:-5s]"
        aria-hidden
      />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-16 pt-28 sm:pb-24">
        <p className="animate-hero-rise font-[family-name:var(--font-syne)] text-5xl font-extrabold tracking-tight text-cream sm:text-7xl lg:text-8xl">
          FYMIE
        </p>
        <h1 className="animate-hero-rise-delay-1 mt-4 max-w-2xl font-[family-name:var(--font-syne)] text-2xl font-bold leading-tight tracking-tight text-cream sm:text-4xl">
          Find a partner for every event
        </h1>
        <p className="animate-hero-rise-delay-2 mt-4 max-w-xl text-base leading-relaxed text-fog sm:text-lg">
          See what is happening nearby, then match with a partner or group who
          actually wants to go.
        </p>
        <div className="animate-hero-rise-delay-3 mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
          <a
            href="/signup"
            className="inline-flex items-center justify-center rounded-xl bg-copper px-7 py-3.5 text-base font-semibold text-ink transition-colors hover:bg-amber"
          >
            Get started
          </a>
          <a
            href="#how-it-works"
            className="inline-flex items-center justify-center px-1 text-base font-medium text-fog underline-offset-4 transition-colors hover:text-cream hover:underline sm:px-3"
          >
            How it works
          </a>
        </div>
      </div>
    </section>
  );
}
