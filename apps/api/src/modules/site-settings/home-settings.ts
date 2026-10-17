/**
 * Home-page ("trang chủ") configuration — edited in the CMS, rendered by the
 * public landing page. Stored as one JSON row in `site_settings` (key "home").
 * Image fields hold a URL (an uploaded Media url, or a path to a bundled
 * asset); empty/missing means "not set".
 */
export interface HomeSettings {
  hero: {
    enabled: boolean;
    heading: string;
    tagline: string;
    ctaLabel: string;
    slides: { url: string }[];
  };
  story: {
    enabled: boolean;
    badge: string;
    title: string;
    body: string;
    imageUrl: string;
  };
  space: {
    enabled: boolean;
    title: string;
    tagline: string;
    imageUrl: string;
  };
  /** On/off switches for sections whose content comes from other CMS tabs. */
  sections: {
    newProducts: boolean;
    stores: boolean;
    news: boolean;
    giveBack: boolean;
    jobs: boolean;
  };
}

export const DEFAULT_HOME_SETTINGS: HomeSettings = {
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

const MAX_SLIDES = 8;

const str = (v: unknown, max: number): string =>
  typeof v === 'string' ? v.trim().slice(0, max) : '';

/** Only http(s) URLs or site-relative paths — these end up in src/href. */
const url = (v: unknown): string => {
  const s = str(v, 2000);
  return /^https?:\/\//i.test(s) || /^\/(?!\/)/.test(s) ? s : '';
};

const obj = (v: unknown): Record<string, unknown> =>
  v && typeof v === 'object' && !Array.isArray(v)
    ? (v as Record<string, unknown>)
    : {};

const bool = (v: unknown, fallback: boolean): boolean =>
  typeof v === 'boolean' ? v : fallback;

/** Whitelists and clamps arbitrary input into a valid HomeSettings. */
export function sanitizeHomeSettings(input: unknown): HomeSettings {
  const root = obj(input);
  const hero = obj(root.hero);
  const story = obj(root.story);
  const space = obj(root.space);
  const sections = obj(root.sections);
  const d = DEFAULT_HOME_SETTINGS;

  const slides = (Array.isArray(hero.slides) ? hero.slides : [])
    .map((s) => url(obj(s).url))
    .filter(Boolean)
    .slice(0, MAX_SLIDES)
    .map((u) => ({ url: u }));

  return {
    hero: {
      enabled: bool(hero.enabled, d.hero.enabled),
      heading: str(hero.heading, 120),
      tagline: str(hero.tagline, 300),
      ctaLabel: str(hero.ctaLabel, 40),
      slides,
    },
    story: {
      enabled: bool(story.enabled, d.story.enabled),
      badge: str(story.badge, 60),
      title: str(story.title, 200),
      body: str(story.body, 3000),
      imageUrl: url(story.imageUrl),
    },
    space: {
      enabled: bool(space.enabled, d.space.enabled),
      title: str(space.title, 120),
      tagline: str(space.tagline, 200),
      imageUrl: url(space.imageUrl),
    },
    sections: {
      newProducts: bool(sections.newProducts, true),
      stores: bool(sections.stores, true),
      news: bool(sections.news, true),
      giveBack: bool(sections.giveBack, true),
      jobs: bool(sections.jobs, true),
    },
  };
}
