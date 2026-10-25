/**
 * Demo content for the public website + CMS. Edit freely — `npm run seed:demo`
 * upserts by natural key (name / slug / title), so re-running updates rows
 * instead of duplicating them.
 *
 * All names, addresses, phone numbers and people below are fictional demo
 * data. Replace them in the CMS (or here) before going live.
 *
 * Images: `/images/seed/*.svg` (generated placeholders) and `/images/home/*.jpg`
 * ship with the web app and are served by the same origin as the site.
 */
import {
  DrinkSubType,
  JobStatus,
  MerchandiseSubType,
  PostType,
  ProductCategory,
  TeamMemberGroup,
} from '../common/enums';
import { HomeSettings } from '../modules/site-settings/home-settings';
import {
  DEFAULT_INTERNAL_NOTICES,
  InternalNotices,
} from '../modules/site-settings/internal-settings';

const img = (name: string) => `/images/seed/${name}.svg`;

// ── Site settings ───────────────────────────────────────────────────────────

export const CONTACT_SETTINGS = {
  phone: '1900 636 868',
  openingHours: 'Mở cửa mỗi ngày: 07:00 – 22:30',
  closingMessage: 'Cảm ơn bạn đã đồng hành cùng S+ Coffee – hẹn gặp lại bạn!',
  facebookUrl: 'https://www.facebook.com/',
  instagramUrl: 'https://www.instagram.com/',
  youtubeUrl: 'https://www.youtube.com/',
  tiktokUrl: 'https://www.tiktok.com/',
  chatUrl: 'https://m.me/',
};

export const HOME_SETTINGS: HomeSettings = {
  hero: {
    enabled: true,
    heading: 'S+ Coffee',
    tagline: '“Nơi ấm áp được trao đi - nơi chúng ta thuộc về”',
    ctaLabel: 'Tìm Hiểu Thêm',
    slides: [
      { url: '/images/home/hero-cafe.jpg' },
      { url: '/images/home/hero-studying.jpg' },
    ],
  },
  story: {
    enabled: true,
    badge: 'Câu chuyện S+',
    title: 'Gần Gũi - Ấm Áp - Chuyên Nghiệp',
    body: 'Trên hành trình này, S+ coi khách hàng là những người thân thiết luôn đồng hành và ủng hộ, từ đó luôn dành trọn sự trân trọng và biết ơn đối với khách hàng.',
    imageUrl: '/images/home/barista.jpg',
  },
  space: {
    enabled: true,
    title: 'Không Gian',
    tagline: 'Học Tập · Làm Việc · Kết Nối · Thư Giãn',
    imageUrl: '/images/home/khong-gian-bg.jpg',
  },
  sections: { newProducts: true },
};

// ── Story ───────────────────────────────────────────────────────────────────

export const STORY_BLOCKS = [
  {
    slug: 'huong-di',
    title: 'Hướng đi',
    sortOrder: 1,
    content: `<p>S+ Coffee bắt đầu từ một ý nghĩ giản dị: một quán cà phê không chỉ là nơi bán đồ uống, mà là nơi người ta được <strong>nghỉ chân, được lắng nghe và được tiếp thêm năng lượng</strong> cho một ngày dài.</p>
<p>Chúng tôi chọn con đường đi chậm mà chắc: chọn nguồn hạt rõ ràng, rang vừa tới, pha đúng công thức và phục vụ bằng sự chân thành. Mỗi cửa hàng S+ mới được mở ra khi chúng tôi chắc rằng có thể giữ nguyên chất lượng và không khí quen thuộc.</p>
<h3>Chúng tôi đang hướng tới</h3>
<ul>
<li>Mở rộng hệ thống cửa hàng gần gũi với sinh viên và người đi làm.</li>
<li>Hợp tác trực tiếp với nhà vườn để cà phê có nguồn gốc minh bạch.</li>
<li>Dành một phần doanh thu mỗi tháng cho các hoạt động cộng đồng “Cho đi”.</li>
</ul>`,
  },
  {
    slug: 'cot-loi-van-hoa',
    title: 'Cốt lõi & Văn hoá',
    sortOrder: 2,
    content: `<p>Văn hoá S+ được xây từ ba giá trị: <strong>Gần gũi – Ấm áp – Chuyên nghiệp</strong>.</p>
<ul>
<li><strong>Gần gũi:</strong> mỗi khách hàng là một người quen, mỗi đồng nghiệp là một người thân.</li>
<li><strong>Ấm áp:</strong> một nụ cười, một ly nước ấm, một chỗ ngồi yên tĩnh — những điều nhỏ làm nên khác biệt.</li>
<li><strong>Chuyên nghiệp:</strong> quy trình rõ ràng, tiêu chuẩn nhất quán, luôn học hỏi để làm tốt hơn.</li>
</ul>
<blockquote>“Làm điều tử tế một cách đều đặn — đó là cách S+ giữ lửa.”</blockquote>
<p>Chúng tôi tin rằng khi nhân viên được tôn trọng và đào tạo bài bản, khách hàng sẽ cảm nhận được điều đó trong từng ly cà phê.</p>`,
  },
];

