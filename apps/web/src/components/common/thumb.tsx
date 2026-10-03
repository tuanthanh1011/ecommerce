import type { LucideIcon } from "lucide-react";
import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/** Square image thumbnail with an icon fallback, used in table name cells. */
export function Thumb({
  src,
  icon: Icon = ImageIcon,
  className,
}: {
  src?: string | null;
  icon?: LucideIcon;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-muted/70 text-muted-foreground/60",
        className,
      )}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" className="size-full object-cover" />
      ) : (
        <Icon className="size-4" />
      )}
    </div>
  );
}

/** Primary cell: thumbnail/icon + title + secondary line. */
export function TitleCell({
  title,
  subtitle,
  leading,
}: {
  title: string;
  subtitle?: React.ReactNode;
  leading?: React.ReactNode;
}) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      {leading}
      <div className="min-w-0">
        <p className="max-w-[320px] truncate font-medium text-foreground">{title}</p>
        {subtitle && (
          <p className="mt-0.5 max-w-[320px] truncate text-xs text-muted-foreground">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
