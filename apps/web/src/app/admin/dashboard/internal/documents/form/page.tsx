"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  AlignLeft,
  BadgeCheck,
  ChefHat,
  FileText,
  Loader2,
  Paperclip,
  Save,
  Workflow,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { LinkButton } from "@/components/ui/link-button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/common/page-header";
import { Field, FormLayout, FormSection, FormSkeleton } from "@/components/common/form";
import { ChoiceCards } from "@/components/common/choice";
import { FormActionBar } from "@/components/common/form-action-bar";
import { PreviewFrame, PreviewText } from "@/components/common/preview-card";
import { FileUploader } from "@/components/upload/file-uploader";
import { TiptapEditor } from "@/components/rich-text/tiptap-editor";
import { cleanInput } from "@/lib/clean";
import {
  useCreateDocument,
  useDocumentQuery,
  useUpdateDocument,
} from "@/hooks/use-documents";
import {
  DocumentCategory,
  DOCUMENT_CATEGORY_LABELS,
  DOCUMENT_CATEGORY_TONES,
} from "@/lib/constants";
import { TONES, toneChip } from "@/lib/tones";
import { cn } from "@/lib/utils";

const documentSchema = z.object({
  title: z.string().min(1, "Bắt buộc"),
  category: z.nativeEnum(DocumentCategory),
  content: z.string().optional(),
  fileId: z.string().optional(),
});

type DocumentValues = z.infer<typeof documentSchema>;

const CATEGORY_ICONS = {
  [DocumentCategory.WORKFLOW]: Workflow,
  [DocumentCategory.RECIPE]: ChefHat,
  [DocumentCategory.QUALITY_STANDARD]: BadgeCheck,
};

const FORM_ID = "document-form";

function DocumentFormInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id") ?? undefined;
  const isEdit = !!id;

  const { data: document, isLoading } = useDocumentQuery(id);
  const createDocument = useCreateDocument();
  const updateDocument = useUpdateDocument(id ?? "");
  const [filePreview, setFilePreview] = useState<{
    url: string;
    originalFileName?: string | null;
  } | null>(null);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<DocumentValues>({
    resolver: zodResolver(documentSchema),
    defaultValues: { title: "", category: DocumentCategory.WORKFLOW, content: "" },
    values: document
      ? {
          title: document.title,
          category: document.category,
          content: document.content ?? "",
          fileId: document.fileId ?? undefined,
        }
      : undefined,
  });

  const onSubmit = async (rawValues: DocumentValues) => {
    const values = cleanInput(rawValues) as DocumentValues;
    try {
      if (isEdit) {
        await updateDocument.mutateAsync(values);
        toast.success("Đã cập nhật tài liệu");
      } else {
        await createDocument.mutateAsync(values);
        toast.success("Đã tạo tài liệu");
        router.replace("/admin/dashboard/internal/documents/");
        return;
      }
    } catch {
      toast.error("Lưu thất bại");
    }
  };

  if (isEdit && isLoading) return <FormSkeleton />;

  const file = filePreview ?? document?.file ?? null;
  const [title, category] = watch(["title", "category"]);
  const CategoryIcon = CATEGORY_ICONS[category];

  return (
    <div>
      <PageHeader
        module="/admin/dashboard/internal/documents"
        backHref="/admin/dashboard/internal/documents"
        title={isEdit ? document?.title ?? "Sửa tài liệu" : "Thêm tài liệu"}
        description="Tài liệu nội bộ chỉ hiển thị cho nhân sự S.t"
        actions={
          <>
            <LinkButton href="/admin/dashboard/internal/documents" variant="outline">
              Huỷ
            </LinkButton>
            <Button type="submit" form={FORM_ID} disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="animate-spin" /> : <Save />}
              {isSubmitting ? "Đang lưu..." : isEdit ? "Lưu thay đổi" : "Tạo tài liệu"}
            </Button>
          </>
        }
      />

      <form id={FORM_ID} onSubmit={handleSubmit(onSubmit)}>
        <FormLayout
          main={
            <>
              <FormSection icon={FileText} tone="indigo" title="Thông tin tài liệu" description="Tiêu đề và nhóm tài liệu để dễ tra cứu.">
                <Field label="Tiêu đề" htmlFor="title" required error={errors.title?.message}>
                  <Input id="title" placeholder="VD: Quy trình mở ca" {...register("title")} />
                </Field>
                <Field label="Danh mục" required>
                  <Controller
                    control={control}
                    name="category"
                    render={({ field }) => (
                      <ChoiceCards
                        columns={3}
                        value={field.value}
                        onChange={field.onChange}
                        options={Object.values(DocumentCategory).map((c) => ({
                          value: c,
                          label: DOCUMENT_CATEGORY_LABELS[c],
                          icon: CATEGORY_ICONS[c],
                        }))}
                      />
                    )}
                  />
                </Field>
              </FormSection>
              <FormSection icon={AlignLeft} tone="sky" title="Nội dung chi tiết" description="Tuỳ chọn — dùng khi không có file đính kèm hoặc cần tóm tắt.">
                <Controller
                  control={control}
                  name="content"
                  render={({ field }) => (
                    <TiptapEditor value={field.value ?? ""} onChange={field.onChange} />
                  )}
                />
              </FormSection>
            </>
          }
          side={
            <>
            <FormSection icon={Paperclip} tone="amber" title="File đính kèm" description="PDF, Word, Excel…">
              <FileUploader
                value={file}
                onUploaded={(media) => {
                  setValue("fileId", media.id, { shouldDirty: true });
                  setFilePreview({ url: media.url, originalFileName: media.originalFileName });
                }}
                onRemove={() => {
                  setValue("fileId", undefined, { shouldDirty: true });
                  setFilePreview(null);
                }}
              />
            </FormSection>
            <PreviewFrame label="Xem trước trong thư viện nội bộ">
              <div className="flex items-start gap-3 p-4">
                <span
                  className={cn(
                    "flex size-11 shrink-0 items-center justify-center rounded-xl ring-1 ring-inset",
                    TONES[DOCUMENT_CATEGORY_TONES[category]].soft,
                  )}
                >
                  <CategoryIcon className="size-5" />
                </span>
                <div className="min-w-0 space-y-1.5">
                  <p className="line-clamp-2 font-semibold tracking-tight">
                    <PreviewText value={title} placeholder="Tiêu đề tài liệu" />
                  </p>
                  <span className={toneChip(DOCUMENT_CATEGORY_TONES[category])}>
                    {DOCUMENT_CATEGORY_LABELS[category]}
                  </span>
                  <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Paperclip className="size-3.5 shrink-0" />
                    <span className="truncate">
                      {file ? file.originalFileName ?? "Tệp đính kèm" : "Chưa có tệp đính kèm"}
                    </span>
                  </p>
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
        onDiscard={() => {
          reset();
          setFilePreview(null);
        }}
        submitLabel={isEdit ? "Lưu thay đổi" : "Tạo tài liệu"}
      />
    </div>
  );
}

export default function DocumentFormPage() {
  return (
    <Suspense fallback={<FormSkeleton />}>
      <DocumentFormInner />
    </Suspense>
  );
}
