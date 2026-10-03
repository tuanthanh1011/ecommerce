"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Activity, Briefcase, Building2, Lightbulb, Loader2, Save, ScrollText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LinkButton } from "@/components/ui/link-button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { PageHeader } from "@/components/common/page-header";
import { StatusBadge } from "@/components/common/status-badge";
import { Field, FormLayout, FormSection, FormSkeleton } from "@/components/common/form";
import { ToggleRow } from "@/components/common/choice";
import { FormActionBar } from "@/components/common/form-action-bar";
import { PreviewFrame, PreviewText } from "@/components/common/preview-card";
import { useCreateJob, useJobQuery, useJobsQuery, useUpdateJob } from "@/hooks/use-jobs";
import { JobStatus } from "@/lib/constants";

const jobSchema = z.object({
  title: z.string().min(1, "Bắt buộc"),
  department: z.string().min(1, "Bắt buộc"),
  description: z.string().min(1, "Bắt buộc"),
  requirements: z.string().min(1, "Bắt buộc"),
  status: z.nativeEnum(JobStatus),
});

type JobValues = z.infer<typeof jobSchema>;

const FORM_ID = "job-form";

function JobFormInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id") ?? undefined;
  const isEdit = !!id;

  const { data: job, isLoading } = useJobQuery(id);
  const createJob = useCreateJob();
  const updateJob = useUpdateJob(id ?? "");

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<JobValues>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      title: "",
      department: "",
      description: "",
      requirements: "",
      status: JobStatus.OPEN,
    },
    values: job
      ? {
          title: job.title,
          department: job.department,
          description: job.description,
          requirements: job.requirements,
          status: job.status,
        }
      : undefined,
  });

  const status = watch("status");
  const [title, department, description] = watch(["title", "department", "description"]);
  const { data: allJobs } = useJobsQuery();
  const departments = [...new Set((allJobs?.data ?? []).map((j) => j.department).filter(Boolean))]
    .filter((d) => d !== department)
    .slice(0, 6);

  const onSubmit = async (values: JobValues) => {
    try {
      if (isEdit) {
        await updateJob.mutateAsync(values);
        toast.success("Đã cập nhật");
      } else {
        await createJob.mutateAsync(values);
        toast.success("Đã tạo tin tuyển dụng");
        router.replace("/admin/dashboard/jobs/");
        return;
      }
    } catch {
      toast.error("Lưu thất bại");
    }
  };

  if (isEdit && isLoading) return <FormSkeleton />;

  return (
    <div>
      <PageHeader
        module="/admin/dashboard/jobs"
        backHref="/admin/dashboard/jobs"
        title={isEdit ? job?.title ?? "Sửa tin tuyển dụng" : "Đăng tin tuyển dụng"}
        description={isEdit ? "Cập nhật mô tả và yêu cầu vị trí" : "Mô tả vị trí để thu hút đúng ứng viên"}
        meta={
          isEdit &&
          (status === JobStatus.OPEN ? (
            <StatusBadge tone="success" pulse>
              Đang tuyển
            </StatusBadge>
          ) : (
            <StatusBadge tone="neutral">Đã đóng</StatusBadge>
          ))
        }
        actions={
          <>
            <LinkButton href="/admin/dashboard/jobs" variant="outline">
              Huỷ
            </LinkButton>
            <Button type="submit" form={FORM_ID} disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="animate-spin" /> : <Save />}
              {isSubmitting ? "Đang lưu..." : isEdit ? "Lưu thay đổi" : "Đăng tin"}
            </Button>
          </>
        }
      />

      <form id={FORM_ID} onSubmit={handleSubmit(onSubmit)}>
        <FormLayout
          main={
            <>
              <FormSection icon={Briefcase} tone="violet" title="Vị trí" description="Tên vị trí và bộ phận tuyển.">
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Tên vị trí" htmlFor="title" required error={errors.title?.message}>
                    <Input id="title" placeholder="VD: Barista ca sáng" {...register("title")} />
                  </Field>
                  <Field label="Bộ phận" htmlFor="department" required error={errors.department?.message}>
                    <div className="relative">
                      <Building2 className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input id="department" className="pl-9" placeholder="VD: Vận hành cửa hàng" {...register("department")} />
                    </div>
                  </Field>
                </div>
                {departments.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-xs text-muted-foreground">Bộ phận đã dùng:</span>
                    {departments.map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setValue("department", d, { shouldDirty: true, shouldValidate: true })}
                        className="rounded-full border bg-card px-2.5 py-0.5 text-xs font-medium text-foreground/80 transition-colors hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700 dark:hover:bg-violet-500/10"
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                )}
              </FormSection>
              <FormSection icon={ScrollText} tone="sky" title="Nội dung tuyển dụng" description="Ứng viên đọc phần này để quyết định ứng tuyển.">
                <Field
                  label="Mô tả công việc"
                  htmlFor="description"
                  required
                  error={errors.description?.message}
                >
                  <Textarea id="description" rows={6} {...register("description")} />
                </Field>
                <Field
                  label="Yêu cầu"
                  htmlFor="requirements"
                  required
                  error={errors.requirements?.message}
                  hint="Mỗi yêu cầu một dòng để hiển thị dạng danh sách."
                >
                  <Textarea id="requirements" rows={6} {...register("requirements")} />
                </Field>
              </FormSection>
            </>
          }
          side={
            <>
              <FormSection icon={Activity} tone="emerald" title="Trạng thái">
                <Controller
                  control={control}
                  name="status"
                  render={({ field }) => (
                    <ToggleRow
                      title="Đang tuyển"
                      description="Tắt để đóng tin, ứng viên sẽ không còn thấy vị trí này."
                      control={
                        <Switch
                          checked={field.value === JobStatus.OPEN}
                          onCheckedChange={(checked) =>
                            field.onChange(checked ? JobStatus.OPEN : JobStatus.CLOSED)
                          }
                        />
                      }
                    />
                  )}
                />
              </FormSection>
              <PreviewFrame label="Xem trước trang tuyển dụng">
                <div className="p-4">
                  <div className="flex items-start gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300">
                      <Briefcase className="size-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="line-clamp-2 font-semibold tracking-tight">
                        <PreviewText value={title} placeholder="Tên vị trí" />
                      </p>
                      <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                        <Building2 className="size-3" />
                        <PreviewText value={department} placeholder="Bộ phận" />
                      </p>
                    </div>
                  </div>
                  <p className="mt-3 line-clamp-3 text-xs leading-relaxed text-muted-foreground">
                    <PreviewText value={description} placeholder="Mô tả công việc sẽ hiển thị ở đây…" />
                  </p>
                  <div className="mt-3 flex items-center justify-between border-t pt-3">
                    {status === JobStatus.OPEN ? (
                      <StatusBadge tone="success" pulse>
                        Đang tuyển
                      </StatusBadge>
                    ) : (
                      <StatusBadge tone="neutral">Đã đóng</StatusBadge>
                    )}
                    <span className="text-xs font-semibold text-violet-700 dark:text-violet-300">
                      Ứng tuyển →
                    </span>
                  </div>
                </div>
              </PreviewFrame>
              <div className="rounded-2xl border border-violet-200 bg-violet-50/70 p-4 dark:border-violet-500/20 dark:bg-violet-500/10">
                <p className="flex items-center gap-2 text-sm font-semibold text-violet-900 dark:text-violet-200">
                  <Lightbulb className="size-4" />
                  Mẹo viết tin
                </p>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-[13px] text-violet-900/80 dark:text-violet-200/80">
                  <li>Nêu rõ ca làm, địa điểm và quyền lợi.</li>
                  <li>Giữ yêu cầu ngắn gọn, ưu tiên điều bắt buộc.</li>
                  <li>Chia sẻ một chút về văn hoá S.t.</li>
                </ul>
              </div>
            </>
          }
        />
      </form>
      <FormActionBar
        formId={FORM_ID}
        dirty={isDirty}
        submitting={isSubmitting}
        onDiscard={() => reset()}
        submitLabel={isEdit ? "Lưu thay đổi" : "Đăng tin"}
      />
    </div>
  );
}

export default function JobFormPage() {
  return (
    <Suspense fallback={<FormSkeleton />}>
      <JobFormInner />
    </Suspense>
  );
}
