import { SEED_EVENTS, SEED_USERS } from "./seed-data";
import type {
  ChatMessage,
  ChatThread,
  Circle,
  CirclePost,
  FymieEvent,
  GoTogetherInterest,
  LiveShare,
  Session,
  UserProfile,
  UserReport,
} from "./types";
import { DEFAULT_FIT, SEED_CIRCLES } from "./types";

const KEYS = {
  users: "fymie-users",
  listedEvents: "fymie-listed-events",
  session: "fymie-session",
  seeded: "fymie-seeded-v5",
  interests: "fymie-go-together",
  threads: "fymie-chat-threads",
  messages: "fymie-chat-messages",
  reports: "fymie-reports",
  pendingOtps: "fymie-pending-otps",
  liveShares: "fymie-live-shares",
  circles: "fymie-circles",
  circlePosts: "fymie-circle-posts",
} as const;

function canUseStorage() {
  return typeof window !== "undefined";
}

function readJson<T>(key: string, fallback: T): T {
  if (!canUseStorage()) return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  if (!canUseStorage()) return;
  localStorage.setItem(key, JSON.stringify(value));
}

export function normalizeUser(user: UserProfile): UserProfile {
  return {
    ...user,
    accountType: user.accountType ?? "traveler",
    fit: { ...DEFAULT_FIT, ...user.fit },
    phoneVerified: Boolean(user.phoneVerified),
    idVerified: Boolean(user.idVerified),
    organizerVerified: Boolean(user.organizerVerified),
    blockedUserIds: user.blockedUserIds ?? [],
    joinedEventIds: user.joinedEventIds ?? [],
    circleIds: user.circleIds ?? [],
  };
}

export function ensureSeedData() {
  if (!canUseStorage()) return;
  if (localStorage.getItem(KEYS.seeded)) return;

  const existingUsers = readJson<UserProfile[]>(KEYS.users, []);
  const seedIds = new Set(SEED_USERS.map((user) => user.id));
  const customUsers = existingUsers
    .filter((user) => !seedIds.has(user.id))
    .map(normalizeUser);
  writeJson(KEYS.users, [...SEED_USERS.map(normalizeUser), ...customUsers]);

  if (!localStorage.getItem(KEYS.listedEvents)) {
    writeJson(KEYS.listedEvents, []);
  }
  if (!localStorage.getItem(KEYS.interests)) {
    // Demo mutual interest on Triund between Aria and Dev so chat can be tried quickly
    writeJson(KEYS.interests, [
      {
        id: "int-seed-1",
        eventId: "evt-triund",
        fromUserId: "user-aria",
        toUserId: "user-dev",
        createdAt: "2026-02-01T10:00:00.000Z",
      },
      {
        id: "int-seed-2",
        eventId: "evt-triund",
        fromUserId: "user-dev",
        toUserId: "user-aria",
        createdAt: "2026-02-01T10:05:00.000Z",
      },
    ]);
  }
  if (!localStorage.getItem(KEYS.threads)) {
    writeJson(KEYS.threads, [
      {
        id: "thread-evt-triund-user-aria-user-dev",
        eventId: "evt-triund",
        kind: "direct",
        participantIds: ["user-aria", "user-dev"],
        createdAt: "2026-02-01T10:06:00.000Z",
        updatedAt: "2026-02-01T10:06:00.000Z",
      },
      {
        id: "group-evt-triund",
        eventId: "evt-triund",
        kind: "group",
        title: "Triund Trek Weekend crew",
        participantIds: ["user-aria", "user-dev"],
        createdAt: "2026-02-01T10:07:00.000Z",
        updatedAt: "2026-02-01T10:07:00.000Z",
      },
    ]);
  }
  if (!localStorage.getItem(KEYS.messages)) {
    writeJson(KEYS.messages, [
      {
        id: "msg-seed-1",
        threadId: "thread-evt-triund-user-aria-user-dev",
        senderId: "user-aria",
        body: "Hey! Still on for Triund this weekend?",
        createdAt: "2026-02-01T10:06:00.000Z",
      },
    ]);
  }
  if (!localStorage.getItem(KEYS.reports)) {
    writeJson(KEYS.reports, []);
  }
  if (!localStorage.getItem(KEYS.liveShares)) {
    writeJson(KEYS.liveShares, []);
  }
  if (!localStorage.getItem(KEYS.circles)) {
    writeJson(
      KEYS.circles,
      SEED_CIRCLES.map((circle) => ({
        ...circle,
        memberIds: ["user-aria", "user-dev", "user-kai", "user-noor"].filter(
          Boolean,
        ),
      })),
    );
  }
  if (!localStorage.getItem(KEYS.circlePosts)) {
    writeJson(KEYS.circlePosts, [
      {
        id: "cpost-1",
        circleId: "circle-trekking",
        authorId: "user-dev",
        body: "Anyone from NCR free for a Triund weekend in April? Looking for a moderate pace group.",
        createdAt: "2026-02-10T09:00:00.000Z",
      },
      {
        id: "cpost-2",
        circleId: "circle-indie",
        authorId: "user-aria",
        body: "Hauz Khas indie night next month. Prefer meeting publicly before the show.",
        createdAt: "2026-02-11T12:00:00.000Z",
      },
    ]);
  }

  localStorage.setItem(KEYS.seeded, "1");
}

