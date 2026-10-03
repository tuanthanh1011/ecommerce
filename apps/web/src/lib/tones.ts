// Accent hues per module. Class strings are literal so Tailwind can see them.
export type Tone =
  | "amber"
  | "emerald"
  | "sky"
  | "violet"
  | "rose"
  | "orange"
  | "indigo"
  | "pink"
  | "teal"
  | "slate";

interface ToneClasses {
  /** Soft tinted chip: icon tiles, badges */
  soft: string;
  /** Solid gradient: hero tiles, active indicators */
  solid: string;
  /** Text-only accent */
  text: string;
  /** Small dot */
  dot: string;
}

export const TONES: Record<Tone, ToneClasses> = {
  amber: {
    soft: "bg-amber-100 text-amber-700 ring-amber-600/15 dark:bg-amber-500/15 dark:text-amber-300",
    solid: "from-amber-500 to-orange-600",
    text: "text-amber-600 dark:text-amber-400",
    dot: "bg-amber-500",
  },
  emerald: {
    soft: "bg-emerald-100 text-emerald-700 ring-emerald-600/15 dark:bg-emerald-500/15 dark:text-emerald-300",
    solid: "from-emerald-500 to-teal-600",
    text: "text-emerald-600 dark:text-emerald-400",
    dot: "bg-emerald-500",
  },
  sky: {
    soft: "bg-sky-100 text-sky-700 ring-sky-600/15 dark:bg-sky-500/15 dark:text-sky-300",
    solid: "from-sky-500 to-blue-600",
    text: "text-sky-600 dark:text-sky-400",
    dot: "bg-sky-500",
  },
  violet: {
    soft: "bg-violet-100 text-violet-700 ring-violet-600/15 dark:bg-violet-500/15 dark:text-violet-300",
    solid: "from-violet-500 to-purple-600",
    text: "text-violet-600 dark:text-violet-400",
    dot: "bg-violet-500",
  },
  rose: {
    soft: "bg-rose-100 text-rose-700 ring-rose-600/15 dark:bg-rose-500/15 dark:text-rose-300",
    solid: "from-rose-500 to-pink-600",
    text: "text-rose-600 dark:text-rose-400",
    dot: "bg-rose-500",
  },
  orange: {
    soft: "bg-orange-100 text-orange-700 ring-orange-600/15 dark:bg-orange-500/15 dark:text-orange-300",
    solid: "from-orange-500 to-red-600",
    text: "text-orange-600 dark:text-orange-400",
    dot: "bg-orange-500",
  },
  indigo: {
    soft: "bg-indigo-100 text-indigo-700 ring-indigo-600/15 dark:bg-indigo-500/15 dark:text-indigo-300",
    solid: "from-indigo-500 to-blue-700",
    text: "text-indigo-600 dark:text-indigo-400",
    dot: "bg-indigo-500",
  },
  pink: {
    soft: "bg-pink-100 text-pink-700 ring-pink-600/15 dark:bg-pink-500/15 dark:text-pink-300",
    solid: "from-pink-500 to-fuchsia-600",
    text: "text-pink-600 dark:text-pink-400",
    dot: "bg-pink-500",
  },
  teal: {
    soft: "bg-teal-100 text-teal-700 ring-teal-600/15 dark:bg-teal-500/15 dark:text-teal-300",
    solid: "from-teal-500 to-cyan-600",
    text: "text-teal-600 dark:text-teal-400",
    dot: "bg-teal-500",
  },
  slate: {
    soft: "bg-stone-200/70 text-stone-700 ring-stone-600/15 dark:bg-stone-500/15 dark:text-stone-300",
    solid: "from-stone-600 to-stone-800",
    text: "text-stone-600 dark:text-stone-400",
    dot: "bg-stone-500",
  },
};

export function toneChip(tone: Tone): string {
  return `inline-flex h-6 items-center rounded-md px-2 text-xs font-medium whitespace-nowrap ring-1 ring-inset ${TONES[tone].soft}`;
}
