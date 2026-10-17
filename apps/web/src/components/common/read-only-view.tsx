import type { LucideIcon } from "lucide-react";
import { Lock } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { EmptyState } from "@/components/common/empty-state";
import { StatusBadge } from "@/components/common/status-badge";

/**
 * Detail page for read-only users (Employees). Employees can't edit anything
 * (the API refuses their writes), so instead of the edit form they get a
 * reading layout: the content on the left, a "Thông tin" panel of key facts
 * on the right.
 */
export function ReadOnlyView({
  module,
  backHref,
  title,
  kicker,
  badges,
  facts,
  children,
}: {
  module: string;
  backHref: string;
  title: string;
  /** One line under the title, e.g. the category. */
  kicker?: string;
  badges?: React.ReactNode;
  /** Key facts shown in the side panel. */
  facts?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <PageHeader
        module={module}
        backHref={backHref}
        title={title}
        description={kicker}
        meta={badges ?? <StatusBadge tone="neutral">Chỉ xem</StatusBadge>}
      />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <article className="min-w-0 rounded-2xl border bg-card p-6 shadow-[0_1px_3px_rgb(28_25_23/0.05)] sm:p-8">
          {children}
        </article>
        {facts && (
          <aside className="h-fit rounded-2xl border bg-card p-5 shadow-[0_1px_3px_rgb(28_25_23/0.05)] lg:sticky lg:top-24">
            <h2 className="mb-4 text-[13px] font-semibold tracking-tight text-muted-foreground">
              Thông tin
            </h2>
            <dl className="space-y-4">{facts}</dl>
          </aside>
        )}
      </div>
    </div>
  );
}

/** One row of the side panel: icon, label, value. */
export function Fact({
  icon: Icon,
  label,
  children,
}: {
  icon: LucideIcon;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
        <Icon className="size-4" />
      </span>
      <div className="min-w-0">
        <dt className="text-xs text-muted-foreground">{label}</dt>
        <dd className="text-sm font-medium break-words">{children}</dd>
      </div>
    </div>
  );
}

/** Shown when an Employee lands on a "create" or missing-record URL. */
export function ReadOnlyBlocked({ title }: { title: string }) {
  return (
    <div className="rounded-xl border border-dashed bg-card">
      <EmptyState
        icon={Lock}
        title={title}
        description="Tài khoản nhân viên chỉ có quyền xem nội dung."
      />
    </div>
  );
}
