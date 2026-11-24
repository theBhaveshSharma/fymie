import { Reveal } from "./Reveal";
import { WaitlistForm } from "./WaitlistForm";

export function Waitlist() {
  return (
    <section id="waitlist" className="border-t border-white/5 bg-ink">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
        <Reveal className="mx-auto max-w-lg">
          <h2 className="text-center font-[family-name:var(--font-syne)] text-3xl font-bold tracking-tight text-cream sm:text-4xl">
            Be first in line
          </h2>
          <p className="mt-3 text-center text-base text-mist">
            Get early access to nearby event discovery and partner matching.
          </p>
          <div className="mt-8">
            <WaitlistForm />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
