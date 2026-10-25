"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, ArrowUpRight, ScrollText } from "lucide-react";
import { useInternalNotices, useInternalPeople } from "@/hooks/use-internal-pages";
import type { InternalNotices, InternalPeople } from "@/hooks/use-site-settings";
import { cn } from "@/lib/utils";
import { InternalGate } from "./internal-shell";
import { RichContent } from "./rich-content";
import { MAROON } from "./theme";
import { SiteEmpty } from "./ui";

const isExternal = (url: string) => /^https?:\/\//i.test(url);

const DETAIL_BUTTON =
  "font-title group/btn inline-flex h-10 items-center justify-center gap-1.5 rounded-full px-5 text-base whitespace-nowrap text-white shadow-sm transition-all hover:shadow-md hover:brightness-110";

/** Photo banner with the slogan over it — top of every Nội bộ page. */
function Banner({ imageUrl, slogan }: { imageUrl: string; slogan: string }) {
  if (!imageUrl && !slogan) return null;
  return (
    <div className="relative h-44 overflow-hidden sm:h-72" style={{ backgroundColor: MAROON }}>
      {imageUrl && (
        <>
          <Image src={imageUrl} alt="" fill priority className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/35 to-black/65" />
        </>
      )}
      {slogan && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6">
          <p className="font-title max-w-2xl text-center text-xl leading-snug whitespace-pre-line text-[#f3d9a8] italic [text-shadow:0_2px_12px_rgb(0_0_0/0.5)] sm:text-4xl">
            {slogan}
          </p>
          <span className="h-px w-16 bg-[#e9bb80]/70 sm:w-24" />
        </div>
      )}
      <span className="absolute inset-x-0 bottom-0 h-1 bg-[#e9bb80]/60" />
    </div>
  );
}

/** Big faint "S+ COFFEE" mark behind a content block (the block must be `relative overflow-hidden`). */
function Watermark() {
  return (
    <div
      aria-hidden
      className="font-title pointer-events-none absolute inset-0 flex flex-col items-center justify-center leading-none text-[#b08968]/25 select-none"
    >
      <span className="text-[14rem] sm:text-[20rem]">S+</span>
      <span className="-mt-4 text-5xl tracking-widest sm:-mt-8 sm:text-7xl">COFFEE</span>
    </div>
  );
}

/** Line — diamond — line. */
function Ornament({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("flex items-center justify-center gap-3", className)}>
      <span className="h-px w-16 bg-[#960000]/30 sm:w-28" />
      <span className="size-2 rotate-45" style={{ backgroundColor: MAROON }} />
      <span className="h-px w-16 bg-[#960000]/30 sm:w-28" />
    </div>
  );
}

/** "NỘI BỘ" eyebrow, underlined title, ornament and the red lead block. */
function PageTitle({ title, block }: { title: string; block?: string }) {
  return (
    <header className="text-center">
      <p className="font-ui text-xs tracking-[0.35em] text-[#960000]/70 uppercase">Nội bộ S+</p>
      <h1
        className="font-title mx-auto mt-3 w-fit border-b-[3px] pb-1.5 text-3xl uppercase sm:text-5xl"
        style={{ color: MAROON, borderColor: MAROON }}
      >
        {title}
      </h1>
      {block && (
        <p className="font-title relative mt-8 overflow-hidden rounded-2xl bg-gradient-to-br from-[#a80000] to-[#780000] px-6 py-5 text-lg leading-snug text-white uppercase shadow-lg shadow-[#960000]/20 sm:px-12 sm:py-6 sm:text-2xl">
          <span
            aria-hidden
            className="absolute -top-4 left-3 text-7xl leading-none text-white/10 sm:text-8xl"
          >
            “
          </span>
          <span className="relative">{block}</span>
        </p>
      )}
    </header>
  );
}

function ClosingLine({ text }: { text: string }) {
  if (!text) return null;
  return (
    <div className="mt-14">
      <Ornament />
      <p
        className="font-title mt-4 text-center text-lg sm:text-xl"
        style={{ color: MAROON }}
      >
        {text}
      </p>
    </div>
  );
}

/**
 * "Thông Báo", after the Canva design: banner, title, red intro block and
 * "Mục Lục" — one row per entry with its number, name and a "Chi Tiết" button
 * going to the CMS link — then a closing line. `preview` renders the buttons
 * as plain labels (nothing navigates in the CMS).
 */
