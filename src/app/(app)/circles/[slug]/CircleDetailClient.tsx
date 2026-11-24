"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { FeatureGate } from "@/components/app/FeatureGate";
import { useAuth } from "@/context/AuthContext";
import { FEATURES } from "@/lib/features";
import {
  createCirclePost,
  getCircleBySlug,
  getCirclePosts,
  getUserById,
  joinCircle,
  leaveCircle,
} from "@/lib/storage";
import type { Circle, CirclePost } from "@/lib/types";

export default function CircleDetailClient() {
  const params = useParams<{ slug: string }>();
  const { user, refresh } = useAuth();
  const [circle, setCircle] = useState<Circle | undefined>();
  const [posts, setPosts] = useState<CirclePost[]>([]);
  const [body, setBody] = useState("");

  function reload() {
    const found = getCircleBySlug(params.slug);
    setCircle(found);
    if (found) setPosts(getCirclePosts(found.id));
  }

  useEffect(() => {
    reload();
  }, [params.slug]);

  if (!FEATURES.circles) {
    return <FeatureGate enabled={false}>{null}</FeatureGate>;
  }

  if (!circle || !user) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-16">
        <p className="text-mist">Circle not found.</p>
        <Link href="/circles" className="mt-4 inline-block text-cream underline">
          Back to circles
        </Link>
      </main>
    );
  }

  const joined = circle.memberIds.includes(user.id);

  function handleToggle() {
    if (!user || !circle) return;
    if (joined) leaveCircle(user.id, circle.id);
    else joinCircle(user.id, circle.id);
    refresh();
    reload();
  }

  function handlePost(event: FormEvent) {
    event.preventDefault();
    if (!user || !circle || !body.trim() || !joined) return;
    createCirclePost(circle.id, user.id, body);
    setBody("");
    reload();
  }

  return (
    <main className="pb-16">
      <section className="relative min-h-[36vh] overflow-hidden">
        <Image
          src={circle.coverImage}
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/65 to-ink/20" />
        <div className="relative z-10 mx-auto flex min-h-[36vh] max-w-3xl flex-col justify-end px-6 pb-10 pt-24">
          <Link href="/circles" className="text-sm text-fog hover:text-cream">
            All circles
          </Link>
          <h1 className="mt-4 font-[family-name:var(--font-syne)] text-4xl font-bold text-cream">
            {circle.name}
          </h1>
          <p className="mt-2 text-fog">{circle.description}</p>
          <button
            type="button"
            onClick={handleToggle}
            className={`mt-6 w-fit rounded-xl px-5 py-2.5 text-sm font-semibold ${
              joined
                ? "border border-white/15 text-cream"
                : "bg-copper text-ink"
            }`}
          >
            {joined ? "Leave circle" : "Join circle"}
          </button>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-6 py-10">
        {joined ? (
          <form onSubmit={handlePost} className="space-y-3">
            <textarea
              rows={3}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Share a plan, ask for company, or post an update..."
              className="w-full resize-none rounded-xl border border-white/10 bg-ink-elevated px-4 py-3 text-cream outline-none focus:border-copper/60"
            />
            <button
              type="submit"
              className="rounded-xl bg-copper px-5 py-2.5 text-sm font-semibold text-ink"
            >
              Post
            </button>
          </form>
        ) : (
          <p className="text-sm text-mist">Join this circle to post.</p>
        )}

        <ul className="mt-10 space-y-6">
          {posts.map((post) => {
            const author = getUserById(post.authorId);
            return (
              <li key={post.id} className="border-b border-white/5 pb-6">
                <p className="text-sm font-medium text-cream">
                  {author?.name ?? "Member"}
                </p>
                <p className="mt-2 text-mist">{post.body}</p>
                <p className="mt-2 text-xs text-fog">
                  {new Date(post.createdAt).toLocaleString()}
                </p>
              </li>
            );
          })}
          {posts.length === 0 ? (
            <li className="text-mist">No posts yet. Start the thread.</li>
          ) : null}
        </ul>
      </div>
    </main>
  );
}
