import { cn } from "@/lib/utils";

type StatusTone = "success" | "neutral" | "warning" | "info" | "danger";

const STYLES: Record<StatusTone, { chip: string; dot: string }> = {
  success: {
    chip: "bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-300",
    dot: "bg-emerald-500",
  },
  neutral: {
    chip: "bg-stone-100 text-stone-600 ring-stone-500/20 dark:bg-stone-500/10 dark:text-stone-300",
    dot: "bg-stone-400",
  },
  warning: {
    chip: "bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-500/10 dark:text-amber-300",
    dot: "bg-amber-500",
  },
  info: {
    chip: "bg-sky-50 text-sky-700 ring-sky-600/20 dark:bg-sky-500/10 dark:text-sky-300",
    dot: "bg-sky-500",
  },
  danger: {
    chip: "bg-red-50 text-red-700 ring-red-600/20 dark:bg-red-500/10 dark:text-red-300",
    dot: "bg-red-500",
  },
};

export function StatusBadge({
  tone,
  children,
  pulse,
  className,
}: {
  tone: StatusTone;
  children: React.ReactNode;
  /** Animate the dot — for "live" states like Đang tuyển */
  pulse?: boolean;
  className?: string;
}) {
  const style = STYLES[tone];
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center gap-1.5 rounded-full px-2.5 text-xs font-medium whitespace-nowrap ring-1 ring-inset",
        style.chip,
        className,
      )}
    >
      <span className="relative flex size-1.5">
        {pulse && (
          <span
            className={cn(
              "absolute inline-flex size-full animate-ping rounded-full opacity-60",
              style.dot,
            )}
          />
        )}
        <span className={cn("relative inline-flex size-1.5 rounded-full", style.dot)} />
      </span>
      {children}
    </span>
  );
}

/** Neutral pill for categories / types */
export function TagBadge({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center rounded-md border bg-muted/60 px-2 text-xs font-medium whitespace-nowrap text-foreground/80",
        className,
      )}
    >
      {children}
    </span>
  );
}
