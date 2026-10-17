import Image from "next/image";
import { ArrowRight, Coffee } from "lucide-react";

const MAROON = "#960000";

/**
 * The "Sản Phẩm Mới" card from the real landing page — extracted so the
 * admin product-form preview can render the exact same thing the public
 * site shows, instead of a generic placeholder card that drifts out of
 * sync with the real design over time.
 */
export function ProductCard({
  name,
  imageUrl,
  badge = "Mới",
  unoptimized,
}: {
  name: string;
  /** No photo yet → a plain brand-coloured tile, never another product's image. */
  imageUrl?: string | null;
  badge?: string | null;
  /** Preview images (blob: URLs, local uploads) can't go through next/image's loader. */
  unoptimized?: boolean;
}) {
  return (
    <div
      className="group relative aspect-[3/4] overflow-hidden rounded-2xl border shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl"
      style={{ borderColor: MAROON }}
    >
      {badge && (
        <span
          className="absolute top-3 left-3 z-10 rounded-full px-3 py-1 text-[11px] font-semibold tracking-wide text-white shadow"
          style={{ backgroundColor: MAROON }}
        >
          {badge}
        </span>
      )}
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={name}
          fill
          unoptimized={unoptimized}
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
      ) : (
        <div
          className="absolute inset-0"
          style={{ background: `linear-gradient(135deg, ${MAROON}, #5c0000)` }}
        >
          <Coffee
            className="absolute top-1/3 left-1/2 size-16 -translate-x-1/2"
            style={{ color: "rgba(255,255,255,0.25)" }}
          />
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent transition-opacity group-hover:from-black/85" />
      <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
        <p className="line-clamp-1 text-base font-semibold text-white sm:text-lg">{name}</p>
        <span className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-white/0 transition-all group-hover:text-white/90">
          Xem chi tiết <ArrowRight className="size-3" />
        </span>
      </div>
    </div>
  );
}
