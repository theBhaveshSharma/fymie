"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getEvents } from "@/lib/storage";
import {
  LAUNCH_CITIES,
  type EventCategory,
  type FymieEvent,
  type LaunchCity,
} from "@/lib/types";

const FILTERS: { id: EventCategory | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "social", label: "Social" },
  { id: "trek", label: "Treks" },
  { id: "adventure", label: "Adventure" },
  { id: "offbeat", label: "Offbeat" },
  { id: "travel", label: "Travel" },
];

function formatDate(iso: string) {
  return new Date(iso + "T12:00:00").toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function EventRow({
  event,
  joined,
}: {
  event: FymieEvent;
  joined: boolean;
}) {
  return (
    <Link
      href={`/events/detail/?id=${encodeURIComponent(event.id)}`}
      className="group grid gap-4 border-b border-white/5 py-5 transition-colors hover:bg-white/[0.02] sm:grid-cols-[200px_1fr] sm:gap-6"
    >
      <div className="relative aspect-[16/10] overflow-hidden sm:aspect-[4/3]">
        <Image
          src={event.coverImage}
          alt=""
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          sizes="(max-width: 640px) 100vw, 200px"
        />
      </div>
      <div className="min-w-0">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="font-[family-name:var(--font-syne)] text-xl font-bold text-cream">
            {event.title}
          </h2>
          <span className="text-sm text-mist">{formatDate(event.date)}</span>
        </div>
        <p className="mt-1 text-sm text-fog">
          {event.launchCity} · {event.location} · {event.duration}
        </p>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-mist">
          {event.summary}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="rounded-md bg-mint/15 px-2 py-0.5 text-xs font-medium capitalize text-mint">
            {event.category}
          </span>
          <span className="rounded-md border border-white/10 px-2 py-0.5 text-xs text-fog">
            {event.difficulty}
          </span>
          {event.source === "listed" ? (
            <span className="rounded-md bg-copper/20 px-2 py-0.5 text-xs font-medium text-copper">
              {event.listedBy?.accountType === "tour_company"
                ? "Tour listing"
                : event.listedBy?.accountType === "organizer"
                  ? "Organizer"
                  : "Traveler plan"}
            </span>
          ) : null}
          {joined ? (
            <span className="rounded-md bg-copper/20 px-2 py-0.5 text-xs font-medium text-copper">
              Joined
            </span>
          ) : null}
        </div>
      </div>
    </Link>
  );
}

export default function EventsPage() {
  const { user } = useAuth();
  const [filter, setFilter] = useState<EventCategory | "all">("all");
  const [city, setCity] = useState<LaunchCity | "all">("all");
  const events = useMemo(() => getEvents(), []);

  const filtered = events.filter((event) => {
    const categoryOk = filter === "all" || event.category === filter;
    const cityOk = city === "all" || event.launchCity === city;
    return categoryOk && cityOk;
  });

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-syne)] text-3xl font-bold text-cream">
            Discover
          </h1>
          <p className="mt-2 max-w-xl text-mist">
            Launch focus: Delhi NCR, Mumbai, Himachal Pradesh, and Uttarakhand.
            Join a plan, then find a partner or group to go with.
          </p>
        </div>
        <Link
          href="/events/new"
          className="rounded-xl border border-white/15 px-4 py-2.5 text-sm font-medium text-cream transition-colors hover:bg-white/5"
        >
          List an event
        </Link>
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        {(["all", ...LAUNCH_CITIES] as const).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setCity(item)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              city === item
                ? "bg-mint/20 text-mint"
                : "border border-white/10 text-fog hover:border-mint/40"
            }`}
          >
            {item === "all" ? "All regions" : item}
          </button>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {FILTERS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setFilter(item.id)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              filter === item.id
                ? "bg-copper text-ink"
                : "border border-white/10 text-fog hover:border-copper/40"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="mt-4">
        {filtered.map((event) => (
          <EventRow
            key={event.id}
            event={event}
            joined={Boolean(user?.joinedEventIds.includes(event.id))}
          />
        ))}
        {filtered.length === 0 ? (
          <p className="py-12 text-mist">No events in this category yet.</p>
        ) : null}
      </div>
    </main>
  );
}
