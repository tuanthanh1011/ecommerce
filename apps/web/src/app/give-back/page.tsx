import type { Metadata } from "next";
import { PublicShell } from "@/components/site/public-shell";
import { PostsListContent } from "@/components/site/posts-page";

export const metadata: Metadata = {
  title: "Cho Đi | S+ Coffee",
  description: "Hoạt động thiện nguyện và lời tri ân của S+ Coffee.",
};

export default function GiveBackPage() {
  return (
    <PublicShell>
      <PostsListContent kind="give-back" />
    </PublicShell>
  );
}
