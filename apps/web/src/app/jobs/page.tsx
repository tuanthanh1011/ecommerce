import type { Metadata } from "next";
import { PublicShell } from "@/components/site/public-shell";
import { JobsListContent } from "@/components/site/jobs-page";

export const metadata: Metadata = {
  title: "Tuyển Dụng | S+ Coffee",
  description: "Các vị trí đang tuyển tại S+ Coffee.",
};

export default function JobsPage() {
  return (
    <PublicShell>
      <JobsListContent />
    </PublicShell>
  );
}
