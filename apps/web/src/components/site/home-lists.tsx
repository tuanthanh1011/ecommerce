"use client";

import {
  usePublicJobs,
  usePublicPosts,
  usePublicProducts,
  usePublicStores,
  type PostsFilter,
} from "@/hooks/use-public-site";
import { PostType } from "@/lib/constants";
import { JobCard, PostCard, ProductItem, StoreCard } from "./cards";
import { Reveal } from "./reveal";
import { SectionHeading } from "./ui";

/**
 * The teaser sections on the home page that are fed by other CMS tabs
 * (products, stores, news, give-back, jobs). Each shows the latest few items
 * with a link to its full page, and renders nothing at all while it has no
 * content — there is no placeholder data.
 */

const HOME_LIMIT = 3;

/** Same params as the nav's presence checks, so React Query serves both. */
export const HOME_POSTS_FILTER: PostsFilter = {
  limit: HOME_LIMIT,
  excludeType: PostType.GIVE_BACK,
};
export const HOME_GIVE_BACK_FILTER: PostsFilter = {
  limit: HOME_LIMIT,
  type: PostType.GIVE_BACK,
};

export function NewProductsSection() {
  const { data, isLoading } = usePublicProducts({ limit: HOME_LIMIT, isNew: true });
  const products = data?.data ?? [];
  if (!isLoading && products.length === 0) return null;

  return (
    <section id="products" className="py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          pill="Sản Phẩm Mới"
          title="Vừa ra lò, chờ bạn thử"
          href="/products/"
          linkLabel="Xem tất cả sản phẩm"
        />
        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-8 max-sm:[&>*:last-child:nth-child(odd)]:col-span-2 max-sm:[&>*:last-child:nth-child(odd)]:mx-auto max-sm:[&>*:last-child:nth-child(odd)]:w-1/2">
          {isLoading
            ? [0, 1, 2].map((i) => (
                <div key={i} className="aspect-[3/4] animate-pulse rounded-2xl bg-stone-900/5" />
              ))
            : products.map((product, i) => (
                <Reveal key={product.id} delay={i * 120}>
                  <ProductItem
                    product={product}
                    href={`/products/detail/?id=${product.id}`}
                  />
                </Reveal>
              ))}
        </div>
      </div>
    </section>
  );
}

export function StoresSection() {
  const { data } = usePublicStores(HOME_LIMIT);
  const stores = data?.data ?? [];
  if (stores.length === 0) return null;

  return (
    <section id="stores" className="bg-white/50 py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          pill="Cửa Hàng"
          title="Ghé thăm S+"
          href="/stores/"
          linkLabel="Xem tất cả cửa hàng"
        />
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {stores.map((store, i) => (
            <Reveal key={store.id} delay={i * 100}>
              <StoreCard store={store} href={`/stores/detail/?id=${store.id}`} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function PostsSection({
  id,
  pill,
  title,
  href,
  detailBase,
  filter,
  tinted,
}: {
  id: string;
  pill: string;
  title: string;
  href: string;
  detailBase: string;
  filter: PostsFilter;
  tinted?: boolean;
}) {
  const { data } = usePublicPosts(filter);
  const posts = data?.data ?? [];
  if (posts.length === 0) return null;

  return (
    <section id={id} className={tinted ? "bg-white/50 py-24" : "py-24"}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading pill={pill} title={title} href={href} />
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {posts.map((post, i) => (
            <Reveal key={post.id} delay={i * 100}>
              <PostCard post={post} href={`${detailBase}?slug=${encodeURIComponent(post.slug)}`} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function NewsSection() {
  return (
    <PostsSection
      id="news"
      pill="Tin Tức - Sự Kiện"
      title="Có gì mới ở S+"
      href="/news/"
      detailBase="/news/post/"
      filter={HOME_POSTS_FILTER}
      tinted
    />
  );
}

export function GiveBackSection() {
  return (
    <PostsSection
      id="give-back"
      pill="Cho Đi"
      title="Nơi ấm áp được trao đi"
      href="/give-back/"
      detailBase="/give-back/post/"
      filter={HOME_GIVE_BACK_FILTER}
    />
  );
}

export function JobsSection() {
  const { data } = usePublicJobs(HOME_LIMIT);
  const jobs = data?.data ?? [];
  if (jobs.length === 0) return null;

  return (
    <section id="jobs" className="bg-white/50 py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <SectionHeading pill="Tuyển Dụng" title="Cùng làm việc với S+" href="/jobs/" />
        <ul className="mt-12 space-y-4">
          {jobs.map((job, i) => (
            <Reveal key={job.id} delay={i * 100}>
              <li>
                <JobCard job={job} href={`/jobs/detail/?id=${job.id}`} />
              </li>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
