"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Eye, ImageIcon, Layers, Loader2, Plus, Quote, Save, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/common/page-header";
import { Field, FormSection, FormSkeleton } from "@/components/common/form";
import { ToggleRow } from "@/components/common/choice";
import { useUnsavedChangesWarning } from "@/components/common/form-action-bar";
import { ImageUploader } from "@/components/upload/image-uploader";
import { HomeHero, HomeSpace, HomeStory } from "@/components/site/home-sections";
import {
  useHomeSettingsQuery,
  useUpdateHomeSettings,
  type HomeSettings,
} from "@/hooks/use-site-settings";

const MAX_SLIDES = 8;

/** The real home-page component, framed so it reads as "what visitors see". */
function Preview({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-2 space-y-2">
      <p className="flex items-center gap-1.5 text-[13px] font-semibold text-muted-foreground">
        <Eye className="size-4" /> Xem trước trên website
      </p>
      <div
        className="isolate overflow-hidden rounded-xl bg-[#f3e9dc] text-stone-900 shadow-lg ring-1 ring-border"
      >
        {children}
      </div>
    </div>
  );
}

function SectionSwitch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <label className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
      <span className="hidden sm:inline">{checked ? "Đang hiển thị" : "Đang ẩn"}</span>
      <Switch checked={checked} onCheckedChange={onChange} aria-label={label} />
    </label>
  );
}

