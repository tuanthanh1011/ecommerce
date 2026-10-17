import type { Metadata } from "next";
import { PublicShell } from "@/components/site/public-shell";
import { StoryPageContent } from "@/components/site/story-page";

export const metadata: Metadata = {
  title: "Câu Chuyện S+ | S+ Coffee",
  description: "Hướng đi, văn hoá và đội ngũ của S+ Coffee.",
};

export default function StoryPage() {
  return (
    <PublicShell>
      <StoryPageContent />
    </PublicShell>
  );
}
