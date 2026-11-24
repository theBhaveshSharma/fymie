import { CalendarDays, Sparkles, Users } from "lucide-react";
import { Reveal } from "./Reveal";

const steps = [
  {
    number: "01",
    title: "Discover nearby",
    description:
      "Browse the latest concerts, treks, festivals, and trips around you, including plans listed by travelers, organizers, and tour companies.",
    icon: CalendarDays,
  },
  {
    number: "02",
    title: "Match a partner",
    description:
      "Find a partner or group who shares your interests, hobbies, and likes for that event.",
    icon: Sparkles,
  },
  {
    number: "03",
    title: "Go and enjoy",
    description:
      "Show up together, stay updated as plans change, and make the event memorable.",
    icon: Users,
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="border-t border-white/5 bg-ink-elevated"
    >
      <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
        <Reveal>
          <h2 className="font-[family-name:var(--font-syne)] text-3xl font-bold tracking-tight text-cream sm:text-4xl">
            How it works
          </h2>
          <p className="mt-3 max-w-xl text-base text-mist">
            From spotting an event to finding people who want to go with you.
          </p>
        </Reveal>

        <ol className="mt-14 grid gap-12 sm:grid-cols-3 sm:gap-8">
          {steps.map((step) => (
            <li key={step.number} className="relative">
              <Reveal>
                <span className="font-[family-name:var(--font-syne)] text-sm font-bold tracking-widest text-copper">
                  {step.number}
                </span>
                <div className="mt-4 flex items-center gap-3">
                  <step.icon
                    className="h-5 w-5 text-mint"
                    aria-hidden
                    strokeWidth={1.75}
                  />
                  <h3 className="font-[family-name:var(--font-syne)] text-xl font-bold text-cream">
                    {step.title}
                  </h3>
                </div>
                <p className="mt-3 text-base leading-relaxed text-mist">
                  {step.description}
                </p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
