import {
  LayoutDashboard,
  BookOpen,
  Store,
  Coffee,
  Newspaper,
  Briefcase,
  Images,
  FileText,
  Megaphone,
  CalendarDays,
  Users,
  Phone,
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
  /** Omit for both roles. Employee is scoped to "Nội bộ" content only. */
  roles?: AdminRole[];
}

export const NAV_GROUPS: NavGroup[] = [
  {
    title: "Tổng quan",
    // The dashboard is Admin-only: Employees are read-only and start in "Nội bộ".
    roles: [AdminRole.ADMIN],
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
    roles: [AdminRole.ADMIN],
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
        label: "Cửa hàng",
        href: "/admin/dashboard/stores",
        icon: Store,
        tone: "emerald",
        description: "Hệ thống cửa hàng hiển thị trên website",
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
        label: "Tài liệu & vận hành",
        href: "/admin/dashboard/internal/documents",
        icon: FileText,
        tone: "indigo",
        description: "Quy trình, công thức và tiêu chuẩn chất lượng",
      },
      {
        label: "Thông báo nội bộ",
        href: "/admin/dashboard/internal/announcements",
        icon: Megaphone,
        tone: "pink",
        description: "Thông tin gửi tới toàn bộ nhân sự",
      },
      {
        label: "Lịch trình",
        href: "/admin/dashboard/internal/schedule",
        icon: CalendarDays,
        tone: "teal",
        description: "Sự kiện, họp và lịch làm việc chung",
      },
    ],
  },
  {
    title: "Hệ thống",
    roles: [AdminRole.ADMIN],
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

export function navGroupsForRole(role: AdminRole | undefined): NavGroup[] {
  if (!role) return NAV_GROUPS;
  return NAV_GROUPS.filter((g) => !g.roles || g.roles.includes(role));
}

/** Longest-prefix match against the groups visible to this role. */
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
  const first = navGroupsForRole(role)[0]?.items[0];
  return first ? `${first.href}/` : "/admin/login/";
}
