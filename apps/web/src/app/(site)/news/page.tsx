import type { Metadata } from "next";
import { PostsListContent } from "@/components/site/posts-page";

export const metadata: Metadata = {
  title: "Tin Tức - Sự Kiện | S+ Coffee",
  description:
    "Thông báo, sản phẩm mới và những câu chuyện văn hoá từ S+ Coffee.",
};

export default function NewsPage() {
  return <PostsListContent />;
}
