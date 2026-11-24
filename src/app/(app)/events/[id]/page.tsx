"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Clock3,
  MapPin,
  Mountain,
  Users,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { findEventCompanions } from "@/lib/matching";
import {
  blockUser,
  expressGoTogether,
  getEventById,
  getLiveSharesForEvent,
  getOrCreateEventGroupThread,
  getOrCreateThread,
  getUsers,
  hasGoTogetherInterest,
  isMutualGoTogether,
  reportUser,
  stopLiveShare,
  upsertLiveShare,
} from "@/lib/storage";
import { FEATURES } from "@/lib/features";
import type { LiveShare } from "@/lib/types";

function formatDate(iso: string) {
  return new Date(iso + "T12:00:00").toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatDateRange(start: string, end?: string) {
  if (!end || end === start) return formatDate(start);
  return `${formatDate(start)} to ${formatDate(end)}`;
}

export default function EventDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { user, toggleJoinEvent, refresh } = useAuth();
  const event = useMemo(() => getEventById(params.id), [params.id]);
  const [meetupAck, setMeetupAck] = useState(false);
  const [joinError, setJoinError] = useState("");
  const [tick, setTick] = useState(0);
  const [liveShares, setLiveShares] = useState<LiveShare[]>([]);
  const [shareMessage, setShareMessage] = useState("");

  const companions = useMemo(() => {
    if (!user || !event) return [];
    void tick;
    return findEventCompanions(user, event.id, getUsers());
  }, [user, event, tick]);

  const mutualCompanionIds = useMemo(() => {
    if (!user || !event) return [];
    void tick;
    return companions
      .filter((match) =>
        isMutualGoTogether(event.id, user.id, match.user.id),
      )
      .map((match) => match.user.id);
  }, [companions, user, event, tick]);

  useEffect(() => {
    if (!event) return;
    setLiveShares(getLiveSharesForEvent(event.id));
  }, [event, tick]);

  if (!event || !user) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-16">
        <p className="text-mist">Event not found.</p>
        <Link href="/events" className="mt-4 inline-block text-cream underline">
          Back to events
        </Link>
      </main>
    );
  }

  const joined = user.joinedEventIds.includes(event.id);

  function handleJoinToggle() {
    if (!event || !user) return;
    if (!joined && !meetupAck) {
      setJoinError("Confirm the public meetup checklist before joining.");
      return;
    }
    setJoinError("");
    toggleJoinEvent(event.id);
    setTick((value) => value + 1);
  }

  function handleGoTogether(otherId: string) {
    if (!event || !user) return;
    expressGoTogether(event.id, user.id, otherId);
    if (isMutualGoTogether(event.id, user.id, otherId)) {
      getOrCreateThread(event.id, user.id, otherId);
    }
    setTick((value) => value + 1);
    refresh();
  }

  function handleChat(otherId: string) {
    if (!event || !user) return;
    const thread = getOrCreateThread(event.id, user.id, otherId);
    router.push(`/chat/${thread.id}`);
  }

  function handleOpenGroupChat() {
    if (!event || !user) return;
    const participants = Array.from(
      new Set([user.id, ...mutualCompanionIds]),
    );
    if (participants.length < 2) {
      setShareMessage("Need at least one mutual match to open group chat.");
      return;
    }
    const thread = getOrCreateEventGroupThread(
      event.id,
      `${event.title} crew`,
      participants,
    );
    router.push(`/chat/${thread.id}`);
  }

  function handleStartLiveShare() {
    if (!event || !user) return;
    if (!navigator.geolocation) {
      setShareMessage("Geolocation is not available in this browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        upsertLiveShare({
          eventId: event.id,
          userId: user.id,
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          label: `${user.name} · live`,
        });
        setShareMessage("Live location shared with this event crew for 6 hours.");
        setTick((value) => value + 1);
      },
      () => {
        // Demo fallback near Delhi NCR if permission denied
        upsertLiveShare({
          eventId: event.id,
          userId: user.id,
          lat: 28.6139,
          lng: 77.209,
          label: `${user.name} · demo pin`,
        });
        setShareMessage(
          "Using demo location pin (permission denied). Shared for 6 hours.",
        );
        setTick((value) => value + 1);
      },
    );
  }

  function handleStopLiveShare() {
    if (!event || !user) return;
    stopLiveShare(event.id, user.id);
    setShareMessage("Live share stopped.");
    setTick((value) => value + 1);
  }

  function handleBlock(otherId: string) {
    if (!user) return;
    if (!window.confirm("Block this person? They will leave your matches.")) {
      return;
    }
    blockUser(user.id, otherId);
    refresh();
    setTick((value) => value + 1);
  }

  function handleReport(otherId: string) {
    if (!user) return;
    const reason = window.prompt("Why are you reporting this person?");
    if (!reason?.trim()) return;
    reportUser(user.id, otherId, reason);
    window.alert("Report submitted. Our demo queue will review within 24 hours.");
  }

  return (
    <main className="pb-16">
      <section className="relative min-h-[52vh] overflow-hidden sm:min-h-[62vh]">
        <Image
          src={event.coverImage}
          alt={event.title}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/20"
          aria-hidden
        />
        <div className="relative z-10 mx-auto flex h-full min-h-[52vh] max-w-6xl flex-col justify-end px-6 pb-10 pt-24 sm:min-h-[62vh] sm:pb-14">
          <Link
            href="/events"
            className="mb-6 w-fit text-sm text-fog transition-colors hover:text-cream"
          >
            Back to events
          </Link>
          <p className="text-sm font-medium tracking-wide text-mint">
            <span className="capitalize">{event.category}</span>
            {" · "}
            {event.launchCity}
          </p>
          <h1 className="mt-2 max-w-3xl font-[family-name:var(--font-syne)] text-3xl font-bold leading-tight text-cream sm:text-5xl">
            {event.title}
          </h1>
          <p className="mt-3 max-w-2xl text-base text-fog sm:text-lg">
            {event.summary}
          </p>
          {event.listedBy ? (
            <p className="mt-4 text-sm text-mist">
              Listed by{" "}
              <span className="text-cream">
                {event.listedBy.organizationName || event.listedBy.name}
              </span>
            </p>
          ) : null}
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-10 lg:grid-cols-[1fr_300px]">
        <div>
          <div className="flex flex-wrap gap-x-6 gap-y-3 border-b border-white/5 pb-6 text-sm text-fog">
            <span className="inline-flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-copper" aria-hidden />
              {formatDateRange(event.date, event.endDate)}
            </span>
            <span className="inline-flex items-center gap-2">
              <Clock3 className="h-4 w-4 text-copper" aria-hidden />
              {event.duration}
            </span>
            <span className="inline-flex items-center gap-2">
              <MapPin className="h-4 w-4 text-copper" aria-hidden />
              {event.location}, {event.region}
            </span>
            <span className="inline-flex items-center gap-2">
              <Mountain className="h-4 w-4 text-copper" aria-hidden />
              {event.difficulty}
            </span>
            <span className="inline-flex items-center gap-2">
              <Users className="h-4 w-4 text-copper" aria-hidden />
              {event.groupSize}
            </span>
          </div>

          <section className="pt-8">
            <h2 className="font-[family-name:var(--font-syne)] text-2xl font-bold text-cream">
              About this plan
            </h2>
            <p className="mt-4 text-base leading-relaxed text-mist">
              {event.description}
            </p>
          </section>

          <section className="pt-10">
            <h2 className="font-[family-name:var(--font-syne)] text-2xl font-bold text-cream">
              Photos
            </h2>
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {event.gallery.map((src, index) => (
                <div
                  key={src}
                  className={`relative overflow-hidden ${
                    index === 0
                      ? "col-span-2 aspect-[16/10] sm:col-span-2"
                      : "aspect-[4/3]"
                  }`}
                >
                  <Image
                    src={src}
                    alt={`${event.title} photo ${index + 1}`}
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-[1.03]"
                    sizes="(max-width: 640px) 100vw, 40vw"
                  />
                </div>
              ))}
            </div>
          </section>

          <section className="pt-10">
            <h2 className="font-[family-name:var(--font-syne)] text-2xl font-bold text-cream">
              Highlights
            </h2>
            <ul className="mt-4 space-y-3">
              {event.highlights.map((item) => (
                <li key={item} className="flex gap-3 text-mist">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-mint" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <div className="mt-10 grid gap-10 sm:grid-cols-2">
            <section>
              <h2 className="font-[family-name:var(--font-syne)] text-xl font-bold text-cream">
                What you get
              </h2>
              <ul className="mt-4 space-y-3">
                {event.includes.map((item) => (
                  <li key={item} className="flex gap-3 text-sm text-mist">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-copper" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
            <section>
              <h2 className="font-[family-name:var(--font-syne)] text-xl font-bold text-cream">
                What to bring
              </h2>
              <ul className="mt-4 space-y-3">
                {event.bring.map((item) => (
                  <li key={item} className="flex gap-3 text-sm text-mist">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-copper" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {joined ? (
            <section className="mt-12 border-t border-white/5 pt-8">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h2 className="font-[family-name:var(--font-syne)] text-xl font-bold text-cream">
                    People also going
                  </h2>
                  <p className="mt-2 text-sm text-mist">
                    Chat unlocks only after both of you tap Interested in going
                    together.
                  </p>
                </div>
                {FEATURES.groupChat ? (
                  <button
                    type="button"
                    onClick={handleOpenGroupChat}
                    className="rounded-lg border border-mint/30 px-3 py-2 text-sm font-medium text-mint"
                  >
                    Open event group chat
                  </button>
                ) : null}
              </div>
              {companions.length > 0 ? (
                <ul className="mt-5 space-y-6">
                  {companions.map((match) => {
                    const interested = hasGoTogetherInterest(
                      event.id,
                      user.id,
                      match.user.id,
                    );
                    const mutual = isMutualGoTogether(
                      event.id,
                      user.id,
                      match.user.id,
                    );
                    return (
                      <li
                        key={match.user.id}
                        className="border-b border-white/5 pb-6"
                      >
                        <div className="flex flex-wrap items-baseline justify-between gap-2">
                          <p className="font-medium text-cream">
                            {match.user.name}
                            {match.user.phoneVerified ? (
                              <span className="ml-2 text-xs font-normal text-mint">
                                Verified phone
                              </span>
                            ) : null}
                            {FEATURES.idVerification && match.user.idVerified ? (
                              <span className="ml-2 text-xs font-normal text-mint">
                                ID verified
                              </span>
                            ) : null}
                          </p>
                          <span className="text-xs text-copper">
                            Score {match.score}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-mist">{match.user.bio}</p>
                        {match.sharedInterests.length > 0 ? (
                          <p className="mt-2 text-xs text-fog">
                            Shared: {match.sharedInterests.join(", ")}
                          </p>
                        ) : null}
                        {match.fitOverlap.length > 0 ? (
                          <p className="mt-1 text-xs text-fog">
                            Fit: {match.fitOverlap.join(" · ")}
                          </p>
                        ) : null}
                        <div className="mt-4 flex flex-wrap gap-2">
                          {!mutual ? (
                            <button
                              type="button"
                              onClick={() => handleGoTogether(match.user.id)}
                              className={`rounded-lg px-3 py-2 text-sm font-medium ${
                                interested
                                  ? "border border-mint/40 text-mint"
                                  : "bg-copper text-ink"
                              }`}
                            >
                              {interested
                                ? "Waiting for them"
                                : "Interested in going together"}
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleChat(match.user.id)}
                              className="rounded-lg bg-mint/20 px-3 py-2 text-sm font-medium text-mint"
                            >
                              Open chat
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleBlock(match.user.id)}
                            className="rounded-lg px-3 py-2 text-sm text-mist hover:text-cream"
                          >
                            Block
                          </button>
                          <button
                            type="button"
                            onClick={() => handleReport(match.user.id)}
                            className="rounded-lg px-3 py-2 text-sm text-mist hover:text-cream"
                          >
                            Report
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="mt-3 text-sm text-mist">
                  No interest matches yet for this plan. Check back as more
                  people join.
                </p>
              )}
            </section>
          ) : null}

          {joined && FEATURES.liveShare ? (
            <section className="mt-12 border-t border-white/5 pt-8">
              <h2 className="font-[family-name:var(--font-syne)] text-xl font-bold text-cream">
                Live trip share
              </h2>
              <p className="mt-2 text-sm text-mist">
                Share a live pin with people on this plan while you are meeting
                or traveling. Auto-expires in 6 hours.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handleStartLiveShare}
                  className="rounded-lg bg-copper px-3 py-2 text-sm font-semibold text-ink"
                >
                  Share my live location
                </button>
                <button
                  type="button"
                  onClick={handleStopLiveShare}
                  className="rounded-lg border border-white/15 px-3 py-2 text-sm text-cream"
                >
                  Stop sharing
                </button>
              </div>
              {shareMessage ? (
                <p className="mt-3 text-sm text-mist">{shareMessage}</p>
              ) : null}
              <ul className="mt-5 space-y-3">
                {liveShares.map((share) => (
                  <li key={share.id} className="text-sm text-fog">
                    <span className="text-cream">{share.label}</span>
                    {" · "}
                    {share.lat.toFixed(4)}, {share.lng.toFixed(4)}
                    {" · expires "}
                    {new Date(share.expiresAt).toLocaleTimeString()}
                  </li>
                ))}
                {liveShares.length === 0 ? (
                  <li className="text-sm text-mist">No active shares yet.</li>
                ) : null}
              </ul>
            </section>
          ) : null}
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-white/10 bg-ink-elevated/80 p-5 backdrop-blur-sm">
            {event.listedBy ? (
              <>
                <p className="text-sm text-mist">Listed by</p>
                <p className="mt-1 text-base font-medium text-cream">
                  {event.listedBy.organizationName || event.listedBy.name}
                </p>
              </>
            ) : (
              <>
                <p className="text-sm text-mist">Source</p>
                <p className="mt-1 text-base font-medium text-cream">
                  FYMIE featured plan
                </p>
              </>
            )}
            <p className="mt-4 text-sm text-mist">Launch region</p>
            <p className="mt-1 text-base text-cream">{event.launchCity}</p>
            <p className="mt-4 text-sm text-mist">Meetup</p>
            <p className="mt-1 text-base font-medium text-cream">
              {event.meetingPoint}
            </p>
            <p className="mt-4 text-sm text-mist">When</p>
            <p className="mt-1 text-base text-cream">
              {formatDateRange(event.date, event.endDate)}
            </p>

            {!joined ? (
              <label className="mt-6 flex cursor-pointer items-start gap-3 text-sm text-mist">
                <input
                  type="checkbox"
                  checked={meetupAck}
                  onChange={(e) => {
                    setMeetupAck(e.target.checked);
                    if (e.target.checked) setJoinError("");
                  }}
                  className="mt-1"
                />
                <span>
                  I will meet in a public place first, keep chat in FYMIE, and
                  share plans with my emergency contact.
                </span>
              </label>
            ) : null}

            {joinError ? (
              <p className="mt-3 text-sm text-copper" role="alert">
                {joinError}
              </p>
            ) : null}

            <button
              type="button"
              onClick={handleJoinToggle}
              className={`mt-6 w-full rounded-xl px-6 py-3.5 text-base font-semibold transition-colors ${
                joined
                  ? "border border-white/15 text-cream hover:bg-white/5"
                  : "bg-copper text-ink hover:bg-amber"
              }`}
            >
              {joined ? "Leave this plan" : "I want to go"}
            </button>
            <p className="mt-3 text-xs leading-relaxed text-mist">
              {joined
                ? "You are in. Tap Interested in going together to unlock chat with a match."
                : "Join to see matched partners. Chat stays locked until both people opt in."}
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}
