"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { CalendarDays, Clock, Loader2, MapPin, NotebookText, Save, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LinkButton } from "@/components/ui/link-button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/common/page-header";
import { Field, FormLayout, FormSection, FormSkeleton } from "@/components/common/form";
import { ChoiceChips } from "@/components/common/choice";
import { FormActionBar } from "@/components/common/form-action-bar";
import { PreviewFrame, PreviewText } from "@/components/common/preview-card";
import {
  useCreateScheduleEntry,
  useScheduleQuery,
  useUpdateScheduleEntry,
} from "@/hooks/use-internal";

const schema = z
  .object({
    title: z.string().min(1, "Bắt buộc"),
    description: z.string(),
    startAt: z.string().min(1, "Bắt buộc"),
    endAt: z.string(),
    location: z.string(),
  })
  .refine((v) => !v.endAt || !v.startAt || new Date(v.endAt) > new Date(v.startAt), {
    path: ["endAt"],
    message: "Kết thúc phải sau thời điểm bắt đầu",
  });

type Values = z.infer<typeof schema>;

const FORM_ID = "schedule-form";

function toLocalInput(value: Date | string | null | undefined): string {
  if (!value) return "";
  const date = new Date(value);
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60000).toISOString().slice(0, 16);
}

const DURATIONS = [
  { value: "30", label: "30 phút" },
  { value: "60", label: "1 giờ" },
  { value: "120", label: "2 giờ" },
  { value: "240", label: "Nửa ngày" },
];

const WEEKDAY = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

function hm(value: string) {
  return new Date(value).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
}

function ScheduleFormInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id") ?? undefined;
  const isEdit = !!id;

  const { data: list, isLoading } = useScheduleQuery();
  const entry = id ? list?.find((e) => e.id === id) : undefined;
  const create = useCreateScheduleEntry();
  const update = useUpdateScheduleEntry(id ?? "");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { title: "", description: "", startAt: "", endAt: "", location: "" },
    values: entry
      ? {
          title: entry.title,
          description: entry.description ?? "",
          startAt: toLocalInput(entry.startAt),
          endAt: toLocalInput(entry.endAt),
          location: entry.location ?? "",
        }
      : undefined,
  });

  const [title, startAt, endAt, location, description] = watch([
    "title",
    "startAt",
    "endAt",
    "location",
    "description",
  ]);

  const durationMinutes =
    startAt && endAt ? Math.round((new Date(endAt).getTime() - new Date(startAt).getTime()) / 60000) : null;

  const onSubmit = async (raw: Values) => {
    // Send empty strings as-is so clearing a field on edit actually clears it.
    const payload = {
      title: raw.title,
      description: raw.description,
      location: raw.location,
      startAt: new Date(raw.startAt).toISOString(),
      endAt: raw.endAt ? new Date(raw.endAt).toISOString() : undefined,
    };
    try {
      if (isEdit) {
        await update.mutateAsync(payload);
        toast.success("Đã cập nhật lịch");
      } else {
        await create.mutateAsync(payload);
        toast.success("Đã thêm lịch");
        router.replace("/admin/dashboard/internal/schedule/");
      }
    } catch {
      toast.error("Lưu thất bại");
    }
  };

  if (isEdit && isLoading) return <FormSkeleton />;

  const start = startAt ? new Date(startAt) : null;

  return (
    <div>
      <PageHeader
        module="/admin/dashboard/internal/schedule"
        backHref="/admin/dashboard/internal/schedule"
        title={isEdit ? entry?.title ?? "Sửa lịch" : "Thêm lịch mới"}
        description={isEdit ? "Cập nhật thời gian và địa điểm sự kiện" : "Lên lịch họp, đào tạo hoặc sự kiện cho cả đội"}
        actions={
          <>
            <LinkButton href="/admin/dashboard/internal/schedule" variant="outline">
              Huỷ
            </LinkButton>
            <Button type="submit" form={FORM_ID} disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="animate-spin" /> : <Save />}
              {isSubmitting ? "Đang lưu..." : isEdit ? "Lưu thay đổi" : "Thêm lịch"}
            </Button>
          </>
        }
      />

      <form id={FORM_ID} onSubmit={handleSubmit(onSubmit)}>
        <FormLayout
          main={
            <>
              <FormSection icon={CalendarDays} tone="teal" title="Thông tin sự kiện" description="Tên sự kiện hiển thị trên lịch chung.">
                <Field label="Tiêu đề" htmlFor="title" required error={errors.title?.message}>
                  <Input id="title" placeholder="VD: Họp giao ban tháng 10" {...register("title")} />
                </Field>
                <Field label="Ghi chú" htmlFor="description" hint="Nội dung chuẩn bị, người tham gia, link họp online…">
                  <Textarea id="description" rows={4} {...register("description")} />
                </Field>
              </FormSection>

              <FormSection icon={Clock} tone="sky" title="Thời gian & địa điểm">
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Bắt đầu" htmlFor="startAt" required error={errors.startAt?.message}>
                    <Input id="startAt" type="datetime-local" {...register("startAt")} />
                  </Field>
                  <Field label="Kết thúc" htmlFor="endAt" error={errors.endAt?.message}>
                    <Input id="endAt" type="datetime-local" min={startAt || undefined} {...register("endAt")} />
                  </Field>
                </div>
                <Field label="Thời lượng nhanh" hint={startAt ? "Tự tính giờ kết thúc từ giờ bắt đầu." : "Chọn giờ bắt đầu trước."}>
                  <div className={startAt ? undefined : "pointer-events-none opacity-50"}>
                    <ChoiceChips
                      value={durationMinutes !== null ? String(durationMinutes) : undefined}
                      onChange={(mins) =>
                        setValue(
                          "endAt",
                          toLocalInput(new Date(new Date(startAt).getTime() + Number(mins) * 60000)),
                          { shouldDirty: true, shouldValidate: true },
                        )
                      }
                      options={DURATIONS.map((d) => ({ ...d, icon: Timer }))}
                    />
                  </div>
                </Field>
                <Field label="Địa điểm" htmlFor="location">
                  <div className="relative">
                    <MapPin className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input id="location" className="pl-9" placeholder="Cửa hàng / phòng họp / Google Meet" {...register("location")} />
                  </div>
                </Field>
              </FormSection>
            </>
          }
          side={
            <PreviewFrame label="Xem trước trên lịch chung">
              <div className="flex gap-4 p-4">
                <div className="flex w-14 shrink-0 flex-col items-center overflow-hidden rounded-xl border bg-card text-center shadow-xs">
                  <span className="w-full bg-teal-600 py-0.5 text-[10px] font-semibold text-white uppercase">
                    {start ? `Th${start.getMonth() + 1}` : "Th—"}
                  </span>
                  <span className="pt-1 text-xl leading-none font-semibold tabular-nums">
                    {start ? start.getDate() : "—"}
                  </span>
                  <span className="pb-1 text-[10px] text-muted-foreground">
                    {start ? WEEKDAY[start.getDay()] : ""}
                  </span>
                </div>
                <div className="min-w-0 space-y-1.5 pt-0.5">
                  <p className="line-clamp-2 font-semibold tracking-tight">
                    <PreviewText value={title} placeholder="Tên sự kiện" />
                  </p>
                  <p className="flex items-center gap-1.5 text-xs text-muted-foreground tabular-nums">
                    <Clock className="size-3.5 shrink-0 text-teal-600" />
                    {startAt ? `${hm(startAt)}${endAt ? ` – ${hm(endAt)}` : ""}` : "Chưa chọn giờ"}
                  </p>
                  <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <MapPin className="size-3.5 shrink-0 text-teal-600" />
                    <PreviewText value={location} placeholder="Chưa có địa điểm" className="truncate" />
                  </p>
                  {description && (
                    <p className="flex items-start gap-1.5 text-xs text-muted-foreground">
                      <NotebookText className="mt-0.5 size-3.5 shrink-0 text-teal-600" />
                      <span className="line-clamp-3">{description}</span>
                    </p>
                  )}
                </div>
              </div>
            </PreviewFrame>
          }
        />
      </form>
      <FormActionBar
        formId={FORM_ID}
        dirty={isDirty}
        submitting={isSubmitting}
        onDiscard={() => reset()}
        submitLabel={isEdit ? "Lưu thay đổi" : "Thêm lịch"}
      />
    </div>
  );
}

export default function ScheduleFormPage() {
  return (
    <Suspense fallback={<FormSkeleton />}>
      <ScheduleFormInner />
    </Suspense>
  );
}
