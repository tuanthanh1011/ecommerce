"use client";

import { usePublicProducts, type PostsFilter } from "@/hooks/use-public-site";
import { PostType } from "@/lib/constants";
import { ProductItem } from "./cards";
import { Reveal } from "./reveal";
import { SectionHeading } from "./ui";

/**
 * The home page ends with the new-products teaser: the latest few items with
 * a link to the full page, rendered only while there is content. Stores,
 * news, give-back and jobs have their own pages and menu entries.
 */

const HOME_LIMIT = 3;

/** Params of the nav's presence checks for the news / give-back entries. */
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
