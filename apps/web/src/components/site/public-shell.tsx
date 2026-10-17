import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";

/** Header + footer chrome shared by the home page and every public page. */
export function PublicShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      data-public-site
      className="flex min-h-screen flex-col bg-[#f3e9dc] text-stone-900"
    >
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
