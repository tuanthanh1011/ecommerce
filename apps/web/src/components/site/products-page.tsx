"use client";

import { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Coffee } from "lucide-react";
import { usePublicProduct, usePublicProducts } from "@/hooks/use-public-site";
import type { Product } from "@/hooks/use-products";
import {
  DRINK_SUB_TYPE_LABELS,
  DrinkSubType,
  PRODUCT_CATEGORY_LABELS,
  ProductCategory,
} from "@/lib/constants";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/format";
import { photoUrls, ProductChips, ProductItem } from "./cards";
import { MAROON } from "./theme";
import { Gallery, PageHero, SiteEmpty } from "./ui";

const detailHref = (id: string) => `/products/detail/?id=${id}`;

interface MenuGroup {
  key: string;
  title: string;
  products: Product[];
}

/** Square photo, name and price — the menu tile (no overlay, nothing hidden on hover). */
export function MenuItem({
  product,
  href,
  unoptimized,
}: {
  product: Pick<Product, "name" | "price" | "isNew" | "photos">;
  /** Omitted by the CMS preview: same tile, not a link. */
  href?: string;
  /** Preview images (blob: URLs) can't go through next/image's loader. */
  unoptimized?: boolean;
}) {
  const [cover] = photoUrls(product.photos);
  const Tag = href ? Link : "div";
  return (
    <Tag href={href as string} className="group block">
      <div className="relative aspect-square overflow-hidden rounded-lg border border-[#960000]/15 bg-white shadow-sm">
        {cover ? (
          <Image
            src={cover}
            alt={product.name}
            fill
            unoptimized={unoptimized}
            sizes="(min-width: 1280px) 20vw, (min-width: 640px) 28vw, 45vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <Coffee className="absolute top-1/2 left-1/2 size-12 -translate-x-1/2 -translate-y-1/2 text-[#960000]/25" />
        )}
        {product.isNew && (
          <span
            className="absolute top-2 left-2 rounded-full px-2.5 py-0.5 text-[11px] font-semibold text-white"
            style={{ backgroundColor: MAROON }}
          >
            Mới
          </span>
        )}
      </div>
      <h3 className="mt-3 line-clamp-2 text-base leading-snug text-stone-950 sm:text-lg">
        {product.name}
      </h3>
      {product.price && (
        <p className="font-body mt-0.5 text-sm tabular-nums" style={{ color: MAROON }}>
          {formatPrice(product.price)}
        </p>
      )}
    </Tag>
  );
}

/**
 * "Sản Phẩm" — the menu laid out like a restaurant site: a sticky list of
 * categories on the left (a bar of chips on phones) that scrolls to each
 * titled block of products on the right.
 */
export function ProductsListContent() {
  // The whole menu is a few dozen items: load it once and group on the client.
  const { data, isLoading } = usePublicProducts({ limit: 200 });
  const all = data?.data ?? [];
  const [active, setActive] = useState<string>();

  const groups: MenuGroup[] = [
    { key: "BEST", title: "Best Seller", products: all.filter((p) => p.isBestSeller) },
    ...Object.values(DrinkSubType).map((t) => ({
      key: t,
      title: DRINK_SUB_TYPE_LABELS[t],
      products: all.filter((p) => p.drinkSubType === t),
    })),
    {
      key: "MERCH",
      title: PRODUCT_CATEGORY_LABELS[ProductCategory.MERCHANDISE],
      products: all.filter((p) => p.category === ProductCategory.MERCHANDISE),
    },
  ].filter((g) => g.products.length > 0);

  const keys = groups.map((g) => g.key).join(",");
  // Highlight the category whose block is under the header.
  useEffect(() => {
    const blocks = keys
      .split(",")
      .map((k) => document.getElementById(`menu-${k}`))
      .filter((el): el is HTMLElement => !!el);
    if (blocks.length === 0) return;
    const onScroll = () => {
      const line = window.innerHeight * 0.3;
      let current = blocks[0];
      for (const b of blocks) if (b.getBoundingClientRect().top <= line) current = b;
      setActive(current.id.replace("menu-", ""));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [keys]);

  const go = (key: string) =>
    document.getElementById(`menu-${key}`)?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <>
      <PageHero
        eyebrow="Menu"
        title="Mời bạn thưởng thức"
        description="Trà, cà phê và những món đặc biệt của S+."
      />
      <section className="pb-24">
        {isLoading ? (
          <div className="mx-auto mt-10 grid max-w-6xl grid-cols-2 gap-4 px-4 sm:grid-cols-3 sm:gap-8 sm:px-6 lg:px-8">
            {[0, 1, 2].map((i) => (
              <div key={i} className="aspect-square animate-pulse rounded-lg bg-stone-900/5" />
            ))}
          </div>
        ) : groups.length === 0 ? (
          <SiteEmpty
            icon={Coffee}
            title="Chưa có sản phẩm nào"
            description="Hãy quay lại sau nhé."
          />
        ) : (
          <>
            {/* phones / tablets: horizontal category bar */}
            <nav
              aria-label="Danh mục"
              className="sticky top-[4.5rem] z-30 border-b border-[#960000]/10 bg-[#f3e9dc]/95 backdrop-blur lg:hidden"
            >
              <ul className="no-scrollbar flex gap-2 overflow-x-auto px-4 py-3 sm:px-6">
                {groups.map((g) => (
                  <li key={g.key} className="shrink-0">
                    <button
                      type="button"
                      onClick={() => go(g.key)}
                      aria-current={active === g.key}
                      className={cn(
                        "rounded-full border px-4 py-1.5 text-sm whitespace-nowrap transition-colors",
                        active === g.key
                          ? "border-transparent text-white"
                          : "border-[#960000]/20 bg-white text-stone-700",
                      )}
                      style={active === g.key ? { backgroundColor: MAROON } : undefined}
                    >
                      {g.title}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="mx-auto flex max-w-[1400px] gap-10 px-4 sm:px-6 lg:px-8">
              {/* desktop: sticky category list */}
              <aside className="hidden w-64 shrink-0 lg:block">
                <ul className="sticky top-28 flex flex-col gap-5 pt-12 text-sm tracking-wide uppercase">
                  {groups.map((g) => (
                    <li key={g.key}>
                      <button
                        type="button"
                        onClick={() => go(g.key)}
                        aria-current={active === g.key}
                        className={cn(
                          "border-b-2 pb-1 text-left transition-colors",
                          active === g.key
                            ? "border-[#960000] text-[#960000]"
                            : "border-transparent text-stone-700 hover:text-[#960000]",
                        )}
                      >
                        {g.title}
                      </button>
                    </li>
                  ))}
                </ul>
              </aside>

              <div className="min-w-0 flex-1">
                {groups.map((g) => (
                  <section
                    key={g.key}
                    id={`menu-${g.key}`}
                    className="scroll-mt-40 pt-10 first:pt-8 lg:scroll-mt-28"
                  >
                    <h2 className="pb-6 text-2xl sm:text-4xl" style={{ color: MAROON }}>
                      {g.title}
                    </h2>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-8 xl:grid-cols-4">
                      {g.products.map((p) => (
                        <MenuItem key={p.id} product={p} href={detailHref(p.id)} />
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            </div>
          </>
        )}
      </section>
    </>
  );
}

function ProductDetailInner() {
  const id = useSearchParams().get("id") ?? undefined;
  const { data: product, isLoading, isError } = usePublicProduct(id);
  const { data: related } = usePublicProducts({
    limit: 4,
    category: product?.category,
  });

  if (isLoading || (!product && !isError)) return <div className="min-h-[60vh]" />;
  if (isError || !product) {
    return (
      <SiteEmpty
        icon={Coffee}
        title="Không tìm thấy sản phẩm"
        description="Sản phẩm này có thể đã được gỡ."
        action={{ href: "/products/", label: "Xem tất cả sản phẩm" }}
      />
    );
  }

  const others = (related?.data ?? []).filter((p) => p.id !== product.id).slice(0, 3);

  return (
    <>
      <PageHero
        title={product.name}
        crumbs={[{ label: "Sản phẩm", href: "/products/" }]}
      />
      <section className="pb-20">
        <div className="mx-auto grid grid-cols-1 max-w-6xl gap-10 px-4 sm:px-6 md:grid-cols-2 lg:px-8">
          <Gallery
            images={photoUrls(product.photos)}
            alt={product.name}
            fallbackIcon={Coffee}
          />
          <div className="flex flex-col">
            <ProductChips product={product} />
            <p
              className="mt-6 text-3xl font-semibold tabular-nums"
              style={{ color: MAROON, fontFamily: "var(--font-display)" }}
            >
              {product.price ? formatPrice(product.price) : "Liên hệ"}
            </p>
            {product.description && (
              <p className="mt-6 leading-loose whitespace-pre-line text-stone-950 font-body">
                {product.description}
              </p>
            )}
          </div>
        </div>
      </section>

      {others.length > 0 && (
        <section className="bg-white/50 py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <h2
              className="text-center text-2xl font-semibold"
              style={{ color: MAROON, fontFamily: "var(--font-display)" }}
            >
              Có thể bạn cũng thích
            </h2>
            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-8">
              {others.map((p) => (
                <ProductItem key={p.id} product={p} href={detailHref(p.id)} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

/** `/products/detail/?id=...` — static export has no dynamic routes. */
export function ProductDetailContent() {
  return (
    <Suspense fallback={null}>
      <ProductDetailInner />
    </Suspense>
  );
}