export const TEAM_MEMBERS = [
  {
    group: TeamMemberGroup.CORE_TEAM,
    name: 'Nguyễn Minh Anh',
    role: 'Nhà sáng lập & Giám đốc điều hành',
    bio: 'Hơn 10 năm trong ngành F&B, người đặt nền móng cho tinh thần “gần gũi – ấm áp” của S+.',
    sortOrder: 1,
  },
  {
    group: TeamMemberGroup.CORE_TEAM,
    name: 'Trần Quốc Bảo',
    role: 'Giám đốc vận hành',
    bio: 'Phụ trách chuẩn hoá quy trình và đảm bảo trải nghiệm đồng nhất ở mọi cửa hàng.',
    sortOrder: 2,
  },
  {
    group: TeamMemberGroup.CORE_TEAM,
    name: 'Lê Thu Hà',
    role: 'Trưởng bộ phận sản phẩm',
    bio: 'Người đứng sau thực đơn S+: từ lựa chọn hạt cà phê đến công thức đồ uống theo mùa.',
    sortOrder: 3,
  },
  {
    group: TeamMemberGroup.CORE_TEAM,
    name: 'Phạm Đức Long',
    role: 'Trưởng bộ phận đào tạo',
    bio: 'Xây dựng chương trình đào tạo barista và văn hoá phục vụ cho toàn hệ thống.',
    sortOrder: 4,
  },
  {
    group: TeamMemberGroup.ADVISORY_BOARD,
    name: 'Hoàng Gia Khánh',
    role: 'Cố vấn chiến lược',
    bio: 'Chuyên gia phát triển chuỗi bán lẻ với nhiều năm kinh nghiệm tư vấn cho doanh nghiệp F&B.',
    sortOrder: 1,
  },
  {
    group: TeamMemberGroup.ADVISORY_BOARD,
    name: 'Đặng Thuỳ Linh',
    role: 'Cố vấn thương hiệu',
    bio: 'Đồng hành cùng S+ trong việc định hình bản sắc hình ảnh và câu chuyện thương hiệu.',
    sortOrder: 2,
  },
  {
    group: TeamMemberGroup.ADVISORY_BOARD,
    name: 'Vũ Thanh Tùng',
    role: 'Cố vấn chất lượng cà phê',
    bio: 'Q-Grader, tư vấn về nguồn hạt, rang xay và tiêu chuẩn chất lượng.',
    sortOrder: 3,
  },
];

// ── Products ────────────────────────────────────────────────────────────────

interface SeedProduct {
  name: string;
  category: ProductCategory;
  drinkSubType?: DrinkSubType;
  merchandiseSubType?: MerchandiseSubType;
  description: string;
  price: number | null;
  isNew?: boolean;
  isBestSeller?: boolean;
  photo: string;
}

const drink = (
  sub: DrinkSubType,
  name: string,
  price: number | null,
  description: string,
  photo: string,
  isNew = false,
  isBestSeller = false,
): SeedProduct => ({
  name,
  category: ProductCategory.DRINK,
  drinkSubType: sub,
  description,
  price,
  isNew,
  isBestSeller,
  photo,
});

const merch = (
  sub: MerchandiseSubType,
  name: string,
  price: number,
  description: string,
  photo: string,
  isNew = false,
): SeedProduct => ({
  name,
  category: ProductCategory.MERCHANDISE,
  merchandiseSubType: sub,
  description,
  price,
  isNew,
  photo,
});

