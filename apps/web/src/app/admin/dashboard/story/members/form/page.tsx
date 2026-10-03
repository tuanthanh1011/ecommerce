"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Camera, Crown, Loader2, Save, Sparkles, UserRound, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LinkButton } from "@/components/ui/link-button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/common/page-header";
import { Field, FormLayout, FormSection, FormSkeleton } from "@/components/common/form";
import { ChoiceCards } from "@/components/common/choice";
import { FormActionBar } from "@/components/common/form-action-bar";
import { PreviewFrame, PreviewText } from "@/components/common/preview-card";
import { ImageUploader } from "@/components/upload/image-uploader";
import {
  useCreateTeamMember,
  useTeamMembersQuery,
  useUpdateTeamMember,
} from "@/hooks/use-story";
import { TeamMemberGroup, TEAM_MEMBER_GROUP_LABELS } from "@/lib/constants";
import { initials } from "@/lib/format";

const schema = z.object({
  name: z.string().min(1, "Bắt buộc"),
  role: z.string().min(1, "Bắt buộc"),
  bio: z.string(),
  group: z.nativeEnum(TeamMemberGroup),
  photoId: z.string().optional(),
});

type Values = z.infer<typeof schema>;

const FORM_ID = "member-form";
const BIO_MAX = 300;

function MemberFormInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id") ?? undefined;
  const groupParam = searchParams.get("group") as TeamMemberGroup | null;
  const isEdit = !!id;

  const { data: members, isLoading } = useTeamMembersQuery();
  const member = id ? members?.find((m) => m.id === id) : undefined;
  const createMember = useCreateTeamMember();
  const updateMember = useUpdateTeamMember(id ?? "");
  const [uploaded, setUploaded] = useState<{ url: string } | null>(null);

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
    defaultValues: {
      name: "",
      role: "",
      bio: "",
      group: groupParam ?? TeamMemberGroup.CORE_TEAM,
    },
    values: member
      ? {
          name: member.name,
          role: member.role,
          bio: member.bio ?? "",
          group: member.group,
          photoId: member.photoId ?? undefined,
        }
      : undefined,
  });

  const [name, role, bio, group, photoId] = watch(["name", "role", "bio", "group", "photoId"]);
  const photo =
    uploaded ?? (member?.photo && photoId === member.photoId ? member.photo : null);

  // Return to the tab this member belongs to.
  const backHref = `/admin/dashboard/story/?tab=${
    group === TeamMemberGroup.ADVISORY_BOARD ? "advisory" : "core-team"
  }`;

  const onSubmit = async (raw: Values) => {
    // Raw values: an emptied bio must reach the API as "" to be cleared.
    const values = raw;
    try {
      if (isEdit) {
        await updateMember.mutateAsync(values);
        toast.success("Đã cập nhật thành viên");
      } else {
        await createMember.mutateAsync(values);
        toast.success("Đã thêm thành viên");
        router.replace(backHref);
      }
    } catch {
      toast.error("Lưu thất bại");
    }
  };

  if (isEdit && isLoading) return <FormSkeleton />;

  return (
    <div>
      <PageHeader
        module="/admin/dashboard/story"
        backHref={backHref}
        title={isEdit ? member?.name ?? "Sửa thành viên" : "Thêm thành viên"}
        description={
          isEdit
            ? `${TEAM_MEMBER_GROUP_LABELS[group]} · Trang Câu chuyện S.t`
            : "Giới thiệu một gương mặt mới trên trang Câu chuyện S.t"
        }
        actions={
          <>
            <LinkButton href={backHref} variant="outline">
              Huỷ
            </LinkButton>
            <Button type="submit" form={FORM_ID} disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="animate-spin" /> : <Save />}
              {isSubmitting ? "Đang lưu..." : isEdit ? "Lưu thay đổi" : "Thêm thành viên"}
            </Button>
          </>
        }
      />

      <form id={FORM_ID} onSubmit={handleSubmit(onSubmit)}>
        <FormLayout
          main={
            <>
              <FormSection icon={UserRound} tone="orange" title="Thông tin thành viên" description="Tên và vai trò hiển thị dưới ảnh đại diện.">
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Họ tên" htmlFor="name" required error={errors.name?.message}>
                    <Input id="name" placeholder="VD: Nguyễn Minh Anh" {...register("name")} />
                  </Field>
                  <Field label="Vai trò" htmlFor="role" required error={errors.role?.message}>
                    <Input id="role" placeholder="VD: Head Barista" {...register("role")} />
                  </Field>
                </div>
                <Field
                  label="Giới thiệu"
                  htmlFor="bio"
                  hint={`${bio?.length ?? 0}/${BIO_MAX} ký tự · Một vài dòng về hành trình, sở thích hoặc câu nói yêu thích.`}
                >
                  <Textarea id="bio" rows={5} maxLength={BIO_MAX} {...register("bio")} />
                </Field>
              </FormSection>

              <FormSection icon={Users} tone="violet" title="Nhóm" description="Thành viên xuất hiện trong tab tương ứng.">
                <Controller
                  control={control}
                  name="group"
                  render={({ field }) => (
                    <ChoiceCards
                      value={field.value}
                      onChange={field.onChange}
                      options={[
                        {
                          value: TeamMemberGroup.CORE_TEAM,
                          label: TEAM_MEMBER_GROUP_LABELS[TeamMemberGroup.CORE_TEAM],
                          description: "Những người vận hành S.t mỗi ngày",
                          icon: Crown,
                        },
                        {
                          value: TeamMemberGroup.ADVISORY_BOARD,
                          label: TEAM_MEMBER_GROUP_LABELS[TeamMemberGroup.ADVISORY_BOARD],
                          description: "Chuyên gia đồng hành và định hướng",
                          icon: Sparkles,
                        },
                      ]}
                    />
                  )}
                />
              </FormSection>
            </>
          }
          side={
            <>
              <FormSection icon={Camera} tone="rose" title="Ảnh đại diện" description="Ảnh vuông, khuôn mặt rõ nét.">
                <div className="flex justify-center">
                  <ImageUploader
                    aspect="square"
                    value={photo}
                    onUploaded={(media) => {
                      setValue("photoId", media.id, { shouldDirty: true });
                      setUploaded({ url: media.url });
                    }}
                    onRemove={() => {
                      setValue("photoId", undefined, { shouldDirty: true });
                      setUploaded(null);
                    }}
                  />
                </div>
              </FormSection>

              <PreviewFrame>
                <div className="relative flex flex-col items-center px-5 pt-7 pb-5 text-center">
                  <div className="absolute inset-x-0 top-0 h-16 bg-linear-to-br from-amber-100 via-orange-50 to-rose-100 dark:from-amber-500/15 dark:via-orange-500/5 dark:to-rose-500/10" />
                  <div className="relative size-20 overflow-hidden rounded-full bg-muted shadow-md ring-4 ring-card">
                    {photo?.url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={photo.url} alt="" className="size-full object-cover" />
                    ) : (
                      <span className="flex size-full items-center justify-center bg-linear-to-br from-amber-400 to-orange-600 text-lg font-semibold text-white">
                        {name ? initials(name) : "?"}
                      </span>
                    )}
                  </div>
                  <p className="relative mt-3 font-semibold">
                    <PreviewText value={name} placeholder="Họ tên" />
                  </p>
                  <p className="relative text-[13px] text-amber-700 dark:text-amber-300">
                    <PreviewText value={role} placeholder="Vai trò" />
                  </p>
                  {bio && (
                    <p className="relative mt-2 line-clamp-3 text-xs text-muted-foreground">{bio}</p>
                  )}
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
          setUploaded(null);
        }}
        submitLabel={isEdit ? "Lưu thay đổi" : "Thêm thành viên"}
      />
    </div>
  );
}

export default function MemberFormPage() {
  return (
    <Suspense fallback={<FormSkeleton />}>
      <MemberFormInner />
    </Suspense>
  );
}
