"use client";

import { FormEvent, useState } from "react";

const STORAGE_KEY = "fymie-waitlist-emails";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = email.trim().toLowerCase();

    if (!isValidEmail(trimmed)) {
      setError("Enter a valid email address.");
      return;
    }

    try {
      const existing = JSON.parse(
        localStorage.getItem(STORAGE_KEY) ?? "[]",
      ) as string[];
      if (!existing.includes(trimmed)) {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify([...existing, trimmed]),
        );
      }
    } catch {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([trimmed]));
    }

    setError("");
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="rounded-2xl border border-mint/25 bg-ink/60 px-6 py-8 text-center backdrop-blur-sm">
        <p className="font-[family-name:var(--font-syne)] text-xl font-bold text-cream">
          You&apos;re on the list
        </p>
        <p className="mt-2 text-sm text-mist">
          We&apos;ll reach out when FYMIE opens early access.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-white/10 bg-ink/60 p-5 backdrop-blur-sm sm:p-6"
      noValidate
    >
      <label htmlFor="waitlist-email" className="sr-only">
        Email address
      </label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          id="waitlist-email"
          type="email"
          name="email"
          autoComplete="email"
          placeholder="you@email.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (error) setError("");
          }}
          className="min-w-0 flex-1 rounded-xl border border-white/10 bg-ink-elevated px-4 py-3 text-base text-cream outline-none placeholder:text-mist/70 focus:border-copper/60"
        />
        <button
          type="submit"
          className="rounded-xl bg-copper px-6 py-3 text-base font-semibold text-ink transition-colors hover:bg-amber"
        >
          Join waitlist
        </button>
      </div>
      {error ? (
        <p className="mt-3 text-sm text-copper" role="alert">
          {error}
        </p>
      ) : null}
    </form>
  );
}
