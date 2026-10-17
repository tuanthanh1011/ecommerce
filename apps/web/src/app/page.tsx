import type { Metadata } from "next";
import { HomeContent } from "@/components/site/home-content";
import { PublicShell } from "@/components/site/public-shell";

export const metadata: Metadata = {
  title: "S+ Coffee",
  description: "S+ Coffee — nơi ấm áp được trao đi, nơi chúng ta thuộc về.",
};

export default function LandingPage() {
  return (
    <PublicShell>
      <HomeContent />
    </PublicShell>
  );
}
