"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

const SLIDE_DURATION = 6000;

/** Auto-playing hero banner slider with a slow Ken-Burns zoom — no deps, static-export friendly. */
export function HeroBanner({
  heading,
  tagline,
  ctaLabel,
  slides: slideConfig,
  headingClassName,
  headingStyle,
}: {
  heading?: string;
  tagline?: string;
  ctaLabel?: string;
  slides: { url: string }[];
  headingClassName?: string;
  headingStyle?: React.CSSProperties;
}) {
  const SLIDES = slideConfig.map((s) => ({ src: s.url, alt: heading || "S+ Coffee" }));
  const [rawIndex, setIndex] = useState(0);
  // The CMS can shorten the slide list while a slide is active.
  const index = SLIDES.length ? rawIndex % SLIDES.length : 0;

  const count = SLIDES.length;
  const next = useCallback(() => {
    setIndex((i) => (i + 1) % Math.max(count, 1));
  }, [count]);
  const prev = useCallback(() => {
    setIndex((i) => (i - 1 + Math.max(count, 1)) % Math.max(count, 1));
  }, [count]);

  useEffect(() => {
    if (count < 2) return;
    const timer = setInterval(next, SLIDE_DURATION);
    return () => clearInterval(timer);
  }, [next, index, count]);

  return (
    <section className="relative isolate flex min-h-[520px] items-center overflow-hidden bg-[#960000] sm:min-h-[680px]">
      {SLIDES.map((slide, i) => (
        <div
          key={slide.src}
          aria-hidden={i !== index}
          className="absolute inset-0 overflow-hidden transition-opacity duration-1000 ease-in-out"
          style={{ opacity: i === index ? 1 : 0 }}
        >
          <div
            key={i === index ? "active" : "idle"}
            className="absolute inset-0"
            style={
              i === index
                ? {
                    animation: `st-kenburns ${SLIDE_DURATION * 1.6}ms ease-out forwards`,
                  }
                : undefined
            }
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              priority={i === 0}
              className="object-cover"
            />
          </div>
        </div>
      ))}

      {/* warm color wash + vignette, closer to the Canva photo grading */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-black/10" />
      <div className="absolute inset-0 bg-[#960000]/10 mix-blend-multiply" />
      <div className="bg-grain pointer-events-none absolute inset-0 opacity-[0.12]" />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 py-10 text-center sm:px-10 sm:py-14">
        {heading && (
          <h1
            className={
              headingClassName ??
              "text-5xl font-semibold tracking-tight text-white sm:text-6xl"
            }
            style={headingStyle}
          >
            {heading}
          </h1>
        )}
        {tagline && (
          <p className="mx-auto mt-4 max-w-xl text-xl leading-snug font-medium text-white/95 sm:text-2xl">
            {tagline}
          </p>
        )}
        {ctaLabel && (
          <div className="mt-8 flex justify-center">
            <a
              href="#story"
              className="group inline-flex h-11 items-center gap-2 rounded-full border border-white/70 px-6 text-sm font-medium text-white transition-all hover:bg-white hover:text-[#960000]"
            >
              {ctaLabel}
              <ChevronDown className="size-4 transition-transform group-hover:translate-y-0.5" />
            </a>
          </div>
        )}
      </div>

      {/* Arrows */}
      {count > 1 && (
      <>
      <button
        type="button"
        onClick={prev}
        aria-label="Ảnh trước"
        className="absolute top-1/2 left-3 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/25 text-white backdrop-blur-sm transition-colors hover:bg-black/50 sm:left-6"
      >
        <ChevronLeft className="size-5" />
      </button>
      <button
        type="button"
        onClick={next}
        aria-label="Ảnh tiếp theo"
        className="absolute top-1/2 right-3 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/25 text-white backdrop-blur-sm transition-colors hover:bg-black/50 sm:right-6"
      >
        <ChevronRight className="size-5" />
      </button>
      </>
      )}

      {/* Dots */}
      {count > 1 && (
      <div className="absolute bottom-16 left-1/2 z-10 flex -translate-x-1/2 gap-2 sm:bottom-20">
        {SLIDES.map((slide, i) => (
          <button
            key={slide.src}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Đi đến ảnh ${i + 1}`}
            className="h-1.5 rounded-full transition-all duration-300"
            style={{
              width: i === index ? 26 : 8,
              backgroundColor: i === index ? "#ffffff" : "rgba(255,255,255,0.5)",
            }}
          />
        ))}
      </div>
      )}

      {/* Scroll cue */}
      <div className="absolute bottom-5 left-1/2 z-10 -translate-x-1/2 text-white/70">
        <ChevronDown className="size-5 animate-bounce" />
      </div>

      <style jsx>{`
        @keyframes st-kenburns {
          from {
            transform: scale(1);
          }
          to {
            transform: scale(1.1);
          }
        }
      `}</style>
    </section>
  );
}
