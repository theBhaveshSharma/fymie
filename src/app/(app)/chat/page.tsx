"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { FEATURES } from "@/lib/features";
import { getEventById, getThreadsForUser, getUserById } from "@/lib/storage";

export default function ChatInboxPage() {
  const { user } = useAuth();

  const threads = useMemo(() => {
    if (!user) return [];
    return getThreadsForUser(user.id).filter(
      (thread) => FEATURES.groupChat || thread.kind !== "group",
    );
  }, [user]);

  if (!user) return null;

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-10">
      <h1 className="font-[family-name:var(--font-syne)] text-3xl font-bold text-cream">
        Chats
      </h1>
      <p className="mt-2 text-mist">
        {FEATURES.groupChat
          ? "Direct chats after mutual interest, plus event group threads for matched crews."
          : "Direct chats unlock after both of you tap Interested in going together."}
      </p>

      <ul className="mt-8 divide-y divide-white/5">
        {threads.map((thread) => {
          const event = getEventById(thread.eventId);
          const isGroup = thread.kind === "group";
          const otherId = thread.participantIds.find((id) => id !== user.id);
          const other = otherId ? getUserById(otherId) : undefined;
          const title = isGroup
            ? thread.title ?? `${event?.title ?? "Event"} crew`
            : (other?.name ?? "Unknown");

          return (
            <li key={thread.id}>
              <Link
                href={`/chat/${thread.id}`}
                className="block py-5 transition-colors hover:bg-white/[0.02]"
              >
                <p className="font-medium text-cream">
                  {title}
                  {isGroup ? (
                    <span className="ml-2 text-xs font-normal text-mint">
                      Group
                    </span>
                  ) : null}
                </p>
                <p className="mt-1 text-sm text-mist">
                  {event?.title ?? "Event"} · {thread.participantIds.length}{" "}
                  people · {new Date(thread.updatedAt).toLocaleString()}
                </p>
              </Link>
            </li>
          );
        })}
      </ul>

      {threads.length === 0 ? (
        <p className="mt-10 text-mist">
          No chats yet. Find someone on an event and both tap Interested in going
          together.
        </p>
      ) : null}
    </main>
  );
}
