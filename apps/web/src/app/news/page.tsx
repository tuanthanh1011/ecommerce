import type { Metadata } from "next";
import { PublicShell } from "@/components/site/public-shell";
import { PostsListContent } from "@/components/site/posts-page";

export const metadata: Metadata = {
  title: "Tin Tức - Sự Kiện | S+ Coffee",
  description: "Thông báo, sản phẩm mới và những câu chuyện văn hoá từ S+ Coffee.",
};

export default function NewsPage() {
  return (
    <PublicShell>
      <PostsListContent kind="news" />
    </PublicShell>
  );
}
