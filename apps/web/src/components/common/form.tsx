import { CircleAlert, type LucideIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { TONES, type Tone } from "@/lib/tones";
import { cn } from "@/lib/utils";

export function Field({
  label,
  htmlFor,
  error,
  hint,
  required,
  className,
  children,
}: {
  label: string;
  htmlFor?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={htmlFor} className="text-[13px] font-medium text-foreground/90">
        {label}
        {required && <span className="text-red-500">*</span>}
      </Label>
      {children}
      {error ? (
        <p className="flex items-center gap-1.5 text-[13px] text-destructive">
          <CircleAlert className="size-3.5 shrink-0" />
          {error}
        </p>
      ) : (
        hint && <p className="text-[13px] text-muted-foreground">{hint}</p>
      )}
    </div>
  );
}

/** A titled card section for long forms. */
export function FormSection({
  title,
  description,
  icon: Icon,
  tone = "amber",
  children,
  className,
  aside,
}: {
  title: string;
  description?: string;
  /** Small tinted glyph that gives each section its own colour cue */
  icon?: LucideIcon;
  tone?: Tone;
  children: React.ReactNode;
  className?: string;
  /** Element rendered at the right of the section header */
  aside?: React.ReactNode;
}) {
  return (
    <section
      className={cn(
        "rounded-2xl border bg-card shadow-[0_1px_3px_rgb(28_25_23/0.05)]",
        className,
      )}
    >
      <header className="flex items-start justify-between gap-3 px-5 pt-5 sm:px-6">
        <div className="flex items-start gap-3">
          {Icon && (
            <span
              className={cn(
                "flex size-9 shrink-0 items-center justify-center rounded-xl ring-1 ring-inset",
                TONES[tone].soft,
              )}
            >
              <Icon className="size-[18px]" />
            </span>
          )}
          <div className={cn(Icon && !description && "pt-1.5")}>
            <h2 className="text-[15px] leading-tight font-semibold tracking-tight">{title}</h2>
            {description && (
              <p className="mt-1 text-[13px] leading-snug text-muted-foreground">{description}</p>
            )}
          </div>
        </div>
        {aside}
      </header>
      <div className="space-y-5 p-5 pt-5 sm:px-6 sm:pb-6">{children}</div>
    </section>
  );
}

/** Two-column form canvas: main content + narrow settings rail. */
export function FormLayout({
  main,
  side,
}: {
  main: React.ReactNode;
  side?: React.ReactNode;
}) {
  if (!side) return <div className="max-w-3xl space-y-6">{main}</div>;
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_360px]">
      <div className="min-w-0 space-y-6">{main}</div>
      <div className="space-y-6 lg:sticky lg:top-24 lg:self-start">{side}</div>
    </div>
  );
}

/** Skeleton shown while a record loads on edit pages. */
export function FormSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="flex items-center gap-4">
        <div className="size-11 rounded-xl bg-muted" />
        <div className="space-y-2">
          <div className="h-5 w-48 rounded bg-muted" />
          <div className="h-3.5 w-72 rounded bg-muted" />
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="h-96 rounded-xl border bg-card" />
        <div className="h-56 rounded-xl border bg-card" />
      </div>
    </div>
  );
}