export function getUsers(): UserProfile[] {
  ensureSeedData();
  return readJson<UserProfile[]>(KEYS.users, SEED_USERS).map(normalizeUser);
}

export function saveUsers(users: UserProfile[]) {
  writeJson(KEYS.users, users);
}

export function getUserById(id: string): UserProfile | undefined {
  return getUsers().find((user) => user.id === id);
}

export function getUserByEmail(email: string): UserProfile | undefined {
  return getUsers().find(
    (user) => user.email.toLowerCase() === email.toLowerCase(),
  );
}

export function upsertUser(profile: UserProfile) {
  const users = getUsers();
  const normalized = normalizeUser(profile);
  const index = users.findIndex((user) => user.id === normalized.id);
  if (index >= 0) {
    users[index] = normalized;
  } else {
    users.push(normalized);
  }
  saveUsers(users);
  return normalized;
}

export function getListedEvents(): FymieEvent[] {
  ensureSeedData();
  return readJson<FymieEvent[]>(KEYS.listedEvents, []).map((event) => ({
    ...event,
    launchCity: event.launchCity ?? "Delhi NCR",
  }));
}

export function saveListedEvents(events: FymieEvent[]) {
  writeJson(KEYS.listedEvents, events);
}

export function getEvents(): FymieEvent[] {
  ensureSeedData();
  const listed = getListedEvents();
  return [...listed, ...SEED_EVENTS].sort((a, b) =>
    a.date.localeCompare(b.date),
  );
}

export function getEventById(id: string): FymieEvent | undefined {
  return getEvents().find((event) => event.id === id);
}

export function getEventsByCreator(userId: string): FymieEvent[] {
  return getListedEvents().filter((event) => event.listedBy?.userId === userId);
}

export function createListedEvent(
  input: Omit<FymieEvent, "id" | "source" | "createdAt">,
): FymieEvent {
  const event: FymieEvent = {
    ...input,
    id: `listed-${crypto.randomUUID()}`,
    source: "listed",
    createdAt: new Date().toISOString(),
  };
  const listed = getListedEvents();
  saveListedEvents([event, ...listed]);
  return event;
}

export function deleteListedEvent(eventId: string, userId: string): boolean {
  const listed = getListedEvents();
  const event = listed.find((item) => item.id === eventId);
  if (!event || event.listedBy?.userId !== userId) return false;
  saveListedEvents(listed.filter((item) => item.id !== eventId));
  return true;
}

export function getSession(): Session | null {
  return readJson<Session | null>(KEYS.session, null);
}

export function setSession(session: Session | null) {
  if (!canUseStorage()) return;
  if (!session) {
    localStorage.removeItem(KEYS.session);
    return;
  }
  writeJson(KEYS.session, session);
}

