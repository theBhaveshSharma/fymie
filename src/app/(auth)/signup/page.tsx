"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { InterestPicker } from "@/components/app/InterestPicker";
import { useAuth } from "@/context/AuthContext";
import {
  ACCOUNT_TYPES,
  type AccountType,
  type Interest,
} from "@/lib/types";

export default function SignupPage() {
  const { ready, user, signUp } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [accountType, setAccountType] = useState<AccountType>("traveler");
  const [organizationName, setOrganizationName] = useState("");
  const [interests, setInterests] = useState<Interest[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (ready && user) router.replace("/events");
  }, [ready, user, router]);

  const needsOrg =
    accountType === "organizer" || accountType === "tour_company";

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (interests.length === 0) {
      setError("Pick at least one interest.");
      return;
    }
    const result = signUp({
      name,
      email,
      bio,
      interests,
      accountType,
      organizationName,
    });
    if (!result.ok) {
      setError(result.error);
      return;
    }
    router.push("/events");
  }

  return (
    <main className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center px-6 py-16">
      <Link
        href="/"
        className="font-[family-name:var(--font-syne)] text-2xl font-bold text-cream"
      >
        FYMIE
      </Link>
      <h1 className="mt-8 font-[family-name:var(--font-syne)] text-3xl font-bold text-cream">
        Create your account
      </h1>
      <p className="mt-2 text-mist">
        Join as a traveler, organizer, or tour company. List events and find
        partners or groups to go with.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
        <div>
          <p className="mb-2 text-sm text-fog">I am a</p>
          <div className="space-y-2">
            {ACCOUNT_TYPES.map((type) => (
              <button
                key={type.id}
                type="button"
                onClick={() => setAccountType(type.id)}
                className={`w-full rounded-xl border px-4 py-3 text-left transition-colors ${
                  accountType === type.id
                    ? "border-copper/50 bg-copper/10"
                    : "border-white/10 bg-ink-elevated hover:border-white/20"
                }`}
              >
                <span className="block text-sm font-semibold text-cream">
                  {type.label}
                </span>
                <span className="mt-0.5 block text-xs text-mist">{type.hint}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm text-fog">
            {needsOrg ? "Contact name" : "Name"}
          </label>
          <input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-ink-elevated px-4 py-3 text-cream outline-none focus:border-copper/60"
            placeholder="Your name"
          />
        </div>

        {needsOrg ? (
          <div>
            <label htmlFor="org" className="mb-1.5 block text-sm text-fog">
              {accountType === "tour_company"
                ? "Tour company name"
                : "Organization name"}
            </label>
            <input
              id="org"
              value={organizationName}
              onChange={(e) => setOrganizationName(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-ink-elevated px-4 py-3 text-cream outline-none focus:border-copper/60"
              placeholder="Your brand or company"
            />
          </div>
        ) : null}

        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm text-fog">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-ink-elevated px-4 py-3 text-cream outline-none focus:border-copper/60"
            placeholder="you@email.com"
          />
        </div>
        <div>
          <label htmlFor="bio" className="mb-1.5 block text-sm text-fog">
            Short bio
          </label>
          <textarea
            id="bio"
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full resize-none rounded-xl border border-white/10 bg-ink-elevated px-4 py-3 text-cream outline-none focus:border-copper/60"
            placeholder="Trekker, festival goer, tour host..."
          />
        </div>
        <div>
          <p className="mb-2 text-sm text-fog">Interests</p>
          <InterestPicker selected={interests} onChange={setInterests} />
        </div>
        {error ? (
          <p className="text-sm text-copper" role="alert">
            {error}
          </p>
        ) : null}
        <button
          type="submit"
          className="w-full rounded-xl bg-copper py-3 text-base font-semibold text-ink transition-colors hover:bg-amber"
        >
          Get started
        </button>
      </form>

      <p className="mt-6 text-sm text-mist">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-cream underline-offset-4 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </main>
  );
}
