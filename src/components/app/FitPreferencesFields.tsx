"use client";

import type {
  BudgetBand,
  CompanyPreference,
  ExperienceLevel,
  FitPreferences,
  Gender,
  Pace,
  VisibilityPref,
} from "@/lib/types";

function OptionRow<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { id: T; label: string }[];
  onChange: (next: T) => void;
}) {
  return (
    <div>
      <p className="mb-2 text-sm text-fog">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => onChange(option.id)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              value === option.id
                ? "bg-copper text-ink"
                : "border border-white/10 text-fog hover:border-copper/40"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function FitPreferencesFields({
  value,
  onChange,
}: {
  value: FitPreferences;
  onChange: (next: FitPreferences) => void;
}) {
  function patch<K extends keyof FitPreferences>(key: K, next: FitPreferences[K]) {
    onChange({ ...value, [key]: next });
  }

  return (
    <div className="space-y-5">
      <OptionRow<Pace>
        label="Pace"
        value={value.pace}
        onChange={(pace) => patch("pace", pace)}
        options={[
          { id: "relaxed", label: "Relaxed" },
          { id: "moderate", label: "Moderate" },
          { id: "intense", label: "Intense" },
        ]}
      />
      <OptionRow<ExperienceLevel>
        label="Experience"
        value={value.experience}
        onChange={(experience) => patch("experience", experience)}
        options={[
          { id: "beginner", label: "Beginner" },
          { id: "intermediate", label: "Intermediate" },
          { id: "advanced", label: "Advanced" },
        ]}
      />
      <OptionRow<BudgetBand>
        label="Budget"
        value={value.budget}
        onChange={(budget) => patch("budget", budget)}
        options={[
          { id: "budget", label: "Budget" },
          { id: "mid", label: "Mid" },
          { id: "flex", label: "Flex" },
        ]}
      />
      <OptionRow<CompanyPreference>
        label="Company preference"
        value={value.companyPreference}
        onChange={(companyPreference) => patch("companyPreference", companyPreference)}
        options={[
          { id: "pair", label: "Pair" },
          { id: "small_group", label: "Small group" },
          { id: "either", label: "Either" },
        ]}
      />
      <OptionRow<Gender>
        label="Gender (for visibility matching)"
        value={value.gender}
        onChange={(gender) => patch("gender", gender)}
        options={[
          { id: "woman", label: "Woman" },
          { id: "man", label: "Man" },
          { id: "non_binary", label: "Non-binary" },
          { id: "prefer_not", label: "Prefer not" },
        ]}
      />
      <OptionRow<VisibilityPref>
        label="Who can match with you"
        value={value.visibility}
        onChange={(visibility) => patch("visibility", visibility)}
        options={[
          { id: "everyone", label: "Everyone" },
          { id: "same_gender", label: "Same gender" },
          { id: "women_only", label: "Women only" },
        ]}
      />
    </div>
  );
}
