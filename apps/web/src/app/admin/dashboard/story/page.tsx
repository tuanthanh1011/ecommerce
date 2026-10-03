"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Compass, Heart, Loader2, Plus, Save, Sparkles, Users } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/common/page-header";
import { EmptyState } from "@/components/common/empty-state";
import { Field, FormSection } from "@/components/common/form";
import { EditAction } from "@/components/common/row-actions";
import { DeleteButton } from "@/components/common/confirm-dialog";
import { useUnsavedChangesWarning } from "@/components/common/form-action-bar";
import { TiptapEditor } from "@/components/rich-text/tiptap-editor";
import {
  useStoryBlocksQuery,
  useTeamMembersQuery,
  useUpsertStoryBlock,
  useDeleteTeamMember,
} from "@/hooks/use-story";
import { TeamMemberGroup } from "@/lib/constants";
import type { Tone } from "@/lib/tones";
import { initials } from "@/lib/format";

const BLOCK_DEFS: {
  slug: string;
  defaultTitle: string;
  icon: typeof Compass;
  tone: Tone;
  hint: string;
}[] = [
  {
    slug: "huong-di",
    defaultTitle: "Hướng đi",
    icon: Compass,
    tone: "orange",
    hint: "Tầm nhìn và định hướng phát triển của S.t",
  },
  {
    slug: "cot-loi-van-hoa",
    defaultTitle: "Cốt lõi & Văn hoá",
    icon: Heart,
    tone: "rose",
    hint: "Giá trị cốt lõi và văn hoá làm việc",
  },
];

function StoryBlockEditor({ slug, defaultTitle, icon, tone, hint }: (typeof BLOCK_DEFS)[number]) {
  const { data: blocks } = useStoryBlocksQuery();
  const block = blocks?.find((b) => b.slug === slug);
  const [title, setTitle] = useState(block?.title ?? defaultTitle);
  const [content, setContent] = useState(block?.content ?? "");
  const [saved, setSaved] = useState({ title: block?.title ?? defaultTitle, content: block?.content ?? "" });
  const [loadedFromServer, setLoadedFromServer] = useState(false);
  const upsert = useUpsertStoryBlock(slug);

  useEffect(() => {
    if (block && !loadedFromServer) {
      setTitle(block.title);
      setContent(block.content);
      setSaved({ title: block.title, content: block.content });
      setLoadedFromServer(true);
    }
  }, [block, loadedFromServer]);

  const dirty = title !== saved.title || content !== saved.content;
  useUnsavedChangesWarning(dirty);

  const handleSave = async () => {
    try {
      await upsert.mutateAsync({ title, content, isPublished: true });
      setSaved({ title, content });
      toast.success(`Đã lưu “${title}”`);
    } catch {
      toast.error("Lưu thất bại");
    }
  };

  return (
    <FormSection
      icon={icon}
      tone={tone}
      title={title || defaultTitle}
      description={hint}
      aside={
        <div className="flex items-center gap-2">
          {dirty && (
            <span className="hidden items-center gap-1.5 text-xs font-medium text-amber-700 sm:inline-flex dark:text-amber-300">
              <span className="size-1.5 rounded-full bg-amber-500" />
              Chưa lưu
            </span>
          )}
          <Button onClick={handleSave} disabled={upsert.isPending || !dirty}>
            {upsert.isPending ? <Loader2 className="animate-spin" /> : <Save />}
            {upsert.isPending ? "Đang lưu..." : "Lưu"}
          </Button>
        </div>
      }
    >
      <Field label="Tiêu đề hiển thị" htmlFor={`title-${slug}`}>
        <Input id={`title-${slug}`} value={title} onChange={(e) => setTitle(e.target.value)} />
      </Field>
      <Field label="Nội dung">
        <TiptapEditor value={content} onChange={setContent} />
      </Field>
    </FormSection>
  );
}

