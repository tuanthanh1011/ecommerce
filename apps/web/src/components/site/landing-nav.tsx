"use client";

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
function useNavItems() {
  const blocks = usePublicStoryBlocks().data?.length ?? 0;
  const core = usePublicTeamMembers(TeamMemberGroup.CORE_TEAM).data?.length ?? 0;
  const advisory = usePublicTeamMembers(TeamMemberGroup.ADVISORY_BOARD).data?.length ?? 0;
  const stores = usePublicStores(3).data?.total ?? 0;
  const products = usePublicProducts({ limit: 1 }).data?.total ?? 0;
  const news = usePublicPosts(HOME_POSTS_FILTER).data?.total ?? 0;
  const giveBack = usePublicPosts(HOME_GIVE_BACK_FILTER).data?.total ?? 0;
  const jobs = usePublicJobs(3).data?.total ?? 0;

  const pages = [
    { show: blocks + core + advisory > 0, href: "/story/", label: "Câu Chuyện S+" },
    { show: stores > 0, href: "/stores/", label: "Cửa Hàng" },
    { show: products > 0, href: "/products/", label: "Sản Phẩm" },
    { show: news > 0, href: "/news/", label: "Tin Tức - Sự Kiện" },
    { show: giveBack > 0, href: "/give-back/", label: "Cho Đi" },
    { show: jobs > 0, href: "/jobs/", label: "Tuyển Dụng" },
  ];
  return [
    { href: "/", label: "Trang chủ" },
    ...pages.filter((p) => p.show).map(({ href, label }) => ({ href, label })),
  ];
}

export function DesktopNav() {
  const items = useNavItems();
  return (
    <nav className="hidden items-center gap-6 xl:flex">
      {items.map((item) => (
        <a
          key={item.label}
          href={item.href}
          className="relative text-sm font-medium whitespace-nowrap text-[#f3e9dc]/90 transition-colors after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-current after:transition-all hover:text-white hover:after:w-full"
        >
          {item.label}
        </a>
      ))}
    </nav>
  );
}

export function LandingMobileNav() {
  return <MobileNav items={useNavItems()} />;
}
