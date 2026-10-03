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
  type LucideIcon,
} from "lucide-react";
import type { Tone } from "@/lib/tones";

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
        label: "Câu chuyện S.t",
        href: "/admin/dashboard/story",
        icon: BookOpen,
        tone: "orange",
        description: "Hướng đi, văn hoá và đội ngũ S.t",
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
        description: "Thực đơn đồ uống và vật phẩm S.t",
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
