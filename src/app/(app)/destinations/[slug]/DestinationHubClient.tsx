"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { useParams } from "next/navigation";
import { FeatureGate } from "@/components/app/FeatureGate";
import { useAuth } from "@/context/AuthContext";
import { FEATURES } from "@/lib/features";
import { getEvents, getUsers } from "@/lib/storage";
import {
  DESTINATION_HUBS,
  slugToLaunchCity,
} from "@/lib/types";

export default function DestinationHubClient() {
  const params = useParams<{ slug: string }>();
  const { user } = useAuth();
  const hub = DESTINATION_HUBS.find((item) => item.slug === params.slug);
  const city = slugToLaunchCity(params.slug);

  const events = useMemo(() => {
    if (!city) return [];
    return getEvents().filter((event) => event.launchCity === city);
  }, [city]);

  const peopleGoing = useMemo(() => {
    if (!user || !city) return [];
    const cityEventIds = new Set(events.map((event) => event.id));
    return getUsers().filter(
      (person) =>
        person.id !== user.id &&
        person.joinedEventIds.some((id) => cityEventIds.has(id)),
    );
  }, [user, city, events]);

  if (!FEATURES.destinations) {
    return <FeatureGate enabled={false}>{null}</FeatureGate>;
  }

  if (!hub || !city) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-16">
        <p className="text-mist">Destination not found.</p>
        <Link href="/destinations" className="mt-4 inline-block text-cream underline">
          Back to destinations
        </Link>
      </main>
    );
  }

  return (
    <main className="pb-16">
      <section className="relative min-h-[40vh] overflow-hidden">
        <Image
          src={hub.coverImage}
          alt=""
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/25" />
        <div className="relative z-10 mx-auto flex min-h-[40vh] max-w-6xl flex-col justify-end px-6 pb-10 pt-24">
          <Link href="/destinations" className="text-sm text-fog hover:text-cream">
            All destinations
          </Link>
          <h1 className="mt-4 font-[family-name:var(--font-syne)] text-4xl font-bold text-cream">
            {hub.name}
          </h1>
          <p className="mt-2 max-w-2xl text-fog">{hub.blurb}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {hub.highlights.map((item) => (
              <span
                key={item}
                className="rounded-md border border-white/15 px-2.5 py-1 text-xs text-fog"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-10 lg:grid-cols-[1.4fr_1fr]">
        <section>
          <h2 className="font-[family-name:var(--font-syne)] text-2xl font-bold text-cream">
            Events this season
          </h2>
          <ul className="mt-6 divide-y divide-white/5">
            {events.map((event) => (
              <li key={event.id} className="py-4">
                <Link
                  href={`/events/detail/?id=${encodeURIComponent(event.id)}`}
                  className="block hover:opacity-90"
                >
                  <p className="font-medium text-cream">{event.title}</p>
                  <p className="mt-1 text-sm text-mist">
                    {event.date} · {event.location}
                  </p>
                </Link>
              </li>
            ))}
            {events.length === 0 ? (
              <li className="py-6 text-mist">No events listed here yet.</li>
            ) : null}
          </ul>
        </section>

        <section>
          <h2 className="font-[family-name:var(--font-syne)] text-2xl font-bold text-cream">
            People going
          </h2>
          <ul className="mt-6 space-y-4">
            {peopleGoing.map((person) => (
              <li key={person.id} className="border-b border-white/5 pb-4">
                <p className="font-medium text-cream">
                  {person.name}
                  {person.idVerified ? (
                    <span className="ml-2 text-xs text-mint">ID verified</span>
                  ) : null}
                </p>
                <p className="mt-1 text-sm text-mist">{person.bio}</p>
              </li>
            ))}
            {peopleGoing.length === 0 ? (
              <li className="text-mist">Join an event to see companions here.</li>
            ) : null}
          </ul>
        </section>
      </div>
    </main>
  );
}
