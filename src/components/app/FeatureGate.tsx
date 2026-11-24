"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** Redirects to the core events feed when a future feature is hidden. */
export function FeatureGate({
  enabled,
  children,
}: {
  enabled: boolean;
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    if (!enabled) router.replace("/events");
  }, [enabled, router]);

  if (!enabled) return null;
  return children;
}
