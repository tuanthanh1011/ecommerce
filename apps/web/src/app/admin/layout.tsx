import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "S.t CMS",
  description: "CMS nội bộ quản lý nội dung website S.t",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
