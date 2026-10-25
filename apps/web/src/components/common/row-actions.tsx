"use client";

import Link from "next/link";
import { Pencil } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const EDIT_CLASS =
  "text-muted-foreground hover:bg-amber-50 hover:text-amber-700 dark:hover:bg-amber-500/10 dark:hover:text-amber-300";

export function RowActions({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-end gap-0.5 opacity-70 transition-opacity group-hover/row:opacity-100">
      {children}
    </div>
  );
}

export function EditAction({
  href,
  onClick,
  label = "Sửa",
}: {
  href?: string;
  onClick?: () => void;
  label?: string;
}) {
  if (href) {
    return (
      <Link
        href={href}
        title={label}
        aria-label={label}
        className={cn(buttonVariants({ variant: "ghost", size: "icon-sm" }), EDIT_CLASS)}
      >
        <Pencil />
      </Link>
    );
  }
  return (
    <Button
      variant="ghost"
      size="icon-sm"
      title={label}
      aria-label={label}
      className={EDIT_CLASS}
      onClick={onClick}
    >
      <Pencil />
    </Button>
  );
}
