import type { Metadata } from "next";
import { InternalNoticesPage } from "@/components/site/internal-pages";

// Staff area: keep it out of search results.
export const metadata: Metadata = {
  title: "Thông Báo | Nội bộ S+ Coffee",
  robots: { index: false, follow: false },
};

export default function NoticesPage() {
  return <InternalNoticesPage />;
}
