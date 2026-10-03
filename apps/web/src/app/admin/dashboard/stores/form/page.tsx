"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  ExternalLink,
  Eye,
  Images,
  Link2,
  Loader2,
  MapPin,
  MapPinned,
  Phone,
  Save,
  Store,
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
import { PhotoGallery } from "@/components/upload/photo-gallery";
import { cleanInput } from "@/lib/clean";
import {
  useAttachStorePhoto,
  useCreateStore,
  useDetachStorePhoto,
  useStoreQuery,
  useUpdateStore,
} from "@/hooks/use-stores";

const storeSchema = z.object({
  name: z.string().min(1, "Bắt buộc"),
  address: z.string().min(1, "Bắt buộc"),
  phone: z.string().optional(),
  googleMapsUrl: z.string().optional(),
  description: z.string().optional(),
  isActive: z.boolean(),
});

type StoreValues = z.infer<typeof storeSchema>;

const FORM_ID = "store-form";

function IconInput({
  icon: Icon,
  ...props
}: React.ComponentProps<typeof Input> & { icon: typeof Phone }) {
  return (
    <div className="relative">
      <Icon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input className="pl-9" {...props} />
    </div>
  );
}

function StoreFormInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id") ?? undefined;
  const isEdit = !!id;

  const { data: store, isLoading } = useStoreQuery(id);
  const createStore = useCreateStore();
  const updateStore = useUpdateStore(id ?? "");
  const attachPhoto = useAttachStorePhoto(id ?? "");
  const detachPhoto = useDetachStorePhoto(id ?? "");

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<StoreValues>({
    resolver: zodResolver(storeSchema),
    defaultValues: {
      name: "",
      address: "",
      phone: "",
      googleMapsUrl: "",
      description: "",
      isActive: true,
    },
    values: store
      ? {
          name: store.name,
          address: store.address,
          phone: store.phone ?? "",
          googleMapsUrl: store.googleMapsUrl ?? "",
          description: store.description ?? "",
          isActive: store.isActive,
        }
      : undefined,
  });

  const isActive = watch("isActive");
  const mapsUrl = watch("googleMapsUrl");
  const [previewName, previewAddress, previewPhone] = watch(["name", "address", "phone"]);
  const coverPhoto = store
    ? [...store.photos].sort((a, b) => a.sortOrder - b.sortOrder)[0]?.media.url
    : undefined;

  const onSubmit = async (rawValues: StoreValues) => {
    const values = cleanInput(rawValues) as StoreValues;
    try {
      if (isEdit) {
        await updateStore.mutateAsync(values);
        toast.success("Đã cập nhật cửa hàng");
      } else {
        const created = await createStore.mutateAsync(values);
        toast.success("Đã tạo cửa hàng");
        router.replace(`/admin/dashboard/stores/form/?id=${created.id}`);
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
        module="/admin/dashboard/stores"
        backHref="/admin/dashboard/stores"
        title={isEdit ? store?.name ?? "Sửa cửa hàng" : "Thêm cửa hàng"}
        description={isEdit ? "Cập nhật thông tin điểm bán" : "Thêm một điểm bán mới lên website"}
        meta={
          isEdit && (
            <StatusBadge tone={isActive ? "success" : "neutral"}>
              {isActive ? "Hoạt động" : "Ẩn"}
            </StatusBadge>
          )
        }
        actions={
          <>
            <LinkButton href="/admin/dashboard/stores" variant="outline">
              Huỷ
            </LinkButton>
            <Button type="submit" form={FORM_ID} disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="animate-spin" /> : <Save />}
              {isSubmitting ? "Đang lưu..." : isEdit ? "Lưu thay đổi" : "Tạo cửa hàng"}
            </Button>
          </>
        }
      />

      <form id={FORM_ID} onSubmit={handleSubmit(onSubmit)}>
        <FormLayout
          main={
            <>
              <FormSection icon={Store} tone="emerald" title="Thông tin cửa hàng" description="Tên và giới thiệu ngắn về không gian.">
                <Field label="Tên cửa hàng" htmlFor="name" required error={errors.name?.message}>
                  <Input id="name" placeholder="VD: S.t Nguyễn Huệ" {...register("name")} />
                </Field>
                <Field label="Mô tả / điểm nhấn" htmlFor="description" hint="Không gian, giờ mở cửa, điểm đặc biệt…">
                  <Textarea id="description" rows={4} {...register("description")} />
                </Field>
              </FormSection>

              <FormSection icon={MapPinned} tone="sky" title="Vị trí & liên hệ" description="Giúp khách tìm đường và gọi đặt chỗ.">
                <Field label="Địa chỉ" htmlFor="address" required error={errors.address?.message}>
                  <div className="relative">
                    <MapPin className="pointer-events-none absolute top-3 left-3 size-4 text-muted-foreground" />
                    <Textarea id="address" rows={2} className="pl-9" {...register("address")} />
                  </div>
                </Field>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Điện thoại" htmlFor="phone">
                    <IconInput id="phone" icon={Phone} placeholder="028 xxxx xxxx" {...register("phone")} />
                  </Field>
                  <Field label="Link Google Maps" htmlFor="googleMapsUrl">
                    <IconInput id="googleMapsUrl" icon={Link2} placeholder="https://maps.app.goo.gl/…" {...register("googleMapsUrl")} />
                  </Field>
                </div>
                {mapsUrl && (
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-[13px] font-medium text-primary hover:underline"
                  >
                    Kiểm tra vị trí trên Google Maps
                    <ExternalLink className="size-3.5" />
                  </a>
                )}
              </FormSection>

              <FormSection
                icon={Images}
                tone="rose"
                title="Hình ảnh"
                description={isEdit ? "Ảnh đầu tiên được dùng làm ảnh bìa." : undefined}
              >
                {isEdit && store ? (
                  <PhotoGallery
                    photos={store.photos}
                    onAttach={(mediaId) => attachPhoto.mutateAsync(mediaId).then(() => {})}
                    onDetach={(photoId) => detachPhoto.mutateAsync(photoId).then(() => {})}
                  />
                ) : (
                  <div className="flex items-center gap-3 rounded-lg border border-dashed bg-muted/30 p-4 text-[13px] text-muted-foreground">
                    <Store className="size-5 shrink-0 text-emerald-600" />
                    Lưu cửa hàng trước, sau đó bạn có thể thêm hình ảnh.
                  </div>
                )}
              </FormSection>
            </>
          }
          side={
            <>
              <FormSection icon={Eye} tone="amber" title="Hiển thị">
                <Controller
                  control={control}
                  name="isActive"
                  render={({ field }) => (
                    <ToggleRow
                      title="Hiển thị công khai"
                      description="Cửa hàng xuất hiện trong danh sách trên website."
                      control={<Switch checked={field.value} onCheckedChange={field.onChange} />}
                    />
                  )}
                />
              </FormSection>

              <PreviewCard
                image={coverPhoto}
                fallbackIcon={Store}
                imageClassName="aspect-video"
                title={previewName}
                titlePlaceholder="Tên cửa hàng"
                footer={
                  <div className="space-y-1 pt-1 text-xs text-muted-foreground">
                    <p className="flex items-start gap-1.5">
                      <MapPin className="mt-0.5 size-3.5 shrink-0 text-emerald-600" />
                      <span className="line-clamp-2">{previewAddress || "Địa chỉ cửa hàng"}</span>
                    </p>
                    {previewPhone && (
                      <p className="flex items-center gap-1.5 tabular-nums">
                        <Phone className="size-3.5 shrink-0 text-emerald-600" />
                        {previewPhone}
                      </p>
                    )}
                  </div>
                }
              />
            </>
          }
        />
      </form>
      <FormActionBar
        formId={FORM_ID}
        dirty={isDirty}
        submitting={isSubmitting}
        onDiscard={() => reset()}
        submitLabel={isEdit ? "Lưu thay đổi" : "Tạo cửa hàng"}
      />
    </div>
  );
}

export default function StoreFormPage() {
  return (
    <Suspense fallback={<FormSkeleton />}>
      <StoreFormInner />
    </Suspense>
  );
}
