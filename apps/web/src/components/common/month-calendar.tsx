"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type CalendarEventTone = "upcoming" | "live" | "past";

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  /** Same as `start` for a single-moment event. */
  end: Date;
  href: string;
  tone: CalendarEventTone;
}

const TONE: Record<CalendarEventTone, string> = {
  upcoming: "bg-teal-50 text-teal-900 ring-teal-200 hover:bg-teal-100 dark:bg-teal-500/15 dark:text-teal-100 dark:ring-teal-500/30",
  live: "bg-rose-50 text-rose-900 ring-rose-200 hover:bg-rose-100 dark:bg-rose-500/15 dark:text-rose-100 dark:ring-rose-500/30",
  past: "bg-muted text-muted-foreground ring-border hover:bg-muted/70",
};

const DOT: Record<CalendarEventTone, string> = {
  upcoming: "bg-teal-500",
  live: "bg-rose-500",
  past: "bg-stone-400",
};

const WEEKDAYS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
const MAX_VISIBLE = 3;
/** Guards against a runaway end date painting years of cells. */
const MAX_SPAN_DAYS = 31;

const pad = (n: number) => String(n).padStart(2, "0");
const dayKey = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const clock = (d: Date) => `${pad(d.getHours())}:${pad(d.getMinutes())}`;

/**
 * Month grid (Monday first). Events appear on every day they cover; empty
 * space on a day offers a "+" that opens `createHref(date)` (when given).
 */
