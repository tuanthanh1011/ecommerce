import type { Metadata } from "next";
import { InternalIndexRedirect } from "@/components/site/internal-pages";

// Staff area: keep it out of search results.
export const metadata: Metadata = {
  title: "Nội bộ | Nội bộ S+ Coffee",
  robots: { index: false, follow: false },
};

export default function IndexPage() {
  return <InternalIndexRedirect />;
}
