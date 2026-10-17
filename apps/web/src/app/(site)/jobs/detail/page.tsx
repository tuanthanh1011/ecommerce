import type { Metadata } from "next";
import { JobDetailContent } from "@/components/site/jobs-page";

export const metadata: Metadata = {
  title: "Tuyển Dụng | S+ Coffee",
};

export default function JobDetailPage() {
  return <JobDetailContent />;
}
