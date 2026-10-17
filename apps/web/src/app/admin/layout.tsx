import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "S+ CMS",
  description: "CMS nội bộ quản lý nội dung website S+",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