const { MILK_TEA, NEW, TEA, SPECIAL, COFFEE, FRUIT, TOPPING } = DrinkSubType;
const { NOTEBOOK, PEN, TUMBLER, BAG } = MerchandiseSubType;

/** The S+ menu, grouped as on the printed menu. sortOrder follows the array index. */
export const PRODUCTS: SeedProduct[] = [
  drink(
    MILK_TEA,
    'Hồng Trà Sữa',
    35000,
    'Trà sữa Việt · Hồng Trà Sữa.',
    img('p-hong-tra-sua'),
    false,
    true,
  ),
  drink(
    MILK_TEA,
    'Olong Khói',
    40000,
    'Trà sữa Việt · Olong Khói.',
    img('p-olong-khoi'),
    false,
    true,
  ),
  drink(
    MILK_TEA,
    'Trà Sữa Socola',
    40000,
    'Trà sữa Việt · Trà Sữa Socola.',
    img('p-tra-sua-socola'),
    false,
    false,
  ),
  drink(
    NEW,
    'Thơm Cốm',
    45000,
    'Món mới · Thơm Cốm.',
    img('p-thom-com'),
    true,
    false,
  ),
  drink(
    NEW,
    'Thơm Gạo',
    45000,
    'Món mới · Thơm Gạo.',
    img('p-thom-gao'),
    true,
    false,
  ),
  drink(
    NEW,
    'Thơm Khoai Môn',
    40000,
    'Món mới · Thơm Khoai Môn.',
    img('p-thom-khoai-mon'),
    true,
    false,
  ),
  drink(
    TEA,
    'Trà Măng Cầu',
    40000,
    'Trà · Trà Măng Cầu.',
    img('p-tra-mang-cau'),
    false,
    true,
  ),
  drink(
    TEA,
    'Trà Đào Cam Sả',
    35000,
    'Trà · Trà Đào Cam Sả.',
    img('p-tra-dao-cam-sa'),
    false,
    true,
  ),
  drink(
    TEA,
    'Trà Sen Vàng',
    45000,
    'Trà · Trà Sen Vàng.',
    img('p-tra-sen-vang'),
    false,
    true,
  ),
  drink(
    TEA,
    'Trà Thạch Đào',
    40000,
    'Trà · Trà Thạch Đào.',
    img('p-tra-thach-dao'),
    false,
    false,
  ),
  drink(
    TEA,
    'Trà Cam Xoài',
    40000,
    'Trà · Trà Cam Xoài.',
    img('p-tra-cam-xoai'),
    false,
    true,
  ),
  drink(
    SPECIAL,
    'Matcha Latte',
    40000,
    'Đặc biệt · Matcha Latte.',
    img('p-matcha-latte'),
    false,
    true,
  ),
  drink(
    SPECIAL,
    'Sữa Tươi Đường Đen',
    35000,
    'Đặc biệt · Sữa Tươi Đường Đen.',
    img('p-sua-tuoi-duong-den'),
    false,
    false,
  ),
  drink(
    SPECIAL,
    'Sữa Tươi Kem Dừa Nướng',
    45000,
    'Đặc biệt · Sữa Tươi Kem Dừa Nướng.',
    img('p-sua-tuoi-kem-dua-nuong'),
    false,
    true,
  ),
  drink(
    SPECIAL,
    'Sữa Chua Nha Đam',
    40000,
    'Đặc biệt · Sữa Chua Nha Đam.',
    img('p-sua-chua-nha-dam'),
    false,
    false,
  ),
  drink(
    SPECIAL,
    'Sữa Chua Xoài',
    40000,
    'Đặc biệt · Sữa Chua Xoài.',
    img('p-sua-chua-xoai'),
    false,
    false,
  ),
  drink(
    SPECIAL,
    'Sữa Chua Việt Quất',
    40000,
    'Đặc biệt · Sữa Chua Việt Quất.',
    img('p-sua-chua-viet-quat'),
    false,
    false,
  ),
  drink(
    COFFEE,
    'Nâu Đá',
    35000,
    'Cà phê · Nâu Đá.',
    img('p-nau-da'),
    false,
    false,
  ),
  drink(
    COFFEE,
    'Bạc Xỉu',
    40000,
    'Cà phê · Bạc Xỉu.',
    img('p-bac-xiu'),
    false,
    true,
  ),
  drink(
    COFFEE,
    'Cà Phê Muối',
    40000,
    'Cà phê · Cà Phê Muối.',
    img('p-ca-phe-muoi'),
    false,
    false,
  ),
  drink(
    FRUIT,
    'Nước Ép Cam',
    40000,
    'Nước hoa quả · Nước Ép Cam.',
    img('p-nuoc-ep-cam'),
    false,
    false,
  ),
  drink(
    FRUIT,
    'Nước Ép Lựu',
    40000,
    'Nước hoa quả · Nước Ép Lựu.',
    img('p-nuoc-ep-luu'),
    false,
    false,
  ),
  drink(
    FRUIT,
    'Chanh Vàng',
    35000,
    'Nước hoa quả · Chanh Vàng.',
    img('p-chanh-vang'),
    false,
    false,
  ),
  drink(
    TOPPING,
    'Trân Châu Đen',
    null,
    'Topping · Trân Châu Đen.',
    img('p-tran-chau-den'),
    false,
    false,
  ),
  drink(
    TOPPING,
    'Trân Châu Trắng',
    null,
    'Topping · Trân Châu Trắng.',
    img('p-tran-chau-trang'),
    false,
    false,
  ),
  drink(
    TOPPING,
    'Hạt Lựu',
    null,
    'Topping · Hạt Lựu.',
    img('p-hat-luu'),
    false,
    false,
  ),
  drink(
    TOPPING,
    'Thạch Dừa',
    null,
    'Topping · Thạch Dừa.',
    img('p-thach-dua'),
    false,
    false,
  ),
  drink(
    TOPPING,
    'Kem Cheese',
    null,
    'Topping · Kem Cheese.',
    img('p-kem-cheese'),
    false,
    false,
  ),
  merch(
    NOTEBOOK,
    'Sổ tay S+ bìa da',
    119000,
    'Sổ khổ A5, giấy kem 100gsm, bìa da PU có dập logo S+.',
    img('m-so-tay'),
    true,
  ),
  merch(
    PEN,
    'Bút gel S+',
    39000,
    'Bút gel mực đen 0.5mm, thân gỗ nhẹ, viết êm.',
    img('m-but'),
  ),
  merch(
    TUMBLER,
    'Bình giữ nhiệt S+ 500ml',
    259000,
    'Inox 304 hai lớp, giữ nóng 8 giờ, giữ lạnh 12 giờ.',
    img('m-binh-giu-nhiet'),
    true,
  ),
  merch(
    TUMBLER,
    'Ly sứ S+',
    149000,
    'Ly sứ trắng men bóng 350ml, in logo S+ màu đỏ đô.',
    img('m-ly-su'),
  ),
  merch(
    BAG,
    'Túi tote canvas S+',
    99000,
    'Túi vải canvas dày, quai dài đeo vai, in hoạ tiết S+.',
    img('m-tui-tote'),
  ),
];

