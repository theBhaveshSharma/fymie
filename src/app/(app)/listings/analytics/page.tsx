"use client";

import Link from "next/link";
import { Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { FeatureGate } from "@/components/app/FeatureGate";
import { useAuth } from "@/context/AuthContext";
import { FEATURES } from "@/lib/features";
import { getEventById, getOrganizerEventStats } from "@/lib/storage";

function ListingAnalyticsInner() {
  const searchParams = useSearchParams();
  const eventId = searchParams.get("id") ?? "";
  const { user } = useAuth();
  const event = useMemo(() => getEventById(eventId), [eventId]);
  const stats = useMemo(
    () => (event ? getOrganizerEventStats(event.id) : null),
    [event],
  );

  if (!FEATURES.organizerAnalytics) {
    return <FeatureGate enabled={false}>{null}</FeatureGate>;
  }

  if (!user || !event) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-16">
        <p className="text-mist">Listing not found.</p>
        <Link href="/listings/" className="mt-4 inline-block text-cream underline">
          Back to listings
        </Link>
      </main>
    );
  }

  const isOwner = event.listedBy?.userId === user.id;
  if (!isOwner) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-16">
        <p className="text-mist">Only the listing owner can view analytics.</p>
        <Link href="/listings/" className="mt-4 inline-block text-cream underline">
          Back to listings
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-10">
      <Link href="/listings/" className="text-sm text-mist hover:text-cream">
        Back to listings
      </Link>
      <h1 className="mt-4 font-[family-name:var(--font-syne)] text-3xl font-bold text-cream">
        Analytics
      </h1>
      <p className="mt-2 text-mist">{event.title}</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-white/10 p-4">
          <p className="text-xs text-mist">Want to go</p>
          <p className="mt-2 font-[family-name:var(--font-syne)] text-3xl font-bold text-cream">
            {stats?.joinCount ?? 0}
          </p>
        </div>
        <div className="rounded-xl border border-white/10 p-4">
          <p className="text-xs text-mist">Go-together interests</p>
          <p className="mt-2 font-[family-name:var(--font-syne)] text-3xl font-bold text-cream">
            {stats?.interestCount ?? 0}
          </p>
        </div>
        <div className="rounded-xl border border-white/10 p-4">
          <p className="text-xs text-mist">Mutual matches</p>
          <p className="mt-2 font-[family-name:var(--font-syne)] text-3xl font-bold text-cream">
            {stats?.mutualCount ?? 0}
          </p>
        </div>
      </div>

      <section className="mt-10">
        <h2 className="font-[family-name:var(--font-syne)] text-xl font-bold text-cream">
          Who wants to go
        </h2>
        <ul className="mt-5 space-y-4">
          {stats?.joiners.map((joiner) => (
            <li key={joiner.id} className="border-b border-white/5 pb-4">
              <p className="font-medium text-cream">
                {joiner.name}
                {FEATURES.idVerification && joiner.idVerified ? (
                  <span className="ml-2 text-xs text-mint">ID verified</span>
                ) : null}
                {joiner.phoneVerified ? (
                  <span className="ml-2 text-xs text-mint">Phone verified</span>
                ) : null}
              </p>
              <p className="mt-1 text-sm text-mist">{joiner.bio}</p>
              <p className="mt-1 text-xs text-fog">
                {joiner.interests.join(", ")}
              </p>
            </li>
          ))}
          {(stats?.joiners.length ?? 0) === 0 ? (
            <li className="text-mist">Nobody has joined yet.</li>
          ) : null}
        </ul>
      </section>
    </main>
  );
}

export default function ListingAnalyticsPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto max-w-3xl px-6 py-16">
          <p className="text-mist">Loading analytics...</p>
        </main>
      }
    >
      <ListingAnalyticsInner />
    </Suspense>
  );
}
