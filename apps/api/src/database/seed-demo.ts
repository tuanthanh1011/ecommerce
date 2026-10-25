import * as bcrypt from 'bcrypt';
import { DataSource, EntityManager } from 'typeorm';
import AppDataSource from './data-source';
import {
  CONTACT_SETTINGS,
  HOME_SETTINGS,
  INTERNAL_NOTICES,
  JOBS,
  POSTS,
  PRODUCTS,
  STORY_BLOCKS,
  TEAM_MEMBERS,
} from './seed-data';
import { AdminRole, MediaType, ProductStatus } from '../common/enums';
import { Admin } from '../modules/admins/entities/admin.entity';
import { Job } from '../modules/jobs/entities/job.entity';
import { Media } from '../modules/media/entities/media.entity';
import { Post } from '../modules/posts/entities/post.entity';
import { ProductPhoto } from '../modules/products/entities/product-photo.entity';
import { Product } from '../modules/products/entities/product.entity';
import { SiteSetting } from '../modules/site-settings/entities/site-setting.entity';
import { StoryBlock } from '../modules/story/entities/story-block.entity';
import { TeamMember } from '../modules/story/entities/team-member.entity';
import { DEFAULT_INTERNAL_PEOPLE } from '../modules/site-settings/internal-settings';

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
    const media = await upsertMedia(
      em,
      p.photo.split('/').pop()!.replace('.svg', ''),
    );
    const product =
      (await repo.findOne({ where: { name: p.name } })) ??
      repo.create({ name: p.name });
    Object.assign(product, {
      category: p.category,
      drinkSubType: p.drinkSubType ?? null,
      merchandiseSubType: p.merchandiseSubType ?? null,
      description: p.description,
      price: p.price === null ? null : p.price.toFixed(2),
      isNew: p.isNew ?? false,
      isBestSeller: p.isBestSeller ?? false,
      status: ProductStatus.ACTIVE,
      sortOrder: i + 1,
      photos: undefined,
    });
    const saved = await repo.save(product);
    await photoRepo.delete({ productId: saved.id });
    await photoRepo.save(
      photoRepo.create({
        productId: saved.id,
        mediaId: media.id,
        sortOrder: 0,
      }),
    );
  }
  return PRODUCTS.length;
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

/** A demo staff account (read-only, lands on the "Nội bộ" pages) to try the employee flow. */
async function seedEmployee(em: EntityManager): Promise<string> {
  const email = 'nhanvien@st-coffee.local';
  const repo = em.getRepository(Admin);
  const row =
    (await repo.findOne({ where: { email } })) ?? repo.create({ email });
  Object.assign(row, {
    fullName: 'Nhân viên S+',
    role: AdminRole.EMPLOYEE,
    passwordHash: await bcrypt.hash('ChangeMe123!', 10),
  });
  await repo.save(row);
  return `${email} / ChangeMe123!`;
}

async function seed(dataSource: DataSource) {
  await dataSource.transaction(async (em) => {
    await upsertSetting(em, 'contact', CONTACT_SETTINGS);
    await upsertSetting(em, 'home', HOME_SETTINGS);
    await upsertSetting(em, 'internal-notices', INTERNAL_NOTICES);
    await upsertSetting(em, 'internal-people', DEFAULT_INTERNAL_PEOPLE);
    console.log('✔ site settings (contact, home, internal pages)');
    console.log(`✔ ${await seedStory(em)} story blocks + team members`);
    console.log(`✔ ${await seedProducts(em)} products`);
    console.log(`✔ ${await seedPosts(em)} posts`);
    console.log(`✔ ${await seedJobs(em)} jobs`);
    console.log(`✔ demo employee ${await seedEmployee(em)}`);
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
