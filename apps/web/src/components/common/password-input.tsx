"use client";

import { forwardRef, useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export const PasswordInput = forwardRef<
  HTMLInputElement,
  React.ComponentProps<typeof Input>
>(function PasswordInput({ className, ...props }, ref) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <Lock className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        ref={ref}
        type={show ? "text" : "password"}
        className={cn("pr-10 pl-9", className)}
        {...props}
      />
      <button
        type="button"
        onClick={() => setShow((v) => !v)}
        aria-label={show ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
        className="absolute top-1/2 right-1.5 flex size-7 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
      >
        {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
    </div>
  );
});

const LEVELS = [
  { label: "Rất yếu", bar: "bg-red-500", text: "text-red-600" },
  { label: "Yếu", bar: "bg-orange-500", text: "text-orange-600" },
  { label: "Trung bình", bar: "bg-amber-500", text: "text-amber-600" },
  { label: "Mạnh", bar: "bg-emerald-500", text: "text-emerald-600" },
  { label: "Rất mạnh", bar: "bg-emerald-600", text: "text-emerald-700" },
];

function score(pw: string): number {
  let s = 0;
  if (pw.length >= 8) s++;
  if (pw.length >= 12) s++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) s++;
  if (/\d/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return Math.min(4, Math.max(0, s - (pw.length < 6 ? 1 : 0)));
}

export function PasswordStrength({ value }: { value: string }) {
  if (!value) return null;
  const s = score(value);
  const level = LEVELS[s];
  return (
    <div className="space-y-1.5">
      <div className="flex gap-1">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className={cn(
              "h-1.5 flex-1 rounded-full transition-colors",
              i < Math.max(1, s) ? level.bar : "bg-muted",
            )}
          />
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        Độ mạnh: <span className={cn("font-medium", level.text)}>{level.label}</span>
        {s < 3 && " · Nên dùng ≥ 8 ký tự, có chữ hoa, số và ký tự đặc biệt."}
      </p>
    </div>
  );
}
