"use client";

import { useState } from "react";
import { toast } from "sonner";
import { ArrowDown, ArrowUp, ListChecks, Loader2, Plus, Save, ScrollText, Trash2, Type } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageUploader } from "@/components/upload/image-uploader";
import { Switch } from "@/components/ui/switch";
import { ToggleRow } from "@/components/common/choice";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/common/page-header";
import { Field, FormSection, FormSkeleton } from "@/components/common/form";
import { useUnsavedChangesWarning } from "@/components/common/form-action-bar";
import { TiptapEditor } from "@/components/rich-text/tiptap-editor";
import { NoticesView, PeopleView } from "@/components/site/internal-pages";
import { SitePreview } from "@/components/site/site-preview";
import {
  useInternalNoticesQuery,
  useInternalPeopleQuery,
  useUpdateInternalNotices,
  useUpdateInternalPeople,
  type InternalNotices,
  type InternalPeople,
} from "@/hooks/use-site-settings";

const TRIGGER_CLASS =
  "data-active:bg-amber-50 data-active:text-amber-900 dark:data-active:bg-amber-500/15 dark:data-active:text-amber-100";

const validLink = (url: string) => url === "" || /^https?:\/\/\S+$/i.test(url) || /^\/(?!\/)\S*$/.test(url);

function SaveButton({
  dirty,
  pending,
  onClick,
}: {
  dirty: boolean;
  pending: boolean;
  onClick: () => void;
}) {
  return (
    <div className="flex items-center gap-2">
      {dirty && (
        <span className="hidden items-center gap-1.5 text-xs font-medium text-amber-700 sm:inline-flex dark:text-amber-300">
          <span className="size-1.5 rounded-full bg-amber-500" />
          Chưa lưu
        </span>
      )}
      <Button onClick={onClick} disabled={pending || !dirty}>
        {pending ? <Loader2 className="animate-spin" /> : <Save />}
        {pending ? "Đang lưu..." : "Lưu"}
      </Button>
    </div>
  );
}

// ── Thông báo ─────────────────────────────────────────────────────────────

