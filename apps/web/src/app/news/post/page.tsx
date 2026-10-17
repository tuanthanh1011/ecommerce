import type { Metadata } from "next";
import { PublicShell } from "@/components/site/public-shell";
import { PostDetailContent } from "@/components/site/posts-page";

export const metadata: Metadata = { title: "Tin Tức | S+ Coffee" };

export default function NewsPostPage() {
  return (
    <PublicShell>
      <PostDetailContent kind="news" />
    </PublicShell>
  );
}
