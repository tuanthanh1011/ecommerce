import Link from "next/link";
import { BrandLogo } from "@/components/common/brand-logo";
import { AccountButton } from "./account";
import { DesktopNav, LandingMobileNav } from "./landing-nav";
import { MAROON } from "./theme";

/** Sticky top bar shared by the home page and every public page. */
export function SiteHeader() {
  return (
    <header
      className="sticky top-0 z-40 text-[#f3e9dc] shadow-sm"
      style={{ backgroundColor: MAROON }}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between sm:h-[72px] px-4 sm:px-6 lg:px-8">
        <Link href="/">
          <BrandLogo
            className="text-[22px] sm:text-3xl"
            subtitle="Nơi ấm áp được trao đi - Nơi chúng ta thuộc về"
            subtitleClassName="hidden text-[#f3e9dc] sm:block sm:text-xs"
          />
        </Link>
        <DesktopNav />
        <div className="flex items-center gap-2">
          <AccountButton />
          <LandingMobileNav />
        </div>
      </div>
    </header>
  );
}
