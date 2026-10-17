import { DataSource, EntityManager } from 'typeorm';
import AppDataSource from './data-source';
import {
  ANNOUNCEMENTS,
  CONTACT_SETTINGS,
  DOCUMENTS,
  HOME_SETTINGS,
  JOBS,
  POSTS,
  PRODUCTS,
  SCHEDULE_ENTRIES,
  STORES,
  STORY_BLOCKS,
  TEAM_MEMBERS,
} from './seed-data';
import { MediaType, ProductStatus } from '../common/enums';
import { Document } from '../modules/documents/entities/document.entity';
import { InternalAnnouncement } from '../modules/internal-announcements/entities/internal-announcement.entity';
import { ScheduleEntry } from '../modules/internal-announcements/entities/schedule-entry.entity';
import { Job } from '../modules/jobs/entities/job.entity';
import { Media } from '../modules/media/entities/media.entity';
import { Post } from '../modules/posts/entities/post.entity';
import { ProductPhoto } from '../modules/products/entities/product-photo.entity';
import { Product } from '../modules/products/entities/product.entity';
import { SiteSetting } from '../modules/site-settings/entities/site-setting.entity';
import { StorePhoto } from '../modules/stores/entities/store-photo.entity';
import { Store } from '../modules/stores/entities/store.entity';
import { StoryBlock } from '../modules/story/entities/story-block.entity';
import { TeamMember } from '../modules/story/entities/team-member.entity';

/**
 * Fills the database with demo content so the public website and the CMS are
 * fully populated. Idempotent: rows are matched by natural key (name / slug /
 * title) and updated in place, so it is safe to re-run.
 *
 * Local:       npm run seed:demo
 * Production:  docker compose -f docker-compose.prod.yml exec api node dist/database/seed-demo.js
 */

const svgMedia = (name: string) => ({
  key: `seed/${name}.svg`,
  url: `/images/seed/${name}.svg`,
});

async function upsertMedia(em: EntityManager, name: string): Promise<Media> {
  const { key, url } = svgMedia(name);
  const repo = em.getRepository(Media);
  const existing = await repo.findOne({ where: { key } });
  if (existing) {
    Object.assign(existing, { url });
    return repo.save(existing);
  }
  return repo.save(
    repo.create({
      key,
      url,
      type: MediaType.IMAGE,
      mimeType: 'image/svg+xml',
      sizeBytes: null,
      originalFileName: `${name}.svg`,
    }),
  );
}

async function upsertSetting(
  em: EntityManager,
  key: string,
  value: object,
): Promise<void> {
  const repo = em.getRepository(SiteSetting);
  const row = (await repo.findOne({ where: { key } })) ?? repo.create({ key });
  row.value = value as Record<string, unknown>;
  await repo.save(row);
}

async function seedProducts(em: EntityManager): Promise<number> {
  const repo = em.getRepository(Product);
  const photoRepo = em.getRepository(ProductPhoto);
  for (const [i, p] of PRODUCTS.entries()) {
    const media = await upsertMedia(em, p.photo.split('/').pop()!.replace('.svg', ''));
    const product =
      (await repo.findOne({ where: { name: p.name } })) ??
      repo.create({ name: p.name });
    Object.assign(product, {
      category: p.category,
      drinkSubType: p.drinkSubType ?? null,
      merchandiseSubType: p.merchandiseSubType ?? null,
      description: p.description,
      price: p.price.toFixed(2),
      isNew: p.isNew ?? false,
      status: ProductStatus.ACTIVE,
      sortOrder: i + 1,
      photos: undefined,
    });
    const saved = await repo.save(product);
    await photoRepo.delete({ productId: saved.id });
    await photoRepo.save(
      photoRepo.create({ productId: saved.id, mediaId: media.id, sortOrder: 0 }),
    );
  }
  return PRODUCTS.length;
}

async function seedStores(em: EntityManager): Promise<number> {
  const repo = em.getRepository(Store);
  const photoRepo = em.getRepository(StorePhoto);
  for (const [i, s] of STORES.entries()) {
    const store =
      (await repo.findOne({ where: { name: s.name } })) ??
      repo.create({ name: s.name });
    Object.assign(store, {
      address: s.address,
      phone: s.phone,
      googleMapsUrl: s.googleMapsUrl,
      description: s.description,
      isActive: true,
      sortOrder: i + 1,
      photos: undefined,
    });
    const saved = await repo.save(store);
    await photoRepo.delete({ storeId: saved.id });
    for (const [order, photo] of s.photos.entries()) {
      const media = await upsertMedia(em, photo);
      await photoRepo.save(
        photoRepo.create({ storeId: saved.id, mediaId: media.id, sortOrder: order }),
      );
    }
  }
  return STORES.length;
}

