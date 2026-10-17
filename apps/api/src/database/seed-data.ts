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
  DocumentCategory,
  DrinkSubType,
  JobStatus,
  MerchandiseSubType,
  PostType,
  ProductCategory,
  TeamMemberGroup,
} from '../common/enums';
import { HomeSettings } from '../modules/site-settings/home-settings';

const img = (name: string) => `/images/seed/${name}.svg`;

// ── Site settings ───────────────────────────────────────────────────────────

export const CONTACT_SETTINGS = {
  phone: '1900 636 868',
  openingHours: 'Mở cửa mỗi ngày: 07:00 – 22:30',
  closingMessage: 'Cảm ơn bạn đã đồng hành cùng S+ Coffee – hẹn gặp lại bạn!',
  facebookUrl: 'https://www.facebook.com/',
  instagramUrl: 'https://www.instagram.com/',
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
  sections: {
    newProducts: true,
    stores: true,
    news: true,
    giveBack: true,
    jobs: true,
  },
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
  price: number;
  isNew?: boolean;
  photo: string;
}

const drink = (
  sub: DrinkSubType,
  name: string,
  price: number,
  description: string,
  photo: string,
  isNew = false,
): SeedProduct => ({
  name,
  category: ProductCategory.DRINK,
  drinkSubType: sub,
  description,
  price,
  isNew,
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

const { HOT, ICED, FRESH } = DrinkSubType;
const { NOTEBOOK, PEN, TUMBLER, BAG } = MerchandiseSubType;

/** Listed in menu order — sortOrder is assigned from the array index. */
export const PRODUCTS: SeedProduct[] = [
  drink(HOT, 'Cà phê đen nóng', 29000, 'Cà phê phin truyền thống, đậm đà và thơm nồng.', img('p-ca-phe-den')),
  drink(HOT, 'Cà phê sữa nóng', 32000, 'Vị đắng nhẹ của cà phê hoà cùng sữa đặc béo ngậy.', img('p-ca-phe-sua-nong')),
  drink(HOT, 'Latte nóng', 45000, 'Espresso kết hợp sữa tươi đánh nóng, bề mặt bọt mịn.', img('p-latte-nong')),
  drink(HOT, 'Cappuccino', 45000, 'Tỉ lệ cân bằng giữa espresso, sữa nóng và lớp bọt dày.', img('p-cappuccino')),
  drink(HOT, 'Trà gừng mật ong', 42000, 'Trà gừng ấm nồng, ngọt dịu từ mật ong — hợp những ngày se lạnh.', img('p-tra-gung'), true),
  drink(HOT, 'Cacao nóng', 42000, 'Cacao nguyên chất pha cùng sữa tươi, thêm lớp kem nhẹ phía trên.', img('p-cacao-nong')),
  drink(ICED, 'Cà phê sữa đá', 32000, 'Món quen thuộc của S+: đậm, mát và ngọt vừa phải.', img('p-ca-phe-sua-da')),
  drink(ICED, 'Bạc xỉu đá', 35000, 'Nhiều sữa, ít cà phê — êm dịu cho người mới uống cà phê.', img('p-bac-xiu')),
  drink(ICED, 'Cold brew cam', 52000, 'Cà phê ủ lạnh 18 giờ kết hợp nước cam vắt, chua thanh sảng khoái.', img('p-cold-brew-cam'), true),
  drink(ICED, 'Trà đào cam sả', 49000, 'Trà đen thơm mùi sả, đào miếng giòn và cam tươi.', img('p-tra-dao')),
  drink(ICED, 'Matcha latte đá', 52000, 'Matcha Nhật xay mịn, hoà cùng sữa tươi lạnh.', img('p-matcha-da'), true),
  drink(ICED, 'Americano đá', 39000, 'Espresso pha loãng với nước đá, vị cà phê rõ và sạch.', img('p-americano-da')),
  drink(FRESH, 'Sinh tố bơ', 52000, 'Bơ sáp Đắk Lắk xay cùng sữa, béo mịn tự nhiên.', img('p-sinh-to-bo')),
  drink(FRESH, 'Nước ép cam', 45000, 'Cam vàng vắt tươi mỗi ngày, không thêm đường.', img('p-nuoc-cam')),
  drink(FRESH, 'Nước ép dưa hấu', 42000, 'Dưa hấu ép lạnh, ngọt mát giải nhiệt.', img('p-dua-hau')),
  drink(FRESH, 'Sinh tố xoài', 49000, 'Xoài cát chín cây xay mịn cùng sữa chua.', img('p-sinh-to-xoai')),
  merch(NOTEBOOK, 'Sổ tay S+ bìa da', 119000, 'Sổ khổ A5, giấy kem 100gsm, bìa da PU có dập logo S+.', img('m-so-tay'), true),
  merch(PEN, 'Bút gel S+', 39000, 'Bút gel mực đen 0.5mm, thân gỗ nhẹ, viết êm.', img('m-but')),
  merch(TUMBLER, 'Bình giữ nhiệt S+ 500ml', 259000, 'Inox 304 hai lớp, giữ nóng 8 giờ, giữ lạnh 12 giờ.', img('m-binh-giu-nhiet'), true),
  merch(TUMBLER, 'Ly sứ S+', 149000, 'Ly sứ trắng men bóng 350ml, in logo S+ màu đỏ đô.', img('m-ly-su')),
  merch(BAG, 'Túi tote canvas S+', 99000, 'Túi vải canvas dày, quai dài đeo vai, in hoạ tiết S+.', img('m-tui-tote')),
];

// ── Stores ──────────────────────────────────────────────────────────────────

export const STORES = [
  {
    name: 'S+ Coffee Cầu Giấy',
    address: '25 Trần Thái Tông, Dịch Vọng, Cầu Giấy, Hà Nội',
    phone: '024 3333 0001',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=25+Tran+Thai+Tong+Cau+Giay+Ha+Noi',
    description:
      'Cửa hàng đầu tiên của S+, không gian rộng rãi với nhiều ổ cắm, wifi mạnh — lý tưởng để học tập và làm việc. Có khu vực yên tĩnh ở tầng 2.',
    photos: ['s-1', 'n-barista'],
  },
  {
    name: 'S+ Coffee Đống Đa',
    address: '112 Chùa Bộc, Quang Trung, Đống Đa, Hà Nội',
    phone: '024 3333 0002',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=112+Chua+Boc+Dong+Da+Ha+Noi',
    description:
      'Nằm gần các trường đại học, S+ Đống Đa luôn nhộn nhịp với các nhóm bạn trẻ. Có khu ngồi ngoài trời và góc sách nhỏ.',
    photos: ['s-2'],
  },
  {
    name: 'S+ Coffee Quận 1',
    address: '48 Lê Thị Hồng Gấm, Nguyễn Thái Bình, Quận 1, TP. Hồ Chí Minh',
    phone: '028 3333 0003',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=48+Le+Thi+Hong+Gam+Quan+1+TP+HCM',
    description:
      'Cửa hàng đầu tiên của S+ ở phía Nam, thiết kế ấm áp với gam màu đỏ đô đặc trưng, phù hợp cho cuộc hẹn nhỏ và họp nhanh.',
    photos: ['s-3'],
  },
];

// ── Posts ───────────────────────────────────────────────────────────────────

const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000);

export const POSTS = [
  {
    slug: 'khai-truong-s-plus-quan-1',
    title: 'S+ Coffee chính thức khai trương cửa hàng đầu tiên tại TP. Hồ Chí Minh',
    type: PostType.ANNOUNCEMENT,
    cover: 'n-thong-bao',
    excerpt: 'Từ ngày hôm nay, S+ Coffee Quận 1 mở cửa đón khách với nhiều ưu đãi dành cho 7 ngày đầu tiên.',
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
    excerpt: 'Toàn hệ thống S+ phục vụ như bình thường trong dịp lễ, riêng một số cửa hàng thay đổi giờ đóng cửa.',
    publishedAt: daysAgo(14),
    content: `<p>Trong dịp nghỉ lễ sắp tới, S+ Coffee tiếp tục phục vụ khách hàng với khung giờ <strong>07:00 – 22:30</strong>.</p>
<p>Riêng cửa hàng Đống Đa sẽ đóng cửa sớm lúc <strong>21:00</strong> vào ngày cuối kỳ nghỉ. Mong bạn thông cảm và sắp xếp thời gian ghé quán.</p>`,
  },
  {
    slug: 'sap-ra-mat-bo-suu-tap-mua-thu',
    title: 'Sắp ra mắt: Bộ sưu tập đồ uống mùa thu',
    type: PostType.COMING_SOON,
    cover: 'n-coming-soon',
    excerpt: 'Ba thức uống mới lấy cảm hứng từ hương vị mùa thu sẽ có mặt tại S+ từ đầu tháng sau.',
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
    excerpt: 'Cà phê ủ lạnh 18 giờ kết hợp nước cam vắt, thức uống mới đang được yêu thích tại S+.',
    publishedAt: daysAgo(9),
    content: `<p><strong>Cold brew cam</strong> là sự kết hợp giữa cà phê ủ lạnh 18 giờ và nước cam vắt tươi. Vị chua thanh của cam làm nổi bật hương trái cây tự nhiên trong hạt cà phê.</p>
<p>Gợi ý: uống lạnh với nhiều đá, ngon nhất vào buổi chiều.</p>`,
  },
  {
    slug: 'ra-mat-matcha-latte-da',
    title: 'Matcha latte đá – lựa chọn mới cho người không uống cà phê',
    type: PostType.NEW_PRODUCT,
    cover: 'n-san-pham-moi',
    excerpt: 'Matcha Nhật xay mịn hoà cùng sữa tươi, vị trà đậm và hậu ngọt nhẹ.',
    publishedAt: daysAgo(20),
    content: `<p>Không phải ai cũng yêu cà phê, vì vậy S+ giới thiệu <strong>Matcha latte đá</strong> — bột matcha Nhật xay mịn, đánh tan cùng sữa tươi lạnh.</p>
<p>Bạn có thể chọn mức đường (0%, 50%, 100%) khi gọi món.</p>`,
  },
  {
    slug: 'mot-ngay-cua-barista-s-plus',
    title: 'Một ngày của barista S+: phía sau mỗi ly cà phê',
    type: PostType.CULTURE_ARTICLE,
    cover: 'n-van-hoa',
    excerpt: 'Từ 6 giờ sáng chuẩn bị quán đến lúc đóng cửa, cùng xem barista S+ làm việc như thế nào.',
    publishedAt: daysAgo(30),
    content: `<p>06:00 – Barista đến quán, kiểm tra máy pha, xay thử và nếm espresso đầu tiên để điều chỉnh độ xay.</p>
<p>07:00 – Mở cửa. Những vị khách quen đầu tiên bước vào, và barista nhớ luôn món quen thuộc của họ.</p>
<p>12:00 – Giờ cao điểm. Mọi người phối hợp nhịp nhàng: người pha, người ra món, người tiếp khách.</p>
<p>22:30 – Đóng cửa. Vệ sinh máy, kiểm kê nguyên liệu và chuẩn bị cho ngày mai.</p>
<blockquote>“Mỗi ly cà phê là một lời chào.” — Barista S+</blockquote>`,
  },
  {
    slug: 'ca-phe-treo-s-plus',
    title: 'Chương trình “Cà phê treo”: một ly ấm cho người cần',
    type: PostType.GIVE_BACK,
    cover: 'g-1',
    excerpt: 'Mỗi ly cà phê bạn “treo” tại S+ sẽ được trao tận tay cho một người lao động cần nghỉ chân.',
    publishedAt: daysAgo(5),
    content: `<p>“Cà phê treo” là hoạt động quen thuộc của S+: khách hàng có thể trả trước một hoặc nhiều ly cho những người cần giúp đỡ.</p>
<p>Chỉ riêng tháng vừa qua, cộng đồng S+ đã cùng nhau trao đi <strong>hơn 1.200 ly cà phê và trà nóng</strong> cho tài xế công nghệ, công nhân vệ sinh và người bán hàng rong quanh các cửa hàng.</p>
<p>Cảm ơn bạn đã cùng S+ lan toả sự ấm áp.</p>`,
  },
  {
    slug: 'mua-dong-am-s-plus',
    title: 'Mùa đông ấm: tặng áo ấm cho trẻ em vùng cao',
    type: PostType.GIVE_BACK,
    cover: 'g-2',
    excerpt: 'Hơn 500 chiếc áo ấm đã được gửi tới các điểm trường vùng cao nhờ sự chung tay của khách hàng S+.',
    publishedAt: daysAgo(40),
    content: `<p>Cuối năm ngoái, S+ phát động chương trình <strong>“Mùa đông ấm”</strong> kêu gọi khách hàng quyên góp áo ấm cũ và mới.</p>
<p>Đoàn thiện nguyện của S+ đã mang <strong>hơn 500 chiếc áo ấm</strong> cùng sách vở tới các điểm trường vùng cao. Những nụ cười của các em là món quà lớn nhất với chúng tôi.</p>`,
  },
  {
    slug: 'goc-sach-nho-s-plus',
    title: 'Góc sách nhỏ: đọc miễn phí tại S+ Đống Đa',
    type: PostType.GIVE_BACK,
    cover: 'g-3',
    excerpt: 'Hơn 300 đầu sách do khách hàng đóng góp, sẵn sàng cho bạn đọc tại chỗ hoàn toàn miễn phí.',
    publishedAt: daysAgo(55),
    content: `<p>Tại S+ Coffee Đống Đa, bạn sẽ tìm thấy một giá sách nhỏ với hơn 300 đầu sách do chính khách hàng đóng góp.</p>
<p>Hãy mượn một cuốn sách, gọi một ly nước và ngồi lại thật lâu. Nếu có sách hay, bạn cũng có thể tặng lại cho kệ sách chung này.</p>`,
  },
  {
    // Employee-only: must never appear on the public site.
    slug: 'cap-nhat-quy-trinh-ca-moi',
    title: '[Nội bộ] Cập nhật quy trình giao ca từ tháng này',
    type: PostType.INTERNAL_UPDATE,
    cover: null,
    excerpt: 'Quy trình giao ca mới áp dụng cho toàn bộ cửa hàng.',
    publishedAt: daysAgo(2),
    content: `<p>Từ tháng này, mọi cửa hàng áp dụng biểu mẫu giao ca mới gồm: kiểm kê quầy, tình trạng máy móc và các lưu ý đặc biệt cho ca sau.</p>
<p>Quản lý ca chịu trách nhiệm ký xác nhận trước khi rời quán.</p>`,
  },
];

// ── Jobs ────────────────────────────────────────────────────────────────────

export const JOBS = [
  {
    title: 'Nhân viên pha chế (Barista)',
    department: 'Vận hành cửa hàng',
    status: JobStatus.OPEN,
    postedDaysAgo: 4,
    description: `<p>Pha chế và phục vụ đồ uống theo tiêu chuẩn S+, giữ gìn không gian quán sạch sẽ và thân thiện.</p>
<ul>
<li>Pha chế đồ uống theo công thức chuẩn.</li>
<li>Tiếp đón và tư vấn thực đơn cho khách.</li>
<li>Vệ sinh khu vực làm việc, kiểm kê nguyên liệu.</li>
</ul>`,
    requirements: `<ul>
<li>Từ 18 tuổi, có thể làm việc theo ca (sáng/chiều/tối).</li>
<li>Thân thiện, chủ động, có tinh thần học hỏi.</li>
<li>Ưu tiên người có kinh nghiệm pha chế; S+ sẽ đào tạo từ đầu nếu bạn chưa có.</li>
</ul>`,
  },
  {
    title: 'Nhân viên phục vụ (Part-time)',
    department: 'Vận hành cửa hàng',
    status: JobStatus.OPEN,
    postedDaysAgo: 7,
    description: `<p>Hỗ trợ đón khách, order, ra món và giữ gìn không gian quán. Phù hợp với sinh viên.</p>`,
    requirements: `<ul>
<li>Sinh viên hoặc đã đi làm, có thể làm tối thiểu 20 giờ/tuần.</li>
<li>Giao tiếp tốt, trung thực, nhanh nhẹn.</li>
</ul>`,
  },
  {
    title: 'Quản lý cửa hàng',
    department: 'Vận hành cửa hàng',
    status: JobStatus.OPEN,
    postedDaysAgo: 10,
    description: `<p>Chịu trách nhiệm vận hành một cửa hàng S+: nhân sự, doanh thu, chất lượng dịch vụ và trải nghiệm khách hàng.</p>
<ul>
<li>Xây dựng lịch làm việc và đào tạo nhân viên.</li>
<li>Theo dõi doanh thu, chi phí và tồn kho.</li>
<li>Đảm bảo tiêu chuẩn chất lượng và vệ sinh an toàn thực phẩm.</li>
</ul>`,
    requirements: `<ul>
<li>Tối thiểu 2 năm kinh nghiệm quản lý trong ngành F&B.</li>
<li>Kỹ năng lãnh đạo, giải quyết vấn đề tốt.</li>
<li>Sẵn sàng làm việc ca và cuối tuần.</li>
</ul>`,
  },
  {
    title: 'Nhân viên Marketing & Nội dung',
    department: 'Marketing',
    status: JobStatus.OPEN,
    postedDaysAgo: 12,
    description: `<p>Xây dựng nội dung truyền thông trên mạng xã hội, hỗ trợ tổ chức sự kiện và các chiến dịch “Cho đi”.</p>`,
    requirements: `<ul>
<li>Có kinh nghiệm viết nội dung, chụp ảnh/dựng video cơ bản.</li>
<li>Hiểu các nền tảng Facebook, Instagram, TikTok.</li>
<li>Yêu thích cà phê và văn hoá quán là một lợi thế.</li>
</ul>`,
  },
  {
    title: 'Nhân viên kho (Đã tuyển đủ)',
    department: 'Vận hành',
    status: JobStatus.CLOSED,
    postedDaysAgo: 60,
    description: `<p>Vị trí đã tuyển đủ. Cảm ơn các bạn đã quan tâm.</p>`,
    requirements: `<p>—</p>`,
  },
];

// ── CMS-only content (staff area) ───────────────────────────────────────────

export const DOCUMENTS = [
  {
    title: 'Quy trình mở cửa hàng buổi sáng',
    category: DocumentCategory.WORKFLOW,
    content: `<ol>
<li>Tắt hệ thống báo động, bật điện và máy lạnh.</li>
<li>Khởi động máy pha, đợi đủ áp suất (khoảng 20 phút).</li>
<li>Xay thử và nếm espresso đầu ngày, điều chỉnh độ xay.</li>
<li>Kiểm tra tủ mát, sữa tươi, trái cây và ghi chú hạn dùng.</li>
<li>Lau bàn ghế, kiểm tra nhà vệ sinh, bật nhạc nền.</li>
</ol>`,
  },
  {
    title: 'Công thức Cold brew cam',
    category: DocumentCategory.RECIPE,
    content: `<p><strong>Nguyên liệu (1 ly 450ml):</strong></p>
<ul>
<li>120ml cold brew (ủ 18 giờ).</li>
<li>60ml nước cam vắt tươi.</li>
<li>10ml siro đường (tuỳ khẩu vị).</li>
<li>Đá viên đầy ly.</li>
</ul>
<p><strong>Cách làm:</strong> cho đá vào ly, đổ nước cam và siro, rót cold brew từ từ lên trên để tạo lớp. Trang trí lát cam.</p>`,
  },
  {
    title: 'Tiêu chuẩn chất lượng espresso',
    category: DocumentCategory.QUALITY_STANDARD,
    content: `<ul>
<li>Liều lượng: 18g cà phê, chiết xuất 36g trong 25–30 giây.</li>
<li>Nhiệt độ nước: 92–94°C.</li>
<li>Crema vàng nâu, dày khoảng 3–4mm.</li>
<li>Bỏ ly espresso nếu chiết xuất ngoài khoảng thời gian trên và điều chỉnh lại độ xay.</li>
</ul>`,
  },
];

export const ANNOUNCEMENTS = [
  {
    title: 'Họp toàn hệ thống cuối tháng',
    content: 'Cuộc họp toàn hệ thống diễn ra vào 14:00 thứ Bảy cuối tháng tại S+ Cầu Giấy. Quản lý cửa hàng sắp xếp ca để nhân viên có thể tham dự.',
    pinned: true,
  },
  {
    title: 'Đăng ký đồng phục mới',
    content: 'Nhân viên vui lòng đăng ký size áo đồng phục mới với quản lý cửa hàng trước cuối tuần này.',
    pinned: false,
  },
];

export const SCHEDULE_ENTRIES = [
  {
    title: 'Đào tạo barista nâng cao',
    description: 'Buổi đào tạo về latte art và quy trình chiết xuất espresso.',
    startInDays: 3,
    hours: 3,
    location: 'S+ Coffee Cầu Giấy',
  },
  {
    title: 'Họp toàn hệ thống',
    description: 'Tổng kết tháng và công bố bộ sưu tập đồ uống mùa thu.',
    startInDays: 9,
    hours: 2,
    location: 'S+ Coffee Cầu Giấy',
  },
  {
    title: 'Ngày hội “Cho đi” tại cửa hàng Đống Đa',
    description: 'Phát cà phê treo và trao sách cho cộng đồng.',
    startInDays: 16,
    hours: 4,
    location: 'S+ Coffee Đống Đa',
  },
];
