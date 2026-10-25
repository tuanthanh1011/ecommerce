import { cn } from "@/lib/utils";

/**
 * The S+ Coffee wordmark — the same logo the public website shows in its
 * header, reused by the CMS (sidebar, login, loading screen) so the brand is
 * identical in both places. Inherits its colour from the surrounding text.
 * Needs `--font-display`, which the root layout provides.
 */
export function BrandLogo({
  subtitle,
  compact,
  className,
  subtitleClassName,
}: {
  subtitle?: string;
  /** "S+" only, for collapsed sidebars. */
  compact?: boolean;
  className?: string;
  subtitleClassName?: string;
}) {
  return (
    <span className={cn("flex flex-col text-lg leading-tight", className)}>
      <span
        className="tracking-wide uppercase"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {compact ? "S+" : "S+ Coffee"}
      </span>
      {!compact && subtitle && (
        <span className={cn("text-[10px] tracking-wide opacity-70", subtitleClassName)}>
          {subtitle}
        </span>
      )}
    </span>
  );
}
