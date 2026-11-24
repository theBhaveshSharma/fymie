"use client";

import { AppImage as Image } from "@/components/AppImage";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  deleteListedEvent,
  getEventsByCreator,
  getOrganizerEventStats,
} from "@/lib/storage";
import { FEATURES } from "@/lib/features";
import type { FymieEvent } from "@/lib/types";

function accountLabel(type: string) {
  if (type === "tour_company") return "Tour company";
  if (type === "organizer") return "Organizer";
  return "Traveler";
}

export default function ListingsPage() {
  const { user } = useAuth();
  const [listings, setListings] = useState<FymieEvent[]>([]);

  useEffect(() => {
    if (!user) return;
    setListings(getEventsByCreator(user.id));
  }, [user]);

  const statsByEvent = useMemo(() => {
    const map = new Map<
      string,
      ReturnType<typeof getOrganizerEventStats>
    >();
    for (const event of listings) {
      map.set(event.id, getOrganizerEventStats(event.id));
    }
    return map;
  }, [listings]);

  if (!user) return null;

  function handleDelete(eventId: string) {
    if (!user) return;
    if (!window.confirm("Remove this listing from FYMIE?")) return;
    deleteListedEvent(eventId, user.id);
    setListings(getEventsByCreator(user.id));
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-syne)] text-3xl font-bold text-cream">
            My listings
          </h1>
          <p className="mt-2 max-w-xl text-mist">
            Publish events as a {accountLabel(user.accountType).toLowerCase()}
            {user.organizationName ? ` (${user.organizationName})` : ""}.
            {FEATURES.organizerAnalytics
              ? " See who wants to go and how many mutual matches formed."
              : " Keep your plans visible on FYMIE."}
          </p>
        </div>
        <Link
          href="/events/new"
          className="rounded-xl bg-copper px-5 py-3 text-sm font-semibold text-ink transition-colors hover:bg-amber"
        >
          List an event
        </Link>
      </div>

      <div className="mt-10">
        {listings.length === 0 ? (
          <div className="border border-dashed border-white/15 px-6 py-14 text-center">
            <p className="text-cream">No listings yet</p>
            <p className="mt-2 text-sm text-mist">
              Add a trek, gig, tour package, or personal travel plan.
            </p>
            <Link
              href="/events/new"
              className="mt-6 inline-flex rounded-xl bg-copper px-5 py-3 text-sm font-semibold text-ink"
            >
              Create your first listing
            </Link>
          </div>
        ) : (
          <ul>
            {listings.map((event) => {
              const stats = statsByEvent.get(event.id);
              return (
                <li
                  key={event.id}
                  className="grid gap-4 border-b border-white/5 py-5 sm:grid-cols-[180px_1fr_auto] sm:items-center"
                >
                  <Link
                    href={`/events/detail/?id=${encodeURIComponent(event.id)}`}
                    className="relative aspect-[16/10] overflow-hidden sm:aspect-[4/3]"
                  >
                    <Image
                      src={event.coverImage}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="180px"
                    />
                  </Link>
                  <div>
                    <Link
                      href={`/events/detail/?id=${encodeURIComponent(event.id)}`}
                      className="font-[family-name:var(--font-syne)] text-xl font-bold text-cream hover:underline"
                    >
                      {event.title}
                    </Link>
                    <p className="mt-1 text-sm text-fog">
                      {event.location} · {event.date}
                    </p>
                    <p className="mt-2 line-clamp-2 text-sm text-mist">
                      {event.summary}
                    </p>
                    {FEATURES.organizerAnalytics ? (
                      <p className="mt-3 text-xs text-mint">
                        {stats?.joinCount ?? 0} want to go ·{" "}
                        {stats?.interestCount ?? 0} interests ·{" "}
                        {stats?.mutualCount ?? 0} mutual matches
                      </p>
                    ) : null}
                  </div>
                  <div className="flex flex-col items-start gap-2 sm:items-end">
                    {FEATURES.organizerAnalytics ? (
                      <Link
                        href={`/listings/analytics/?id=${encodeURIComponent(event.id)}`}
                        className="text-sm text-cream underline-offset-4 hover:underline"
                      >
                        Analytics
                      </Link>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => handleDelete(event.id)}
                      className="text-sm text-mist underline-offset-4 hover:text-cream hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </main>
  );
}
