"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { InterestPicker } from "@/components/app/InterestPicker";
import { useAuth } from "@/context/AuthContext";
import { createListedEvent } from "@/lib/storage";
import {
  CATEGORY_COVERS,
  LAUNCH_CITIES,
  type EventCategory,
  type EventDifficulty,
  type Interest,
  type LaunchCity,
} from "@/lib/types";

const CATEGORIES: { id: EventCategory; label: string }[] = [
  { id: "social", label: "Social" },
  { id: "trek", label: "Trek" },
  { id: "adventure", label: "Adventure" },
  { id: "offbeat", label: "Offbeat" },
  { id: "travel", label: "Travel" },
];

const DIFFICULTIES: EventDifficulty[] = [
  "Easy",
  "Moderate",
  "Challenging",
  "All levels",
];

function splitLines(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export default function CreateEventPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<EventCategory>("trek");
  const [location, setLocation] = useState("");
  const [region, setRegion] = useState("");
  const [launchCity, setLaunchCity] = useState<LaunchCity>("Delhi NCR");
  const [date, setDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [duration, setDuration] = useState("");
  const [difficulty, setDifficulty] = useState<EventDifficulty>("All levels");
  const [groupSize, setGroupSize] = useState("");
  const [meetingPoint, setMeetingPoint] = useState("");
  const [highlights, setHighlights] = useState("");
  const [includes, setIncludes] = useState("");
  const [bring, setBring] = useState("");
  const [interests, setInterests] = useState<Interest[]>([]);
  const [coverImage, setCoverImage] = useState(CATEGORY_COVERS.trek[0]);
  const [contactEmail, setContactEmail] = useState(user?.email ?? "");

  const coverOptions = useMemo(() => CATEGORY_COVERS[category], [category]);

  if (!user) return null;

  function handleCategoryChange(next: EventCategory) {
    setCategory(next);
    setCoverImage(CATEGORY_COVERS[next][0]);
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!user) return;

    if (
      !title.trim() ||
      !summary.trim() ||
      !description.trim() ||
      !location.trim() ||
      !region.trim() ||
      !date ||
      !duration.trim() ||
      !groupSize.trim() ||
      !meetingPoint.trim()
    ) {
      setError("Fill in all required fields.");
      return;
    }
    if (interests.length === 0) {
      setError("Pick at least one interest tag.");
      return;
    }

    const highlightList = splitLines(highlights);
    const includeList = splitLines(includes);
    const bringList = splitLines(bring);

    const created = createListedEvent({
      title: title.trim(),
      summary: summary.trim(),
      description: description.trim(),
      category,
      location: location.trim(),
      region: region.trim(),
      launchCity,
      date,
      endDate: endDate || undefined,
      duration: duration.trim(),
      difficulty,
      groupSize: groupSize.trim(),
      meetingPoint: meetingPoint.trim(),
      highlights:
        highlightList.length > 0
          ? highlightList
          : ["Open to people looking for company on this plan"],
      includes:
        includeList.length > 0
          ? includeList
          : ["Listing on FYMIE", "Partner and group matching"],
      bring:
        bringList.length > 0
          ? bringList
          : ["Comfortable clothing", "Valid ID if needed"],
      coverImage,
      gallery: coverOptions,
      interests,
      listedBy: {
        userId: user.id,
        name: user.name,
        accountType: user.accountType,
        organizationName: user.organizationName,
      },
      contactEmail: contactEmail.trim() || user.email,
    });

    router.push(`/events/detail/?id=${encodeURIComponent(created.id)}`);
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-10">
      <Link
        href="/listings"
        className="text-sm text-mist transition-colors hover:text-cream"
      >
        Back to my listings
      </Link>
      <h1 className="mt-6 font-[family-name:var(--font-syne)] text-3xl font-bold text-cream">
        List an event
      </h1>
      <p className="mt-2 text-mist">
        Travelers, organizers, and tour companies can publish plans so others
        can discover them and join.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6" noValidate>
        <div>
          <label htmlFor="title" className="mb-1.5 block text-sm text-fog">
            Title
          </label>
          <input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-ink-elevated px-4 py-3 text-cream outline-none focus:border-copper/60"
            placeholder="Triund Trek Weekend"
          />
        </div>

        <div>
          <label htmlFor="summary" className="mb-1.5 block text-sm text-fog">
            Short summary
          </label>
          <input
            id="summary"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-ink-elevated px-4 py-3 text-cream outline-none focus:border-copper/60"
            placeholder="One line that shows up in Discover"
          />
        </div>

        <div>
          <label htmlFor="description" className="mb-1.5 block text-sm text-fog">
            Full description
          </label>
          <textarea
            id="description"
            rows={6}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full resize-y rounded-xl border border-white/10 bg-ink-elevated px-4 py-3 text-cream outline-none focus:border-copper/60"
            placeholder="What is the plan, who it is for, and why someone should join..."
          />
        </div>

        <div>
          <p className="mb-2 text-sm text-fog">Category</p>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleCategoryChange(item.id)}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
                  category === item.id
                    ? "bg-copper text-ink"
                    : "border border-white/10 text-fog"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm text-fog">Cover photo</p>
          <div className="grid grid-cols-3 gap-3">
            {coverOptions.map((src) => (
              <button
                key={src}
                type="button"
                onClick={() => setCoverImage(src)}
                className={`relative aspect-[4/3] overflow-hidden border-2 ${
                  coverImage === src ? "border-copper" : "border-transparent"
                }`}
              >
                <Image src={src} alt="" fill className="object-cover" sizes="200px" />
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="location" className="mb-1.5 block text-sm text-fog">
              Location
            </label>
            <input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-ink-elevated px-4 py-3 text-cream outline-none focus:border-copper/60"
              placeholder="McLeod Ganj"
            />
          </div>
          <div>
            <label htmlFor="region" className="mb-1.5 block text-sm text-fog">
              City / state / country
            </label>
            <input
              id="region"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-ink-elevated px-4 py-3 text-cream outline-none focus:border-copper/60"
              placeholder="Himachal Pradesh, India"
            />
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm text-fog">Launch region</p>
          <div className="flex flex-wrap gap-2">
            {LAUNCH_CITIES.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setLaunchCity(item)}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
                  launchCity === item
                    ? "bg-mint/20 text-mint"
                    : "border border-white/10 text-fog"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="date" className="mb-1.5 block text-sm text-fog">
              Start date
            </label>
            <input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-ink-elevated px-4 py-3 text-cream outline-none focus:border-copper/60"
            />
          </div>
          <div>
            <label htmlFor="endDate" className="mb-1.5 block text-sm text-fog">
              End date (optional)
            </label>
            <input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-ink-elevated px-4 py-3 text-cream outline-none focus:border-copper/60"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="duration" className="mb-1.5 block text-sm text-fog">
              Duration
            </label>
            <input
              id="duration"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-ink-elevated px-4 py-3 text-cream outline-none focus:border-copper/60"
              placeholder="2 days / 1 night"
            />
          </div>
          <div>
            <label htmlFor="groupSize" className="mb-1.5 block text-sm text-fog">
              Group size
            </label>
            <input
              id="groupSize"
              value={groupSize}
              onChange={(e) => setGroupSize(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-ink-elevated px-4 py-3 text-cream outline-none focus:border-copper/60"
              placeholder="4 to 8 people"
            />
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm text-fog">Difficulty</p>
          <div className="flex flex-wrap gap-2">
            {DIFFICULTIES.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setDifficulty(item)}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
                  difficulty === item
                    ? "bg-copper text-ink"
                    : "border border-white/10 text-fog"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="meetup" className="mb-1.5 block text-sm text-fog">
            Meeting point
          </label>
          <input
            id="meetup"
            value={meetingPoint}
            onChange={(e) => setMeetingPoint(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-ink-elevated px-4 py-3 text-cream outline-none focus:border-copper/60"
            placeholder="McLeod Ganj main square, 7:00 AM"
          />
        </div>

        <div>
          <label htmlFor="contact" className="mb-1.5 block text-sm text-fog">
            Contact email for this listing
          </label>
          <input
            id="contact"
            type="email"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-ink-elevated px-4 py-3 text-cream outline-none focus:border-copper/60"
          />
        </div>

        <div>
          <label htmlFor="highlights" className="mb-1.5 block text-sm text-fog">
            Highlights (one per line)
          </label>
          <textarea
            id="highlights"
            rows={4}
            value={highlights}
            onChange={(e) => setHighlights(e.target.value)}
            className="w-full resize-y rounded-xl border border-white/10 bg-ink-elevated px-4 py-3 text-cream outline-none focus:border-copper/60"
            placeholder={"Sunrise ridge views\nShared camping\nPhoto stops"}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="includes" className="mb-1.5 block text-sm text-fog">
              What you provide (one per line)
            </label>
            <textarea
              id="includes"
              rows={4}
              value={includes}
              onChange={(e) => setIncludes(e.target.value)}
              className="w-full resize-y rounded-xl border border-white/10 bg-ink-elevated px-4 py-3 text-cream outline-none focus:border-copper/60"
            />
          </div>
          <div>
            <label htmlFor="bring" className="mb-1.5 block text-sm text-fog">
              What to bring (one per line)
            </label>
            <textarea
              id="bring"
              rows={4}
              value={bring}
              onChange={(e) => setBring(e.target.value)}
              className="w-full resize-y rounded-xl border border-white/10 bg-ink-elevated px-4 py-3 text-cream outline-none focus:border-copper/60"
            />
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm text-fog">Interest tags</p>
          <InterestPicker selected={interests} onChange={setInterests} />
        </div>

        {error ? (
          <p className="text-sm text-copper" role="alert">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          className="rounded-xl bg-copper px-7 py-3.5 text-base font-semibold text-ink transition-colors hover:bg-amber"
        >
          Publish event
        </button>
      </form>
    </main>
  );
}
