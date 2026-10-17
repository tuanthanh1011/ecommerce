"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Coffee } from "lucide-react";
import { usePublicProduct, usePublicProducts } from "@/hooks/use-public-site";
import {
  DRINK_SUB_TYPE_LABELS,
  DrinkSubType,
  MERCHANDISE_SUB_TYPE_LABELS,
  MerchandiseSubType,
  PRODUCT_CATEGORY_LABELS,
  ProductCategory,
} from "@/lib/constants";
import { formatPrice } from "@/lib/format";
import { photoUrls, ProductChips, ProductItem } from "./cards";
import { Reveal } from "./reveal";
import { MAROON } from "./theme";
import { Chips, Gallery, PageHero, Pager, SiteEmpty } from "./ui";

const PAGE_SIZE = 12;

const CATEGORY_OPTIONS = [
  { value: undefined, label: "Tất cả" },
  ...Object.values(ProductCategory).map((c) => ({
    value: c,
    label: PRODUCT_CATEGORY_LABELS[c],
  })),
];

const toOptions = <T extends string>(labels: Record<T, string>) => [
  { value: undefined, label: "Tất cả loại" },
  ...(Object.keys(labels) as T[]).map((value) => ({ value, label: labels[value] })),
];
const DRINK_OPTIONS = toOptions(DRINK_SUB_TYPE_LABELS);
const MERCH_OPTIONS = toOptions(MERCHANDISE_SUB_TYPE_LABELS);

const detailHref = (id: string) => `/products/detail/?id=${id}`;

/** "Sản Phẩm" — đồ uống đặc trưng & vật phẩm S+, lọc theo nhóm và loại. */
export function ProductsListContent() {
  const [category, setCategory] = useState<ProductCategory | undefined>();
  const [drinkSubType, setDrinkSubType] = useState<DrinkSubType | undefined>();
  const [merchSubType, setMerchSubType] = useState<MerchandiseSubType | undefined>();
  const [page, setPage] = useState(1);

  const { data, isLoading } = usePublicProducts({
    limit: PAGE_SIZE,
    page,
    category,
    drinkSubType: category === ProductCategory.DRINK ? drinkSubType : undefined,
    merchandiseSubType:
      category === ProductCategory.MERCHANDISE ? merchSubType : undefined,
  });
  const products = data?.data ?? [];

  const pick = <T,>(set: (v: T) => void) => (v: T) => {
    set(v);
    setPage(1);
  };

  return (
    <>
      <PageHero
        eyebrow="Thực đơn & vật phẩm"
        title="Sản phẩm S+"
        description="Đồ uống đặc trưng và những vật phẩm nhỏ mang hơi ấm S+ về nhà."
      />
      <section className="pb-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <Chips
            options={CATEGORY_OPTIONS}
            value={category}
            onChange={(v) => {
              setCategory(v);
              setDrinkSubType(undefined);
              setMerchSubType(undefined);
              setPage(1);
            }}
          />
          {category === ProductCategory.DRINK && (
            <Chips
              className="mt-3"
              options={DRINK_OPTIONS}
              value={drinkSubType}
              onChange={pick(setDrinkSubType)}
            />
          )}
          {category === ProductCategory.MERCHANDISE && (
            <Chips
              className="mt-3"
              options={MERCH_OPTIONS}
              value={merchSubType}
              onChange={pick(setMerchSubType)}
            />
          )}

          {isLoading ? (
            <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="aspect-[3/4] animate-pulse rounded-2xl bg-stone-900/5" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <SiteEmpty
              icon={Coffee}
              title="Chưa có sản phẩm nào"
              description="Hãy thử chọn nhóm khác hoặc quay lại sau nhé."
            />
          ) : (
            <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-8 lg:grid-cols-3">
              {products.map((product, i) => (
                <Reveal key={product.id} delay={(i % 3) * 100}>
                  <ProductItem product={product} href={detailHref(product.id)} />
                </Reveal>
              ))}
            </div>
          )}

          <Pager page={page} total={data?.total ?? 0} pageSize={PAGE_SIZE} onChange={setPage} />
        </div>
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
              <p className="mt-6 leading-loose whitespace-pre-line text-stone-700">
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