function HomeEditor({ initial }: { initial: HomeSettings }) {
  const update = useUpdateHomeSettings();
  const [saved, setSaved] = useState(initial);
  const [draft, setDraft] = useState(initial);
  const dirty = JSON.stringify(draft) !== JSON.stringify(saved);
  useUnsavedChangesWarning(dirty);

  const patch = <K extends keyof HomeSettings>(key: K, value: Partial<HomeSettings[K]>) =>
    setDraft((d) => ({ ...d, [key]: { ...d[key], ...value } }));

  const handleSave = async () => {
    try {
      const result = await update.mutateAsync(draft);
      setSaved(result);
      setDraft(result);
      toast.success("Đã lưu trang chủ");
    } catch {
      toast.error("Lưu thất bại");
    }
  };

  const { hero, story, space, sections } = draft;

  return (
    <div>
      <PageHeader
        module="/admin/dashboard/home"
        actions={
          <div className="flex items-center gap-3">
            {dirty && (
              <span className="hidden items-center gap-1.5 text-xs font-medium text-amber-700 sm:inline-flex dark:text-amber-300">
                <span className="size-1.5 rounded-full bg-amber-500" />
                Chưa lưu
              </span>
            )}
            <Button onClick={handleSave} disabled={update.isPending || !dirty}>
              {update.isPending ? <Loader2 className="animate-spin" /> : <Save />}
              {update.isPending ? "Đang lưu..." : "Lưu trang chủ"}
            </Button>
          </div>
        }
      />

      <div className="max-w-4xl space-y-6">
        {/* ── Hero ─────────────────────────────────────────────── */}
        <FormSection
          title="Banner đầu trang"
          description="Ảnh trượt, tiêu đề và câu giới thiệu ngay đầu trang."
          icon={ImageIcon}
          tone="rose"
          aside={
            <SectionSwitch
              checked={hero.enabled}
              onChange={(enabled) => patch("hero", { enabled })}
              label="Hiển thị banner"
            />
          }
        >
          <Field label="Tiêu đề" htmlFor="hero-heading">
            <Input
              id="hero-heading"
              value={hero.heading}
              onChange={(e) => patch("hero", { heading: e.target.value })}
            />
          </Field>
          <Field label="Câu giới thiệu" htmlFor="hero-tagline">
            <Input
              id="hero-tagline"
              value={hero.tagline}
              onChange={(e) => patch("hero", { tagline: e.target.value })}
            />
          </Field>
          <Field
            label="Chữ trên nút"
            htmlFor="hero-cta"
            hint="Để trống để ẩn nút (nút cuộn xuống phần Câu chuyện)."
          >
            <Input
              id="hero-cta"
              value={hero.ctaLabel}
              onChange={(e) => patch("hero", { ctaLabel: e.target.value })}
            />
          </Field>
          <Field label={`Ảnh trượt (${hero.slides.length}/${MAX_SLIDES})`}>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {hero.slides.map((slide, i) => (
                <div key={`${slide.url}-${i}`} className="relative">
                  <ImageUploader
                    value={slide}
                    onUploaded={(m) =>
                      patch("hero", {
                        slides: hero.slides.map((s, j) => (j === i ? { url: m.url } : s)),
                      })
                    }
                    onRemove={() =>
                      patch("hero", { slides: hero.slides.filter((_, j) => j !== i) })
                    }
                  />
                  <span className="pointer-events-none absolute top-2 left-2 rounded-full bg-black/60 px-2 py-0.5 text-[11px] font-medium text-white">
                    {i + 1}
                  </span>
                </div>
              ))}
              {hero.slides.length < MAX_SLIDES && (
                <div>
                  <p className="mb-2 flex items-center gap-1 text-xs text-muted-foreground">
                    <Plus className="size-3.5" /> Thêm ảnh
                  </p>
                  <ImageUploader
                    value={null}
                    onUploaded={(m) =>
                      patch("hero", { slides: [...hero.slides, { url: m.url }] })
                    }
                  />
                </div>
              )}
            </div>
          </Field>
          <Preview>
            <HomeHero config={{ ...hero, enabled: true }} />
          </Preview>
        </FormSection>

        {/* ── Câu chuyện ───────────────────────────────────────── */}
        <FormSection
          title="Giới thiệu ngắn"
          description="Khối “Gần Gũi - Ấm Áp - Chuyên Nghiệp”: tiêu đề, đoạn văn và ảnh minh hoạ."
          icon={Quote}
          tone="orange"
          aside={
            <SectionSwitch
              checked={story.enabled}
              onChange={(enabled) => patch("story", { enabled })}
              label="Hiển thị giới thiệu"
            />
          }
        >
          <Field label="Tiêu đề" htmlFor="story-title">
            <Input
              id="story-title"
              value={story.title}
              onChange={(e) => patch("story", { title: e.target.value })}
            />
          </Field>
          <Field label="Nội dung" htmlFor="story-body">
            <Textarea
              id="story-body"
              rows={4}
              value={story.body}
              onChange={(e) => patch("story", { body: e.target.value })}
            />
          </Field>
          <Field label="Nhãn trên ảnh" htmlFor="story-badge" hint="Để trống để ẩn nhãn.">
            <Input
              id="story-badge"
              value={story.badge}
              onChange={(e) => patch("story", { badge: e.target.value })}
            />
          </Field>
          <Field label="Ảnh minh hoạ">
            <div className="max-w-sm">
              <ImageUploader
                value={story.imageUrl ? { url: story.imageUrl } : null}
                onUploaded={(m) => patch("story", { imageUrl: m.url })}
                onRemove={() => patch("story", { imageUrl: "" })}
              />
            </div>
          </Field>
          <Preview>
            <HomeStory config={{ ...story, enabled: true }} />
          </Preview>
        </FormSection>

        {/* ── Không gian ───────────────────────────────────────── */}
        <FormSection
          title="Không gian"
          description="Ảnh nền rộng kèm tiêu đề và dòng chữ nhỏ."
          icon={Sparkles}
          tone="indigo"
          aside={
            <SectionSwitch
              checked={space.enabled}
              onChange={(enabled) => patch("space", { enabled })}
              label="Hiển thị không gian"
            />
          }
        >
          <Field label="Tiêu đề" htmlFor="space-title">
            <Input
              id="space-title"
              value={space.title}
              onChange={(e) => patch("space", { title: e.target.value })}
            />
          </Field>
          <Field label="Dòng chữ nhỏ" htmlFor="space-tagline">
            <Input
              id="space-tagline"
              value={space.tagline}
              onChange={(e) => patch("space", { tagline: e.target.value })}
            />
          </Field>
          <Field label="Ảnh nền">
            <ImageUploader
              value={space.imageUrl ? { url: space.imageUrl } : null}
              onUploaded={(m) => patch("space", { imageUrl: m.url })}
              onRemove={() => patch("space", { imageUrl: "" })}
            />
          </Field>
          <Preview>
            <HomeSpace config={{ ...space, enabled: true }} />
          </Preview>
        </FormSection>

        {/* ── Các mục lấy từ tab khác ──────────────────────────── */}
        <FormSection
          title="Các mục lấy dữ liệu từ tab khác"
          description="Nội dung nhập ở các tab Sản phẩm, Cửa hàng, Tin tức, Tuyển dụng. Ở đây chỉ bật/tắt việc hiển thị ở trang chủ — mục nào chưa có dữ liệu sẽ tự ẩn."
          icon={Layers}
          tone="teal"
        >
          {(
            [
              ["newProducts", "Sản phẩm mới", "Các sản phẩm được bật “Sản phẩm mới” ở tab Sản phẩm."],
              ["stores", "Cửa hàng", "Các cửa hàng đang hoạt động."],
              ["news", "Tin tức - Sự kiện", "Các bài viết đã xuất bản gần nhất (không gồm “Cho đi”)."],
              ["giveBack", "Cho đi", "Các bài viết thuộc loại “Cho đi”."],
              ["jobs", "Tuyển dụng", "Các vị trí đang mở."],
            ] as const
          ).map(([key, title, description]) => (
            <ToggleRow
              key={key}
              title={title}
              description={description}
              control={
                <Switch
                  checked={sections[key]}
                  onCheckedChange={(v) => patch("sections", { [key]: v })}
                />
              }
            />
          ))}
        </FormSection>
      </div>
    </div>
  );
}

export default function HomeSettingsPage() {
  const { data, isLoading } = useHomeSettingsQuery();
  if (isLoading || !data) return <FormSkeleton />;
  return <HomeEditor initial={data} />;
}
