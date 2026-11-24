import type { FitPreferences, Interest, UserProfile } from "./types";
import { DEFAULT_FIT } from "./types";

export type MatchResult = {
  user: UserProfile;
  sharedInterests: Interest[];
  sharedEventIds: string[];
  fitOverlap: string[];
  score: number;
};

function visibilityAllows(me: UserProfile, other: UserProfile): boolean {
  const myVis = me.fit?.visibility ?? DEFAULT_FIT.visibility;
  const theirVis = other.fit?.visibility ?? DEFAULT_FIT.visibility;
  const myGender = me.fit?.gender ?? DEFAULT_FIT.gender;
  const theirGender = other.fit?.gender ?? DEFAULT_FIT.gender;

  if (myVis === "women_only" && theirGender !== "woman") return false;
  if (theirVis === "women_only" && myGender !== "woman") return false;

  if (myVis === "same_gender") {
    if (myGender === "prefer_not" || theirGender === "prefer_not") return true;
    if (myGender !== theirGender) return false;
  }
  if (theirVis === "same_gender") {
    if (myGender === "prefer_not" || theirGender === "prefer_not") return true;
    if (myGender !== theirGender) return false;
  }

  return true;
}

function fitOverlapLabels(me: FitPreferences, other: FitPreferences): string[] {
  const labels: string[] = [];
  if (me.pace === other.pace) labels.push(`Pace: ${me.pace}`);
  if (me.experience === other.experience)
    labels.push(`Experience: ${me.experience}`);
  if (me.budget === other.budget) labels.push(`Budget: ${me.budget}`);
  if (
    me.companyPreference === other.companyPreference ||
    me.companyPreference === "either" ||
    other.companyPreference === "either"
  ) {
    labels.push("Company fit");
  }
  return labels;
}

export function scoreMatch(
  me: UserProfile,
  other: UserProfile,
): MatchResult | null {
  if (me.id === other.id) return null;
  if (me.blockedUserIds?.includes(other.id)) return null;
  if (other.blockedUserIds?.includes(me.id)) return null;
  if (!visibilityAllows(me, other)) return null;

  const sharedInterests = me.interests.filter((interest) =>
    other.interests.includes(interest),
  );
  const sharedEventIds = me.joinedEventIds.filter((eventId) =>
    other.joinedEventIds.includes(eventId),
  );

  const myFit = me.fit ?? DEFAULT_FIT;
  const theirFit = other.fit ?? DEFAULT_FIT;
  const fitOverlap = fitOverlapLabels(myFit, theirFit);

  let score = sharedInterests.length * 2 + sharedEventIds.length * 5;
  score += fitOverlap.length;

  if (other.phoneVerified) score += 1;
  if (other.idVerified) score += 2;

  if (score === 0) return null;

  return { user: other, sharedInterests, sharedEventIds, fitOverlap, score };
}

export function findMatches(
  me: UserProfile,
  others: UserProfile[],
): MatchResult[] {
  return others
    .map((other) => scoreMatch(me, other))
    .filter((result): result is MatchResult => result !== null)
    .sort((a, b) => b.score - a.score);
}

export function findEventCompanions(
  me: UserProfile,
  eventId: string,
  others: UserProfile[],
): MatchResult[] {
  return findMatches(me, others).filter((match) =>
    match.sharedEventIds.includes(eventId),
  );
}
