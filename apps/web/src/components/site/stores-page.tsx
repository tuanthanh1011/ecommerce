"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Clock, MapPin, Phone, Store as StoreIcon } from "lucide-react";
import { usePublicContact, usePublicStore, usePublicStores } from "@/hooks/use-public-site";
import { photoUrls, StoreCard } from "./cards";
import { Reveal } from "./reveal";
import { MAROON } from "./theme";
import { Gallery, PageHero, SiteEmpty } from "./ui";

const detailHref = (id: string) => `/stores/detail/?id=${id}`;

/** Only http(s) links are rendered — Google Maps URLs come from the CMS. */
const isHttpUrl = (v?: string | null): v is string => !!v && /^https?:\/\//i.test(v);

/** "Cửa Hàng" — hệ thống cơ sở S+. */
export function StoresListContent() {
  const { data, isLoading } = usePublicStores(50);
  const stores = data?.data ?? [];

  return (
    <>
      <PageHero
        eyebrow="Hệ thống cơ sở"
        title="Cửa hàng S+"
        description="Ghé thăm S+ gần bạn — bếp lò ấm, ghế sofa êm và những người bạn luôn chờ."
      />
      <section className="pb-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {isLoading ? null : stores.length === 0 ? (
            <SiteEmpty icon={StoreIcon} title="Thông tin cửa hàng đang được cập nhật" />
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {stores.map((store, i) => (
                <Reveal key={store.id} delay={(i % 3) * 100}>
                  <StoreCard store={store} href={detailHref(store.id)} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function StoreDetailInner() {
  const id = useSearchParams().get("id") ?? undefined;
  const { data: store, isLoading, isError } = usePublicStore(id);
  const { data: contact } = usePublicContact();

  if (isLoading || (!store && !isError)) return <div className="min-h-[60vh]" />;
  if (isError || !store) {
    return (
      <SiteEmpty
        icon={StoreIcon}
        title="Không tìm thấy cửa hàng"
        action={{ href: "/stores/", label: "Xem tất cả cửa hàng" }}
      />
    );
  }

  const rows = [
    { icon: MapPin, label: "Địa chỉ", value: store.address },
    store.phone && {
      icon: Phone,
      label: "Điện thoại",
      value: store.phone,
      href: `tel:${store.phone.replace(/[^\d+]/g, "")}`,
    },
    contact?.openingHours && {
      icon: Clock,
      label: "Giờ mở cửa",
      value: contact.openingHours,
    },
  ].filter(Boolean) as {
    icon: typeof MapPin;
    label: string;
    value: string;
    href?: string;
  }[];

  return (
    <>
      <PageHero title={store.name} crumbs={[{ label: "Cửa hàng", href: "/stores/" }]} />
      <section className="pb-24">
        <div className="mx-auto grid grid-cols-1 max-w-6xl gap-10 px-4 sm:px-6 md:grid-cols-[3fr_2fr] lg:px-8">
          <Gallery images={photoUrls(store.photos)} alt={store.name} fallbackIcon={StoreIcon} />
          <div className="space-y-6">
            <ul className="space-y-4 rounded-2xl border border-[#960000]/10 bg-white p-6 shadow-sm">
              {rows.map(({ icon: Icon, label, value, href }) => (
                <li key={label} className="flex items-start gap-3">
                  <span
                    className="flex size-9 shrink-0 items-center justify-center rounded-lg"
                    style={{ backgroundColor: `${MAROON}14`, color: MAROON }}
                  >
                    <Icon className="size-4" />
                  </span>
                  <div>
                    <p className="text-xs font-medium text-stone-500">{label}</p>
                    {href ? (
                      <a href={href} className="text-stone-900 hover:underline">
                        {value}
                      </a>
                    ) : (
                      <p className="text-stone-900">{value}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
            {isHttpUrl(store.googleMapsUrl) && (
              <a
                href={store.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center gap-2 rounded-full px-6 text-sm font-semibold text-white"
                style={{ backgroundColor: MAROON }}
              >
                <MapPin className="size-4" /> Chỉ đường trên Google Maps
              </a>
            )}
            {store.description && (
              <p className="leading-loose whitespace-pre-line text-stone-700">
                {store.description}
              </p>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

/** `/stores/detail/?id=...` — static export has no dynamic routes. */
export function StoreDetailContent() {
  return (
    <Suspense fallback={null}>
      <StoreDetailInner />
    </Suspense>
  );
}