export function NoticesView({ data, preview }: { data: InternalNotices; preview?: boolean }) {
  return (
    <>
      <Banner imageUrl={data.bannerUrl} slogan={data.slogan} />
      <article className="mx-auto max-w-3xl px-4 pt-10 pb-20 sm:px-6">
        <PageTitle title={data.title} block={data.intro} />

        {data.tocTitle && (
          <div className="mt-14 text-center">
            <h2 className="font-title text-3xl uppercase sm:text-4xl" style={{ color: MAROON }}>
              {data.tocTitle}
            </h2>
            <Ornament className="mt-3" />
          </div>
        )}

        <div className="mt-8">
          {data.items.length === 0 ? (
            <p className="font-body text-center text-stone-700">Chưa có thông báo nào.</p>
          ) : (
            <div className="relative overflow-hidden rounded-2xl border border-[#960000]/20">
              {data.showWatermark && <Watermark />}
              <ol className="relative divide-y divide-[#960000]/10">
              {data.items.map((item, i) => {
                const button = (
                  <>
                    Chi Tiết
                    {isExternal(item.url) ? (
                      <ArrowUpRight className="size-4 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                    ) : (
                      <ArrowRight className="size-4 transition-transform group-hover/btn:translate-x-0.5" />
                    )}
                  </>
                );
                return (
                  <li
                    key={`${item.title}-${i}`}
                    className="grid grid-cols-[auto_1fr_auto] items-center gap-3 px-4 py-4 transition-colors hover:bg-[#960000]/[0.04] sm:gap-5 sm:px-6"
                  >
                    <span
                      className="font-title flex size-10 items-center justify-center rounded-full text-lg tabular-nums"
                      style={{ backgroundColor: `${MAROON}14`, color: MAROON }}
                    >
                      {i + 1}
                    </span>
                    <span className="font-title min-w-0 text-lg text-stone-900 sm:text-xl">
                      {item.title}
                    </span>
                    {item.url &&
                      (preview ? (
                        <span className={DETAIL_BUTTON} style={{ backgroundColor: MAROON }}>
                          {button}
                        </span>
                      ) : isExternal(item.url) ? (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={DETAIL_BUTTON}
                          style={{ backgroundColor: MAROON }}
                        >
                          {button}
                        </a>
                      ) : (
                        <Link
                          href={item.url}
                          className={DETAIL_BUTTON}
                          style={{ backgroundColor: MAROON }}
                        >
                          {button}
                        </Link>
                      ))}
                  </li>
                );
              })}
              </ol>
            </div>
          )}
        </div>

        <ClosingLine text={data.closing} />
      </article>
    </>
  );
}

const BULLETS =
  "[&_ul]:list-none [&_ul]:space-y-3 [&_ul]:p-0 [&_li]:relative [&_li]:rounded-xl [&_li]:border [&_li]:border-[#960000]/20 [&_li]:py-3 [&_li]:pr-4 [&_li]:pl-11 [&_li]:before:absolute [&_li]:before:top-3 [&_li]:before:left-4 [&_li]:before:font-bold [&_li]:before:text-[#960000] [&_li]:before:content-['✓'] [&_li+li]:mt-3";

const SECTIONS =
  "[&_h2]:font-title [&_h2]:mt-9 [&_h2]:border-l-4 [&_h2]:border-[#960000] [&_h2]:pl-3 [&_h2]:text-xl [&_h2]:font-normal [&_h2]:text-[#960000] [&_h2]:uppercase [&_h2]:first:mt-0 sm:[&_h2]:text-2xl [&_h2+*]:pl-4 [&_h2+*]:text-stone-800 [&_ul]:list-disc [&_ul]:pl-8";

/**
 * Static "Con người phù hợp", after the Canva design: banner, title, red lead
 * block, bullet cards, a highlighted line, a "details" divider and the
 * numbered sections, then a closing line. Everything but the layout comes
 * from the CMS.
 */
export function PeopleView({ data }: { data: InternalPeople }) {
  return (
    <>
      <Banner imageUrl={data.bannerUrl} slogan={data.slogan} />

      <article className="mx-auto max-w-3xl px-4 pt-10 pb-20 sm:px-6">
        <PageTitle title={data.title} block={data.lead} />

        <RichContent html={data.intro} className={cn("mt-8 text-stone-900", BULLETS)} />

        {data.highlight && (
          <p
            className="font-title mt-8 text-center text-lg sm:text-xl"
            style={{ color: MAROON }}
          >
            {data.highlight}
          </p>
        )}

        {data.detailTitle && (
          <div className="mt-10 flex items-center gap-4">
            <span className="h-px flex-1 bg-[#960000]/25" />
            <span
              className="font-title rounded-full px-7 py-2.5 text-base text-white shadow-md shadow-[#960000]/20 sm:text-xl"
              style={{ backgroundColor: MAROON }}
            >
              {data.detailTitle}
            </span>
            <span className="h-px flex-1 bg-[#960000]/25" />
          </div>
        )}

        <div className="relative mt-8 overflow-hidden p-2 sm:p-4">
          {data.showWatermark && <Watermark />}
          <RichContent html={data.content} className={cn("relative text-stone-900", SECTIONS)} />
        </div>

        <ClosingLine text={data.closing} />
      </article>
    </>
  );
}

function PageSkeleton() {
  return <div className="mx-auto h-64 max-w-3xl animate-pulse rounded-3xl bg-stone-900/5" />;
}

// ── Pages ─────────────────────────────────────────────────────────────────

export function InternalNoticesPage() {
  const { data, isLoading, isError } = useInternalNotices();
  return (
    <InternalGate>
      {isLoading ? (
        <div className="mx-auto max-w-3xl px-4 py-16">
          <PageSkeleton />
        </div>
      ) : isError || !data ? (
        <SiteEmpty icon={ScrollText} title="Không tải được thông báo" />
      ) : (
        <NoticesView data={data} />
      )}
    </InternalGate>
  );
}

export function InternalPeoplePage() {
  const { data, isLoading, isError } = useInternalPeople();
  return (
    <InternalGate>
      {isLoading ? (
        <div className="mx-auto max-w-3xl px-4 py-16">
          <PageSkeleton />
        </div>
      ) : isError || !data ? (
        <SiteEmpty icon={ScrollText} title="Không tải được nội dung" />
      ) : (
        <PeopleView data={data} />
      )}
    </InternalGate>
  );
}

/** `/internal/` itself has no content: send staff to the first page. */
export function InternalIndexRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/internal/notices/");
  }, [router]);
  return <div className="min-h-[70vh]" aria-busy="true" />;
}
