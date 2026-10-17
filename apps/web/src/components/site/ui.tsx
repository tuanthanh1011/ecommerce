"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Reveal } from "./reveal";
import { CREAM, MAROON } from "./theme";

/** Maroon title band that opens every public sub-page. */
export function PageHero({
  title,
  description,
  eyebrow,
  crumbs = [],
}: {
  title: string;
  description?: string;
  eyebrow?: string;
  /** Ancestor links shown above the title; the current page is the title itself. */
  crumbs?: { label: string; href: string }[];
}) {
  return (
    <section
      className="relative overflow-hidden pt-12 pb-20 text-center sm:pt-14 sm:pb-28"
      style={{ backgroundColor: MAROON, color: CREAM }}
    >
      <div className="bg-grain pointer-events-none absolute inset-0 opacity-[0.14]" />
      <Reveal className="relative mx-auto max-w-3xl px-4">
        {crumbs.length > 0 && (
          <nav
            aria-label="Breadcrumb"
            className="flex items-center justify-center gap-1.5 text-xs text-[#f3e9dc]/70"
          >
            {crumbs.map((c, i) => (
              <span key={c.href} className="flex items-center gap-1.5">
                {i > 0 && <ChevronRight className="size-3" />}
                <Link href={c.href} className="hover:text-white">
                  {c.label}
                </Link>
              </span>
            ))}
          </nav>
        )}
        {eyebrow && (
          <p
            className={cn(
              "text-xs font-semibold tracking-[0.3em] uppercase opacity-80",
              crumbs.length > 0 && "mt-6",
            )}
          >
            {eyebrow}
          </p>
        )}
        <h1
          className={cn(
            "text-4xl font-semibold tracking-tight text-balance sm:text-5xl",
            eyebrow ? "mt-2" : crumbs.length > 0 && "mt-6",
          )}
          style={{ fontFamily: "var(--font-display)" }}
        >
          {title}
        </h1>
        {description && (
          <p className="mx-auto mt-4 max-w-xl text-[#f3e9dc]/85 text-pretty">
            {description}
          </p>
        )}
      </Reveal>
      <svg
        className="absolute -bottom-px left-0 w-full"
        style={{ color: CREAM }}
        viewBox="0 0 1440 56"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path fill="currentColor" d="M0 56h1440V24c-240-24-480-32-720-24S240 32 0 24v32Z" />
      </svg>
    </section>
  );
}

/** Pill + serif title that heads each section on the home page. */
export function SectionHeading({
  pill,
  title,
  href,
  linkLabel = "Xem tất cả",
}: {
  pill: string;
  title: string;
  /** Adds a "see all" link to the matching page. */
  href?: string;
  linkLabel?: string;
}) {
  return (
    <Reveal className="flex flex-col items-center text-center">
      <span
        className="rounded-full px-6 py-2 text-sm font-semibold tracking-wide text-white shadow-sm"
        style={{ backgroundColor: MAROON }}
      >
        {pill}
      </span>
      <h2
        className="mt-5 text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {title}
      </h2>
      {href && (
        <Link
          href={href}
          className="mt-3 inline-flex items-center gap-1 text-sm font-semibold hover:underline"
          style={{ color: MAROON }}
        >
          {linkLabel} <ChevronRight className="size-4" />
        </Link>
      )}
    </Reveal>
  );
}

/** Single-choice filter pills. */
export function Chips<T extends string>({
  options,
  value,
  onChange,
  className,
}: {
  options: { value: T | undefined; label: string }[];
  value: T | undefined;
  onChange: (value: T | undefined) => void;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap justify-center gap-2", className)}>
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.label}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(o.value)}
            className={cn(
              "rounded-full border px-5 py-2 text-sm font-medium transition-colors",
              active
                ? "border-transparent text-white shadow-sm"
                : "border-[#960000]/15 bg-white text-stone-700 hover:border-[#960000]/40",
            )}
            style={active ? { backgroundColor: MAROON } : undefined}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

export function Pager({
  page,
  total,
  pageSize,
  onChange,
}: {
  page: number;
  total: number;
  pageSize: number;
  onChange: (page: number) => void;
}) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  if (pages <= 1) return null;
  const btn =
    "flex size-10 items-center justify-center rounded-full border border-[#960000]/15 bg-white transition-colors enabled:hover:border-[#960000]/40 disabled:opacity-40";
  return (
    <div className="mt-12 flex items-center justify-center gap-4 text-sm">
      <button
        type="button"
        aria-label="Trang trước"
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
        className={btn}
      >
        <ChevronLeft className="size-4" />
      </button>
      <span className="text-stone-600 tabular-nums">
        {page} / {pages}
      </span>
      <button
        type="button"
        aria-label="Trang sau"
        disabled={page >= pages}
        onClick={() => onChange(page + 1)}
        className={btn}
      >
        <ChevronRight className="size-4" />
      </button>
    </div>
  );
}

/** Friendly message for "nothing here yet" / "not found" states. */
export function SiteEmpty({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description?: string;
  action?: { href: string; label: string };
}) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center py-20 text-center">
      <span
        className="flex size-16 items-center justify-center rounded-full"
        style={{ backgroundColor: `${MAROON}14`, color: MAROON }}
      >
        <Icon className="size-7" />
      </span>
      <h2
        className="mt-5 text-xl font-semibold text-stone-900"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {title}
      </h2>
      {description && <p className="mt-2 text-sm text-stone-600">{description}</p>}
      {action && (
        <Link
          href={action.href}
          className="mt-6 inline-flex h-10 items-center rounded-full px-6 text-sm font-semibold text-white"
          style={{ backgroundColor: MAROON }}
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}

/** Cover image with a tinted fallback block when there is no photo. */
export function Cover({
  src,
  alt,
  icon: Icon,
  className,
}: {
  src?: string | null;
  alt: string;
  icon: React.ComponentType<{ className?: string }>;
  className?: string;
}) {
  return (
    <div className={cn("relative aspect-video overflow-hidden bg-[#960000]/5", className)}>
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <Icon className="absolute inset-0 m-auto size-8 text-[#960000]/25" />
      )}
    </div>
  );
}

/** Large image with clickable thumbnails — product and store detail pages. */
export function Gallery({
  images,
  alt,
  fallbackIcon: Icon,
}: {
  images: string[];
  alt: string;
  fallbackIcon: React.ComponentType<{ className?: string }>;
}) {
  const [active, setActive] = useState(0);
  const current = images[Math.min(active, images.length - 1)];

  return (
    <div>
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-[#960000]/10 bg-[#960000]/5 shadow-sm">
        {current ? (
          <Image src={current} alt={alt} fill priority className="object-cover" />
        ) : (
          <Icon className="absolute inset-0 m-auto size-12 text-[#960000]/25" />
        )}
      </div>
      {images.length > 1 && (
        <div className="mt-3 grid grid-cols-5 gap-2">
          {images.map((url, i) => (
            <button
              key={`${url}-${i}`}
              type="button"
              aria-label={`Xem ảnh ${i + 1}`}
              aria-current={i === active}
              onClick={() => setActive(i)}
              className={cn(
                "relative aspect-square overflow-hidden rounded-lg border-2 transition-opacity",
                i === active ? "border-[#960000]" : "border-transparent opacity-70 hover:opacity-100",
              )}
            >
              <Image src={url} alt="" fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
