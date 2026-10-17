import type { Metadata } from "next";
import { PostDetailContent } from "@/components/site/posts-page";

export const metadata: Metadata = { title: "Tin Tức | S+ Coffee" };

export default function NewsPostPage() {
  return <PostDetailContent kind="news" />;
}
