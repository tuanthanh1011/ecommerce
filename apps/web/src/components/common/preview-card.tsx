import type { LucideIcon } from "lucide-react";
import { Eye } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Side-rail frame for a live preview. Children render the mock card;
 * the hatched backdrop separates "what it will look like" from form inputs.
 */
export function PreviewFrame({
  label = "Xem trước trên website",
  children,
}: {
  label?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border bg-card shadow-[0_1px_3px_rgb(28_25_23/0.05)]">
      <header className="flex items-center gap-2 border-b px-5 py-3 text-[13px] font-semibold text-muted-foreground">
        <Eye className="size-4" />
        {label}
      </header>
      <div className="bg-[repeating-linear-gradient(45deg,transparent,transparent_8px,rgb(120_113_108/0.04)_8px,rgb(120_113_108/0.04)_16px)] p-5">
        <div className="overflow-hidden rounded-xl bg-card shadow-lg ring-1 shadow-stone-900/10 ring-border">
          {children}
        </div>
      </div>
    </section>
  );
}

/** Text that falls back to a muted placeholder while the field is empty. */
export function PreviewText({
  value,
  placeholder,
  className,
}: {
  value?: string | null;
  placeholder: string;
  className?: string;
}) {
  return (
    <span className={cn(!value && "text-muted-foreground/50", className)}>
      {value || placeholder}
    </span>
  );
}

/** Media-first card: cover image on top, text below (products, stores, posts). */
export function PreviewCard({
  image,
  fallbackIcon: FallbackIcon,
  chip,
  title,
  titlePlaceholder,
  body,
  footer,
  imageClassName,
  label,
}: {
  image?: string | null;
  fallbackIcon: LucideIcon;
  chip?: React.ReactNode;
  title?: string;
  titlePlaceholder: string;
  body?: string;
  footer?: React.ReactNode;
  imageClassName?: string;
  label?: string;
}) {
  return (
    <PreviewFrame label={label}>
      <div
        className={cn(
          "flex aspect-4/3 items-center justify-center overflow-hidden bg-linear-to-br from-amber-100 via-orange-50 to-amber-200 dark:from-amber-500/20 dark:via-stone-800 dark:to-orange-500/10",
          imageClassName,
        )}
      >
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt="" className="size-full object-cover" />
        ) : (
          <FallbackIcon className="size-10 text-amber-700/30 dark:text-amber-200/30" />
        )}
      </div>
      <div className="space-y-1.5 p-4">
        {chip}
        <p className="line-clamp-2 font-semibold tracking-tight">
          <PreviewText value={title} placeholder={titlePlaceholder} />
        </p>
        {body && <p className="line-clamp-2 text-xs text-muted-foreground">{body}</p>}
        {footer}
      </div>
    </PreviewFrame>
  );
}
