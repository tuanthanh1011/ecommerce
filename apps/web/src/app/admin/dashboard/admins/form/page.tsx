"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  Check,
  KeyRound,
  Loader2,
  Lock,
  Mail,
  Save,
  ShieldAlert,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { LinkButton } from "@/components/ui/link-button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/common/page-header";
import { StatusBadge } from "@/components/common/status-badge";
import { Field, FormLayout, FormSection, FormSkeleton } from "@/components/common/form";
import { FormActionBar } from "@/components/common/form-action-bar";
import { PreviewFrame, PreviewText } from "@/components/common/preview-card";
import { PasswordInput, PasswordStrength } from "@/components/common/password-input";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import {
  useAdminsQuery,
  useCreateAdmin,
  useDeactivateAdmin,
  useUpdateAdminPassword,
  type AdminAccount,
} from "@/hooks/use-admins";
import { initials } from "@/lib/format";
import { cn } from "@/lib/utils";

const passwordFields = {
  password: z.string().min(6, "Tối thiểu 6 ký tự"),
  confirm: z.string(),
};
const matches = (v: { password: string; confirm: string }) => v.password === v.confirm;
const mismatch = { path: ["confirm"], message: "Mật khẩu nhập lại không khớp" };

const createSchema = z
  .object({
    fullName: z.string().min(1, "Bắt buộc"),
    email: z.string().email("Email không hợp lệ"),
    ...passwordFields,
  })
  .refine(matches, mismatch);
type CreateValues = z.infer<typeof createSchema>;

const passwordSchema = z.object(passwordFields).refine(matches, mismatch);
type PasswordValues = z.infer<typeof passwordSchema>;

const FORM_ID = "admin-form";
const BACK = "/admin/dashboard/admins";

const PERMISSIONS = [
  "Quản lý toàn bộ nội dung công khai",
  "Quản lý tài liệu & thông báo nội bộ",
  "Tạo và khoá tài khoản admin khác",
];

function AccountPreview({
  name,
  email,
  active = true,
}: {
  name?: string;
  email?: string;
  active?: boolean;
}) {
  return (
    <PreviewFrame label="Tài khoản sẽ hiển thị">
      <div className="h-14 bg-linear-to-r from-stone-800 via-stone-700 to-amber-700" />
      <div className="-mt-8 px-4 pb-4">
        <span
          className={cn(
            "flex size-14 items-center justify-center rounded-2xl text-lg font-semibold text-white shadow-md ring-4 ring-card",
            active ? "bg-linear-to-br from-amber-400 to-orange-600" : "bg-stone-400",
          )}
        >
          {name ? initials(name) : "?"}
        </span>
        <p className="mt-3 font-semibold tracking-tight">
          <PreviewText value={name} placeholder="Họ tên" />
        </p>
        <p className="truncate text-xs text-muted-foreground">
          <PreviewText value={email} placeholder="email@st.vn" />
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          <span className="inline-flex items-center gap-1 rounded-md bg-amber-100 px-2 py-0.5 text-[11px] font-medium text-amber-800 dark:bg-amber-500/15 dark:text-amber-200">
            <ShieldCheck className="size-3" />
            Quản trị viên
          </span>
          <StatusBadge tone={active ? "success" : "danger"} className="h-5 text-[11px]">
            {active ? "Hoạt động" : "Đã khoá"}
          </StatusBadge>
        </div>
      </div>
    </PreviewFrame>
  );
}

function PermissionsCard() {
  return (
    <FormSection icon={ShieldCheck} tone="amber" title="Quyền truy cập">
      <ul className="space-y-2.5">
        {PERMISSIONS.map((p) => (
          <li key={p} className="flex items-start gap-2 text-[13px]">
            <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
              <Check className="size-3" strokeWidth={3} />
            </span>
            {p}
          </li>
        ))}
      </ul>
    </FormSection>
  );
}

