"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const { ready, user, signIn } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (ready && user) router.replace("/events");
  }, [ready, user, router]);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const result = signIn(email);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    router.push("/events");
  }

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 py-16">
      <Link
        href="/"
        className="font-[family-name:var(--font-syne)] text-2xl font-bold text-cream"
      >
        FYMIE
      </Link>
      <h1 className="mt-8 font-[family-name:var(--font-syne)] text-3xl font-bold text-cream">
        Welcome back
      </h1>
      <p className="mt-2 text-mist">
        Sign in with your email. Try a demo account like aria@demo.fymie.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4" noValidate>
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm text-fog">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError("");
            }}
            className="w-full rounded-xl border border-white/10 bg-ink-elevated px-4 py-3 text-cream outline-none placeholder:text-mist/70 focus:border-copper/60"
            placeholder="you@email.com"
          />
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
          Sign in
        </button>
      </form>

      <p className="mt-6 text-sm text-mist">
        New here?{" "}
        <Link href="/signup" className="text-cream underline-offset-4 hover:underline">
          Create an account
        </Link>
      </p>
    </main>
  );
}
