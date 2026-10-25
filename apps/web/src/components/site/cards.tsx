import Image from "next/image";
import Link from "next/link";
import { Briefcase, Newspaper } from "lucide-react";
import type { Job } from "@/hooks/use-jobs";
import type { Post } from "@/hooks/use-posts";
import type { Product } from "@/hooks/use-products";
import {
  DRINK_SUB_TYPE_LABELS,
  MERCHANDISE_SUB_TYPE_LABELS,
  POST_TYPE_LABELS,
  PRODUCT_CATEGORY_LABELS,
} from "@/lib/constants";
import { formatPrice, initials } from "@/lib/format";
import { ProductCard } from "./product-card";
import { RichContent } from "./rich-content";
import { MAROON } from "./theme";
import { Cover } from "./ui";

/** Photo URLs of a product/store in their CMS display order. */
export function photoUrls(photos: { sortOrder: number; media: { url: string } }[]): string[] {
  return [...photos].sort((a, b) => a.sortOrder - b.sortOrder).map((p) => p.media.url);
}

const CARD =
  "group flex h-full flex-col overflow-hidden rounded-2xl border border-[#960000]/10 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl";

/**
 * A card is a link on the website; the CMS preview renders the very same card
 * without an `href`, so it looks identical but isn't clickable.
 */
function CardLink({
  href,
  className,
  children,
}: {
  href?: string;
  className: string;
  children: React.ReactNode;
}) {
  return href ? (
    <Link href={href} className={className}>
      {children}
    </Link>
  ) : (
    <div className={className}>{children}</div>
  );
}

export const formatDate = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString("vi-VN") : null;

export function PostCard({
  post,
  href,
}: {
  post: Pick<Post, "title" | "type" | "coverImage" | "excerpt" | "publishedAt">;
  href?: string;
}) {
  return (
    <CardLink href={href} className={CARD}>
      <Cover src={post.coverImage?.url} alt={post.title} icon={Newspaper} />
      <div className="flex flex-1 flex-col p-5">
        <span className="text-xs font-semibold tracking-wide uppercase" style={{ color: MAROON }}>
          {POST_TYPE_LABELS[post.type]}
        </span>
        <h3 className="mt-2 line-clamp-2 text-lg font-semibold text-stone-900">{post.title}</h3>
        {post.excerpt && (
          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-stone-800 font-body">{post.excerpt}</p>
        )}
        {post.publishedAt && (
          <time className="mt-auto pt-4 text-xs text-stone-500">{formatDate(post.publishedAt)}</time>
        )}
      </div>
    </CardLink>
  );
}

export function JobCard({
  job,
  href,
}: {
  job: Pick<Job, "title" | "department" | "description">;
  href?: string;
}) {
  return (
    <CardLink
      href={href}
      className="group flex items-start gap-4 rounded-2xl border border-[#960000]/10 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
    >
      <span
        className="flex size-12 shrink-0 items-center justify-center rounded-xl text-white"
        style={{ backgroundColor: MAROON }}
      >
        <Briefcase className="size-5" />
      </span>
      <div className="min-w-0">
        <h3 className="text-lg font-semibold text-stone-900">{job.title}</h3>
        <p className="text-sm font-medium" style={{ color: MAROON }}>
          {job.department}
        </p>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-stone-800 font-body">{job.description}</p>
      </div>
    </CardLink>
  );
}

/** Category / sub-type / "Mới" chips of a product — product detail page and CMS preview. */
export function ProductChips({ product }: { product: ProductChipsData }) {
  const subType = product.drinkSubType
    ? DRINK_SUB_TYPE_LABELS[product.drinkSubType]
    : product.merchandiseSubType
      ? MERCHANDISE_SUB_TYPE_LABELS[product.merchandiseSubType]
      : null;
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span
        className="rounded-full px-3 py-1 text-xs font-semibold text-white"
        style={{ backgroundColor: MAROON }}
      >
        {PRODUCT_CATEGORY_LABELS[product.category]}
      </span>
      {subType && (
        <span className="rounded-full border border-[#960000]/20 bg-white px-3 py-1 text-xs font-medium text-stone-700">
          {subType}
        </span>
      )}
      {product.isNew && (
        <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
          Mới
        </span>
      )}
      {product.isBestSeller && (
        <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-800">
          Best Seller
        </span>
      )}
    </div>
  );
}

type ProductChipsData = Pick<
  Product,
  "category" | "drinkSubType" | "merchandiseSubType" | "isNew" | "isBestSeller"
>;

/**
 * The product tile used on the products page and home. `href` is omitted for
 * the CMS preview, which must look identical but not be a link.
 */
export function ProductItem({
  product,
  href,
  unoptimized,
  imageOnly,
}: {
  product: Pick<Product, "name" | "description" | "price" | "isNew" | "photos">;
  href?: string;
  /** Preview images (blob: URLs) can't go through next/image's loader. */
  unoptimized?: boolean;
  /** Teaser form (home page): the picture only — no name, description or price. */
  imageOnly?: boolean;
}) {
  const [cover] = photoUrls(product.photos);
  const card = (
    <ProductCard
      name={product.name}
      imageUrl={cover}
      badge={product.isNew ? "Mới" : null}
      unoptimized={unoptimized}
      imageOnly={imageOnly}
    />
  );
  return (
    <div>
      {href ? (
        <Link href={href} className="block">
          {card}
        </Link>
      ) : (
        card
      )}
      {!imageOnly && (
        <div className="mt-3 flex items-baseline justify-between gap-x-3 px-1">
          <p className="line-clamp-1 min-w-0 flex-1 text-sm text-stone-600">{product.description}</p>
          {product.price && (
            <p className="shrink-0 text-sm font-semibold tabular-nums" style={{ color: MAROON }}>
              {formatPrice(product.price)}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

/** One person on the "Câu chuyện" page. */
export function TeamMemberCard({
  member,
}: {
  member: { name: string; role: string; bio: string | null; photo: { url: string } | null };
}) {
  return (
    <article className="text-center">
      <div className="relative mx-auto size-36 overflow-hidden rounded-full border-4 border-white shadow-lg sm:size-40">
        {member.photo?.url ? (
          <Image src={member.photo.url} alt={member.name} fill className="object-cover" />
        ) : (
          <span
            className="absolute inset-0 flex items-center justify-center text-4xl font-semibold text-white"
            style={{ backgroundColor: MAROON }}
          >
            {initials(member.name)}
          </span>
        )}
      </div>
      <h3 className="mt-4 font-semibold text-stone-900">{member.name}</h3>
      <p className="text-sm font-medium" style={{ color: MAROON }}>
        {member.role}
      </p>
      {member.bio && (
        <p className="mx-auto mt-2 line-clamp-4 max-w-56 text-xs leading-relaxed text-stone-800 font-body">
          {member.bio}
        </p>
      )}
    </article>
  );
}

/** One numbered block (Hướng đi, Văn hoá…) on the "Câu chuyện" page. */
export function StoryBlockSection({
  index,
  title,
  content,
}: {
  index: number;
  title: string;
  content: string;
}) {
  return (
    <section>
      <span className="text-sm font-semibold tracking-[0.25em] tabular-nums" style={{ color: MAROON }}>
        {String(index + 1).padStart(2, "0")}
      </span>
      <h2
        className="mt-1 text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {title}
      </h2>
      <div className="mt-3 h-px w-20" style={{ backgroundColor: MAROON }} />
      <RichContent html={content} className="mt-6 text-[1.05rem] leading-loose text-stone-950 font-body" />
    </section>
  );
}
