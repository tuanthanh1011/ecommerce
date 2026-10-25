"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useSyncExternalStore } from "react";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  usePublicJobs,
  usePublicPosts,
  usePublicProducts,
  usePublicStoryBlocks,
  usePublicTeamMembers,
} from "@/hooks/use-public-site";
import { TeamMemberGroup } from "@/lib/constants";
import { MENU_CONTENT, MENU_ITEM } from "./theme";
import { INTERNAL_LINKS } from "./internal-shell";
import { MobileNav } from "./mobile-nav";

type NavItem = { href: string; label: string };

const HOME_ITEM: NavItem = { href: "/", label: "Trang chủ" };
/** Appear only while the CMS has content for them. */
const CONTENT_PAGES: NavItem[] = [
  { href: "/story/", label: "Câu Chuyện S+" },
  { href: "/products/", label: "Sản Phẩm" },
  { href: "/news/", label: "Tin Tức - Sự Kiện" },
  { href: "/jobs/", label: "Tuyển Dụng" },
];
const ALL_ITEMS = [HOME_ITEM, ...CONTENT_PAGES];

/**
 * Links are full page loads, so the nav is rebuilt on every tab change. The
 * last resolved list is cached so the header paints at its final width right
 * away instead of growing item by item as the queries come back.
 */
const CACHE_KEY = "site-nav-items-v3";
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
  const productsQ = usePublicProducts({ limit: 1 });
  const newsQ = usePublicPosts({ limit: 1 });
  const jobsQ = usePublicJobs(1);

  const cached = useSyncExternalStore(noopSubscribe, readCache, () => null);

  const settled = ![blocksQ, coreQ, advisoryQ, productsQ, newsQ, jobsQ].some((q) => q.isPending);

  const show = [
    (blocksQ.data?.length ?? 0) + (coreQ.data?.length ?? 0) + (advisoryQ.data?.length ?? 0) > 0,
    (productsQ.data?.total ?? 0) > 0,
    (newsQ.data?.total ?? 0) > 0,
    (jobsQ.data?.total ?? 0) > 0,
  ];
  const live = [HOME_ITEM, ...CONTENT_PAGES.filter((_, i) => show[i])];
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
  "relative text-sm font-medium tracking-wide whitespace-nowrap uppercase text-[#f3e9dc]/90 transition-colors after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-current after:transition-all hover:text-white hover:after:w-full";

/** "Nội bộ" — staff pages; guests are asked to sign in when they open one. */
function InternalDropdown({ hidden }: { hidden?: boolean }) {
  const router = useRouter();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        openOnHover
        delay={0}
        tabIndex={hidden ? -1 : undefined}
        className={`${LINK_CLASS} inline-flex items-center gap-1 outline-none${hidden ? " invisible" : ""}`}
      >
        Nội bộ
        <ChevronDown className="size-3.5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" sideOffset={10} className={`${MENU_CONTENT} min-w-52 p-1.5`}>
        {INTERNAL_LINKS.map((link) => (
          <DropdownMenuItem
            key={link.href}
            className={`${MENU_ITEM} px-3 py-2 text-sm tracking-wide uppercase`}
            onClick={() => router.push(link.href)}
          >
            {link.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

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
      {(items ?? ALL_ITEMS).map((item) => (
        <Link
          key={item.label}
          href={item.href}
          tabIndex={pending ? -1 : undefined}
          className={pending ? `${LINK_CLASS} invisible` : LINK_CLASS}
        >
          {item.label}
        </Link>
      ))}
      <InternalDropdown hidden={pending} />
    </nav>
  );
}

export function LandingMobileNav() {
  return <MobileNav items={useNavItems() ?? [HOME_ITEM]} internalLinks={INTERNAL_LINKS} />;
}
