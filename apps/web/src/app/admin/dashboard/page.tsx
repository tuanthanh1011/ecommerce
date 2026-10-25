"use client";

import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Newspaper,
  PenLine,
  Plus,
} from "lucide-react";
import { LinkButton } from "@/components/ui/link-button";
import { StatusBadge } from "@/components/common/status-badge";
import { EmptyState } from "@/components/common/empty-state";
import { getNavItem } from "@/components/layout/nav-items";
import { useCurrentAdmin } from "@/hooks/use-auth";
import { useProductsQuery } from "@/hooks/use-products";
import { usePostsQuery } from "@/hooks/use-posts";
import { useJobsQuery } from "@/hooks/use-jobs";
import { POST_TYPE_LABELS, POST_TYPE_TONES } from "@/lib/constants";
import { TONES, toneChip } from "@/lib/tones";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

function greeting(): string {
  const h = new Date().getHours();
  if (h < 11) return "Chào buổi sáng";
  if (h < 14) return "Chào buổi trưa";
  if (h < 18) return "Chào buổi chiều";
  return "Chào buổi tối";
}

function Hero() {
  const { data: admin } = useCurrentAdmin();
  const firstName = admin?.fullName.trim().split(/\s+/).pop();

  return (
    <section className="relative overflow-hidden rounded-2xl bg-[#1A1411] px-6 py-7 text-white shadow-xl shadow-stone-900/10 sm:px-8 sm:py-9">
      {/* warm light + crema rings */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_120%_at_100%_0%,rgb(245_158_11/0.35),transparent_60%),radial-gradient(ellipse_60%_80%_at_0%_100%,rgb(234_88_12/0.18),transparent_60%)]" />
      <div className="bg-grain pointer-events-none absolute inset-0 text-white opacity-40 mask-[linear-gradient(to_left,black,transparent_70%)]" />
      <div className="pointer-events-none absolute top-1/2 -right-16 hidden size-80 -translate-y-1/2 rounded-full border-[28px] border-amber-400/10 md:block" />
      <div className="pointer-events-none absolute top-1/2 right-10 hidden size-40 -translate-y-1/2 rounded-full border-[14px] border-amber-300/15 md:block" />
      <div className="pointer-events-none absolute top-1/2 right-24 hidden size-12 -translate-y-1/2 rounded-full bg-amber-400/25 blur-md md:block" />

      <div className="relative max-w-xl">
        <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-amber-200/90 capitalize backdrop-blur">
          <span className="size-1.5 rounded-full bg-amber-400" />
          {new Date().toLocaleDateString("vi-VN", {
            weekday: "long",
            day: "numeric",
            month: "long",
          })}
        </p>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {greeting()}
          {firstName ? `, ${firstName}` : ""} <span className="inline-block">☕</span>
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-stone-300 sm:text-[15px]">
          Hôm nay bạn muốn cập nhật gì cho website S+? Mọi thay đổi sẽ hiển thị
          ngay sau khi lưu.
        </p>
        <div className="mt-6 flex flex-wrap gap-2.5">
          <LinkButton
            href="/admin/dashboard/posts/form/"
            size="lg"
            className="bg-amber-500 text-stone-950 [box-shadow:0_8px_24px_-6px_rgb(245_158_11/0.6)] hover:bg-amber-400"
          >
            <PenLine />
            Viết bài mới
          </LinkButton>
          <LinkButton
            href="/admin/dashboard/products/form/"
            size="lg"
            variant="outline"
            className="border-white/15 bg-white/5 text-white shadow-none hover:bg-white/10 hover:text-white"
          >
            <Plus />
            Thêm sản phẩm
          </LinkButton>
        </div>
      </div>
    </section>
  );
}

function StatCard({
  href,
  value,
  hint,
}: {
  href: string;
  value: number | undefined;
  hint: string;
}) {
  const item = getNavItem(href);
  const tone = TONES[item.tone];
  const Icon = item.icon;

  return (
    <Link
      href={href}
      className="group relative overflow-hidden rounded-xl border bg-card p-5 shadow-[0_1px_2px_rgb(28_25_23/0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-stone-900/5"
    >
      <div
        className={cn(
          "pointer-events-none absolute -top-10 -right-10 size-32 rounded-full bg-linear-to-br opacity-[0.08] blur-sm transition-opacity group-hover:opacity-[0.16]",
          tone.solid,
        )}
      />
      <div className="relative flex items-start justify-between">
        <span
          className={cn(
            "flex size-10 items-center justify-center rounded-lg bg-linear-to-br text-white shadow-md",
            tone.solid,
          )}
        >
          <Icon className="size-[18px]" />
        </span>
        <ArrowUpRight className="size-4 text-muted-foreground/50 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground" />
      </div>
      <div className="relative mt-5">
        {value === undefined ? (
          <div className="h-8 w-14 animate-pulse rounded bg-muted" />
        ) : (
          <p className="text-[28px] leading-none font-semibold tracking-tight tabular-nums">
            {value}
          </p>
        )}
        <p className="mt-2 text-sm font-medium text-foreground/80">{item.label}</p>
        <p className="text-xs text-muted-foreground">{hint}</p>
      </div>
    </Link>
  );
}

