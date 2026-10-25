import type { Metadata } from "next";
import { InternalPeoplePage } from "@/components/site/internal-pages";

// Staff area: keep it out of search results.
export const metadata: Metadata = {
  title: "Con người phù hợp | Nội bộ S+ Coffee",
  robots: { index: false, follow: false },
};

export default function PeoplePage() {
  return <InternalPeoplePage />;
}
