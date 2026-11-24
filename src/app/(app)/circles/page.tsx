"use client";

import { AppImage as Image } from "@/components/AppImage";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FeatureGate } from "@/components/app/FeatureGate";
import { useAuth } from "@/context/AuthContext";
import { FEATURES } from "@/lib/features";
import { getCircles } from "@/lib/storage";
import type { Circle } from "@/lib/types";

export default function CirclesPage() {
  const { user } = useAuth();
  const [circles, setCircles] = useState<Circle[]>([]);

  useEffect(() => {
    setCircles(getCircles());
  }, []);

  if (!FEATURES.circles) {
    return <FeatureGate enabled={false}>{null}</FeatureGate>;
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-10">
      <h1 className="font-[family-name:var(--font-syne)] text-3xl font-bold text-cream">
        Circles
      </h1>
      <p className="mt-2 max-w-2xl text-mist">
        Interest communities for ongoing conversation beyond a single event.
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {circles.map((circle) => {
          const joined = user?.circleIds.includes(circle.id);
          return (
            <Link
              key={circle.id}
              href={`/circles/${circle.slug}`}
              className="group overflow-hidden border border-white/10"
            >
              <div className="relative aspect-[16/9]">
                <Image
                  src={circle.coverImage}
                  alt=""
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  sizes="(max-width: 640px) 100vw, 50vw"
                />
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="font-[family-name:var(--font-syne)] text-xl font-bold text-cream">
                    {circle.name}
                  </h2>
                  {joined ? (
                    <span className="text-xs text-mint">Joined</span>
                  ) : null}
                </div>
                <p className="mt-2 text-sm text-mist">{circle.description}</p>
                <p className="mt-3 text-xs text-fog">
                  {circle.memberIds.length} members
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