function getInterests(): GoTogetherInterest[] {
  ensureSeedData();
  return readJson<GoTogetherInterest[]>(KEYS.interests, []);
}

function saveInterests(items: GoTogetherInterest[]) {
  writeJson(KEYS.interests, items);
}

export function expressGoTogether(
  eventId: string,
  fromUserId: string,
  toUserId: string,
): GoTogetherInterest {
  const existing = getInterests().find(
    (item) =>
      item.eventId === eventId &&
      item.fromUserId === fromUserId &&
      item.toUserId === toUserId,
  );
  if (existing) return existing;

  const item: GoTogetherInterest = {
    id: `int-${crypto.randomUUID()}`,
    eventId,
    fromUserId,
    toUserId,
    createdAt: new Date().toISOString(),
  };
  saveInterests([item, ...getInterests()]);
  return item;
}

export function hasGoTogetherInterest(
  eventId: string,
  fromUserId: string,
  toUserId: string,
): boolean {
  return getInterests().some(
    (item) =>
      item.eventId === eventId &&
      item.fromUserId === fromUserId &&
      item.toUserId === toUserId,
  );
}

export function isMutualGoTogether(
  eventId: string,
  userA: string,
  userB: string,
): boolean {
  return (
    hasGoTogetherInterest(eventId, userA, userB) &&
    hasGoTogetherInterest(eventId, userB, userA)
  );
}

export function threadIdFor(
  eventId: string,
  userA: string,
  userB: string,
): string {
  const [first, second] = [userA, userB].sort();
  return `thread-${eventId}-${first}-${second}`;
}

