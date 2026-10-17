"use client";

import { Menu } from "lucide-react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";

const MAROON = "#960000";

export function MobileNav({
  items,
}: {
  items: { href: string; label: string }[];
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
                <a
                  href={item.href}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-[#f3e9dc]/90 transition-colors hover:bg-white/10 hover:text-white"
                />
              }
            >
              {item.label}
            </SheetClose>
          ))}
          <SheetClose
            render={
              <a
                href="/admin/login/"
                className="mt-3 rounded-full border border-[#f3e9dc]/40 px-3 py-2.5 text-center text-sm font-medium text-[#f3e9dc]"
              />
            }
          >
            Nội bộ · Đăng Nhập
          </SheetClose>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
