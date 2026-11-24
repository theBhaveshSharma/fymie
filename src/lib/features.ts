/**
 * Product surface flags. Keep code paths; flip to true when ready to show again.
 * Core loop stays on: events → match → mutual interest → direct chat.
 */
export const FEATURES = {
  destinations: false,
  circles: false,
  liveShare: false,
  groupChat: false,
  idVerification: false,
  organizerVerification: false,
  organizerAnalytics: false,
} as const;
