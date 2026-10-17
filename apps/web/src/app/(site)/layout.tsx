import { PublicShell } from "@/components/site/public-shell";

/** Header + footer live here so they persist across public page navigations. */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return <PublicShell>{children}</PublicShell>;
}
