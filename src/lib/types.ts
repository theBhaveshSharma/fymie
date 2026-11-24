export type Interest =
  | "Concerts"
  | "Festivals"
  | "Nightlife"
  | "Trekking"
  | "Offbeat travel"
  | "Adventure sports"
  | "Camping"
  | "Road trips"
  | "Photography"
  | "Food & culture";

export const ALL_INTERESTS: Interest[] = [
  "Concerts",
  "Festivals",
  "Nightlife",
  "Trekking",
  "Offbeat travel",
  "Adventure sports",
  "Camping",
  "Road trips",
  "Photography",
  "Food & culture",
];

export type EventCategory =
  | "social"
  | "trek"
  | "adventure"
  | "offbeat"
  | "travel";

export type AccountType = "traveler" | "organizer" | "tour_company";

export const ACCOUNT_TYPES: {
  id: AccountType;
  label: string;
  hint: string;
}[] = [
  {
    id: "traveler",
    label: "Traveler",
    hint: "Join events or list a plan you are going on",
  },
  {
    id: "organizer",
    label: "Event organizer",
    hint: "Host meetups, gigs, and group experiences",
  },
  {
    id: "tour_company",
    label: "Tour company",
    hint: "Publish treks, trips, and packaged adventures",
  },
];

export type EventDifficulty = "Easy" | "Moderate" | "Challenging" | "All levels";

export type Pace = "relaxed" | "moderate" | "intense";
export type ExperienceLevel = "beginner" | "intermediate" | "advanced";
export type BudgetBand = "budget" | "mid" | "flex";
export type CompanyPreference = "pair" | "small_group" | "either";
export type VisibilityPref = "everyone" | "same_gender" | "women_only";
export type Gender = "woman" | "man" | "non_binary" | "prefer_not";

export type FitPreferences = {
  pace: Pace;
  experience: ExperienceLevel;
  budget: BudgetBand;
  companyPreference: CompanyPreference;
  visibility: VisibilityPref;
  gender: Gender;
};

export const DEFAULT_FIT: FitPreferences = {
  pace: "moderate",
  experience: "intermediate",
  budget: "mid",
  companyPreference: "either",
  visibility: "everyone",
  gender: "prefer_not",
};

export const LAUNCH_CITIES = [
  "Delhi NCR",
  "Mumbai",
  "Himachal Pradesh",
  "Uttarakhand",
] as const;

export type LaunchCity = (typeof LAUNCH_CITIES)[number];

export type EventLister = {
  userId: string;
  name: string;
  accountType: AccountType;
  organizationName?: string;
};

export type FymieEvent = {
  id: string;
  title: string;
  summary: string;
  description: string;
  category: EventCategory;
  location: string;
  region: string;
  launchCity: LaunchCity;
  date: string;
  endDate?: string;
  duration: string;
  difficulty: EventDifficulty;
  groupSize: string;
  meetingPoint: string;
  highlights: string[];
  includes: string[];
  bring: string[];
  coverImage: string;
  gallery: string[];
  interests: Interest[];
  source: "seed" | "listed";
  listedBy?: EventLister;
  contactEmail?: string;
  createdAt?: string;
};

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  bio: string;
  interests: Interest[];
  accountType: AccountType;
  organizationName?: string;
  fit: FitPreferences;
  phone?: string;
  phoneVerified: boolean;
  idVerified: boolean;
  organizerVerified: boolean;
  emergencyContact?: string;
  blockedUserIds: string[];
  joinedEventIds: string[];
  circleIds: string[];
  createdAt: string;
};

export type Session = {
  userId: string;
};

export type GoTogetherInterest = {
  id: string;
  eventId: string;
  fromUserId: string;
  toUserId: string;
  createdAt: string;
};

export type ChatMessage = {
  id: string;
  threadId: string;
  senderId: string;
  body: string;
  createdAt: string;
};

export type ChatThread = {
  id: string;
  eventId: string;
  kind: "direct" | "group";
  participantIds: string[];
  title?: string;
  createdAt: string;
  updatedAt: string;
};

export type UserReport = {
  id: string;
  reporterId: string;
  reportedUserId: string;
  reason: string;
  createdAt: string;
};

export type LiveShare = {
  id: string;
  eventId: string;
  userId: string;
  lat: number;
  lng: number;
  label: string;
  updatedAt: string;
  expiresAt: string;
};

