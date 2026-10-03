"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  CupSoda,
  Flame,
  Leaf,
  Loader2,
  NotebookPen,
  Package,
  PenTool,
  Save,
  ShoppingBag,
  Snowflake,
  Coffee,
  GlassWater,
  Info,
  Tags,
  CircleDollarSign,
  Images,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { LinkButton } from "@/components/ui/link-button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { PageHeader } from "@/components/common/page-header";
import { StatusBadge } from "@/components/common/status-badge";
import { Field, FormLayout, FormSection, FormSkeleton } from "@/components/common/form";
import { ChoiceCards, ChoiceChips, ToggleRow } from "@/components/common/choice";
import { FormActionBar } from "@/components/common/form-action-bar";
import { PreviewCard } from "@/components/common/preview-card";
import { PhotoGallery } from "@/components/upload/photo-gallery";
import { cleanInput } from "@/lib/clean";
import { formatPrice } from "@/lib/format";
import { toneChip } from "@/lib/tones";
import {
  useAttachProductPhoto,
  useCreateProduct,
  useDetachProductPhoto,
  useProductQuery,
  useUpdateProduct,
} from "@/hooks/use-products";
import {
  DrinkSubType,
  MerchandiseSubType,
  ProductCategory,
  ProductStatus,
  DRINK_SUB_TYPE_LABELS,
  MERCHANDISE_SUB_TYPE_LABELS,
  PRODUCT_CATEGORY_LABELS,
} from "@/lib/constants";

const productSchema = z.object({
  name: z.string().min(1, "Bắt buộc"),
  category: z.nativeEnum(ProductCategory),
  drinkSubType: z.nativeEnum(DrinkSubType).optional(),
  merchandiseSubType: z.nativeEnum(MerchandiseSubType).optional(),
  description: z.string().optional(),
  price: z.string().optional(),
  status: z.nativeEnum(ProductStatus),
});

type ProductValues = z.infer<typeof productSchema>;

const DRINK_ICONS = {
  [DrinkSubType.HOT]: Flame,
  [DrinkSubType.ICED]: Snowflake,
  [DrinkSubType.FRESH]: Leaf,
};

const MERCH_ICONS = {
  [MerchandiseSubType.NOTEBOOK]: NotebookPen,
  [MerchandiseSubType.PEN]: PenTool,
  [MerchandiseSubType.TUMBLER]: CupSoda,
  [MerchandiseSubType.BAG]: ShoppingBag,
};

const FORM_ID = "product-form";

function ProductFormInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id") ?? undefined;
  const isEdit = !!id;

  const { data: product, isLoading } = useProductQuery(id);
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct(id ?? "");
  const attachPhoto = useAttachProductPhoto(id ?? "");
  const detachPhoto = useDetachProductPhoto(id ?? "");

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProductValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "",
      category: ProductCategory.DRINK,
      status: ProductStatus.ACTIVE,
    },
    values: product
      ? {
          name: product.name,
          category: product.category,
          drinkSubType: product.drinkSubType ?? undefined,
          merchandiseSubType: product.merchandiseSubType ?? undefined,
          description: product.description ?? "",
          price: product.price ?? "",
          status: product.status,
        }
      : undefined,
  });

  const category = watch("category");
  const status = watch("status");
  const [previewName, previewDescription, previewPrice] = watch(["name", "description", "price"]);
  const coverPhoto = product
    ? [...product.photos].sort((a, b) => a.sortOrder - b.sortOrder)[0]?.media.url
    : undefined;

  const onSubmit = async (rawValues: ProductValues) => {
    const values = cleanInput(rawValues) as ProductValues;
    try {
      if (isEdit) {
        await updateProduct.mutateAsync(values);
        toast.success("Đã cập nhật sản phẩm");
      } else {
        const created = await createProduct.mutateAsync(values);
        toast.success("Đã tạo sản phẩm");
        router.replace(`/admin/dashboard/products/form/?id=${created.id}`);
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
        module="/admin/dashboard/products"
        backHref="/admin/dashboard/products"
        title={isEdit ? product?.name ?? "Sửa sản phẩm" : "Thêm sản phẩm"}
        description={isEdit ? "Cập nhật thông tin hiển thị trên thực đơn" : "Tạo món mới cho thực đơn hoặc vật phẩm S.t"}
        meta={
          isEdit && (
            <StatusBadge tone={status === ProductStatus.ACTIVE ? "success" : "neutral"}>
              {status === ProductStatus.ACTIVE ? "Đang bán" : "Ẩn"}
            </StatusBadge>
          )
        }
        actions={
          <>
            <LinkButton href="/admin/dashboard/products" variant="outline">
              Huỷ
            </LinkButton>
            <Button type="submit" form={FORM_ID} disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="animate-spin" /> : <Save />}
              {isSubmitting ? "Đang lưu..." : isEdit ? "Lưu thay đổi" : "Tạo sản phẩm"}
            </Button>
          </>
        }
      />

      <form id={FORM_ID} onSubmit={handleSubmit(onSubmit)}>
        <FormLayout
          main={
            <>
              <FormSection icon={Info} tone="amber" title="Thông tin sản phẩm" description="Tên và mô tả hiển thị cho khách hàng.">
                <Field label="Tên sản phẩm" htmlFor="name" required error={errors.name?.message}>
                  <Input id="name" placeholder="VD: Bạc xỉu đá" {...register("name")} />
                </Field>
                <Field label="Mô tả" htmlFor="description" hint="Hương vị, nguyên liệu hoặc câu chuyện của món.">
                  <Textarea id="description" rows={4} {...register("description")} />
                </Field>
              </FormSection>

              <FormSection icon={Tags} tone="violet" title="Phân loại" description="Giúp khách lọc sản phẩm trên website.">
                <Field label="Danh mục" required>
                  <Controller
                    control={control}
                    name="category"
                    render={({ field }) => (
                      <ChoiceCards
                        value={field.value}
                        onChange={field.onChange}
                        options={[
                          {
                            value: ProductCategory.DRINK,
                            label: "Đồ uống",
                            description: "Cà phê, trà và thức uống pha chế",
                            icon: Coffee,
                          },
                          {
                            value: ProductCategory.MERCHANDISE,
                            label: "Vật phẩm S.t",
                            description: "Sổ, bút, bình giữ nhiệt, túi…",
                            icon: Package,
                          },
                        ]}
                      />
                    )}
                  />
                </Field>

                {category === ProductCategory.DRINK && (
                  <Field label="Loại đồ uống">
                    <Controller
                      control={control}
                      name="drinkSubType"
                      render={({ field }) => (
                        <ChoiceChips
                          value={field.value}
                          onChange={field.onChange}
                          options={Object.values(DrinkSubType).map((t) => ({
                            value: t,
                            label: DRINK_SUB_TYPE_LABELS[t],
                            icon: DRINK_ICONS[t],
                          }))}
                        />
                      )}
                    />
                  </Field>
                )}

                {category === ProductCategory.MERCHANDISE && (
                  <Field label="Loại vật phẩm">
                    <Controller
                      control={control}
                      name="merchandiseSubType"
                      render={({ field }) => (
                        <ChoiceChips
                          value={field.value}
                          onChange={field.onChange}
                          options={Object.values(MerchandiseSubType).map((t) => ({
                            value: t,
                            label: MERCHANDISE_SUB_TYPE_LABELS[t],
                            icon: MERCH_ICONS[t],
                          }))}
                        />
                      )}
                    />
                  </Field>
                )}
              </FormSection>

              <FormSection
                icon={Images}
                tone="rose"
                title="Hình ảnh"
                description={isEdit ? "Ảnh đầu tiên được dùng làm ảnh bìa." : undefined}
              >
                {isEdit && product ? (
                  <PhotoGallery
                    photos={product.photos}
                    onAttach={(mediaId) => attachPhoto.mutateAsync(mediaId).then(() => {})}
                    onDetach={(photoId) => detachPhoto.mutateAsync(photoId).then(() => {})}
                  />
                ) : (
                  <div className="flex items-center gap-3 rounded-lg border border-dashed bg-muted/30 p-4 text-[13px] text-muted-foreground">
                    <GlassWater className="size-5 shrink-0 text-amber-600" />
                    Lưu sản phẩm trước, sau đó bạn có thể thêm hình ảnh.
                  </div>
                )}
              </FormSection>
            </>
          }
          side={
            <>
              <FormSection icon={CircleDollarSign} tone="emerald" title="Giá & hiển thị">
                <Field label="Giá bán" htmlFor="price" hint="Để trống nếu không muốn hiển thị giá.">
                  <div className="relative">
                    <Input
                      id="price"
                      inputMode="decimal"
                      placeholder="45000"
                      className="pr-12 tabular-nums"
                      {...register("price")}
                    />
                    <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs font-medium text-muted-foreground">
                      VNĐ
                    </span>
                  </div>
                </Field>
                <Controller
                  control={control}
                  name="status"
                  render={({ field }) => (
                    <ToggleRow
                      title="Đang bán"
                      description="Tắt để ẩn sản phẩm khỏi website."
                      control={
                        <Switch
                          checked={field.value === ProductStatus.ACTIVE}
                          onCheckedChange={(checked) =>
                            field.onChange(checked ? ProductStatus.ACTIVE : ProductStatus.INACTIVE)
                          }
                        />
                      }
                    />
                  )}
                />
              </FormSection>

              <PreviewCard
                image={coverPhoto}
                fallbackIcon={category === ProductCategory.DRINK ? Coffee : Package}
                imageClassName="aspect-video"
                chip={
                  <span className={toneChip(category === ProductCategory.DRINK ? "amber" : "violet")}>
                    {PRODUCT_CATEGORY_LABELS[category]}
                  </span>
                }
                title={previewName}
                titlePlaceholder="Tên sản phẩm"
                body={previewDescription}
                footer={
                  <p className="pt-1 text-sm font-semibold text-amber-700 tabular-nums dark:text-amber-300">
                    {previewPrice ? formatPrice(previewPrice) : "Liên hệ"}
                  </p>
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
        submitLabel={isEdit ? "Lưu thay đổi" : "Tạo sản phẩm"}
      />
    </div>
  );
}

export default function ProductFormPage() {
  return (
    <Suspense fallback={<FormSkeleton />}>
      <ProductFormInner />
    </Suspense>
  );
}