async function seedPosts(em: EntityManager): Promise<number> {
  const repo = em.getRepository(Post);
  for (const p of POSTS) {
    const cover = p.cover ? await upsertMedia(em, p.cover) : null;
    const post =
      (await repo.findOne({ where: { slug: p.slug } })) ??
      repo.create({ slug: p.slug });
    Object.assign(post, {
      title: p.title,
      type: p.type,
      content: p.content,
      excerpt: p.excerpt,
      isPublished: true,
      publishedAt: p.publishedAt,
      coverImageId: cover?.id ?? null,
      coverImage: cover,
    });
    await repo.save(post);
  }
  return POSTS.length;
}

async function seedJobs(em: EntityManager): Promise<number> {
  const repo = em.getRepository(Job);
  for (const j of JOBS) {
    const job =
      (await repo.findOne({ where: { title: j.title } })) ??
      repo.create({ title: j.title });
    Object.assign(job, {
      department: j.department,
      description: j.description,
      requirements: j.requirements,
      status: j.status,
      postedAt: new Date(Date.now() - j.postedDaysAgo * 86_400_000),
    });
    await repo.save(job);
  }
  return JOBS.length;
}

async function seedStory(em: EntityManager): Promise<number> {
  const blocks = em.getRepository(StoryBlock);
  for (const b of STORY_BLOCKS) {
    const block =
      (await blocks.findOne({ where: { slug: b.slug } })) ??
      blocks.create({ slug: b.slug });
    Object.assign(block, {
      title: b.title,
      content: b.content,
      sortOrder: b.sortOrder,
      isPublished: true,
    });
    await blocks.save(block);
  }

  const members = em.getRepository(TeamMember);
  for (const m of TEAM_MEMBERS) {
    const member =
      (await members.findOne({ where: { name: m.name, group: m.group } })) ??
      members.create({ name: m.name, group: m.group });
    Object.assign(member, {
      role: m.role,
      bio: m.bio,
      sortOrder: m.sortOrder,
    });
    await members.save(member);
  }
  return STORY_BLOCKS.length + TEAM_MEMBERS.length;
}

async function seedStaffArea(em: EntityManager): Promise<number> {
  const docs = em.getRepository(Document);
  for (const d of DOCUMENTS) {
    const doc =
      (await docs.findOne({ where: { title: d.title } })) ??
      docs.create({ title: d.title });
    Object.assign(doc, { category: d.category, content: d.content, fileId: null });
    await docs.save(doc);
  }

  const announcements = em.getRepository(InternalAnnouncement);
  for (const a of ANNOUNCEMENTS) {
    const row =
      (await announcements.findOne({ where: { title: a.title } })) ??
      announcements.create({ title: a.title });
    Object.assign(row, {
      content: a.content,
      pinnedUntil: a.pinned ? new Date(Date.now() + 30 * 86_400_000) : null,
    });
    await announcements.save(row);
  }

  const schedule = em.getRepository(ScheduleEntry);
  for (const s of SCHEDULE_ENTRIES) {
    const start = new Date(Date.now() + s.startInDays * 86_400_000);
    start.setHours(9, 0, 0, 0);
    const row =
      (await schedule.findOne({ where: { title: s.title } })) ??
      schedule.create({ title: s.title });
    Object.assign(row, {
      description: s.description,
      startAt: start,
      endAt: new Date(start.getTime() + s.hours * 3_600_000),
      location: s.location,
    });
    await schedule.save(row);
  }
  return DOCUMENTS.length + ANNOUNCEMENTS.length + SCHEDULE_ENTRIES.length;
}

async function seed(dataSource: DataSource) {
  await dataSource.transaction(async (em) => {
    await upsertSetting(em, 'contact', CONTACT_SETTINGS);
    await upsertSetting(em, 'home', HOME_SETTINGS);
    console.log('✔ site settings (contact, home)');
    console.log(`✔ ${await seedStory(em)} story blocks + team members`);
    console.log(`✔ ${await seedProducts(em)} products`);
    console.log(`✔ ${await seedStores(em)} stores`);
    console.log(`✔ ${await seedPosts(em)} posts`);
    console.log(`✔ ${await seedJobs(em)} jobs`);
    console.log(`✔ ${await seedStaffArea(em)} documents / announcements / schedule`);
  });
}

AppDataSource.initialize()
  .then(async (dataSource) => {
    try {
      await seed(dataSource);
      console.log('Demo data seeded.');
    } finally {
      await dataSource.destroy();
    }
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
