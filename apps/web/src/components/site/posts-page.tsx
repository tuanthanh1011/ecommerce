"use client";

import { Suspense, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Newspaper } from "lucide-react";
import { usePublicPost, usePublicPosts } from "@/hooks/use-public-site";
import { POST_TYPE_LABELS, PostType } from "@/lib/constants";
import { formatDate, PostCard } from "./cards";
import { Reveal } from "./reveal";
import { RichContent } from "./rich-content";
import { MAROON } from "./theme";
import { Chips, PageHero, Pager, SiteEmpty } from "./ui";

const PAGE_SIZE = 9;

/**
 * "Tin tức - Sự kiện" and "Cho đi" are the same content model (Posts) split by
 * type, so one pair of list/detail components serves both pages.
 */
export type PostsKind = "news" | "give-back";

const KINDS: Record<
  PostsKind,
  {
    base: string;
    detail: string;
    crumb: string;
    eyebrow: string;
    title: string;
    description: string;
    /** Types offered as filter pills (empty = no filter row). */
    types: PostType[];
    type?: PostType;
    excludeType?: PostType;
    empty: string;
  }
> = {
  news: {
    base: "/news/",
    detail: "/news/post/",
    crumb: "Tin tức",
    eyebrow: "Tin tức - Sự kiện",
    title: "Có gì mới ở S+",
    description: "Thông báo, chương trình sắp ra mắt, sản phẩm mới và những câu chuyện văn hoá.",
    types: [
      PostType.ANNOUNCEMENT,
      PostType.COMING_SOON,
      PostType.NEW_PRODUCT,
      PostType.CULTURE_ARTICLE,
    ],
    excludeType: PostType.GIVE_BACK,
    empty: "Chưa có bài viết nào.",
  },
  "give-back": {
    base: "/give-back/",
    detail: "/give-back/post/",
    crumb: "Cho đi",
    eyebrow: "Cho đi",
    title: "Nơi ấm áp được trao đi",
    description: "Những hoạt động thiện nguyện và lời tri ân S+ gửi tới khách hàng, cộng đồng.",
    types: [],
    type: PostType.GIVE_BACK,
    empty: "Những hoạt động Cho đi sẽ sớm được chia sẻ ở đây.",
  },
};

const postHref = (kind: PostsKind, slug: string) =>
  `${KINDS[kind].detail}?slug=${encodeURIComponent(slug)}`;

export function PostsListContent({ kind }: { kind: PostsKind }) {
  const cfg = KINDS[kind];
  const [type, setType] = useState<PostType | undefined>();
  const [page, setPage] = useState(1);
  const { data, isLoading } = usePublicPosts({
    limit: PAGE_SIZE,
    page,
    type: cfg.type ?? type,
    excludeType: cfg.excludeType,
  });
  const posts = data?.data ?? [];
  const featured = page === 1 && posts.length > 1 ? posts[0] : undefined;
  const rest = featured ? posts.slice(1) : posts;

  return (
    <>
      <PageHero eyebrow={cfg.eyebrow} title={cfg.title} description={cfg.description} />
      <section className="pb-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {cfg.types.length > 0 && (
            <Chips
              options={[
                { value: undefined, label: "Tất cả" },
                ...cfg.types.map((t) => ({ value: t, label: POST_TYPE_LABELS[t] })),
              ]}
              value={type}
              onChange={(v) => {
                setType(v);
                setPage(1);
              }}
            />
          )}

          {isLoading ? null : posts.length === 0 ? (
            <SiteEmpty icon={Newspaper} title={cfg.empty} />
          ) : (
            <>
              {featured && (
                <Reveal className="mt-10">
                  <Link
                    href={postHref(kind, featured.slug)}
                    className="group grid grid-cols-1 overflow-hidden rounded-3xl border border-[#960000]/10 bg-white shadow-sm transition-shadow hover:shadow-xl md:grid-cols-2"
                  >
                    <div className="relative aspect-video bg-[#960000]/5 md:aspect-auto md:min-h-72">
                      {featured.coverImage?.url ? (
                        <Image
                          src={featured.coverImage.url}
                          alt={featured.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <Newspaper className="absolute inset-0 m-auto size-10 text-[#960000]/25" />
                      )}
                    </div>
                    <div className="flex flex-col justify-center p-8">
                      <span
                        className="text-xs font-semibold tracking-wide uppercase"
                        style={{ color: MAROON }}
                      >
                        {POST_TYPE_LABELS[featured.type]} · Mới nhất
                      </span>
                      <h2
                        className="mt-3 text-2xl font-semibold text-stone-900 sm:text-3xl"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        {featured.title}
                      </h2>
                      {featured.excerpt && (
                        <p className="mt-3 line-clamp-4 leading-relaxed text-stone-600">
                          {featured.excerpt}
                        </p>
                      )}
                      {featured.publishedAt && (
                        <time className="mt-4 text-sm text-stone-500">
                          {formatDate(featured.publishedAt)}
                        </time>
                      )}
                    </div>
                  </Link>
                </Reveal>
              )}
              <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((post, i) => (
                  <Reveal key={post.id} delay={(i % 3) * 100}>
                    <PostCard post={post} href={postHref(kind, post.slug)} />
                  </Reveal>
                ))}
              </div>
            </>
          )}

          <Pager page={page} total={data?.total ?? 0} pageSize={PAGE_SIZE} onChange={setPage} />
        </div>
      </section>
    </>
  );
}

function PostDetailInner({ kind }: { kind: PostsKind }) {
  const cfg = KINDS[kind];
  const slug = useSearchParams().get("slug") ?? undefined;
  const { data: post, isLoading, isError } = usePublicPost(slug);
  const { data: more } = usePublicPosts({
    limit: 4,
    type: cfg.type,
    excludeType: cfg.excludeType,
  });

  if (isLoading || (!post && !isError)) return <div className="min-h-[60vh]" />;
  if (isError || !post) {
    return (
      <SiteEmpty
        icon={Newspaper}
        title="Không tìm thấy bài viết"
        action={{ href: cfg.base, label: `Xem tất cả ${cfg.crumb.toLowerCase()}` }}
      />
    );
  }

  const others = (more?.data ?? []).filter((p) => p.id !== post.id).slice(0, 3);

  return (
    <>
      <PageHero
        eyebrow={POST_TYPE_LABELS[post.type]}
        title={post.title}
        description={formatDate(post.publishedAt) ?? undefined}
        crumbs={[{ label: cfg.crumb, href: cfg.base }]}
      />
      <article className="mx-auto max-w-3xl px-4 pb-20 sm:px-6">
        {post.coverImage?.url && (
          <div className="relative -mt-12 mb-10 aspect-video overflow-hidden rounded-2xl border-4 border-white shadow-xl">
            <Image
              src={post.coverImage.url}
              alt={post.title}
              fill
              priority
              className="object-cover"
            />
          </div>
        )}
        <RichContent html={post.content} className="text-[1.05rem] leading-loose text-stone-700" />
      </article>

      {others.length > 0 && (
        <section className="bg-white/50 py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <h2
              className="text-center text-2xl font-semibold"
              style={{ color: MAROON, fontFamily: "var(--font-display)" }}
            >
              Bài viết khác
            </h2>
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
              {others.map((p) => (
                <PostCard key={p.id} post={p} href={postHref(kind, p.slug)} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

/** `.../post/?slug=...` — static export has no dynamic routes. */
export function PostDetailContent({ kind }: { kind: PostsKind }) {
  return (
    <Suspense fallback={null}>
      <PostDetailInner kind={kind} />
    </Suspense>
  );
}
