import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Coffee,
  Gift,
  Heart,
  Newspaper,
  Store,
  Users,
} from "lucide-react";

export const metadata: Metadata = {
  title: "S.t Coffee",
  description:
    "S.t — chuỗi cà phê với câu chuyện, cửa hàng, sản phẩm, tin tức và cơ hội nghề nghiệp.",
};

const NAV = [
  { href: "#story", label: "Câu chuyện" },
  { href: "#stores", label: "Cửa hàng" },
  { href: "#products", label: "Sản phẩm" },
  { href: "#news", label: "Tin tức" },
  { href: "#giveback", label: "Cho đi" },
  { href: "#careers", label: "Tuyển dụng" },
];

const TEAM = [
  "Cửa hàng trưởng",
  "Marketing",
  "Setup",
  "Sản phẩm",
  "Chuyên gia",
  "Đào tạo",
];

const STORES = [
  { name: "CS1", desc: "Điểm nhấn: bếp lò ấm áp, ghế sofa êm ái để ngồi lâu mà không vội." },
  { name: "CS2", desc: "Không gian mở, gần gũi khu dân cư — nơi khách ghé mỗi sáng." },
  { name: "CS3", desc: "Góc làm việc yên tĩnh dành cho khách cần tập trung." },
];

const PRODUCTS = [
  { title: "Đồ uống đặc trưng", items: ["Nóng", "Đá / Lạnh", "Tươi"] },
  { title: "Vật phẩm S.t", items: ["Sổ tay", "Bút", "Bình giữ nhiệt", "Túi"] },
];

const NEWS = [
  { tag: "Thông báo", desc: "Nghỉ lễ, tạm dừng phục vụ, sự kiện sắp diễn ra." },
  { tag: "Coming Soon", desc: "Các chương trình và sản phẩm sắp ra mắt." },
  { tag: "Sản phẩm mới", desc: "Ra mắt đồ uống và vật phẩm mới nhất." },
  { tag: "Bài viết", desc: "Câu chuyện văn hoá, nguồn gốc của S.t." },
];

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-lg bg-linear-to-br from-amber-400 to-orange-600 text-white shadow-md shadow-amber-900/20">
              <Coffee className="size-4.5" />
            </span>
            <span className="text-base font-semibold tracking-tight">S.t</span>
          </Link>
          <nav className="hidden items-center gap-7 sm:flex">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/70">
        <div className="bg-grain pointer-events-none absolute inset-0 opacity-[0.4]" />
        <div className="pointer-events-none absolute -top-24 -right-24 size-[420px] rounded-full bg-amber-400/10 blur-3xl" />
        <div className="relative mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <p className="mb-4 text-xs font-semibold tracking-[0.2em] text-primary uppercase">
            S.t Coffee
          </p>
          <h1 className="max-w-2xl text-4xl leading-[1.15] font-semibold tracking-tight sm:text-5xl">
            Mỗi câu chuyện S.t bắt đầu từ một tách cà phê.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Không chỉ là nơi pha chế — S.t là không gian văn hoá, con người và
            những tách cà phê được làm nên bằng cả tâm huyết.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#stores"
              className="inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground shadow-sm transition-opacity hover:opacity-90"
            >
              Tìm cửa hàng gần bạn
              <ArrowRight className="size-4" />
            </a>
            <a
              href="#story"
              className="inline-flex h-11 items-center gap-2 rounded-lg border border-border px-5 text-sm font-medium transition-colors hover:bg-accent"
            >
              Khám phá câu chuyện
            </a>
          </div>
        </div>
      </section>

      {/* Story */}
      <section id="story" className="border-b border-border/70 py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            icon={Heart}
            eyebrow="Câu chuyện"
            title="Văn hoá là cốt lõi xuyên suốt"
          />
          <p className="mt-4 max-w-2xl text-muted-foreground">
            S.t được xây dựng bởi một đội ngũ tin rằng mỗi cửa hàng là một
            phần của cộng đồng, và mỗi tách cà phê là một lời chào thân thiện.
          </p>
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {TEAM.map((role) => (
              <div
                key={role}
                className="rounded-xl border border-border bg-card p-4 text-center shadow-sm"
              >
                <p className="text-sm font-medium">{role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stores */}
      <section id="stores" className="border-b border-border/70 bg-secondary/40 py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <SectionHeading icon={Store} eyebrow="Cửa hàng" title="Ghé thăm một cửa hàng S.t" />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {STORES.map((store) => (
              <div
                key={store.name}
                className="rounded-2xl border border-border bg-card p-6 shadow-sm"
              >
                <p className="text-lg font-semibold">{store.name}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {store.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products */}
      <section id="products" className="border-b border-border/70 py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <SectionHeading icon={Coffee} eyebrow="Sản phẩm" title="Đồ uống & vật phẩm S.t" />
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {PRODUCTS.map((group) => (
              <div
                key={group.title}
                className="rounded-2xl border border-border bg-card p-6 shadow-sm"
              >
                <p className="font-semibold">{group.title}</p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="rounded-full border border-border bg-accent px-3 py-1 text-sm text-accent-foreground"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* News */}
      <section id="news" className="border-b border-border/70 bg-secondary/40 py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <SectionHeading icon={Newspaper} eyebrow="Tin tức" title="Luôn cập nhật cùng S.t" />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {NEWS.map((item) => (
              <div
                key={item.tag}
                className="rounded-2xl border border-border bg-card p-6 shadow-sm"
              >
                <p className="text-xs font-semibold tracking-wide text-primary uppercase">
                  {item.tag}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Give back */}
      <section id="giveback" className="border-b border-border/70 py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <SectionHeading icon={Gift} eyebrow="Cho đi" title="Lan toả những điều tử tế" />
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Các hoạt động từ thiện, và những món quà tri ân khách hàng nhân dịp
            đặc biệt — vì S.t lớn lên cùng cộng đồng.
          </p>
        </div>
      </section>

      {/* Careers */}
      <section id="careers" className="py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <SectionHeading icon={Users} eyebrow="Tuyển dụng" title="Trở thành Cộng sự S.t" />
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Chúng tôi luôn tìm kiếm Cửa hàng trưởng, Kế toán và nhiều vị trí
            khác để cùng xây dựng S.t.
          </p>
          <a
            href="mailto:tuyendung@st.vn"
            className="mt-6 inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground shadow-sm transition-opacity hover:opacity-90"
          >
            Ứng tuyển ngay
            <ArrowRight className="size-4" />
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/70 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-4 text-center text-xs text-muted-foreground sm:flex-row sm:justify-between sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} S.t Coffee. Mọi quyền được bảo lưu.</p>
          <Link href="/admin/" className="hover:text-foreground">
            Đăng nhập quản trị
          </Link>
        </div>
      </footer>
    </div>
  );
}

function SectionHeading({
  icon: Icon,
  eyebrow,
  title,
}: {
  icon: React.ComponentType<{ className?: string }>;
  eyebrow: string;
  title: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 text-xs font-semibold tracking-[0.2em] text-primary uppercase">
        <Icon className="size-4" />
        {eyebrow}
      </div>
      <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
        {title}
      </h2>
    </div>
  );
}
