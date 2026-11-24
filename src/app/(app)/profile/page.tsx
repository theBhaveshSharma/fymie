"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { FitPreferencesFields } from "@/components/app/FitPreferencesFields";
import { InterestPicker } from "@/components/app/InterestPicker";
import { useAuth } from "@/context/AuthContext";
import { requestPhoneOtp, submitIdVerification, submitOrganizerVerification, verifyPhoneOtp } from "@/lib/storage";
import { FEATURES } from "@/lib/features";
import {
  ACCOUNT_TYPES,
  DEFAULT_FIT,
  type AccountType,
  type FitPreferences,
  type Interest,
} from "@/lib/types";

export default function ProfilePage() {
  const { user, updateProfile, refresh } = useAuth();
  const [name, setName] = useState(user?.name ?? "");
  const [bio, setBio] = useState(user?.bio ?? "");
  const [accountType, setAccountType] = useState<AccountType>(
    user?.accountType ?? "traveler",
  );
  const [organizationName, setOrganizationName] = useState(
    user?.organizationName ?? "",
  );
  const [interests, setInterests] = useState<Interest[]>(user?.interests ?? []);
  const [fit, setFit] = useState<FitPreferences>(user?.fit ?? DEFAULT_FIT);
  const [emergencyContact, setEmergencyContact] = useState(
    user?.emergencyContact ?? "",
  );
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [phoneMessage, setPhoneMessage] = useState("");

  const [idMessage, setIdMessage] = useState("");
  const [orgMessage, setOrgMessage] = useState("");

  if (!user) return null;

  const needsOrg =
    accountType === "organizer" || accountType === "tour_company";

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (needsOrg && !organizationName.trim()) {
      setError("Add your organization or company name.");
      return;
    }
    updateProfile({
      name,
      bio,
      interests,
      accountType,
      organizationName,
      fit,
      emergencyContact,
    });
    setError("");
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  }

  function handleSendOtp() {
    if (!user) return;
    if (!phone.trim()) {
      setPhoneMessage("Enter a phone number first.");
      return;
    }
    requestPhoneOtp(user.id, phone);
    setOtpSent(true);
    setPhoneMessage("Demo OTP sent. Use code 123456.");
  }

  function handleVerifyOtp() {
    if (!user) return;
    const result = verifyPhoneOtp(user.id, otp);
    if (!result.ok) {
      setPhoneMessage(result.error);
      return;
    }
    refresh();
    setPhoneMessage("Phone verified.");
    setOtpSent(false);
    setOtp("");
  }

  return (
    <main className="mx-auto w-full max-w-2xl px-6 py-10">
      <h1 className="font-[family-name:var(--font-syne)] text-3xl font-bold text-cream">
        Profile
      </h1>
      <p className="mt-2 text-mist">
        Fit preferences and verification help FYMIE match safer companions for
        events you join.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-8">
        <section className="space-y-5">
          <h2 className="font-[family-name:var(--font-syne)] text-xl font-bold text-cream">
            Account
          </h2>
          <div>
            <p className="mb-2 text-sm text-fog">Account type</p>
            <div className="space-y-2">
              {ACCOUNT_TYPES.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setAccountType(type.id)}
                  className={`w-full rounded-xl border px-4 py-3 text-left transition-colors ${
                    accountType === type.id
                      ? "border-copper/50 bg-copper/10"
                      : "border-white/10 bg-ink-elevated"
                  }`}
                >
                  <span className="block text-sm font-semibold text-cream">
                    {type.label}
                  </span>
                  <span className="mt-0.5 block text-xs text-mist">
                    {type.hint}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="name" className="mb-1.5 block text-sm text-fog">
              Name
            </label>
            <input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-ink-elevated px-4 py-3 text-cream outline-none focus:border-copper/60"
            />
          </div>

          {needsOrg ? (
            <div>
              <label htmlFor="org" className="mb-1.5 block text-sm text-fog">
                Organization / company
              </label>
              <input
                id="org"
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-ink-elevated px-4 py-3 text-cream outline-none focus:border-copper/60"
              />
            </div>
          ) : null}

          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm text-fog">
              Email
            </label>
            <input
              id="email"
              value={user.email}
              disabled
              className="w-full rounded-xl border border-white/5 bg-ink px-4 py-3 text-mist"
            />
          </div>
          <div>
            <label htmlFor="bio" className="mb-1.5 block text-sm text-fog">
              Bio
            </label>
            <textarea
              id="bio"
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full resize-none rounded-xl border border-white/10 bg-ink-elevated px-4 py-3 text-cream outline-none focus:border-copper/60"
            />
          </div>
          <div>
            <p className="mb-2 text-sm text-fog">Interests</p>
            <InterestPicker selected={interests} onChange={setInterests} />
          </div>
        </section>

        <section className="space-y-5 border-t border-white/5 pt-8">
          <h2 className="font-[family-name:var(--font-syne)] text-xl font-bold text-cream">
            Fit preferences
          </h2>
          <FitPreferencesFields value={fit} onChange={setFit} />
        </section>

        <section className="space-y-5 border-t border-white/5 pt-8">
          <h2 className="font-[family-name:var(--font-syne)] text-xl font-bold text-cream">
            Safety
          </h2>
          <div>
            <label htmlFor="emergency" className="mb-1.5 block text-sm text-fog">
              Emergency contact
            </label>
            <input
              id="emergency"
              value={emergencyContact}
              onChange={(e) => setEmergencyContact(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-ink-elevated px-4 py-3 text-cream outline-none focus:border-copper/60"
              placeholder="+91..."
            />
          </div>
          <div>
            <label htmlFor="phone" className="mb-1.5 block text-sm text-fog">
              Phone {user.phoneVerified ? "(verified)" : "(not verified)"}
            </label>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={user.phoneVerified}
                className="min-w-0 flex-1 rounded-xl border border-white/10 bg-ink-elevated px-4 py-3 text-cream outline-none focus:border-copper/60 disabled:opacity-60"
                placeholder="+91..."
              />
              {!user.phoneVerified ? (
                <button
                  type="button"
                  onClick={handleSendOtp}
                  className="rounded-xl border border-white/15 px-4 py-3 text-sm font-medium text-cream"
                >
                  Send OTP
                </button>
              ) : null}
            </div>
          </div>
          {otpSent && !user.phoneVerified ? (
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="min-w-0 flex-1 rounded-xl border border-white/10 bg-ink-elevated px-4 py-3 text-cream outline-none focus:border-copper/60"
                placeholder="Enter 123456"
              />
              <button
                type="button"
                onClick={handleVerifyOtp}
                className="rounded-xl bg-mint/20 px-4 py-3 text-sm font-medium text-mint"
              >
                Verify
              </button>
            </div>
          ) : null}
          {phoneMessage ? (
            <p className="text-sm text-mist">{phoneMessage}</p>
          ) : null}
          <p className="text-xs text-mist">
            Demo OTP always uses code 123456. Public first meetups are prompted
            when you join an event.
          </p>

          {FEATURES.idVerification ? (
            <div className="rounded-xl border border-white/10 p-4">
              <p className="text-sm font-medium text-cream">
                ID verification{" "}
                {user.idVerified ? (
                  <span className="text-mint">(Verified badge)</span>
                ) : (
                  <span className="text-mist">(not verified)</span>
                )}
              </p>
              <p className="mt-1 text-xs text-mist">
                Demo flow: confirm you uploaded a government ID and selfie for
                human review. Unlocks stronger match ranking and chat trust.
              </p>
              {!user.idVerified ? (
                <button
                  type="button"
                  onClick={() => {
                    const result = submitIdVerification(user.id);
                    if (!result.ok) {
                      setIdMessage(result.error);
                      return;
                    }
                    refresh();
                    setIdMessage("ID verified. Badge added.");
                  }}
                  className="mt-3 rounded-xl bg-mint/20 px-4 py-2 text-sm font-medium text-mint"
                >
                  Submit ID + selfie (demo)
                </button>
              ) : null}
              {idMessage ? (
                <p className="mt-2 text-sm text-mist">{idMessage}</p>
              ) : null}
            </div>
          ) : null}

          {FEATURES.organizerVerification &&
          user.accountType !== "traveler" ? (
            <div className="rounded-xl border border-white/10 p-4">
              <p className="text-sm font-medium text-cream">
                Organizer verification{" "}
                {user.organizerVerified ? (
                  <span className="text-mint">(Verified)</span>
                ) : (
                  <span className="text-mist">(pending)</span>
                )}
              </p>
              <p className="mt-1 text-xs text-mist">
                Demo business/GST proof check for featured tour listings.
              </p>
              {!user.organizerVerified ? (
                <button
                  type="button"
                  onClick={() => {
                    const result = submitOrganizerVerification(user.id);
                    if (!result.ok) {
                      setOrgMessage(result.error);
                      return;
                    }
                    refresh();
                    setOrgMessage("Organizer verified.");
                  }}
                  className="mt-3 rounded-xl border border-white/15 px-4 py-2 text-sm font-medium text-cream"
                >
                  Submit business proof (demo)
                </button>
              ) : null}
              {orgMessage ? (
                <p className="mt-2 text-sm text-mist">{orgMessage}</p>
              ) : null}
            </div>
          ) : null}
        </section>

        {error ? (
          <p className="text-sm text-copper" role="alert">
            {error}
          </p>
        ) : null}
        <div className="flex flex-wrap items-center gap-4">
          <button
            type="submit"
            className="rounded-xl bg-copper px-6 py-3 text-base font-semibold text-ink transition-colors hover:bg-amber"
          >
            Save profile
          </button>
          {saved ? <span className="text-sm text-mint">Saved</span> : null}
          <Link
            href="/listings"
            className="text-sm text-fog underline-offset-4 hover:text-cream hover:underline"
          >
            Manage listings
          </Link>
        </div>
      </form>

      <p className="mt-10 text-sm text-mist">
        Joined plans: {user.joinedEventIds.length}
      </p>
    </main>
  );
}
