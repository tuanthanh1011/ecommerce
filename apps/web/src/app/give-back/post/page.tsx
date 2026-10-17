import type { Metadata } from "next";
import { PublicShell } from "@/components/site/public-shell";
import { PostDetailContent } from "@/components/site/posts-page";

export const metadata: Metadata = { title: "Cho Đi | S+ Coffee" };

export default function GiveBackPostPage() {
  return (
    <PublicShell>
      <PostDetailContent kind="give-back" />
    </PublicShell>
  );
}
