"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { CalendarClock, Loader2, Megaphone, Pin, PinOff, Save, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LinkButton } from "@/components/ui/link-button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { PageHeader } from "@/components/common/page-header";
import { StatusBadge } from "@/components/common/status-badge";
import { Field, FormLayout, FormSection, FormSkeleton } from "@/components/common/form";
import { ChoiceChips, ToggleRow } from "@/components/common/choice";
import { FormActionBar } from "@/components/common/form-action-bar";
import { PreviewFrame, PreviewText } from "@/components/common/preview-card";
import {
  useAnnouncementsQuery,
  useCreateAnnouncement,
  useUpdateAnnouncement,
} from "@/hooks/use-internal";
import { formatDate } from "@/lib/format";

const schema = z
  .object({
    title: z.string().min(1, "Bắt buộc"),
    content: z.string().min(1, "Bắt buộc"),
    pinned: z.boolean(),
    pinnedUntil: z.string(),
  })
  .refine((v) => !v.pinned || !!v.pinnedUntil, {
    path: ["pinnedUntil"],
    message: "Chọn ngày hết hạn ghim",
  });

type Values = z.infer<typeof schema>;

const FORM_ID = "announcement-form";

function toDateInput(value: Date): string {
  const offset = value.getTimezoneOffset();
  return new Date(value.getTime() - offset * 60000).toISOString().slice(0, 10);
}

function daysFromNow(days: number): string {
  return toDateInput(new Date(Date.now() + days * 86400000));
}

const PIN_PRESETS = [
  { value: "3", label: "3 ngày" },
  { value: "7", label: "1 tuần" },
  { value: "14", label: "2 tuần" },
  { value: "30", label: "1 tháng" },
];

function AnnouncementFormInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id") ?? undefined;
  const isEdit = !!id;

  const { data: list, isLoading } = useAnnouncementsQuery();
  const announcement = id ? list?.find((a) => a.id === id) : undefined;
  const create = useCreateAnnouncement();
  const update = useUpdateAnnouncement(id ?? "");
  const [now] = useState(() => Date.now());

  const currentlyPinned =
    !!announcement?.pinnedUntil && new Date(announcement.pinnedUntil).getTime() > now;

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { title: "", content: "", pinned: false, pinnedUntil: "" },
    values: announcement
      ? {
          title: announcement.title,
          content: announcement.content,
          pinned: currentlyPinned,
          pinnedUntil: currentlyPinned ? toDateInput(new Date(announcement.pinnedUntil!)) : "",
        }
      : undefined,
  });

  const [title, content, pinned, pinnedUntil] = watch(["title", "content", "pinned", "pinnedUntil"]);

  const onSubmit = async (values: Values) => {
    // The API keeps the old pin when sent nothing, so "unpin" expires it now.
    const pinnedUntilIso = values.pinned
      ? new Date(`${values.pinnedUntil}T23:59:59`).toISOString()
      : currentlyPinned
        ? new Date().toISOString()
        : undefined;
    const payload = {
      title: values.title,
      content: values.content,
      ...(pinnedUntilIso ? { pinnedUntil: pinnedUntilIso } : {}),
    };
    try {
      if (isEdit) {
        await update.mutateAsync(payload);
        toast.success("Đã cập nhật thông báo");
      } else {
        await create.mutateAsync(payload);
        toast.success("Đã đăng thông báo");
        router.replace("/admin/dashboard/internal/announcements/");
      }
    } catch {
      toast.error("Lưu thất bại");
    }
  };

  if (isEdit && isLoading) return <FormSkeleton />;

  return (
    <div>
      <PageHeader
        module="/admin/dashboard/internal/announcements"
        backHref="/admin/dashboard/internal/announcements"
        title={isEdit ? "Sửa thông báo" : "Thông báo mới"}
        description={isEdit ? announcement?.title : "Gửi thông tin tới toàn bộ nhân sự S.t"}
        meta={
          isEdit && currentlyPinned ? (
            <StatusBadge tone="warning">Đang ghim</StatusBadge>
          ) : undefined
        }
        actions={
          <>
            <LinkButton href="/admin/dashboard/internal/announcements" variant="outline">
              Huỷ
            </LinkButton>
            <Button type="submit" form={FORM_ID} disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="animate-spin" /> : <Save />}
              {isSubmitting ? "Đang lưu..." : isEdit ? "Lưu thay đổi" : "Đăng thông báo"}
            </Button>
          </>
        }
      />

      <form id={FORM_ID} onSubmit={handleSubmit(onSubmit)}>
        <FormLayout
          main={
            <FormSection
              icon={Megaphone}
              tone="pink"
              title="Nội dung thông báo"
              description="Viết ngắn gọn, rõ việc cần làm và thời hạn (nếu có)."
            >
              <Field label="Tiêu đề" htmlFor="title" required error={errors.title?.message}>
                <Input id="title" placeholder="VD: Lịch nghỉ lễ Quốc khánh 2/9" {...register("title")} />
              </Field>
              <Field
                label="Nội dung"
                htmlFor="content"
                required
                error={errors.content?.message}
                hint={`${content?.length ?? 0} ký tự · Xuống dòng sẽ được giữ nguyên khi hiển thị.`}
              >
                <Textarea id="content" rows={10} {...register("content")} />
              </Field>
            </FormSection>
          }
          side={
            <>
              <FormSection icon={Pin} tone="amber" title="Ghim thông báo" description="Thông báo ghim luôn nằm đầu trang nội bộ.">
                <Controller
                  control={control}
                  name="pinned"
                  render={({ field }) => (
                    <ToggleRow
                      title={field.value ? "Đang ghim" : "Không ghim"}
                      description={
                        field.value && pinnedUntil
                          ? `Tới hết ngày ${formatDate(pinnedUntil)}`
                          : "Bật để giữ thông báo ở vị trí nổi bật."
                      }
                      control={
                        <Switch
                          checked={field.value}
                          onCheckedChange={(checked) => {
                            field.onChange(checked);
                            if (checked && !pinnedUntil) {
                              setValue("pinnedUntil", daysFromNow(7), { shouldDirty: true });
                            }
                          }}
                        />
                      }
                    />
                  )}
                />
                {pinned && (
                  <>
                    <Field label="Ghim đến ngày" htmlFor="pinnedUntil" error={errors.pinnedUntil?.message}>
                      <Input id="pinnedUntil" type="date" min={toDateInput(new Date())} {...register("pinnedUntil")} />
                    </Field>
                    <ChoiceChips
                      value={undefined}
                      onChange={(days) =>
                        setValue("pinnedUntil", daysFromNow(Number(days)), { shouldDirty: true })
                      }
                      options={PIN_PRESETS}
                    />
                  </>
                )}
                {!pinned && currentlyPinned && (
                  <p className="flex items-center gap-1.5 text-[13px] text-muted-foreground">
                    <PinOff className="size-3.5" />
                    Thông báo sẽ được bỏ ghim khi lưu.
                  </p>
                )}
              </FormSection>

              <PreviewFrame label="Xem trước trên trang nội bộ">
                <div className="h-1 bg-linear-to-r from-pink-500 to-rose-500" />
                <div className="p-4">
                  <div className="mb-3 flex items-start justify-between gap-2">
                    <span className="flex size-9 items-center justify-center rounded-lg bg-linear-to-br from-pink-500 to-rose-500 text-white shadow-sm">
                      <Megaphone className="size-4" />
                    </span>
                    {pinned && pinnedUntil && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-medium text-amber-800 dark:bg-amber-500/15 dark:text-amber-200">
                        <Pin className="size-3" />
                        Ghim tới {formatDate(pinnedUntil)}
                      </span>
                    )}
                  </div>
                  <p className="font-semibold tracking-tight">
                    <PreviewText value={title} placeholder="Tiêu đề thông báo" />
                  </p>
                  <p className="mt-1.5 line-clamp-5 text-xs leading-relaxed whitespace-pre-line text-muted-foreground">
                    <PreviewText value={content} placeholder="Nội dung thông báo sẽ hiển thị ở đây…" />
                  </p>
                  <div className="mt-3 flex items-center gap-3 border-t pt-3 text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users className="size-3" />
                      Toàn bộ nhân sự
                    </span>
                    <span className="flex items-center gap-1">
                      <CalendarClock className="size-3" />
                      {formatDate(new Date(now).toISOString())}
                    </span>
                  </div>
                </div>
              </PreviewFrame>
            </>
          }
        />
      </form>
      <FormActionBar
        formId={FORM_ID}
        dirty={isDirty}
        submitting={isSubmitting}
        onDiscard={() => reset()}
        submitLabel={isEdit ? "Lưu thay đổi" : "Đăng thông báo"}
      />
    </div>
  );
}

export default function AnnouncementFormPage() {
  return (
    <Suspense fallback={<FormSkeleton />}>
      <AnnouncementFormInner />
    </Suspense>
  );
}
