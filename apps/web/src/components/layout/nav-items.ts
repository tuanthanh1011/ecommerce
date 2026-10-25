import {
  LayoutDashboard,
  BookOpen,
  Coffee,
  Newspaper,
  Briefcase,
  Images,
  Users,
  Phone,
  ScrollText,
  House,
  type LucideIcon,
} from "lucide-react";
import type { Tone } from "@/lib/tones";
import { AdminRole } from "@/lib/constants";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  tone: Tone;
  /** One-line purpose, reused by page headers and the dashboard */
  description: string;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export const NAV_GROUPS: NavGroup[] = [
  {
    title: "Tổng quan",
    items: [
      {
        label: "Dashboard",
        href: "/admin/dashboard",
        icon: LayoutDashboard,
        tone: "amber",
        description: "Tổng quan hoạt động nội dung",
      },
    ],
  },
  {
    title: "Nội dung công khai",
    items: [
      {
        label: "Trang chủ",
        href: "/admin/dashboard/home",
        icon: House,
        tone: "rose",
        description: "Chỉnh nội dung từng phần của trang chủ website",
      },
      {
        label: "Câu chuyện S+",
        href: "/admin/dashboard/story",
        icon: BookOpen,
        tone: "orange",
        description: "Hướng đi, văn hoá và đội ngũ S+",
      },
      {
        label: "Sản phẩm",
        href: "/admin/dashboard/products",
        icon: Coffee,
        tone: "amber",
        description: "Thực đơn đồ uống và vật phẩm S+",
      },
      {
        label: "Tin tức",
        href: "/admin/dashboard/posts",
        icon: Newspaper,
        tone: "sky",
        description: "Thông báo, sản phẩm mới và bài viết",
      },
      {
        label: "Tuyển dụng",
        href: "/admin/dashboard/jobs",
        icon: Briefcase,
        tone: "violet",
        description: "Tin tuyển dụng đang mở và đã đóng",
      },
      {
        label: "Thông tin liên hệ",
        href: "/admin/dashboard/site-settings",
        icon: Phone,
        tone: "teal",
        description: "Số điện thoại, giờ mở cửa và mạng xã hội ở chân trang",
      },
      {
        label: "Thư viện ảnh",
        href: "/admin/dashboard/media",
        icon: Images,
        tone: "rose",
        description: "Kho hình ảnh dùng chung cho website",
      },
    ],
  },
  {
    title: "Nội bộ",
    items: [
      {
        label: "Trang Nội bộ",
        href: "/admin/dashboard/internal-pages",
        icon: ScrollText,
        tone: "rose",
        description: "Nội dung trang Thông Báo và Con người phù hợp trên website",
      },
    ],
  },
  {
    title: "Hệ thống",
    items: [
      {
        label: "Tài khoản Admin",
        href: "/admin/dashboard/admins",
        icon: Users,
        tone: "slate",
        description: "Quản lý quyền truy cập CMS",
      },
    ],
  },
];

export const NAV_ITEMS: NavItem[] = NAV_GROUPS.flatMap((g) => g.items);

export function getNavItem(href: string): NavItem {
  const item = NAV_ITEMS.find((i) => i.href === href);
  if (!item) throw new Error(`Unknown nav item: ${href}`);
  return item;
}

/** Longest-prefix match so /admin/dashboard/products/form resolves to Sản phẩm */
export function findNavItemForPath(pathname: string | null): NavItem | undefined {
  if (!pathname) return undefined;
  const path = pathname.replace(/\/$/, "") || "/";
  return [...NAV_ITEMS]
    .sort((a, b) => b.href.length - a.href.length)
    .find((i) => path === i.href || path.startsWith(`${i.href}/`));
}

/**
 * The CMS is for Admins only. Employees are read-only and work in the
 * website's "Nội bộ" area, so they get no CMS navigation at all.
 */
export function navGroupsForRole(role: AdminRole | undefined): NavGroup[] {
  if (!role || role === AdminRole.ADMIN) return NAV_GROUPS;
  return [];
}

export function isPathAllowedForRole(
  pathname: string | null,
  role: AdminRole | undefined,
): boolean {
  if (!pathname || !role) return true;
  const path = pathname.replace(/\/$/, "") || "/";
  const allowed = navGroupsForRole(role).flatMap((g) => g.items);
  return allowed.some((i) => path === i.href || path.startsWith(`${i.href}/`));
}

/** Where a role lands after login / when sent away from a page it can't open. */
export function homeHrefForRole(role: AdminRole | undefined): string {
  if (role === AdminRole.EMPLOYEE) return "/internal/notices/";
  return `${NAV_GROUPS[0].items[0].href}/`;
}