export type Circle = {
  id: string;
  name: string;
  slug: string;
  description: string;
  interest: Interest;
  coverImage: string;
  memberIds: string[];
};

export type CirclePost = {
  id: string;
  circleId: string;
  authorId: string;
  body: string;
  createdAt: string;
};

export type DestinationHub = {
  slug: string;
  name: LaunchCity;
  headline: string;
  blurb: string;
  coverImage: string;
  highlights: string[];
};

export const DESTINATION_HUBS: DestinationHub[] = [
  {
    slug: "delhi-ncr",
    name: "Delhi NCR",
    headline: "Weekend exits and city gigs",
    blurb:
      "Indie nights, departure meets, and Himalayan weekend crews leaving from the capital region.",
    coverImage: "/events/mumbai-cover.jpg",
    highlights: ["Gig meetups", "Hill departures", "Food before shows"],
  },
  {
    slug: "mumbai",
    name: "Mumbai",
    headline: "Coastal nights and crew plans",
    blurb:
      "Electronic nights, NCPA sets, and people who actually show up when the group chat goes quiet.",
    coverImage: "/events/goa-cover.jpg",
    highlights: ["Nightlife crews", "Live music", "Same-day plans"],
  },
  {
    slug: "himachal-pradesh",
    name: "Himachal Pradesh",
    headline: "Treks, ridges, and road circuits",
    blurb:
      "Triund weekends, Spiti roads, and camping under cold clear skies with matched pace groups.",
    coverImage: "/events/triund-cover.jpg",
    highlights: ["Treks", "Road trips", "Camping"],
  },
  {
    slug: "uttarakhand",
    name: "Uttarakhand",
    headline: "Rivers, meadows, and temple trails",
    blurb:
      "Rishikesh adventure days and Chopta weekends for people who want company on the climb.",
    coverImage: "/events/rishikesh-cover.jpg",
    highlights: ["Rafting", "Temple treks", "Adventure sports"],
  },
];

export const SEED_CIRCLES: Omit<Circle, "memberIds">[] = [
  {
    id: "circle-trekking",
    name: "Trekking",
    slug: "trekking",
    description: "Weekend summits, ridge camps, and pace-matched trail partners.",
    interest: "Trekking",
    coverImage: "/events/triund-cover.jpg",
  },
  {
    id: "circle-indie",
    name: "Indie gigs",
    slug: "indie-gigs",
    description: "Small venues, open mics, and people who want company before the set.",
    interest: "Concerts",
    coverImage: "/events/mumbai-cover.jpg",
  },
  {
    id: "circle-adventure",
    name: "Adventure sports",
    slug: "adventure-sports",
    description: "Rafting, rides, and high-adrenaline weekends with a verified crew.",
    interest: "Adventure sports",
    coverImage: "/events/rishikesh-cover.jpg",
  },
  {
    id: "circle-offbeat",
    name: "Offbeat travel",
    slug: "offbeat-travel",
    description: "Spiti circuits, quiet towns, and plans that skip the tourist checklist.",
    interest: "Offbeat travel",
    coverImage: "/events/spiti-cover.jpg",
  },
];

export function launchCityToSlug(city: LaunchCity): string {
  return city.toLowerCase().replace(/\s+/g, "-");
}

export function slugToLaunchCity(slug: string): LaunchCity | undefined {
  return DESTINATION_HUBS.find((hub) => hub.slug === slug)?.name;
}

export const CATEGORY_COVERS: Record<EventCategory, string[]> = {
  trek: [
    "/events/triund-cover.jpg",
    "/events/triund-1.jpg",
    "/events/triund-2.jpg",
  ],
  offbeat: [
    "/events/spiti-cover.jpg",
    "/events/hampi-cover.jpg",
    "/events/spiti-1.jpg",
  ],
  adventure: [
    "/events/rishikesh-cover.jpg",
    "/events/ladakh-cover.jpg",
    "/events/bali-cover.jpg",
  ],
  social: [
    "/events/goa-cover.jpg",
    "/events/mumbai-cover.jpg",
    "/events/goa-1.jpg",
  ],
  travel: [
    "/events/bali-cover.jpg",
    "/events/ladakh-1.jpg",
    "/events/bali-2.jpg",
  ],
};

export function accountTypeLabel(type: AccountType) {
  if (type === "tour_company") return "Tour company";
  if (type === "organizer") return "Organizer";
  return "Traveler";
}
