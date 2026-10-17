"use client";

import Image from "next/image";
import { Quote } from "lucide-react";
import type { HomeSettings } from "@/hooks/use-site-settings";
import { HeroBanner } from "./hero-banner";
import { Reveal } from "./reveal";
import { MAROON } from "./theme";

/**
 * Hero / Câu chuyện / Không gian of the home page as pure, prop-driven
 * components. The public home page and the CMS "Trang chủ" preview render
 * these same components, so what you edit is what visitors see.
 */

export function HomeHero({ config }: { config: HomeSettings["hero"] }) {
  if (!config.enabled) return null;
  return (
    <HeroBanner
      heading={config.heading}
      tagline={config.tagline}
      ctaLabel={config.ctaLabel}
      slides={config.slides}
      headingClassName="text-5xl font-semibold tracking-tight text-white sm:text-6xl"
      headingStyle={{ fontFamily: "var(--font-display)" }}
    />
  );
}

export function HomeStory({ config }: { config: HomeSettings["story"] }) {
  if (!config.enabled) return null;
  const hasText = !!config.title || !!config.body;
  if (!hasText && !config.imageUrl) return null;

  return (
    <section id="story" className="relative overflow-hidden py-24">
      <div className="bg-grain pointer-events-none absolute inset-0 opacity-[0.35]" />
      <div
        className={`relative mx-auto grid max-w-6xl items-center gap-14 px-4 sm:px-6 lg:px-8 ${
          hasText && config.imageUrl ? "md:grid-cols-2" : ""
        }`}
      >
        {hasText && (
          <Reveal>
            <Quote
              className="size-12 opacity-15"
              style={{ color: MAROON }}
              aria-hidden
            />
            {config.title && (
              <h2
                className="-mt-2 text-3xl font-semibold tracking-tight sm:text-4xl"
                style={{ color: MAROON, fontFamily: "var(--font-display)" }}
              >
                {config.title}
              </h2>
            )}
            {config.body && (
              <p className="mt-5 max-w-xl text-[1.05rem] leading-loose whitespace-pre-line text-stone-700">
                {config.body}
              </p>
            )}
            <div className="mt-8 h-px w-24" style={{ backgroundColor: MAROON }} />
          </Reveal>
        )}

        {config.imageUrl && (
          <Reveal delay={150} className="relative mx-auto w-full max-w-sm">
            <div
              className="absolute -right-4 -bottom-4 h-full w-full rounded-2xl transition-transform duration-500"
              style={{ backgroundColor: MAROON }}
            />
            <div
              className="relative overflow-hidden rounded-2xl border-[6px] bg-[#f3e9dc] p-1.5 shadow-xl"
              style={{ borderColor: "#fff" }}
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg">
                <Image
                  src={config.imageUrl}
                  alt={config.title || "S+ Coffee"}
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
            </div>
            {config.badge && (
              <span
                className="absolute -top-4 -left-4 rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide text-white shadow-md"
                style={{ backgroundColor: MAROON }}
              >
                {config.badge}
              </span>
            )}
          </Reveal>
        )}
      </div>
    </section>
  );
}

export function HomeSpace({ config }: { config: HomeSettings["space"] }) {
  if (!config.enabled) return null;
  if (!config.title && !config.tagline && !config.imageUrl) return null;

  return (
    <section className="relative isolate overflow-hidden">
      <svg
        className="absolute top-0 left-0 z-10 w-full text-[#f3e9dc]"
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path fill="currentColor" d="M0 0h1440v32c-240 32-480 48-720 48S240 64 0 32V0Z" />
      </svg>

      <div
        className="relative flex min-h-[460px] items-center justify-center bg-cover bg-center bg-scroll text-center md:bg-fixed"
        style={{
          backgroundColor: MAROON,
          ...(config.imageUrl
            ? { backgroundImage: `url(${JSON.stringify(config.imageUrl)})` }
            : {}),
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/40 to-black/55" />
        <Reveal className="relative z-10 px-4 py-28">
          {config.title && (
            <h2
              className="text-4xl font-bold tracking-tight text-white sm:text-6xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {config.title}
            </h2>
          )}
          {config.tagline && (
            <p className="mt-5 text-sm font-medium tracking-[0.3em] text-white/90 uppercase sm:text-base">
              {config.tagline}
            </p>
          )}
        </Reveal>
      </div>

      <svg
        className="absolute bottom-0 left-0 z-10 w-full text-[#f3e9dc]"
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path fill="currentColor" d="M0 80h1440V48c-240-32-480-48-720-48S240 16 0 48v32Z" />
      </svg>
    </section>
  );
}
