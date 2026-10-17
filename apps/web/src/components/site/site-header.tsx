import Link from "next/link";
import { BrandLogo } from "@/components/common/brand-logo";
import { DesktopNav, LandingMobileNav } from "./landing-nav";
import { MAROON } from "./theme";

/** Sticky top bar shared by the home page and every public page. */
export function SiteHeader() {
  return (
    <header
      className="sticky top-0 z-40 text-[#f3e9dc] shadow-sm"
      style={{ backgroundColor: MAROON }}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/">
          <BrandLogo
            subtitle="Nơi ấm áp được trao đi - Nơi chúng ta thuộc về"
            subtitleClassName="hidden text-[#f3e9dc] sm:block"
          />
        </Link>
        <DesktopNav />
        <div className="flex items-center gap-2">
          <Link
            href="/admin/login/"
            className="hidden h-9 items-center rounded-full whitespace-nowrap border border-[#f3e9dc]/40 px-4 text-xs font-medium text-[#f3e9dc] transition-colors hover:bg-[#f3e9dc]/10 sm:inline-flex"
          >
            Đăng Nhập
          </Link>
          <LandingMobileNav />
        </div>
      </div>
    </header>
  );
}