// ── Posts ───────────────────────────────────────────────────────────────────

const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000);

export const POSTS = [
  {
    slug: 'khai-truong-s-plus-quan-1',
    title:
      'S+ Coffee chính thức khai trương cửa hàng đầu tiên tại TP. Hồ Chí Minh',
    type: PostType.ANNOUNCEMENT,
    cover: 'n-thong-bao',
    excerpt:
      'Từ ngày hôm nay, S+ Coffee Quận 1 mở cửa đón khách với nhiều ưu đãi dành cho 7 ngày đầu tiên.',
    publishedAt: daysAgo(3),
    content: `<p>Sau nhiều tháng chuẩn bị, <strong>S+ Coffee Quận 1</strong> chính thức mở cửa. Đây là cửa hàng đầu tiên của S+ tại TP. Hồ Chí Minh.</p>
<h3>Ưu đãi tuần khai trương</h3>
<ul>
<li>Giảm 20% toàn bộ đồ uống cho khách đến cửa hàng.</li>
<li>Tặng một ly sứ S+ cho hoá đơn từ 200.000đ.</li>
<li>Miễn phí nâng size mọi đồ uống.</li>
</ul>
<p>S+ Coffee rất mong được đón bạn tại <em>48 Lê Thị Hồng Gấm, Quận 1</em>.</p>`,
  },
  {
    slug: 'thong-bao-gio-mo-cua-dip-le',
    title: 'Thông báo giờ mở cửa các cửa hàng dịp lễ',
    type: PostType.ANNOUNCEMENT,
    cover: 'n-thong-bao',
    excerpt:
      'Toàn hệ thống S+ phục vụ như bình thường trong dịp lễ, riêng một số cửa hàng thay đổi giờ đóng cửa.',
    publishedAt: daysAgo(14),
    content: `<p>Trong dịp nghỉ lễ sắp tới, S+ Coffee tiếp tục phục vụ khách hàng với khung giờ <strong>07:00 – 22:30</strong>.</p>
<p>Riêng cửa hàng Đống Đa sẽ đóng cửa sớm lúc <strong>21:00</strong> vào ngày cuối kỳ nghỉ. Mong bạn thông cảm và sắp xếp thời gian ghé quán.</p>`,
  },
  {
    slug: 'sap-ra-mat-bo-suu-tap-mua-thu',
    title: 'Sắp ra mắt: Bộ sưu tập đồ uống mùa thu',
    type: PostType.COMING_SOON,
    cover: 'n-coming-soon',
    excerpt:
      'Ba thức uống mới lấy cảm hứng từ hương vị mùa thu sẽ có mặt tại S+ từ đầu tháng sau.',
    publishedAt: daysAgo(6),
    content: `<p>Mùa thu đang đến, và S+ cũng đã sẵn sàng với bộ sưu tập đồ uống giới hạn:</p>
<ol>
<li><strong>Latte hạt dẻ rang</strong> – béo bùi, thơm nhẹ.</li>
<li><strong>Trà táo quế</strong> – ấm áp, ngọt thanh.</li>
<li><strong>Cacao cam quýt</strong> – lạ miệng, hậu vị dễ chịu.</li>
</ol>
<p>Hãy theo dõi fanpage để biết ngày ra mắt chính thức nhé!</p>`,
  },
  {
    slug: 'ra-mat-cold-brew-cam',
    title: 'Ra mắt Cold brew cam – vị chua thanh cho ngày nắng',
    type: PostType.NEW_PRODUCT,
    cover: 'n-san-pham-moi',
    excerpt:
      'Cà phê ủ lạnh 18 giờ kết hợp nước cam vắt, thức uống mới đang được yêu thích tại S+.',
    publishedAt: daysAgo(9),
    content: `<p><strong>Cold brew cam</strong> là sự kết hợp giữa cà phê ủ lạnh 18 giờ và nước cam vắt tươi. Vị chua thanh của cam làm nổi bật hương trái cây tự nhiên trong hạt cà phê.</p>
<p>Gợi ý: uống lạnh với nhiều đá, ngon nhất vào buổi chiều.</p>`,
  },
  {
    slug: 'ra-mat-matcha-latte-da',
    title: 'Matcha latte đá – lựa chọn mới cho người không uống cà phê',
    type: PostType.NEW_PRODUCT,
    cover: 'n-san-pham-moi',
    excerpt:
      'Matcha Nhật xay mịn hoà cùng sữa tươi, vị trà đậm và hậu ngọt nhẹ.',
    publishedAt: daysAgo(20),
    content: `<p>Không phải ai cũng yêu cà phê, vì vậy S+ giới thiệu <strong>Matcha latte đá</strong> — bột matcha Nhật xay mịn, đánh tan cùng sữa tươi lạnh.</p>
<p>Bạn có thể chọn mức đường (0%, 50%, 100%) khi gọi món.</p>`,
  },
  {
    slug: 'mot-ngay-cua-barista-s-plus',
    title: 'Một ngày của barista S+: phía sau mỗi ly cà phê',
    type: PostType.CULTURE_ARTICLE,
    cover: 'n-van-hoa',
    excerpt:
      'Từ 6 giờ sáng chuẩn bị quán đến lúc đóng cửa, cùng xem barista S+ làm việc như thế nào.',
    publishedAt: daysAgo(30),
    content: `<p>06:00 – Barista đến quán, kiểm tra máy pha, xay thử và nếm espresso đầu tiên để điều chỉnh độ xay.</p>
<p>07:00 – Mở cửa. Những vị khách quen đầu tiên bước vào, và barista nhớ luôn món quen thuộc của họ.</p>
<p>12:00 – Giờ cao điểm. Mọi người phối hợp nhịp nhàng: người pha, người ra món, người tiếp khách.</p>
<p>22:30 – Đóng cửa. Vệ sinh máy, kiểm kê nguyên liệu và chuẩn bị cho ngày mai.</p>
<blockquote>“Mỗi ly cà phê là một lời chào.” — Barista S+</blockquote>`,
  },
];

