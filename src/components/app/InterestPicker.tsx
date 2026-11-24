"use client";

import { ALL_INTERESTS, type Interest } from "@/lib/types";

export function InterestPicker({
  selected,
  onChange,
}: {
  selected: Interest[];
  onChange: (next: Interest[]) => void;
}) {
  function toggle(interest: Interest) {
    if (selected.includes(interest)) {
      onChange(selected.filter((item) => item !== interest));
    } else {
      onChange([...selected, interest]);
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {ALL_INTERESTS.map((interest) => {
        const active = selected.includes(interest);
        return (
          <button
            key={interest}
            type="button"
            onClick={() => toggle(interest)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              active
                ? "bg-copper text-ink"
                : "border border-white/10 bg-ink-elevated text-fog hover:border-copper/40"
            }`}
          >
            {interest}
          </button>
        );
      })}
    </div>
  );
}
