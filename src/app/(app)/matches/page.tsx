"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { findMatches } from "@/lib/matching";
import {
  getEventById,
  getOrCreateThread,
  getUsers,
  isMutualGoTogether,
} from "@/lib/storage";
import { useRouter } from "next/navigation";

export default function MatchesPage() {
  const { user } = useAuth();
  const router = useRouter();

  const matches = useMemo(() => {
    if (!user) return [];
    return findMatches(user, getUsers());
  }, [user]);

  if (!user) return null;

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-10">
      <h1 className="font-[family-name:var(--font-syne)] text-3xl font-bold text-cream">
        Your matches
      </h1>
      <p className="mt-2 max-w-xl text-mist">
        Ranked by shared events, interests, and fit. Chat opens only after mutual
        interest on an event.
      </p>

      <ul className="mt-10 divide-y divide-white/5">
        {matches.map((match) => {
          const mutualEvents = match.sharedEventIds.filter((eventId) =>
            isMutualGoTogether(eventId, user.id, match.user.id),
          );
          return (
            <li key={match.user.id} className="py-6">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="font-[family-name:var(--font-syne)] text-xl font-bold text-cream">
                  {match.user.name}
                  {match.user.phoneVerified ? (
                    <span className="ml-2 text-xs font-normal text-mint">
                      Verified phone
                    </span>
                  ) : null}
                </h2>
                <span className="text-sm text-copper">Score {match.score}</span>
              </div>
              <p className="mt-1 text-sm text-mist">{match.user.bio}</p>
              {match.sharedInterests.length > 0 ? (
                <p className="mt-3 text-sm text-fog">
                  Shared interests: {match.sharedInterests.join(", ")}
                </p>
              ) : null}
              {match.fitOverlap.length > 0 ? (
                <p className="mt-1 text-sm text-fog">
                  Fit: {match.fitOverlap.join(" · ")}
                </p>
              ) : null}
              {match.sharedEventIds.length > 0 ? (
                <p className="mt-1 text-sm text-fog">
                  Shared plans:{" "}
                  {match.sharedEventIds
                    .map((id) => getEventById(id)?.title ?? id)
                    .join(", ")}
                </p>
              ) : null}
              <div className="mt-4 flex flex-wrap gap-2">
                {mutualEvents.length > 0 ? (
                  mutualEvents.map((eventId) => (
                    <button
                      key={eventId}
                      type="button"
                      onClick={() => {
                        const thread = getOrCreateThread(
                          eventId,
                          user.id,
                          match.user.id,
                        );
                        router.push(`/chat/${thread.id}`);
                      }}
                      className="rounded-lg bg-mint/20 px-3 py-2 text-sm font-medium text-mint"
                    >
                      Chat · {getEventById(eventId)?.title ?? "event"}
                    </button>
                  ))
                ) : match.sharedEventIds.length > 0 ? (
                  <Link
                    href={`/events/${match.sharedEventIds[0]}`}
                    className="rounded-lg border border-white/15 px-3 py-2 text-sm text-cream"
                  >
                    Open event to send interest
                  </Link>
                ) : null}
              </div>
            </li>
          );
        })}
      </ul>

      {matches.length === 0 ? (
        <p className="mt-10 text-mist">
          No matches yet. Join a few{" "}
          <Link href="/events" className="text-cream underline">
            events
          </Link>{" "}
          or expand your interests and fit prefs.
        </p>
      ) : null}
    </main>
  );
}
