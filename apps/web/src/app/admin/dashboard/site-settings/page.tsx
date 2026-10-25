"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Clock, Link2, Phone } from "lucide-react";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/common/page-header";
import { Field, FormLayout, FormSection, FormSkeleton } from "@/components/common/form";
import { FormActionBar } from "@/components/common/form-action-bar";
import { PreviewFrame } from "@/components/common/preview-card";
import { SiteFooterView } from "@/components/site/site-footer";
import {
  useContactSettingsQuery,
  useUpdateContactSettings,
} from "@/hooks/use-site-settings";

const FORM_ID = "contact-settings-form";

// Empty is allowed (= not shown on the site); otherwise it must be a real link.
const optionalUrl = z
  .string()
  .refine((v) => v === "" || /^https?:\/\/\S+$/i.test(v), "Link phải bắt đầu bằng http:// hoặc https://");

const schema = z.object({
  closingMessage: z.string().max(300, "Tối đa 300 ký tự"),
  phone: z.string().max(30, "Tối đa 30 ký tự"),
  openingHours: z.string().max(200, "Tối đa 200 ký tự"),
  facebookUrl: optionalUrl,
  instagramUrl: optionalUrl,
  youtubeUrl: optionalUrl,
  tiktokUrl: optionalUrl,
  chatUrl: optionalUrl,
});

type Values = z.infer<typeof schema>;

const EMPTY: Values = {
  closingMessage: "",
  phone: "",
  openingHours: "",
  facebookUrl: "",
  instagramUrl: "",
  youtubeUrl: "",
  tiktokUrl: "",
  chatUrl: "",
};

export default function SiteSettingsPage() {
  const { data, isLoading } = useContactSettingsQuery();
  const update = useUpdateContactSettings();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: EMPTY,
    values: data ? { ...EMPTY, ...data } : undefined,
  });

  const onSubmit = async (values: Values) => {
    try {
      const saved = await update.mutateAsync(values);
      reset({ ...EMPTY, ...saved });
      toast.success("Đã lưu thông tin liên hệ");
    } catch {
      toast.error("Lưu thất bại");
    }
  };

  if (isLoading) return <FormSkeleton />;

  const live = watch();

  return (
    <div>
      <PageHeader module="/admin/dashboard/site-settings" />
      <form id={FORM_ID} onSubmit={handleSubmit(onSubmit)}>
        <FormLayout
          main={
            <>
              <FormSection
                title="Liên hệ"
                description="Để trống mục nào thì mục đó không hiển thị trên website."
                icon={Phone}
                tone="teal"
              >
                <Field
                  label="Lời cảm ơn"
                  htmlFor="closingMessage"
                  error={errors.closingMessage?.message}
                  hint="Dòng chữ lớn ở đầu chân trang."
                >
                  <Input id="closingMessage" {...register("closingMessage")} />
                </Field>
                <Field label="Số điện thoại" htmlFor="phone" error={errors.phone?.message}>
                  <Input id="phone" placeholder="098.307.8869" {...register("phone")} />
                </Field>
              </FormSection>

              <FormSection title="Giờ mở cửa" icon={Clock} tone="amber">
                <Field label="Giờ mở cửa" htmlFor="openingHours" error={errors.openingHours?.message}>
                  <Input
                    id="openingHours"
                    placeholder="Giờ mở cửa S+ : 7h30 - 23h30 hàng tuần"
                    {...register("openingHours")}
                  />
                </Field>
              </FormSection>

              <FormSection
                title="Mạng xã hội"
                description="Dán đường link đầy đủ, bắt đầu bằng https://"
                icon={Link2}
                tone="sky"
              >
                <Field label="Facebook" htmlFor="facebookUrl" error={errors.facebookUrl?.message}>
                  <Input id="facebookUrl" placeholder="https://facebook.com/..." {...register("facebookUrl")} />
                </Field>
                <Field label="Instagram" htmlFor="instagramUrl" error={errors.instagramUrl?.message}>
                  <Input id="instagramUrl" placeholder="https://instagram.com/..." {...register("instagramUrl")} />
                </Field>
                <Field label="YouTube" htmlFor="youtubeUrl" error={errors.youtubeUrl?.message}>
                  <Input id="youtubeUrl" placeholder="https://youtube.com/@..." {...register("youtubeUrl")} />
                </Field>
                <Field label="TikTok" htmlFor="tiktokUrl" error={errors.tiktokUrl?.message}>
                  <Input id="tiktokUrl" placeholder="https://tiktok.com/@..." {...register("tiktokUrl")} />
                </Field>
                <Field
                  label="Chat (Zalo, Messenger...)"
                  htmlFor="chatUrl"
                  error={errors.chatUrl?.message}
                >
                  <Input id="chatUrl" placeholder="https://zalo.me/..." {...register("chatUrl")} />
                </Field>
              </FormSection>
            </>
          }
          side={
            <PreviewFrame label="Xem trước chân trang">
              <SiteFooterView contact={live} />
            </PreviewFrame>
          }
        />
        <FormActionBar
          formId={FORM_ID}
          dirty={isDirty}
          submitting={isSubmitting}
          onDiscard={() => reset()}
        />
      </form>
    </div>
  );
}