function NoticesEditor({ initial }: { initial: InternalNotices }) {
  const update = useUpdateInternalNotices();
  const [saved, setSaved] = useState(initial);
  const [draft, setDraft] = useState(initial);
  const dirty = JSON.stringify(draft) !== JSON.stringify(saved);
  useUnsavedChangesWarning(dirty);

  const setItem = (i: number, patch: Partial<InternalNotices["items"][number]>) =>
    setDraft((d) => ({ ...d, items: d.items.map((it, j) => (j === i ? { ...it, ...patch } : it)) }));
  const move = (i: number, dir: -1 | 1) =>
    setDraft((d) => {
      const items = [...d.items];
      const j = i + dir;
      if (j < 0 || j >= items.length) return d;
      [items[i], items[j]] = [items[j], items[i]];
      return { ...d, items };
    });
  const remove = (i: number) =>
    setDraft((d) => ({ ...d, items: d.items.filter((_, j) => j !== i) }));
  const add = () => setDraft((d) => ({ ...d, items: [...d.items, { title: "", url: "" }] }));

  const hasBadLink = draft.items.some((it) => !validLink(it.url.trim()));

  const handleSave = async () => {
    if (hasBadLink) {
      toast.error("Có liên kết không hợp lệ — dùng https://… hoặc đường dẫn bắt đầu bằng /");
      return;
    }
    try {
      const result = await update.mutateAsync(draft);
      setSaved(result);
      setDraft(result);
      toast.success("Đã lưu trang Thông Báo");
    } catch {
      toast.error("Lưu thất bại");
    }
  };

  const shown = draft.items.filter((it) => it.title.trim());

  return (
    <div className="max-w-4xl space-y-6">
      <FormSection
        title="Đầu trang"
        description="Dòng chữ trên ảnh banner, tiêu đề và khối đỏ dưới tiêu đề."
        icon={Type}
        tone="pink"
        aside={<SaveButton dirty={dirty} pending={update.isPending} onClick={handleSave} />}
      >
        <Field label="Ảnh banner">
          <ImageUploader
            value={draft.bannerUrl ? { url: draft.bannerUrl } : null}
            onUploaded={(m) => setDraft({ ...draft, bannerUrl: m.url })}
            onRemove={() => setDraft({ ...draft, bannerUrl: "" })}
          />
        </Field>
        <ToggleRow
          title="Logo S+ COFFEE mờ ở nền"
          description="Hiện chữ S+ COFFEE mờ phía sau nội dung (xem được ở phần xem trước bên dưới)."
          control={
            <Switch
              checked={draft.showWatermark}
              onCheckedChange={(v) => setDraft({ ...draft, showWatermark: v })}
            />
          }
        />
        <Field label="Câu trên ảnh banner" htmlFor="notice-slogan" hint="Xuống dòng để tách thành nhiều dòng.">
          <Textarea
            id="notice-slogan"
            rows={2}
            value={draft.slogan}
            onChange={(e) => setDraft({ ...draft, slogan: e.target.value })}
          />
        </Field>
        <Field label="Tiêu đề" htmlFor="notice-title">
          <Input
            id="notice-title"
            value={draft.title}
            onChange={(e) => setDraft({ ...draft, title: e.target.value })}
          />
        </Field>
        <Field label="Câu trong khối đỏ" htmlFor="notice-intro">
          <Input
            id="notice-intro"
            value={draft.intro}
            onChange={(e) => setDraft({ ...draft, intro: e.target.value })}
          />
        </Field>
      </FormSection>

      <FormSection
        title="Mục lục"
        description="Mỗi mục là một dòng; nút “Chi Tiết” mở liên kết bạn nhập. Để trống liên kết thì dòng đó không có nút. Mục không có tên sẽ bị bỏ."
        icon={ListChecks}
        tone="indigo"
      >
        <Field label="Tiêu đề mục lục" htmlFor="notice-toc">
          <Input
            id="notice-toc"
            value={draft.tocTitle}
            onChange={(e) => setDraft({ ...draft, tocTitle: e.target.value })}
          />
        </Field>
        <div className="space-y-3">
          {draft.items.map((item, i) => {
            const bad = !validLink(item.url.trim());
            return (
              <div
                key={i}
                className="grid grid-cols-1 gap-2 rounded-xl border bg-muted/20 p-3 sm:grid-cols-[2rem_1fr_1.4fr_auto] sm:items-start"
              >
                <span className="hidden size-8 items-center justify-center rounded-full bg-card text-xs font-semibold tabular-nums shadow-xs sm:flex">
                  {i + 1}
                </span>
                <Input
                  aria-label={`Tên mục ${i + 1}`}
                  placeholder="Tên mục, vd: Lịch Làm"
                  value={item.title}
                  onChange={(e) => setItem(i, { title: e.target.value })}
                />
                <div>
                  <Input
                    aria-label={`Liên kết mục ${i + 1}`}
                    placeholder="https://… hoặc /đường-dẫn"
                    value={item.url}
                    aria-invalid={bad}
                    onChange={(e) => setItem(i, { url: e.target.value })}
                  />
                  {bad && (
                    <p className="mt-1 text-xs text-destructive">
                      Dùng https://… hoặc đường dẫn bắt đầu bằng /
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Chuyển lên"
                    disabled={i === 0}
                    onClick={() => move(i, -1)}
                  >
                    <ArrowUp />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Chuyển xuống"
                    disabled={i === draft.items.length - 1}
                    onClick={() => move(i, 1)}
                  >
                    <ArrowDown />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Xoá mục"
                    className="text-destructive hover:text-destructive"
                    onClick={() => remove(i)}
                  >
                    <Trash2 />
                  </Button>
                </div>
              </div>
            );
          })}
          <Button type="button" variant="outline" onClick={add}>
            <Plus />
            Thêm mục
          </Button>
        </div>
        <Field label="Câu kết (chữ đỏ, căn giữa)" htmlFor="notice-closing">
          <Input
            id="notice-closing"
            value={draft.closing}
            onChange={(e) => setDraft({ ...draft, closing: e.target.value })}
          />
        </Field>
      </FormSection>

      <SitePreview label="Xem trước trang Thông Báo">
        <div className="-m-4 overflow-hidden">
          <NoticesView data={{ ...draft, items: shown }} preview />
        </div>
      </SitePreview>
    </div>
  );
}

// ── Con người phù hợp ─────────────────────────────────────────────────────

function PeopleEditor({ initial }: { initial: InternalPeople }) {
  const update = useUpdateInternalPeople();
  const [saved, setSaved] = useState(initial);
  const [draft, setDraft] = useState(initial);
  const dirty = JSON.stringify(draft) !== JSON.stringify(saved);
  useUnsavedChangesWarning(dirty);

  const handleSave = async () => {
    try {
      const result = await update.mutateAsync(draft);
      setSaved(result);
      setDraft(result);
      toast.success("Đã lưu trang Con người phù hợp");
    } catch {
      toast.error("Lưu thất bại");
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <FormSection
        title="Đầu trang"
        description="Dòng chữ trên ảnh banner, tiêu đề và khối đỏ dưới tiêu đề."
        icon={Type}
        tone="pink"
        aside={<SaveButton dirty={dirty} pending={update.isPending} onClick={handleSave} />}
      >
        <Field label="Ảnh banner">
          <ImageUploader
            value={draft.bannerUrl ? { url: draft.bannerUrl } : null}
            onUploaded={(m) => setDraft({ ...draft, bannerUrl: m.url })}
            onRemove={() => setDraft({ ...draft, bannerUrl: "" })}
          />
        </Field>
        <ToggleRow
          title="Logo S+ COFFEE mờ ở nền"
          description="Hiện chữ S+ COFFEE mờ phía sau nội dung (xem được ở phần xem trước bên dưới)."
          control={
            <Switch
              checked={draft.showWatermark}
              onCheckedChange={(v) => setDraft({ ...draft, showWatermark: v })}
            />
          }
        />
        <Field label="Câu trên ảnh banner" htmlFor="people-slogan" hint="Xuống dòng để tách thành nhiều dòng.">
          <Textarea
            id="people-slogan"
            rows={2}
            value={draft.slogan}
            onChange={(e) => setDraft({ ...draft, slogan: e.target.value })}
          />
        </Field>
        <Field label="Tiêu đề" htmlFor="people-title">
          <Input
            id="people-title"
            value={draft.title}
            onChange={(e) => setDraft({ ...draft, title: e.target.value })}
          />
        </Field>
        <Field label="Câu trong khối đỏ" htmlFor="people-lead">
          <Textarea
            id="people-lead"
            rows={2}
            value={draft.lead}
            onChange={(e) => setDraft({ ...draft, lead: e.target.value })}
          />
        </Field>
      </FormSection>

      <FormSection
        title="Phần giới thiệu"
        description="Các gạch đầu dòng và câu nhấn bên dưới."
        icon={ListChecks}
        tone="indigo"
      >
        <Field label="Gạch đầu dòng">
          <TiptapEditor value={draft.intro} onChange={(intro) => setDraft({ ...draft, intro })} />
        </Field>
        <Field label="Câu nhấn (chữ đỏ, căn giữa)" htmlFor="people-highlight">
          <Input
            id="people-highlight"
            value={draft.highlight}
            onChange={(e) => setDraft({ ...draft, highlight: e.target.value })}
          />
        </Field>
      </FormSection>

      <FormSection
        title="Chi tiết"
        description="Nút đỏ, các mục I, II, III… (mỗi tiêu đề H2 là một mục) và câu kết."
        icon={ScrollText}
        tone="rose"
      >
        <Field label="Chữ trên nút đỏ" htmlFor="people-detail">
          <Input
            id="people-detail"
            value={draft.detailTitle}
            onChange={(e) => setDraft({ ...draft, detailTitle: e.target.value })}
          />
        </Field>
        <Field label="Các mục">
          <TiptapEditor value={draft.content} onChange={(content) => setDraft({ ...draft, content })} />
        </Field>
        <Field label="Câu kết (chữ đỏ, căn giữa)" htmlFor="people-closing">
          <Input
            id="people-closing"
            value={draft.closing}
            onChange={(e) => setDraft({ ...draft, closing: e.target.value })}
          />
        </Field>
      </FormSection>

      <SitePreview label="Xem trước trang Con người phù hợp">
        <div className="-m-4 overflow-hidden">
          <PeopleView data={draft} />
        </div>
      </SitePreview>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────

function NoticesTab() {
  const { data } = useInternalNoticesQuery();
  return data ? <NoticesEditor initial={data} /> : <FormSkeleton />;
}

function PeopleTab() {
  const { data } = useInternalPeopleQuery();
  return data ? <PeopleEditor initial={data} /> : <FormSkeleton />;
}

export default function InternalPagesAdmin() {
  const [tab, setTab] = useState("notices");
  return (
    <div>
      <PageHeader module="/admin/dashboard/internal-pages" />
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="mb-4 h-10! bg-card p-1 shadow-xs ring-1 ring-border">
          <TabsTrigger value="notices" className={TRIGGER_CLASS}>
            Thông báo
          </TabsTrigger>
          <TabsTrigger value="people" className={TRIGGER_CLASS}>
            Con người phù hợp
          </TabsTrigger>
        </TabsList>
        <TabsContent value="notices">
          <NoticesTab />
        </TabsContent>
        <TabsContent value="people">
          <PeopleTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