// ── Jobs ────────────────────────────────────────────────────────────────────

export const JOBS = [
  {
    title: 'Nhân viên pha chế (Barista)',
    department: 'Vận hành cửa hàng',
    status: JobStatus.OPEN,
    postedDaysAgo: 4,
    description: `Pha chế và phục vụ đồ uống theo tiêu chuẩn S+, giữ gìn không gian quán sạch sẽ và thân thiện.
- Pha chế đồ uống theo công thức chuẩn.
- Tiếp đón và tư vấn thực đơn cho khách.
- Vệ sinh khu vực làm việc, kiểm kê nguyên liệu.`,
    requirements: `- Từ 18 tuổi, có thể làm việc theo ca (sáng/chiều/tối).
- Thân thiện, chủ động, có tinh thần học hỏi.
- Ưu tiên người có kinh nghiệm pha chế; S+ sẽ đào tạo từ đầu nếu bạn chưa có.`,
  },
  {
    title: 'Nhân viên phục vụ (Part-time)',
    department: 'Vận hành cửa hàng',
    status: JobStatus.OPEN,
    postedDaysAgo: 7,
    description: `Hỗ trợ đón khách, order, ra món và giữ gìn không gian quán. Phù hợp với sinh viên.`,
    requirements: `- Sinh viên hoặc đã đi làm, có thể làm tối thiểu 20 giờ/tuần.
- Giao tiếp tốt, trung thực, nhanh nhẹn.`,
  },
  {
    title: 'Quản lý cửa hàng',
    department: 'Vận hành cửa hàng',
    status: JobStatus.OPEN,
    postedDaysAgo: 10,
    description: `Chịu trách nhiệm vận hành một cửa hàng S+: nhân sự, doanh thu, chất lượng dịch vụ và trải nghiệm khách hàng.
- Xây dựng lịch làm việc và đào tạo nhân viên.
- Theo dõi doanh thu, chi phí và tồn kho.
- Đảm bảo tiêu chuẩn chất lượng và vệ sinh an toàn thực phẩm.`,
    requirements: `- Tối thiểu 2 năm kinh nghiệm quản lý trong ngành F&B.
- Kỹ năng lãnh đạo, giải quyết vấn đề tốt.
- Sẵn sàng làm việc ca và cuối tuần.`,
  },
  {
    title: 'Nhân viên Marketing & Nội dung',
    department: 'Marketing',
    status: JobStatus.OPEN,
    postedDaysAgo: 12,
    description: `Xây dựng nội dung truyền thông trên mạng xã hội, hỗ trợ tổ chức sự kiện và các chiến dịch “Cho đi”.`,
    requirements: `- Có kinh nghiệm viết nội dung, chụp ảnh/dựng video cơ bản.
- Hiểu các nền tảng Facebook, Instagram, TikTok.
- Yêu thích cà phê và văn hoá quán là một lợi thế.`,
  },
  {
    title: 'Nhân viên kho (Đã tuyển đủ)',
    department: 'Vận hành',
    status: JobStatus.CLOSED,
    postedDaysAgo: 60,
    description: `Vị trí đã tuyển đủ. Cảm ơn các bạn đã quan tâm.`,
    requirements: `—`,
  },
];

// ── Nội bộ: Thông Báo (mục lục + link "Chi Tiết") ───────────────────────────
// "Con người Phù Hợp" content lives in site-settings/internal-settings.ts.

export const INTERNAL_NOTICES: InternalNotices = {
  ...DEFAULT_INTERNAL_NOTICES,
  items: [
    { title: 'Lịch Làm', url: 'https://example.com/splus/lich-lam' },
    { title: 'Update Quy Chuẩn', url: 'https://example.com/splus/quy-chuan' },
    { title: 'Update Tiêu chuẩn', url: 'https://example.com/splus/tieu-chuan' },
    { title: 'Công Thức Mới', url: 'https://example.com/splus/cong-thuc-moi' },
    { title: 'Lịch Kiểm Tra', url: 'https://example.com/splus/lich-kiem-tra' },
    { title: 'Update Quyền Lợi', url: '/internal/people/' },
  ],
};