function SaveActions({ submitting, label }: { submitting: boolean; label: string }) {
  return (
    <>
      <LinkButton href={BACK} variant="outline">
        Huỷ
      </LinkButton>
      <Button type="submit" form={FORM_ID} disabled={submitting}>
        {submitting ? <Loader2 className="animate-spin" /> : <Save />}
        {submitting ? "Đang lưu..." : label}
      </Button>
    </>
  );
}

function CreateAdminForm() {
  const router = useRouter();
  const createAdmin = useCreateAdmin();
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<CreateValues>({
    resolver: zodResolver(createSchema),
    defaultValues: { fullName: "", email: "", password: "", confirm: "" },
  });
  const [fullName, email, password] = watch(["fullName", "email", "password"]);

  const onSubmit = async (values: CreateValues) => {
    try {
      await createAdmin.mutateAsync({
        fullName: values.fullName,
        email: values.email,
        password: values.password,
      });
      toast.success("Đã tạo tài khoản admin");
      router.replace(`${BACK}/`);
    } catch {
      toast.error("Tạo thất bại — email có thể đã tồn tại");
    }
  };

  return (
    <div>
      <PageHeader
        module="/admin/dashboard/admins"
        backHref={BACK}
        title="Thêm tài khoản admin"
        description="Cấp quyền truy cập CMS cho thành viên mới"
        actions={<SaveActions submitting={isSubmitting} label="Tạo tài khoản" />}
      />
      <form id={FORM_ID} onSubmit={handleSubmit(onSubmit)}>
        <FormLayout
          main={
            <>
              <FormSection icon={UserRound} tone="slate" title="Thông tin tài khoản" description="Email dùng để đăng nhập, không thể thay đổi sau khi tạo.">
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Họ tên" htmlFor="fullName" required error={errors.fullName?.message}>
                    <Input id="fullName" placeholder="Nguyễn Văn A" {...register("fullName")} />
                  </Field>
                  <Field label="Email" htmlFor="email" required error={errors.email?.message}>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input id="email" type="email" className="pl-9" placeholder="ten@st.vn" {...register("email")} />
                    </div>
                  </Field>
                </div>
              </FormSection>
              <FormSection icon={KeyRound} tone="amber" title="Mật khẩu đăng nhập" description="Gửi mật khẩu cho người dùng qua kênh riêng tư.">
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Mật khẩu" htmlFor="password" required error={errors.password?.message}>
                    <PasswordInput id="password" autoComplete="new-password" {...register("password")} />
                  </Field>
                  <Field label="Nhập lại mật khẩu" htmlFor="confirm" required error={errors.confirm?.message}>
                    <PasswordInput id="confirm" autoComplete="new-password" {...register("confirm")} />
                  </Field>
                </div>
                <PasswordStrength value={password} />
              </FormSection>
            </>
          }
          side={
            <>
              <AccountPreview name={fullName} email={email} />
              <PermissionsCard />
            </>
          }
        />
      </form>
      <FormActionBar
        formId={FORM_ID}
        dirty={isDirty}
        submitting={isSubmitting}
        onDiscard={() => reset()}
        submitLabel="Tạo tài khoản"
      />
    </div>
  );
}

