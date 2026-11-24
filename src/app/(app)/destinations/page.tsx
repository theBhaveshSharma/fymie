"use client";

import Image from "next/image";
import Link from "next/link";
import { FeatureGate } from "@/components/app/FeatureGate";
import { FEATURES } from "@/lib/features";
import { DESTINATION_HUBS } from "@/lib/types";

export default function DestinationsPage() {
  return (
    <FeatureGate enabled={FEATURES.destinations}>
    <main className="mx-auto w-full max-w-6xl px-6 py-10">
      <h1 className="font-[family-name:var(--font-syne)] text-3xl font-bold text-cream">
        Destinations
      </h1>
      <p className="mt-2 max-w-2xl text-mist">
        Launch hubs for Delhi NCR, Mumbai, Himachal Pradesh, and Uttarakhand.
        See what is happening and who is going.
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {DESTINATION_HUBS.map((hub) => (
          <Link
            key={hub.slug}
            href={`/destinations/${hub.slug}`}
            className="group relative min-h-[240px] overflow-hidden"
          >
            <Image
              src={hub.coverImage}
              alt=""
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              sizes="(max-width: 640px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/10" />
            <div className="relative z-10 flex h-full min-h-[240px] flex-col justify-end p-6">
              <p className="text-sm text-mint">{hub.name}</p>
              <h2 className="mt-1 font-[family-name:var(--font-syne)] text-2xl font-bold text-cream">
                {hub.headline}
              </h2>
              <p className="mt-2 text-sm text-fog">{hub.blurb}</p>
            </div>
          </Link>
        ))}
      </div>
    </main>
    </FeatureGate>
  );
}
