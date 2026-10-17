import type { Metadata } from "next";
import { HomeContent } from "@/components/site/home-content";

export const metadata: Metadata = {
  title: "S+ Coffee",
  description: "S+ Coffee — nơi ấm áp được trao đi, nơi chúng ta thuộc về.",
};

export default function LandingPage() {
  return <HomeContent />;
}
