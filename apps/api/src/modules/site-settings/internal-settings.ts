/**
 * Content of the two staff pages under "Nội bộ" on the website, edited in the
 * CMS and stored as JSON rows in `site_settings`:
 *
 * - "Thông Báo": banner slogan, title, red intro block, a table of contents
 *   (every entry has a title and the link its "Chi Tiết" button opens) and a
 *   closing line.
 * - "Con người phù hợp": a static page laid out like the Canva design — banner
 *   slogan, title, lead block, bullet intro, highlighted line, a "details"
 *   label, the numbered sections (rich text) and a closing line.
 */
export interface InternalNoticeItem {
  title: string;
  /** Where the "Chi Tiết" button goes (http(s) URL or a site path); empty = no button. */
  url: string;
}

export interface InternalNotices {
  /** Banner photo: an uploaded Media url or a site path; empty = plain red band. */
  bannerUrl: string;
  /** Text over the banner photo (line breaks kept). */
  slogan: string;
  /** Faint S+ COFFEE mark behind the content. */
  showWatermark: boolean;
  title: string;
  /** Sentence in the red block under the title. */
  intro: string;
  /** Heading above the table of contents. */
  tocTitle: string;
  items: InternalNoticeItem[];
  /** Centered red line at the bottom. */
  closing: string;
}

export interface InternalPeople {
  /** Banner photo: an uploaded Media url or a site path; empty = plain red band. */
  bannerUrl: string;
  /** Text over the banner photo (line breaks kept). */
  slogan: string;
  /** Faint S+ COFFEE mark behind the content. */
  showWatermark: boolean;
  title: string;
  /** Sentence in the red block under the title. */
  lead: string;
  /** Tiptap HTML (the bullets); sanitized again by the website before rendering. */
  intro: string;
  /** Centered red line closing the intro. */
  highlight: string;
  /** Label of the red button above the sections. */
  detailTitle: string;
  /** Tiptap HTML: one h2 per numbered section. */
  content: string;
  /** Centered red line at the very bottom. */
  closing: string;
}

const DEFAULT_BANNER = '/images/home/hero-cafe.jpg';
const DEFAULT_SLOGAN =
  'Nơi ấm áp được trao đi' + String.fromCharCode(10) + 'Nơi chúng ta thuộc về';
const DEFAULT_CLOSING =
  'Cảm ơn các bạn đã là một phần trong hành trình lan tỏa của S+';

export const DEFAULT_INTERNAL_NOTICES: InternalNotices = {
  bannerUrl: DEFAULT_BANNER,
  slogan: DEFAULT_SLOGAN,
  showWatermark: true,
  title: 'Thông Báo',
  intro: 'Thông báo hệ thống S+ luôn được cập nhật hàng tuần',
  tocTitle: 'Mục Lục',
  items: [
    { title: 'Lịch Làm', url: '' },
    { title: 'Update Quy Chuẩn', url: '' },
    { title: 'Update Tiêu chuẩn', url: '' },
    { title: 'Công Thức Mới', url: '' },
    { title: 'Lịch Kiểm Tra', url: '' },
    { title: 'Update Quyền Lợi', url: '' },
  ],
  closing: DEFAULT_CLOSING,
};

export const DEFAULT_INTERNAL_PEOPLE: InternalPeople = {
  bannerUrl: DEFAULT_BANNER,
  slogan: DEFAULT_SLOGAN,
  showWatermark: true,
  title: 'Con người Phù Hợp',
  lead: 'Người luôn đặt tâm cho người khác nhiều hơn, thậm chí không mong cầu nhận lại.',
  intro: `<ul>
<li><strong>Chủ động giúp đỡ:</strong> Cho đi tự nguyện, làm điều tốt nhất trong khả năng mà không so đo thiệt hơn.</li>
<li><strong>Sẵn sàng chịu thiệt:</strong> Nhận phần vất vả về mình một chút để người khác nhẹ nhàng hơn.</li>
<li><strong>Bao dung, rộng lượng:</strong> Luôn đặt mình vào vị trí người khác, dễ bỏ qua và không chấp nhặt.</li>
</ul>`,
  highlight: 'Làm cho mọi người cảm thấy an toàn, gần gũi, ấm áp',
  detailTitle: 'Chi tiết về con người phù hợp',
  content: `<h2>I. Trung thực</h2>
<p>Là sự đồng nhất giữa suy nghĩ – hình ảnh – cảm giác bên trong và điều thể hiện ra bên ngoài.</p>
<h2>II. Chủ động</h2>
<p>Là sự đồng nhất giữa suy nghĩ – hình ảnh – cảm giác bên trong và điều thể hiện ra bên ngoài.</p>
<h2>III. Take Care</h2>
<p>Là tinh tế nhận ra nhu cầu, cảm xúc, sự cố. Từ đó chủ động hành động đúng lúc một cách cẩn thận, tỉ mỉ, nhẹ nhàng, lịch sự và lễ phép.</p>
<h2>IV. Triệt để</h2>
<p>Là làm việc cẩn thận, tỉ mỉ và không để lại việc cho người khác.</p>
<h2>V. Trách nhiệm</h2>
<p>Là biết việc của mình, chủ động, hoàn thành và chịu trách nhiệm về kết quả.</p>
<h2>VI. Các ý bổ trợ</h2>
<ul>
<li>Thương hiệu cà phê Gần Gũi – Ấm Áp – Chuyên Nghiệp</li>
<li>Cái TÔI</li>
<li>Phân biệt đối xử cộng sự</li>
<li>Sự cố</li>
</ul>`,
  closing: DEFAULT_CLOSING,
};

const MAX_ITEMS = 30;
const MAX_CONTENT = 100_000;

const str = (v: unknown, max: number): string =>
  typeof v === 'string' ? v.trim().slice(0, max) : '';

/** http(s) URL or a site-relative path; anything else (javascript:, //evil) is dropped. */
const link = (v: unknown): string => {
  const s = str(v, 2000);
  return /^https?:\/\//i.test(s) || /^\/(?!\/)/.test(s) ? s : '';
};

const obj = (v: unknown): Record<string, unknown> =>
  v && typeof v === 'object' && !Array.isArray(v)
    ? (v as Record<string, unknown>)
    : {};

export function sanitizeInternalNotices(input: unknown): InternalNotices {
  const root = obj(input);
  const items = (Array.isArray(root.items) ? root.items : [])
    .map((raw) => {
      const item = obj(raw);
      return { title: str(item.title, 120), url: link(item.url) };
    })
    .filter((item) => item.title)
    .slice(0, MAX_ITEMS);
  return {
    bannerUrl: link(root.bannerUrl),
    slogan: str(root.slogan, 200),
    // On unless explicitly switched off (also for rows saved before the option existed).
    showWatermark: root.showWatermark !== false,
    title: str(root.title, 120),
    intro: str(root.intro, 300),
    tocTitle: str(root.tocTitle, 120),
    items,
    closing: str(root.closing, 300),
  };
}

const html = (v: unknown): string =>
  typeof v === 'string' ? v.slice(0, MAX_CONTENT) : '';

export function sanitizeInternalPeople(input: unknown): InternalPeople {
  const root = obj(input);
  return {
    bannerUrl: link(root.bannerUrl),
    slogan: str(root.slogan, 200),
    // On unless explicitly switched off (also for rows saved before the option existed).
    showWatermark: root.showWatermark !== false,
    title: str(root.title, 120),
    lead: str(root.lead, 500),
    intro: html(root.intro),
    highlight: str(root.highlight, 300),
    detailTitle: str(root.detailTitle, 120),
    content: html(root.content),
    closing: str(root.closing, 300),
  };
}
