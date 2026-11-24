"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  getSession,
  getUserByEmail,
  getUserById,
  getUsers,
  normalizeUser,
  setSession,
  upsertUser,
} from "@/lib/storage";
import type {
  AccountType,
  FitPreferences,
  Interest,
  UserProfile,
} from "@/lib/types";
import { DEFAULT_FIT } from "@/lib/types";

type AuthContextValue = {
  ready: boolean;
  user: UserProfile | null;
  signUp: (input: {
    name: string;
    email: string;
    bio?: string;
    interests?: Interest[];
    accountType: AccountType;
    organizationName?: string;
  }) => { ok: true } | { ok: false; error: string };
  signIn: (email: string) => { ok: true } | { ok: false; error: string };
  signOut: () => void;
  updateProfile: (
    patch: Partial<
      Pick<
        UserProfile,
        | "name"
        | "bio"
        | "interests"
        | "accountType"
        | "organizationName"
        | "fit"
        | "emergencyContact"
        | "phone"
        | "phoneVerified"
        | "idVerified"
        | "organizerVerified"
        | "blockedUserIds"
        | "circleIds"
      >
    >,
  ) => void;
  toggleJoinEvent: (eventId: string) => void;
  refresh: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);

  const refresh = useCallback(() => {
    const session = getSession();
    if (!session) {
      setUser(null);
      return;
    }
    const found = getUserById(session.userId);
    setUser(found ? normalizeUser(found) : null);
  }, []);

  useEffect(() => {
    refresh();
    setReady(true);
  }, [refresh]);

  const signUp: AuthContextValue["signUp"] = useCallback(
    ({
      name,
      email,
      bio = "",
      interests = [],
      accountType,
      organizationName = "",
    }) => {
      const trimmedEmail = email.trim().toLowerCase();
      const trimmedName = name.trim();
      const trimmedOrg = organizationName.trim();

      if (!trimmedName || !trimmedEmail) {
        return { ok: false, error: "Name and email are required." };
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
        return { ok: false, error: "Enter a valid email address." };
      }
      if (
        (accountType === "organizer" || accountType === "tour_company") &&
        !trimmedOrg
      ) {
        return {
          ok: false,
          error: "Add your organization or company name.",
        };
      }
      if (getUserByEmail(trimmedEmail)) {
        return { ok: false, error: "An account with this email already exists." };
      }

      const profile: UserProfile = {
        id: `user-${crypto.randomUUID()}`,
        name: trimmedName,
        email: trimmedEmail,
        bio: bio.trim(),
        interests,
        accountType,
        organizationName: trimmedOrg || undefined,
        fit: { ...DEFAULT_FIT },
        phoneVerified: false,
        idVerified: false,
        organizerVerified: false,
        blockedUserIds: [],
        joinedEventIds: [],
        circleIds: [],
        createdAt: new Date().toISOString(),
      };

      upsertUser(profile);
      setSession({ userId: profile.id });
      setUser(normalizeUser(profile));
      return { ok: true };
    },
    [],
  );

  const signIn: AuthContextValue["signIn"] = useCallback((email) => {
    const trimmedEmail = email.trim().toLowerCase();
    const existing = getUserByEmail(trimmedEmail);
    if (!existing) {
      return { ok: false, error: "No account found for that email." };
    }
    setSession({ userId: existing.id });
    setUser(normalizeUser(existing));
    return { ok: true };
  }, []);

  const signOut = useCallback(() => {
    setSession(null);
    setUser(null);
  }, []);

  const updateProfile: AuthContextValue["updateProfile"] = useCallback(
    (patch) => {
      if (!user) return;
      const next: UserProfile = normalizeUser({
        ...user,
        ...patch,
        name: patch.name?.trim() || user.name,
        bio: patch.bio !== undefined ? patch.bio.trim() : user.bio,
        organizationName:
          patch.organizationName !== undefined
            ? patch.organizationName.trim() || undefined
            : user.organizationName,
        fit: patch.fit
          ? ({ ...DEFAULT_FIT, ...user.fit, ...patch.fit } as FitPreferences)
          : user.fit,
        emergencyContact:
          patch.emergencyContact !== undefined
            ? patch.emergencyContact.trim() || undefined
            : user.emergencyContact,
      });
      upsertUser(next);
      setUser(next);
    },
    [user],
  );

  const toggleJoinEvent = useCallback(
    (eventId: string) => {
      if (!user) return;
      const joined = user.joinedEventIds.includes(eventId)
        ? user.joinedEventIds.filter((id) => id !== eventId)
        : [...user.joinedEventIds, eventId];
      const next = normalizeUser({ ...user, joinedEventIds: joined });
      upsertUser(next);
      setUser(next);
    },
    [user],
  );

  const value = useMemo(
    () => ({
      ready,
      user,
      signUp,
      signIn,
      signOut,
      updateProfile,
      toggleJoinEvent,
      refresh: () => {
        void getUsers();
        refresh();
      },
    }),
    [
      ready,
      user,
      signUp,
      signIn,
      signOut,
      updateProfile,
      toggleJoinEvent,
      refresh,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
