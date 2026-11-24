"use client";

import Link from "next/link";
import { FormEvent, Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { FEATURES } from "@/lib/features";
import {
  getEventById,
  getMessages,
  getThreadById,
  getThreadsForUser,
  getUserById,
  isMutualGoTogether,
  sendMessage,
} from "@/lib/storage";
import type { ChatMessage } from "@/lib/types";

function ChatInbox() {
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
                href={`/chat/?id=${encodeURIComponent(thread.id)}`}
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

function ChatThread({ threadId }: { threadId: string }) {
  const { user } = useAuth();
  const [body, setBody] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const thread = useMemo(() => getThreadById(threadId), [threadId]);

  useEffect(() => {
    if (!thread) return;
    setMessages(getMessages(thread.id));
  }, [thread]);

  if (!user) return null;

  if (!thread || !thread.participantIds.includes(user.id)) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-16">
        <p className="text-mist">Chat not found.</p>
        <Link href="/chat/" className="mt-4 inline-block text-cream underline">
          Back to chats
        </Link>
      </main>
    );
  }

  const isGroup = thread.kind === "group";
  const otherId = thread.participantIds.find((id) => id !== user.id);
  const other = otherId ? getUserById(otherId) : undefined;
  const event = getEventById(thread.eventId);
  const mutual =
    isGroup ||
    (otherId ? isMutualGoTogether(thread.eventId, user.id, otherId) : false);
  const title = isGroup
    ? thread.title ?? `${event?.title ?? "Event"} crew`
    : (other?.name ?? "Chat");

  function handleSend(eventSubmit: FormEvent) {
    eventSubmit.preventDefault();
    if (!thread || !user || !body.trim() || !mutual) return;
    sendMessage(thread.id, user.id, body);
    setBody("");
    setMessages(getMessages(thread.id));
  }

  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-3xl flex-col px-6 py-8">
      <Link href="/chat/" className="text-sm text-mist hover:text-cream">
        Back to chats
      </Link>
      <div className="mt-4 border-b border-white/5 pb-4">
        <h1 className="font-[family-name:var(--font-syne)] text-2xl font-bold text-cream">
          {title}
          {isGroup ? (
            <span className="ml-2 text-sm font-normal text-mint">Group</span>
          ) : null}
        </h1>
        <p className="mt-1 text-sm text-mist">
          {event?.title ?? "Shared event"} · {thread.participantIds.length}{" "}
          people · Keep plans in-app and meet in public first
        </p>
      </div>

      {!mutual ? (
        <p className="mt-6 text-sm text-copper">
          Mutual interest required before messaging.
        </p>
      ) : null}

      <div className="mt-6 flex-1 space-y-3 overflow-y-auto">
        {messages.map((message) => {
          const mine = message.senderId === user.id;
          const sender = getUserById(message.senderId);
          return (
            <div
              key={message.id}
              className={`flex ${mine ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                  mine
                    ? "bg-copper text-ink"
                    : "border border-white/10 bg-ink-elevated text-cream"
                }`}
              >
                {isGroup && !mine ? (
                  <p className="mb-1 text-[11px] opacity-70">
                    {sender?.name ?? "Member"}
                  </p>
                ) : null}
                {message.body}
              </div>
            </div>
          );
        })}
        {messages.length === 0 ? (
          <p className="text-sm text-mist">
            Say hi and agree on the public meetup point.
          </p>
        ) : null}
      </div>

      <form
        onSubmit={handleSend}
        className="mt-6 flex gap-3 border-t border-white/5 pt-4"
      >
        <input
          value={body}
          onChange={(e) => setBody(e.target.value)}
          disabled={!mutual}
          placeholder="Message..."
          className="min-w-0 flex-1 rounded-xl border border-white/10 bg-ink-elevated px-4 py-3 text-cream outline-none focus:border-copper/60 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!mutual || !body.trim()}
          className="rounded-xl bg-copper px-5 py-3 text-sm font-semibold text-ink disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </main>
  );
}

function ChatPageInner() {
  const searchParams = useSearchParams();
  const threadId = searchParams.get("id");
  if (threadId) return <ChatThread threadId={threadId} />;
  return <ChatInbox />;
}

export default function ChatPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto max-w-3xl px-6 py-16">
          <p className="text-mist">Loading chats...</p>
        </main>
      }
    >
      <ChatPageInner />
    </Suspense>
  );
}
