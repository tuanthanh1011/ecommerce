"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  ArrowRight,
  CircleAlert,
  Coffee,
  Eye,
  EyeOff,
  FileText,
  Loader2,
  Lock,
  Mail,
  Newspaper,
  Store,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/common/form";
import { apiClient, ApiError } from "@/lib/api-client";
import { setTokens } from "@/lib/auth";

const loginSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự"),
});

type LoginValues = z.infer<typeof loginSchema>;

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (values: LoginValues) => {
    setSubmitError(null);
    try {
      const data = await apiClient.post<LoginResponse>(
        "/auth/login",
        values,
        { skipAuth: true },
      );
      setTokens(data.accessToken, data.refreshToken);
      toast.success("Đăng nhập thành công");
      router.replace("/admin/dashboard/");
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "Đăng nhập thất bại";
      setSubmitError(message);
    }
  };

  return (
    <div className="grid min-h-screen bg-background lg:grid-cols-[1.1fr_1fr]">
      {/* Brand panel */}
      <aside className="relative hidden overflow-hidden bg-[#1A1411] text-white lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_80%_10%,rgb(245_158_11/0.35),transparent_60%),radial-gradient(ellipse_60%_60%_at_10%_100%,rgb(234_88_12/0.25),transparent_60%)]" />
        <div className="bg-grain pointer-events-none absolute inset-0 text-white opacity-30" />
        <div className="pointer-events-none absolute -right-32 -bottom-32 size-[520px] rounded-full border-[48px] border-amber-400/10" />
        <div className="pointer-events-none absolute -right-6 -bottom-6 size-[260px] rounded-full border-[24px] border-amber-300/10" />

        <div className="relative flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-linear-to-br from-amber-400 to-orange-600 shadow-lg shadow-amber-900/40 ring-1 ring-white/20">
            <Coffee className="size-5" />
          </span>
          <span className="text-lg font-semibold tracking-tight">S.t CMS</span>
        </div>

        <div className="relative max-w-md">
          <p className="mb-4 text-xs font-semibold tracking-[0.2em] text-amber-300/80 uppercase">
            Content Studio
          </p>
          <h1 className="text-4xl leading-[1.15] font-semibold tracking-tight">
            Mỗi câu chuyện S.t bắt đầu từ một tách cà phê.
          </h1>
          <p className="mt-4 text-[15px] leading-relaxed text-stone-300">
            Quản lý cửa hàng, thực đơn, tin tức và tài liệu nội bộ — tất cả ở một nơi.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-3">
            {[
              { icon: Store, label: "Cửa hàng" },
              { icon: Newspaper, label: "Tin tức" },
              { icon: FileText, label: "Tài liệu" },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur"
              >
                <Icon className="size-4 text-amber-300" />
                <p className="mt-2 text-xs font-medium text-stone-200">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-xs text-stone-500">
          © {new Date().getFullYear()} S.t Coffee · Hệ thống nội bộ
        </p>
      </aside>

      {/* Form */}
      <main className="flex items-center justify-center px-4 py-12 sm:px-8">
        <div className="w-full max-w-[380px]">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <span className="flex size-10 items-center justify-center rounded-xl bg-linear-to-br from-amber-400 to-orange-600 text-white shadow-lg shadow-amber-900/20">
              <Coffee className="size-5" />
            </span>
            <span className="text-lg font-semibold tracking-tight">S.t CMS</span>
          </div>

          <h2 className="text-2xl font-semibold tracking-tight">Chào mừng trở lại</h2>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Đăng nhập bằng tài khoản quản trị để tiếp tục.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
            <Field label="Email" htmlFor="email" error={errors.email?.message}>
              <div className="relative">
                <Mail className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="ten@st.vn"
                  className="h-11 pl-10"
                  aria-invalid={!!errors.email}
                  {...register("email")}
                />
              </div>
            </Field>
            <Field label="Mật khẩu" htmlFor="password" error={errors.password?.message}>
              <div className="relative">
                <Lock className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="h-11 pr-11 pl-10"
                  aria-invalid={!!errors.password}
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  className="absolute top-1/2 right-2 flex size-8 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </Field>

            {submitError && (
              <div className="flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
                <CircleAlert className="mt-0.5 size-4 shrink-0" />
                {submitError}
              </div>
            )}

            <Button type="submit" size="lg" className="h-11 w-full text-[15px]" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" />
                  Đang đăng nhập...
                </>
              ) : (
                <>
                  Đăng nhập
                  <ArrowRight />
                </>
              )}
            </Button>
          </form>

          <p className="mt-8 text-center text-xs text-muted-foreground">
            Quên mật khẩu? Liên hệ quản trị viên hệ thống để được cấp lại.
          </p>
        </div>
      </main>
    </div>
  );
}
