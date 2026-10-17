import type { Metadata } from "next";
import { PostDetailContent } from "@/components/site/posts-page";

export const metadata: Metadata = { title: "Cho Đi | S+ Coffee" };

export default function GiveBackPostPage() {
  return <PostDetailContent kind="give-back" />;
}
