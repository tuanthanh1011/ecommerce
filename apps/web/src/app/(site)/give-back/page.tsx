import type { Metadata } from "next";
import { PostsListContent } from "@/components/site/posts-page";

export const metadata: Metadata = {
  title: "Cho Đi | S+ Coffee",
  description: "Hoạt động thiện nguyện và lời tri ân của S+ Coffee.",
};

export default function GiveBackPage() {
  return <PostsListContent kind="give-back" />;
}