function Panel({
  title,
  icon: Icon,
  href,
  children,
  className,
}: {
  title: string;
  icon: typeof Newspaper;
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "flex flex-col rounded-xl border bg-card shadow-[0_1px_2px_rgb(28_25_23/0.04)]",
        className,
      )}
    >
      <header className="flex items-center justify-between border-b px-5 py-3.5">
        <h2 className="flex items-center gap-2 text-[15px] font-semibold tracking-tight">
          <Icon className="size-4 text-muted-foreground" />
          {title}
        </h2>
        <Link
          href={href}
          className="flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          Xem tất cả
          <ArrowRight className="size-3" />
        </Link>
      </header>
      <div className="flex-1">{children}</div>
    </section>
  );
}

function ListSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="divide-y">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 px-5 py-3.5">
          <div className="size-10 animate-pulse rounded-lg bg-muted" />
          <div className="flex-1 space-y-2">
            <div className="h-3.5 w-2/3 animate-pulse rounded bg-muted" />
            <div className="h-3 w-1/3 animate-pulse rounded bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}

function RecentPosts() {
  const { data, isLoading } = usePostsQuery();
  const posts = data?.data.slice(0, 6) ?? [];

  return (
    <Panel title="Bài viết gần đây" icon={Newspaper} href="/admin/dashboard/posts" className="lg:col-span-2">
      {isLoading ? (
        <ListSkeleton rows={5} />
      ) : posts.length === 0 ? (
        <EmptyState
          icon={Newspaper}
          title="Chưa có bài viết"
          description="Bắt đầu bằng một thông báo hoặc giới thiệu sản phẩm mới."
        />
      ) : (
        <ul className="divide-y">
          {posts.map((post) => (
            <li key={post.id}>
              <Link
                href={`/admin/dashboard/posts/form/?id=${post.id}`}
                className="group flex items-center gap-4 px-5 py-3 transition-colors hover:bg-muted/40"
              >
                <div className="size-12 shrink-0 overflow-hidden rounded-lg border bg-muted">
                  {post.coverImage?.url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={post.coverImage.url} alt="" className="size-full object-cover" />
                  ) : (
                    <div className="flex size-full items-center justify-center text-muted-foreground/60">
                      <Newspaper className="size-4" />
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium group-hover:text-primary">
                    {post.title}
                  </p>
                  <div className="mt-1 flex items-center gap-2">
                    <span className={toneChip(POST_TYPE_TONES[post.type])}>
                      {POST_TYPE_LABELS[post.type]}
                    </span>
                    {post.publishedAt && (
                      <span className="text-xs text-muted-foreground">
                        {formatDate(post.publishedAt)}
                      </span>
                    )}
                  </div>
                </div>
                <StatusBadge tone={post.isPublished ? "success" : "neutral"}>
                  {post.isPublished ? "Đã đăng" : "Nháp"}
                </StatusBadge>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}

const QUICK_LINKS = [
  { href: "/admin/dashboard/jobs", to: "/admin/dashboard/jobs/form/", label: "Đăng tin tuyển dụng" },
  { href: "/admin/dashboard/media", to: "/admin/dashboard/media", label: "Tải ảnh lên" },
  { href: "/admin/dashboard/internal-pages", to: "/admin/dashboard/internal-pages", label: "Sửa trang Nội bộ" },
  { href: "/admin/dashboard/story", to: "/admin/dashboard/story", label: "Sửa câu chuyện" },
  { href: "/admin/dashboard/home", to: "/admin/dashboard/home", label: "Sửa trang chủ" },
];

function QuickActions() {
  return (
    <section>
      <h2 className="mb-3 text-[15px] font-semibold tracking-tight">Lối tắt</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
        {QUICK_LINKS.map((q) => {
          const item = getNavItem(q.href);
          const Icon = item.icon;
          return (
            <Link
              key={q.label}
              href={q.to}
              className="group flex items-center gap-3 rounded-xl border bg-card p-3 shadow-[0_1px_2px_rgb(28_25_23/0.04)] transition-all hover:border-amber-300/60 hover:shadow-md"
            >
              <span
                className={cn(
                  "flex size-9 shrink-0 items-center justify-center rounded-lg ring-1 ring-inset transition-transform group-hover:scale-105",
                  TONES[item.tone].soft,
                )}
              >
                <Icon className="size-4" />
              </span>
              <span className="text-[13px] leading-tight font-medium">{q.label}</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export default function DashboardHomePage() {
  const products = useProductsQuery();
  const posts = usePostsQuery();
  const jobs = useJobsQuery();

  return (
    <div className="space-y-6">
      <Hero />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard href="/admin/dashboard/products" value={products.data?.total} hint="Đồ uống & vật phẩm" />
        <StatCard href="/admin/dashboard/posts" value={posts.data?.total} hint="Tất cả chuyên mục" />
        <StatCard href="/admin/dashboard/jobs" value={jobs.data?.total} hint="Tin tuyển dụng" />
      </div>

      <RecentPosts />

      <QuickActions />
    </div>
  );
}