function TeamMemberList({ group }: { group: TeamMemberGroup }) {
  const { data: members, isLoading } = useTeamMembersQuery(group);
  const deleteMember = useDeleteTeamMember();
  const createHref = `/admin/dashboard/story/members/form/?group=${group}`;

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-60 animate-pulse rounded-2xl border bg-card" />
        ))}
      </div>
    );
  }

  if (!members?.length) {
    return (
      <div className="rounded-2xl border border-dashed bg-card">
        <EmptyState
          icon={Users}
          title="Chưa có thành viên"
          description="Giới thiệu những gương mặt làm nên S.t."
          action={
            <Link
              href={createHref}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border bg-card px-3.5 text-sm font-medium shadow-xs hover:bg-muted"
            >
              <Plus className="size-4" />
              Thêm thành viên
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {members.map((member) => (
        <article
          key={member.id}
          className="group relative flex flex-col items-center overflow-hidden rounded-2xl border bg-card px-4 pt-6 pb-4 text-center shadow-[0_1px_3px_rgb(28_25_23/0.05)] transition-shadow hover:shadow-lg hover:shadow-stone-900/5"
        >
          <div className="absolute inset-x-0 top-0 h-16 bg-linear-to-br from-amber-100 via-orange-50 to-rose-100 dark:from-amber-500/15 dark:via-orange-500/5 dark:to-rose-500/10" />
          <div className="relative size-20 overflow-hidden rounded-full bg-muted shadow-md ring-4 ring-card">
            {member.photo?.url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={member.photo.url} alt="" className="size-full object-cover" />
            ) : (
              <span className="flex size-full items-center justify-center bg-linear-to-br from-amber-400 to-orange-600 text-lg font-semibold text-white">
                {initials(member.name)}
              </span>
            )}
          </div>
          <Link
            href={`/admin/dashboard/story/members/form/?id=${member.id}`}
            className="relative mt-3 line-clamp-1 font-semibold after:absolute after:inset-0 hover:text-primary"
          >
            {member.name}
          </Link>
          <p className="relative text-[13px] text-amber-700 dark:text-amber-300">{member.role}</p>
          {member.bio && (
            <p className="relative mt-2 line-clamp-2 text-xs text-muted-foreground">{member.bio}</p>
          )}
          <div className="relative z-10 mt-auto flex gap-0.5 pt-3">
            <EditAction href={`/admin/dashboard/story/members/form/?id=${member.id}`} />
            <DeleteButton
              itemLabel={member.name}
              onConfirm={async () => {
                try {
                  await deleteMember.mutateAsync(member.id);
                  toast.success("Đã xoá thành viên");
                } catch {
                  toast.error("Xoá thất bại");
                }
              }}
            />
          </div>
        </article>
      ))}
      <Link
        href={createHref}
        className="flex min-h-60 flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-input text-muted-foreground transition-colors hover:border-amber-400 hover:bg-amber-50/50 hover:text-amber-700 dark:hover:bg-amber-500/5"
      >
        <span className="flex size-11 items-center justify-center rounded-full bg-card shadow-sm ring-1 ring-border">
          <Plus className="size-5" />
        </span>
        <span className="text-sm font-medium">Thêm thành viên</span>
      </Link>
    </div>
  );
}

const TABS = ["content", "core-team", "advisory"] as const;
type TabValue = (typeof TABS)[number];

const TRIGGER_CLASS =
  "data-active:bg-amber-50 data-active:text-amber-900 dark:data-active:bg-amber-500/15 dark:data-active:text-amber-100";

function StoryInner() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const param = searchParams.get("tab") as TabValue | null;
  const tab: TabValue = param && TABS.includes(param) ? param : "content";

  return (
    <div>
      <PageHeader module="/admin/dashboard/story" />
      <Tabs
        value={tab}
        onValueChange={(v) => router.replace(`${pathname}?tab=${v}`, { scroll: false })}
      >
        <TabsList className="mb-4 h-10! bg-card p-1 shadow-xs ring-1 ring-border">
          <TabsTrigger value="content" className={TRIGGER_CLASS}>
            <Compass />
            Nội dung
          </TabsTrigger>
          <TabsTrigger value="core-team" className={TRIGGER_CLASS}>
            <Users />
            Đội ngũ cốt lõi
          </TabsTrigger>
          <TabsTrigger value="advisory" className={TRIGGER_CLASS}>
            <Sparkles />
            Đội ngũ cố vấn
          </TabsTrigger>
        </TabsList>
        <TabsContent value="content" className="space-y-6">
          {BLOCK_DEFS.map((b) => (
            <StoryBlockEditor key={b.slug} {...b} />
          ))}
        </TabsContent>
        <TabsContent value="core-team">
          <TeamMemberList group={TeamMemberGroup.CORE_TEAM} />
        </TabsContent>
        <TabsContent value="advisory">
          <TeamMemberList group={TeamMemberGroup.ADVISORY_BOARD} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function StoryPage() {
  return (
    <Suspense fallback={null}>
      <StoryInner />
    </Suspense>
  );
}