export function getOrCreateThread(
  eventId: string,
  userA: string,
  userB: string,
): ChatThread {
  ensureSeedData();
  const id = threadIdFor(eventId, userA, userB);
  const threads = readJson<ChatThread[]>(KEYS.threads, []);
  const existing = threads.find((thread) => thread.id === id);
  if (existing) return { ...existing, kind: existing.kind ?? "direct" };

  const [first, second] = [userA, userB].sort();
  const thread: ChatThread = {
    id,
    eventId,
    kind: "direct",
    participantIds: [first, second],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  writeJson(KEYS.threads, [thread, ...threads]);
  return thread;
}

export function getOrCreateEventGroupThread(
  eventId: string,
  title: string,
  participantIds: string[],
): ChatThread {
  ensureSeedData();
  const id = `group-${eventId}`;
  const threads = readJson<ChatThread[]>(KEYS.threads, []);
  const existing = threads.find((thread) => thread.id === id);
  const unique = Array.from(new Set(participantIds)).sort();

  if (existing) {
    const merged = Array.from(
      new Set([...existing.participantIds, ...unique]),
    ).sort();
    const next = {
      ...existing,
      kind: "group" as const,
      title: existing.title ?? title,
      participantIds: merged,
      updatedAt: new Date().toISOString(),
    };
    writeJson(
      KEYS.threads,
      threads.map((thread) => (thread.id === id ? next : thread)),
    );
    return next;
  }

  const thread: ChatThread = {
    id,
    eventId,
    kind: "group",
    title,
    participantIds: unique,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  writeJson(KEYS.threads, [thread, ...threads]);
  return thread;
}

export function getGroupThreadForEvent(eventId: string): ChatThread | undefined {
  ensureSeedData();
  return readJson<ChatThread[]>(KEYS.threads, []).find(
    (thread) => thread.id === `group-${eventId}` || (thread.kind === "group" && thread.eventId === eventId),
  );
}

export function getThreadsForUser(userId: string): ChatThread[] {
  ensureSeedData();
  return readJson<ChatThread[]>(KEYS.threads, [])
    .filter((thread) => thread.participantIds.includes(userId))
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function getThreadById(threadId: string): ChatThread | undefined {
  ensureSeedData();
  return readJson<ChatThread[]>(KEYS.threads, []).find(
    (thread) => thread.id === threadId,
  );
}

export function getMessages(threadId: string): ChatMessage[] {
  ensureSeedData();
  return readJson<ChatMessage[]>(KEYS.messages, [])
    .filter((message) => message.threadId === threadId)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

export function sendMessage(
  threadId: string,
  senderId: string,
  body: string,
): ChatMessage {
  const message: ChatMessage = {
    id: `msg-${crypto.randomUUID()}`,
    threadId,
    senderId,
    body: body.trim(),
    createdAt: new Date().toISOString(),
  };
  const messages = readJson<ChatMessage[]>(KEYS.messages, []);
  writeJson(KEYS.messages, [...messages, message]);

  const threads = readJson<ChatThread[]>(KEYS.threads, []);
  const next = threads.map((thread) =>
    thread.id === threadId
      ? { ...thread, updatedAt: message.createdAt }
      : thread,
  );
  writeJson(KEYS.threads, next);
  return message;
}

export function blockUser(meId: string, otherId: string) {
  const me = getUserById(meId);
  if (!me) return;
  if (me.blockedUserIds.includes(otherId)) return;
  upsertUser({ ...me, blockedUserIds: [...me.blockedUserIds, otherId] });
}

export function unblockUser(meId: string, otherId: string) {
  const me = getUserById(meId);
  if (!me) return;
  upsertUser({
    ...me,
    blockedUserIds: me.blockedUserIds.filter((id) => id !== otherId),
  });
}

export function reportUser(
  reporterId: string,
  reportedUserId: string,
  reason: string,
): UserReport {
  const report: UserReport = {
    id: `rep-${crypto.randomUUID()}`,
    reporterId,
    reportedUserId,
    reason: reason.trim(),
    createdAt: new Date().toISOString(),
  };
  const reports = readJson<UserReport[]>(KEYS.reports, []);
  writeJson(KEYS.reports, [report, ...reports]);
  return report;
}

/** Demo OTP: always accepts code 123456 after request. */
export function requestPhoneOtp(userId: string, phone: string): string {
  const code = "123456";
  const pending = readJson<Record<string, { phone: string; code: string }>>(
    KEYS.pendingOtps,
    {},
  );
  pending[userId] = { phone: phone.trim(), code };
  writeJson(KEYS.pendingOtps, pending);
  return code;
}

export function verifyPhoneOtp(
  userId: string,
  code: string,
): { ok: true } | { ok: false; error: string } {
  const pending = readJson<Record<string, { phone: string; code: string }>>(
    KEYS.pendingOtps,
    {},
  );
  const entry = pending[userId];
  if (!entry) {
    return { ok: false, error: "Request a code first." };
  }
  if (code.trim() !== entry.code) {
    return { ok: false, error: "Invalid code. Demo code is 123456." };
  }
  const user = getUserById(userId);
  if (!user) return { ok: false, error: "User not found." };
  upsertUser({ ...user, phone: entry.phone, phoneVerified: true });
  delete pending[userId];
  writeJson(KEYS.pendingOtps, pending);
  return { ok: true };
}

export function submitIdVerification(userId: string): { ok: true } | { ok: false; error: string } {
  const user = getUserById(userId);
  if (!user) return { ok: false, error: "User not found." };
  if (!user.phoneVerified) {
    return { ok: false, error: "Verify your phone before ID verification." };
  }
  upsertUser({ ...user, idVerified: true });
  return { ok: true };
}

export function submitOrganizerVerification(
  userId: string,
): { ok: true } | { ok: false; error: string } {
  const user = getUserById(userId);
  if (!user) return { ok: false, error: "User not found." };
  if (user.accountType === "traveler") {
    return { ok: false, error: "Switch to organizer or tour company first." };
  }
  if (!user.idVerified) {
    return { ok: false, error: "Complete ID verification first." };
  }
  upsertUser({ ...user, organizerVerified: true });
  return { ok: true };
}

export function upsertLiveShare(input: {
  eventId: string;
  userId: string;
  lat: number;
  lng: number;
  label: string;
  hours?: number;
}): LiveShare {
  ensureSeedData();
  const hours = input.hours ?? 6;
  const now = Date.now();
  const share: LiveShare = {
    id: `live-${input.eventId}-${input.userId}`,
    eventId: input.eventId,
    userId: input.userId,
    lat: input.lat,
    lng: input.lng,
    label: input.label,
    updatedAt: new Date(now).toISOString(),
    expiresAt: new Date(now + hours * 60 * 60 * 1000).toISOString(),
  };
  const shares = readJson<LiveShare[]>(KEYS.liveShares, []).filter(
    (item) => !(item.eventId === input.eventId && item.userId === input.userId),
  );
  writeJson(KEYS.liveShares, [share, ...shares]);
  return share;
}

export function stopLiveShare(eventId: string, userId: string) {
  ensureSeedData();
  const shares = readJson<LiveShare[]>(KEYS.liveShares, []).filter(
    (item) => !(item.eventId === eventId && item.userId === userId),
  );
  writeJson(KEYS.liveShares, shares);
}

export function getLiveSharesForEvent(eventId: string): LiveShare[] {
  ensureSeedData();
  const now = Date.now();
  return readJson<LiveShare[]>(KEYS.liveShares, []).filter(
    (item) => item.eventId === eventId && new Date(item.expiresAt).getTime() > now,
  );
}

export function getCircles(): Circle[] {
  ensureSeedData();
  return readJson<Circle[]>(KEYS.circles, []);
}

export function getCircleBySlug(slug: string): Circle | undefined {
  return getCircles().find((circle) => circle.slug === slug);
}

export function getCircleById(id: string): Circle | undefined {
  return getCircles().find((circle) => circle.id === id);
}

export function joinCircle(userId: string, circleId: string) {
  const circles = getCircles();
  const nextCircles = circles.map((circle) =>
    circle.id === circleId && !circle.memberIds.includes(userId)
      ? { ...circle, memberIds: [...circle.memberIds, userId] }
      : circle,
  );
  writeJson(KEYS.circles, nextCircles);

  const user = getUserById(userId);
  if (user && !user.circleIds.includes(circleId)) {
    upsertUser({ ...user, circleIds: [...user.circleIds, circleId] });
  }
}

export function leaveCircle(userId: string, circleId: string) {
  const circles = getCircles();
  writeJson(
    KEYS.circles,
    circles.map((circle) =>
      circle.id === circleId
        ? { ...circle, memberIds: circle.memberIds.filter((id) => id !== userId) }
        : circle,
    ),
  );
  const user = getUserById(userId);
  if (user) {
    upsertUser({
      ...user,
      circleIds: user.circleIds.filter((id) => id !== circleId),
    });
  }
}

export function getCirclePosts(circleId: string): CirclePost[] {
  ensureSeedData();
  return readJson<CirclePost[]>(KEYS.circlePosts, [])
    .filter((post) => post.circleId === circleId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function createCirclePost(
  circleId: string,
  authorId: string,
  body: string,
): CirclePost {
  const post: CirclePost = {
    id: `cpost-${crypto.randomUUID()}`,
    circleId,
    authorId,
    body: body.trim(),
    createdAt: new Date().toISOString(),
  };
  const posts = readJson<CirclePost[]>(KEYS.circlePosts, []);
  writeJson(KEYS.circlePosts, [post, ...posts]);
  return post;
}

export function getEventJoiners(eventId: string): UserProfile[] {
  return getUsers().filter((user) => user.joinedEventIds.includes(eventId));
}

export function getOrganizerEventStats(eventId: string) {
  const joiners = getEventJoiners(eventId);
  const interests = getInterests().filter((item) => item.eventId === eventId);
  const mutualPairs = new Set<string>();
  for (const item of interests) {
    if (
      hasGoTogetherInterest(eventId, item.toUserId, item.fromUserId)
    ) {
      mutualPairs.add([item.fromUserId, item.toUserId].sort().join(":"));
    }
  }
  return {
    joinCount: joiners.length,
    interestCount: interests.length,
    mutualCount: mutualPairs.size,
    joiners,
  };
}