export function MonthCalendar({
  events,
  now,
  createHref,
}: {
  events: CalendarEvent[];
  /** Passed in (not read here) so rendering stays pure. */
  now: number;
  /** Omit for a read-only calendar (no "+" on days). */
  createHref?: (dateKey: string) => string;
}) {
  const today = startOfDay(new Date(now));
  const [cursor, setCursor] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [picked, setPicked] = useState<string | null>(null);

  const byDay = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    for (const event of events) {
      const first = startOfDay(event.start);
      const last = startOfDay(event.end < event.start ? event.start : event.end);
      const cursorDay = new Date(first);
      for (let i = 0; i < MAX_SPAN_DAYS && cursorDay <= last; i++) {
        const key = dayKey(cursorDay);
        map.set(key, [...(map.get(key) ?? []), event]);
        cursorDay.setDate(cursorDay.getDate() + 1);
      }
    }
    for (const list of map.values()) list.sort((a, b) => a.start.getTime() - b.start.getTime());
    return map;
  }, [events]);

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const offset = (new Date(year, month, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const rows = Math.ceil((offset + daysInMonth) / 7);
  const cells = Array.from({ length: rows * 7 }, (_, i) => new Date(year, month, 1 - offset + i));

  const go = (delta: number) => {
    setCursor(new Date(year, month + delta, 1));
    setPicked(null);
  };

  // Phone layout: the picked day, else today (when in this month), else the 1st.
  const todayKey = dayKey(today);
  const selectedKey =
    picked ?? (today.getFullYear() === year && today.getMonth() === month ? todayKey : dayKey(new Date(year, month, 1)));
  const selectedDate = new Date(`${selectedKey}T00:00:00`);
  const selectedEvents = byDay.get(selectedKey) ?? [];

  return (
    <div className="overflow-hidden rounded-2xl border bg-card shadow-[0_1px_3px_rgb(28_25_23/0.05)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3">
        <h2 className="text-base font-semibold tabular-nums">
          Tháng {month + 1}, {year}
        </h2>
        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setCursor(new Date(today.getFullYear(), today.getMonth(), 1));
              setPicked(null);
            }}
          >
            Hôm nay
          </Button>
          <Button variant="outline" size="icon-sm" aria-label="Tháng trước" onClick={() => go(-1)}>
            <ChevronLeft />
          </Button>
          <Button variant="outline" size="icon-sm" aria-label="Tháng sau" onClick={() => go(1)}>
            <ChevronRight />
          </Button>
        </div>
      </div>

      <div className="hidden sm:block">
        <div>
          <div className="grid grid-cols-7 border-b bg-muted/40 text-center text-xs font-medium text-muted-foreground">
            {WEEKDAYS.map((d) => (
              <div key={d} className="py-2">
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {cells.map((date, i) => {
              const key = dayKey(date);
              const inMonth = date.getMonth() === month;
              const isToday = key === dayKey(today);
              const dayEvents = byDay.get(key) ?? [];
              const hidden = dayEvents.length - MAX_VISIBLE;
              return (
                <div
                  key={key}
                  className={cn(
                    "group relative min-h-28 border-r border-b p-1.5",
                    (i + 1) % 7 === 0 && "border-r-0",
                    i >= cells.length - 7 && "border-b-0",
                    !inMonth && "bg-muted/30",
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={cn(
                        "flex size-6 items-center justify-center rounded-full text-xs font-medium tabular-nums",
                        isToday
                          ? "bg-teal-600 text-white"
                          : inMonth
                            ? "text-foreground"
                            : "text-muted-foreground/60",
                      )}
                    >
                      {date.getDate()}
                    </span>
                    {createHref && (
                      <Link
                        href={createHref(key)}
                        aria-label={`Thêm lịch ngày ${date.getDate()}/${date.getMonth() + 1}`}
                        className="flex size-6 items-center justify-center rounded-full text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:bg-muted focus-visible:opacity-100"
                      >
                        <Plus className="size-3.5" />
                      </Link>
                    )}
                  </div>
                  <ul className="mt-1 space-y-1">
                    {dayEvents.slice(0, MAX_VISIBLE).map((event) => (
                      <li key={event.id}>
                        <Link
                          href={event.href}
                          title={event.title}
                          className={cn(
                            "block truncate rounded-md px-1.5 py-0.5 text-[11px] leading-4 font-medium ring-1 ring-inset",
                            TONE[event.tone],
                          )}
                        >
                          {dayKey(event.start) === key && (
                            <span className="mr-1 tabular-nums opacity-70">{clock(event.start)}</span>
                          )}
                          {event.title}
                        </Link>
                      </li>
                    ))}
                    {hidden > 0 && (
                      <li className="px-1.5 text-[11px] text-muted-foreground">+{hidden} sự kiện nữa</li>
                    )}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Phone: compact month (dots) + the picked day's agenda below */}
      <div className="sm:hidden">
        <div className="grid grid-cols-7 border-b bg-muted/40 text-center text-[11px] font-medium text-muted-foreground">
          {WEEKDAYS.map((d) => (
            <div key={d} className="py-1.5">
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 p-1">
          {cells.map((date) => {
            const key = dayKey(date);
            const inMonth = date.getMonth() === month;
            const dayEvents = byDay.get(key) ?? [];
            const selected = key === selectedKey;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setPicked(key)}
                aria-label={`${date.getDate()}/${date.getMonth() + 1}${dayEvents.length ? `, ${dayEvents.length} sự kiện` : ""}`}
                aria-pressed={selected}
                className={cn(
                  "flex h-12 flex-col items-center justify-center gap-1 rounded-lg text-sm tabular-nums",
                  !inMonth && "text-muted-foreground/50",
                  selected && "bg-teal-50 ring-1 ring-teal-300 dark:bg-teal-500/15",
                )}
              >
                <span
                  className={cn(
                    "flex size-6 items-center justify-center rounded-full",
                    key === todayKey && "bg-teal-600 font-semibold text-white",
                  )}
                >
                  {date.getDate()}
                </span>
                <span className="flex h-1.5 gap-0.5">
                  {dayEvents.slice(0, 3).map((e) => (
                    <span key={e.id} className={cn("size-1.5 rounded-full", DOT[e.tone])} />
                  ))}
                </span>
              </button>
            );
          })}
        </div>
        <div className="border-t px-4 py-3">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-semibold capitalize">
              {selectedDate.toLocaleDateString("vi-VN", {
                weekday: "long",
                day: "2-digit",
                month: "2-digit",
              })}
            </h3>
            {createHref && (
              <Link
                href={createHref(selectedKey)}
                className="inline-flex items-center gap-1 text-xs font-medium text-teal-700 dark:text-teal-300"
              >
                <Plus className="size-3.5" /> Thêm lịch
              </Link>
            )}
          </div>
          {selectedEvents.length === 0 ? (
            <p className="mt-2 text-sm text-muted-foreground">Không có sự kiện.</p>
          ) : (
            <ul className="mt-2 space-y-2">
              {selectedEvents.map((event) => (
                <li key={event.id}>
                  <Link
                    href={event.href}
                    className={cn(
                      "block rounded-lg px-3 py-2 text-sm font-medium ring-1 ring-inset",
                      TONE[event.tone],
                    )}
                  >
                    <span className="mr-2 tabular-nums opacity-70">{clock(event.start)}</span>
                    {event.title}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}