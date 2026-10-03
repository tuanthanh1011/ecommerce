import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { TONES } from "@/lib/tones";
import { getNavItem } from "@/components/layout/nav-items";

interface PageHeaderProps {
  /** Nav href of the module — supplies icon, accent tone and default copy */
  module: string;
  title?: string;
  description?: string;
  actions?: React.ReactNode;
  /** Render a back link instead of the module icon (form pages) */
  backHref?: string;
  /** Inline meta rendered next to the title, e.g. a status badge */
  meta?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  module,
  title,
  description,
  actions,
  backHref,
  meta,
  className,
}: PageHeaderProps) {
  const item = getNavItem(module);
  const tone = TONES[item.tone];
  const Icon = item.icon;

  return (
    <div
      className={cn(
        "mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      <div className="flex min-w-0 items-center gap-4">
        {backHref ? (
          <Link
            href={backHref}
            aria-label="Quay lại"
            className="flex size-11 shrink-0 items-center justify-center rounded-xl border bg-card text-muted-foreground shadow-xs transition-colors hover:bg-muted hover:text-foreground"
          >
            <ArrowLeft className="size-5" />
          </Link>
        ) : (
          <span
            className={cn(
              "flex size-11 shrink-0 items-center justify-center rounded-xl ring-1 ring-inset",
              tone.soft,
            )}
          >
            <Icon className="size-5" />
          </span>
        )}
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="truncate text-xl font-semibold tracking-tight text-foreground sm:text-[22px]">
              {title ?? item.label}
            </h1>
            {meta}
          </div>
          <p className="mt-0.5 truncate text-sm text-muted-foreground">
            {description ?? item.description}
          </p>
        </div>
      </div>
      {actions && (
        <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>
      )}
    </div>
  );
}
