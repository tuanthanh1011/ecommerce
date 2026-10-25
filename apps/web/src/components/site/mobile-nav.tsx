"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { AdminRole } from "@/lib/constants";
import { useLogout, useSiteAccount } from "./account";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";

const MAROON = "#960000";

/** Sign-in / signed-in block at the bottom of the phone menu. */
function MobileAccount() {
  const account = useSiteAccount();
  const logout = useLogout();
  const row =
    "rounded-lg px-3 py-2.5 text-sm font-medium text-[#f3e9dc]/90 transition-colors hover:bg-white/10 hover:text-white";

  if (account.status === "loading") return null;
  if (account.status === "guest") {
    return (
      <SheetClose
        render={
          <Link
            href="/admin/login/"
            className="font-ui mt-3 rounded-full border border-[#f3e9dc]/40 px-3 py-2.5 text-center text-sm font-medium text-[#f3e9dc] uppercase"
          />
        }
      >
        Đăng Nhập
      </SheetClose>
    );
  }
  const { user } = account;
  return (
    <div className="mt-3 border-t border-white/15 pt-3">
      <p className="px-3 pb-1 text-xs text-[#f3e9dc]/60">{user.fullName}</p>
      <SheetClose render={<Link href="/internal/notices/" className={row} />}>Nội bộ</SheetClose>
      {user.role === AdminRole.ADMIN && (
        <SheetClose render={<Link href="/admin/dashboard/" className={row} />}>
          Quản trị CMS
        </SheetClose>
      )}
      <SheetClose
        render={<button type="button" onClick={logout} className={`${row} w-full text-left`} />}
      >
        Đăng xuất
      </SheetClose>
    </div>
  );
}

export function MobileNav({
  items,
  internalLinks,
}: {
  items: { href: string; label: string }[];
  /** Pages of the staff "Nội bộ" menu, listed under their own heading. */
  internalLinks: { href: string; label: string }[];
}) {
  return (
    <Sheet>
      <SheetTrigger
        render={
          <button
            type="button"
            aria-label="Mở menu"
            className="flex size-9 items-center justify-center rounded-full text-[#f3e9dc] transition-colors hover:bg-white/10 xl:hidden"
          />
        }
      >
        <Menu className="size-5" />
      </SheetTrigger>
      <SheetContent
        side="right"
        className="p-0 [&_[data-slot=sheet-close]]:text-[#f3e9dc] [&_[data-slot=sheet-close]]:hover:bg-white/10" style={{ backgroundColor: MAROON }}>
        <SheetHeader className="border-b border-white/15">
          <SheetTitle className="text-[#f3e9dc]">S+ Coffee</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-1 p-4">
          {items.map((item) => (
            <SheetClose
              key={item.label}
              render={
                <Link
                  href={item.href}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-[#f3e9dc]/90 uppercase transition-colors hover:bg-white/10 hover:text-white"
                />
              }
            >
              {item.label}
            </SheetClose>
          ))}
          <p className="font-ui mt-3 px-3 text-xs tracking-wider text-[#f3e9dc]/60 uppercase">
            Nội bộ
          </p>
          {internalLinks.map((link) => (
            <SheetClose
              key={link.href}
              render={
                <Link
                  href={link.href}
                  className="rounded-lg px-3 py-2.5 pl-6 text-sm font-medium text-[#f3e9dc]/90 transition-colors hover:bg-white/10 hover:text-white"
                />
              }
            >
              {link.label}
            </SheetClose>
          ))}
          <MobileAccount />
        </nav>
      </SheetContent>
    </Sheet>
  );
}