function EditAdminForm({ admin }: { admin: AdminAccount }) {
  const router = useRouter();
  const updatePassword = useUpdateAdminPassword(admin.id);
  const deactivate = useDeactivateAdmin();
  const [confirmLock, setConfirmLock] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<PasswordValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { password: "", confirm: "" },
  });
  const password = watch("password");

  const onSubmit = async (values: PasswordValues) => {
    try {
      await updatePassword.mutateAsync(values.password);
      toast.success("Đã đổi mật khẩu");
      reset();
    } catch {
      toast.error("Đổi mật khẩu thất bại");
    }
  };

  return (
    <div>
      <PageHeader
        module="/admin/dashboard/admins"
        backHref={BACK}
        title={admin.fullName}
        description={admin.email}
        meta={
          <StatusBadge tone={admin.isActive ? "success" : "danger"}>
            {admin.isActive ? "Hoạt động" : "Đã khoá"}
          </StatusBadge>
        }
        actions={<SaveActions submitting={isSubmitting} label="Lưu mật khẩu" />}
      />
      <form id={FORM_ID} onSubmit={handleSubmit(onSubmit)}>
        <FormLayout
          main={
            <>
              <FormSection icon={UserRound} tone="slate" title="Thông tin tài khoản" description="Họ tên và email không thể chỉnh sửa tại đây.">
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Họ tên">
                    <Input value={admin.fullName} disabled readOnly />
                  </Field>
                  <Field label="Email">
                    <Input value={admin.email} disabled readOnly />
                  </Field>
                </div>
              </FormSection>
              <FormSection icon={KeyRound} tone="amber" title="Đổi mật khẩu" description="Mật khẩu mới có hiệu lực ngay ở lần đăng nhập tiếp theo.">
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Mật khẩu mới" htmlFor="password" required error={errors.password?.message}>
                    <PasswordInput id="password" autoComplete="new-password" {...register("password")} />
                  </Field>
                  <Field label="Nhập lại mật khẩu" htmlFor="confirm" required error={errors.confirm?.message}>
                    <PasswordInput id="confirm" autoComplete="new-password" {...register("confirm")} />
                  </Field>
                </div>
                <PasswordStrength value={password} />
              </FormSection>
            </>
          }
          side={
            <>
              <AccountPreview name={admin.fullName} email={admin.email} active={admin.isActive} />
              {admin.isActive && (
                <section className="rounded-2xl border border-red-200 bg-red-50/50 p-5 dark:border-red-500/20 dark:bg-red-500/5">
                  <div className="flex items-start gap-3">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600 dark:bg-red-500/15">
                      <ShieldAlert className="size-[18px]" />
                    </span>
                    <div>
                      <h2 className="text-[15px] font-semibold tracking-tight text-red-900 dark:text-red-200">
                        Vùng nguy hiểm
                      </h2>
                      <p className="mt-1 text-[13px] text-red-900/70 dark:text-red-200/70">
                        Khoá tài khoản để chặn đăng nhập CMS ngay lập tức.
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    className="mt-4 w-full border-red-200 text-red-600 hover:bg-red-600 hover:text-white dark:border-red-500/30"
                    onClick={() => setConfirmLock(true)}
                  >
                    <Lock />
                    Khoá tài khoản
                  </Button>
                </section>
              )}
            </>
          }
        />
      </form>
      <FormActionBar
        formId={FORM_ID}
        dirty={isDirty}
        submitting={isSubmitting}
        onDiscard={() => reset()}
        submitLabel="Lưu mật khẩu"
      />
      <ConfirmDialog
        open={confirmLock}
        onOpenChange={setConfirmLock}
        title="Khoá tài khoản?"
        confirmLabel="Khoá tài khoản"
        description={
          <>
            <span className="font-medium text-foreground">{admin.email}</span> sẽ không thể đăng
            nhập CMS cho tới khi được mở lại.
          </>
        }
        onConfirm={async () => {
          try {
            await deactivate.mutateAsync(admin.id);
            toast.success("Đã khoá tài khoản");
            router.replace(`${BACK}/`);
          } catch {
            toast.error("Thao tác thất bại");
          }
        }}
      />
    </div>
  );
}

function AdminFormInner() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id") ?? undefined;
  const { data, isLoading } = useAdminsQuery();

  if (!id) return <CreateAdminForm />;
  if (isLoading) return <FormSkeleton />;
  const admin = data?.find((a) => a.id === id);
  if (!admin) {
    return <p className="text-sm text-muted-foreground">Không tìm thấy tài khoản.</p>;
  }
  return <EditAdminForm admin={admin} />;
}

export default function AdminFormPage() {
  return (
    <Suspense fallback={<FormSkeleton />}>
      <AdminFormInner />
    </Suspense>
  );
}
