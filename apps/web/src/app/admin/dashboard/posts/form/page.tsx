"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  AlignLeft,
  FileClock,
  ImageIcon,
  Loader2,
  Newspaper,
  PenLine,
  Save,
  Send,
  Tags,
} from "lucide-react";
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
import { PreviewCard } from "@/components/common/preview-card";
import { ImageUploader } from "@/components/upload/image-uploader";
import { TiptapEditor } from "@/components/rich-text/tiptap-editor";
import { cleanInput } from "@/lib/clean";
import {
  useCreatePost,
  usePostQuery,
  useSetPostPublished,
  useUpdatePost,
} from "@/hooks/use-posts";
import { PostType, POST_TYPE_LABELS, POST_TYPE_TONES } from "@/lib/constants";
import { TONES, toneChip } from "@/lib/tones";
import { formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";

const postSchema = z.object({
  title: z.string().min(1, "Bắt buộc"),
  type: z.nativeEnum(PostType),
  excerpt: z.string().optional(),
  content: z.string().min(1, "Bắt buộc"),
  coverImageId: z.string().optional(),
});

type PostValues = z.infer<typeof postSchema>;

const FORM_ID = "post-form";

function PostFormInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id") ?? undefined;
  const defaultType = (searchParams.get("type") as PostType) ?? PostType.ANNOUNCEMENT;
  const isEdit = !!id;

  const { data: post, isLoading } = usePostQuery(id);
  const createPost = useCreatePost();
  const updatePost = useUpdatePost(id ?? "");
  const setPublished = useSetPostPublished(id ?? "");
  const [coverPreview, setCoverPreview] = useState<{ url: string } | null>(null);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<PostValues>({
    resolver: zodResolver(postSchema),
    defaultValues: { title: "", excerpt: "", type: defaultType, content: "" },
    values: post
      ? {
          title: post.title,
          type: post.type,
          excerpt: post.excerpt ?? "",
          content: post.content,
          coverImageId: post.coverImageId ?? undefined,
        }
      : undefined,
  });

  const excerpt = watch("excerpt") ?? "";
  const [previewTitle, previewType] = watch(["title", "type"]);

  const onSubmit = async (rawValues: PostValues) => {
    const values = cleanInput(rawValues) as PostValues;
    try {
      if (isEdit) {
        await updatePost.mutateAsync(values);
        toast.success("Đã cập nhật bài viết");
      } else {
        const created = await createPost.mutateAsync(values);
        toast.success("Đã tạo bài viết");
        router.replace(`/admin/dashboard/posts/form/?id=${created.id}`);
        return;
      }
    } catch {
      toast.error("Lưu thất bại");
    }
  };

  if (isEdit && isLoading) return <FormSkeleton />;

  const cover = coverPreview ?? post?.coverImage ?? null;

  return (
    <div>
      <PageHeader
        module="/admin/dashboard/posts"
        backHref="/admin/dashboard/posts"
        title={isEdit ? "Sửa bài viết" : "Viết bài mới"}
        description={isEdit ? post?.title : "Soạn nội dung, chọn chuyên mục và ảnh bìa"}
        meta={
          isEdit &&
          post && (
            <StatusBadge tone={post.isPublished ? "success" : "warning"}>
              {post.isPublished ? "Đã đăng" : "Bản nháp"}
            </StatusBadge>
          )
        }
        actions={
          <>
            <LinkButton href="/admin/dashboard/posts" variant="outline">
              Huỷ
            </LinkButton>
            <Button type="submit" form={FORM_ID} disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="animate-spin" /> : <Save />}
              {isSubmitting ? "Đang lưu..." : isEdit ? "Lưu thay đổi" : "Lưu bản nháp"}
            </Button>
          </>
        }
      />

      <form id={FORM_ID} onSubmit={handleSubmit(onSubmit)}>
        <FormLayout
          main={
            <>
              <FormSection icon={PenLine} tone="sky" title="Thông tin bài viết" description="Tiêu đề và mô tả hiển thị ở danh sách tin.">
                <Field label="Tiêu đề" htmlFor="title" required error={errors.title?.message}>
                  <Input id="title" placeholder="VD: Ra mắt Cà phê muối mùa thu" {...register("title")} />
                </Field>
                <Field
                  label="Mô tả ngắn"
                  htmlFor="excerpt"
                  hint={`${excerpt.length}/200 ký tự · Hiển thị ở danh sách tin và khi chia sẻ.`}
                >
                  <Textarea id="excerpt" rows={3} maxLength={200} {...register("excerpt")} />
                </Field>
              </FormSection>

              <FormSection icon={AlignLeft} tone="amber" title="Nội dung" description="Dùng tiêu đề nhỏ và danh sách để bài dễ đọc hơn.">
                <Field label="Nội dung bài viết" required error={errors.content?.message}>
                  <Controller
                    control={control}
                    name="content"
                    render={({ field }) => (
                      <TiptapEditor value={field.value} onChange={field.onChange} />
                    )}
                  />
                </Field>
              </FormSection>
            </>
          }
          side={
            <>
              {isEdit && post && (
                <FormSection icon={Send} tone="emerald" title="Xuất bản">
                  <ToggleRow
                    title={post.isPublished ? "Đang hiển thị" : "Chưa đăng"}
                    description={
                      post.publishedAt
                        ? `Đăng lúc ${formatDateTime(post.publishedAt)}`
                        : "Bật để đăng bài lên website."
                    }
                    control={
                      <Switch
                        checked={post.isPublished}
                        onCheckedChange={(checked) =>
                          setPublished.mutate(checked, {
                            onSuccess: () =>
                              toast.success(checked ? "Đã đăng bài viết" : "Đã chuyển về nháp"),
                          })
                        }
                      />
                    }
                  />
                </FormSection>
              )}
              {!isEdit && (
                <div className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-[13px] text-amber-900 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-200">
                  <FileClock className="size-5 shrink-0" />
                  Bài viết mới được lưu dưới dạng nháp. Bạn có thể đăng sau khi lưu.
                </div>
              )}

              <FormSection icon={Tags} tone="sky" title="Chuyên mục">
                <Controller
                  control={control}
                  name="type"
                  render={({ field }) => (
                    <div role="radiogroup" className="grid grid-cols-2 gap-2">
                      {Object.values(PostType).map((t) => {
                        const active = field.value === t;
                        return (
                          <button
                            key={t}
                            type="button"
                            role="radio"
                            aria-checked={active}
                            onClick={() => field.onChange(t)}
                            className={cn(
                              "flex h-10 items-center gap-2 rounded-lg border px-3 text-left text-[13px] font-medium transition-all",
                              active
                                ? "border-amber-500 bg-amber-50/70 text-foreground ring-1 ring-amber-500 dark:bg-amber-500/10"
                                : "bg-card text-foreground/75 hover:border-stone-300 hover:text-foreground",
                            )}
                          >
                            <span className={cn("size-2 shrink-0 rounded-full", TONES[POST_TYPE_TONES[t]].dot)} />
                            <span className="truncate">
                            {POST_TYPE_LABELS[t]}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                />
              </FormSection>

              <FormSection icon={ImageIcon} tone="rose" title="Ảnh bìa" description="Tỉ lệ 16:9 hiển thị đẹp nhất.">
                <ImageUploader
                  value={cover}
                  onUploaded={(media) => {
                    setValue("coverImageId", media.id, { shouldDirty: true });
                    setCoverPreview({ url: media.url });
                  }}
                  onRemove={() => {
                    setValue("coverImageId", undefined, { shouldDirty: true });
                    setCoverPreview(null);
                  }}
                />
              </FormSection>

              <PreviewCard
                image={cover?.url}
                fallbackIcon={Newspaper}
                imageClassName="aspect-video"
                chip={
                  <span className={toneChip(POST_TYPE_TONES[previewType])}>
                    {POST_TYPE_LABELS[previewType]}
                  </span>
                }
                title={previewTitle}
                titlePlaceholder="Tiêu đề bài viết"
                body={excerpt}
              />
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
          setCoverPreview(null);
        }}
        submitLabel={isEdit ? "Lưu thay đổi" : "Lưu bản nháp"}
      />
    </div>
  );
}

export default function PostFormPage() {
  return (
    <Suspense fallback={<FormSkeleton />}>
      <PostFormInner />
    </Suspense>
  );
}
