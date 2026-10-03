"use client";

import type { LucideIcon } from "lucide-react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ChoiceOption<T extends string> {
  value: T;
  label: string;
  description?: string;
  icon?: LucideIcon;
}

/** Large radio cards — for a primary either/or decision. */
export function ChoiceCards<T extends string>({
  value,
  onChange,
  options,
  columns = 2,
}: {
  value: T | undefined;
  onChange: (value: T) => void;
  options: ChoiceOption<T>[];
  columns?: 2 | 3;
}) {
  return (
    <div
      role="radiogroup"
      className={cn("grid gap-3", columns === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2")}
    >
      {options.map((opt) => {
        const active = opt.value === value;
        const Icon = opt.icon;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(opt.value)}
            className={cn(
              "relative flex items-start gap-3 rounded-xl border bg-card p-4 text-left transition-all outline-none focus-visible:ring-3 focus-visible:ring-ring/40",
              active
                ? "border-amber-500 bg-amber-50/60 ring-1 ring-amber-500 dark:bg-amber-500/10"
                : "hover:border-stone-300 hover:bg-muted/30 dark:hover:border-stone-600",
            )}
          >
            {Icon && (
              <span
                className={cn(
                  "flex size-9 shrink-0 items-center justify-center rounded-lg transition-colors",
                  active
                    ? "bg-amber-500 text-white shadow-sm shadow-amber-600/30"
                    : "bg-muted text-muted-foreground",
                )}
              >
                <Icon className="size-4" />
              </span>
            )}
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold">{opt.label}</span>
              {opt.description && (
                <span className="mt-0.5 block text-xs text-muted-foreground">
                  {opt.description}
                </span>
              )}
            </span>
            <span
              className={cn(
                "flex size-5 shrink-0 items-center justify-center rounded-full border transition-colors",
                active ? "border-amber-500 bg-amber-500 text-white" : "border-input bg-card",
              )}
            >
              {active && <Check className="size-3" strokeWidth={3} />}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/** Compact pill radios — for secondary attributes. */
export function ChoiceChips<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T | undefined;
  onChange: (value: T) => void;
  options: ChoiceOption<T>[];
}) {
  return (
    <div role="radiogroup" className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const active = opt.value === value;
        const Icon = opt.icon;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(opt.value)}
            className={cn(
              "inline-flex h-9 items-center gap-1.5 rounded-full border px-3.5 text-[13px] font-medium transition-all outline-none focus-visible:ring-3 focus-visible:ring-ring/40",
              active
                ? "border-stone-900 bg-stone-900 text-white shadow-sm dark:border-amber-400 dark:bg-amber-400 dark:text-stone-950"
                : "bg-card text-foreground/80 hover:border-stone-300 hover:text-foreground",
            )}
          >
            {Icon && <Icon className="size-3.5" />}
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

/** A labelled switch row inside a settings card. */
export function ToggleRow({
  title,
  description,
  control,
}: {
  title: string;
  description?: string;
  control: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-lg border bg-muted/30 p-3.5">
      <div>
        <p className="text-sm font-medium">{title}</p>
        {description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}
      </div>
      {control}
    </div>
  );
}
