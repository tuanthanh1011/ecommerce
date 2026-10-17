"use client";

import Link from "next/link";
import { useEffect, useSyncExternalStore } from "react";
import {
  usePublicJobs,
  usePublicPosts,
  usePublicProducts,
  usePublicStores,
  usePublicStoryBlocks,
  usePublicTeamMembers,
} from "@/hooks/use-public-site";
import { TeamMemberGroup } from "@/lib/constants";
import {
  HOME_GIVE_BACK_FILTER,
  HOME_POSTS_FILTER,
} from "./home-lists";
import { MobileNav } from "./mobile-nav";

/**
 * Menu entries follow the CMS: a page's link only appears when that page
 * actually has content. These are cheap list queries and, where the params
 * match, the same cache entries the home sections use.
 */
type NavItem = { href: string; label: string };

const HOME_ITEM: NavItem = { href: "/", label: "Trang chủ" };
const PAGES: NavItem[] = [
  { href: "/story/", label: "Câu Chuyện S+" },
  { href: "/stores/", label: "Cửa Hàng" },
  { href: "/products/", label: "Sản Phẩm" },
  { href: "/news/", label: "Tin Tức - Sự Kiện" },
  { href: "/give-back/", label: "Cho Đi" },
  { href: "/jobs/", label: "Tuyển Dụng" },
];

/**
 * Links are full page loads, so the nav is rebuilt on every tab change. The
 * last resolved list is cached so the header paints at its final width right
 * away instead of growing item by item as the queries come back.
 */
const CACHE_KEY = "site-nav-items";
const noopSubscribe = () => () => {};
const readCache = () => {
  try {
    return localStorage.getItem(CACHE_KEY);
  } catch {
    return null;
  }
};

function useNavItems(): NavItem[] | null {
  const blocksQ = usePublicStoryBlocks();
  const coreQ = usePublicTeamMembers(TeamMemberGroup.CORE_TEAM);
  const advisoryQ = usePublicTeamMembers(TeamMemberGroup.ADVISORY_BOARD);
  const storesQ = usePublicStores(3);
  const productsQ = usePublicProducts({ limit: 1 });
  const newsQ = usePublicPosts(HOME_POSTS_FILTER);
  const giveBackQ = usePublicPosts(HOME_GIVE_BACK_FILTER);
  const jobsQ = usePublicJobs(3);

  const cached = useSyncExternalStore(noopSubscribe, readCache, () => null);

  const settled = ![
    blocksQ,
    coreQ,
    advisoryQ,
    storesQ,
    productsQ,
    newsQ,
    giveBackQ,
    jobsQ,
  ].some((q) => q.isPending);

  const show = [
    (blocksQ.data?.length ?? 0) +
      (coreQ.data?.length ?? 0) +
      (advisoryQ.data?.length ?? 0) >
      0,
    (storesQ.data?.total ?? 0) > 0,
    (productsQ.data?.total ?? 0) > 0,
    (newsQ.data?.total ?? 0) > 0,
    (giveBackQ.data?.total ?? 0) > 0,
    (jobsQ.data?.total ?? 0) > 0,
  ];
  const live = [HOME_ITEM, ...PAGES.filter((_, i) => show[i])];
  const liveKey = JSON.stringify(live);

  useEffect(() => {
    if (!settled) return;
    try {
      localStorage.setItem(CACHE_KEY, liveKey);
    } catch {
      /* storage unavailable — header just falls back to the placeholder */
    }
  }, [settled, liveKey]);

  if (settled) return live;
  if (cached) {
    try {
      return JSON.parse(cached) as NavItem[];
    } catch {
      /* corrupt cache — ignore */
    }
  }
  return null;
}

const LINK_CLASS =
  "relative text-sm font-medium whitespace-nowrap text-[#f3e9dc]/90 transition-colors after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-current after:transition-all hover:text-white hover:after:w-full";

export function DesktopNav() {
  const items = useNavItems();
  // No cache yet: reserve the full width with invisible links so nothing
  // shifts once the real list arrives.
  const pending = items === null;
  return (
    <nav
      className="hidden items-center gap-6 xl:flex"
      aria-hidden={pending || undefined}
    >
      {(items ?? [HOME_ITEM, ...PAGES]).map((item) => (
        <Link
          key={item.label}
          href={item.href}
          tabIndex={pending ? -1 : undefined}
          className={pending ? `${LINK_CLASS} invisible` : LINK_CLASS}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

export function LandingMobileNav() {
  return <MobileNav items={useNavItems() ?? [HOME_ITEM]} />;
}
