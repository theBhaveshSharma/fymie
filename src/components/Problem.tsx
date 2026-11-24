import { Reveal } from "./Reveal";

export function Problem() {
  return (
    <section className="border-t border-white/5 bg-ink">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
        <Reveal className="max-w-2xl">
          <h2 className="font-[family-name:var(--font-syne)] text-3xl font-bold tracking-tight text-cream sm:text-4xl">
            Wanting to go is easy. Finding company is not.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-mist">
            Treks and events are everywhere, but you often miss what is nearby.
            Even when you find one, your friends may not want to join. FYMIE
            shows what is happening around you and matches you with a partner or
            group based on interests, hobbies, and likes.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
