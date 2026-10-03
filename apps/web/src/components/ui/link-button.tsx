import Link from "next/link";
import type { ComponentProps } from "react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface LinkButtonProps extends ComponentProps<typeof Link> {
  variant?: Parameters<typeof buttonVariants>[0] extends infer P
    ? P extends { variant?: infer V }
      ? V
      : never
    : never;
  size?: Parameters<typeof buttonVariants>[0] extends infer P
    ? P extends { size?: infer S }
      ? S
      : never
    : never;
  className?: string;
}

export function LinkButton({
  variant,
  size,
  className,
  ...props
}: LinkButtonProps) {
  return (
    <Link
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}
