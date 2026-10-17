import * as bcrypt from 'bcrypt';
import AppDataSource from './data-source';
import { Admin } from '../modules/admins/entities/admin.entity';
import { AdminRole } from '../common/enums';

async function seed() {
  const dataSource = await AppDataSource.initialize();
  const adminsRepo = dataSource.getRepository(Admin);

  const email = process.env.SEED_ADMIN_EMAIL ?? 'admin@st-coffee.local';
  const password = process.env.SEED_ADMIN_PASSWORD ?? 'ChangeMe123!';
  const fullName = process.env.SEED_ADMIN_NAME ?? 'Super Admin';

  // One Admin only: skip if any exists, whatever its email. To recover a lost
  // Admin, run `npm run reset-admin` instead.
  const existing = await adminsRepo.findOne({
    where: { role: AdminRole.ADMIN },
  });
  if (existing) {
    console.log(`Admin ${existing.email} already exists, skipping.`);
  } else {
    const passwordHash = await bcrypt.hash(password, 10);
    const admin = adminsRepo.create({
      email,
      passwordHash,
      fullName,
      role: AdminRole.ADMIN,
    });
    await adminsRepo.save(admin);
    console.log(`Seeded admin: ${email} / ${password}`);
  }

  await dataSource.destroy();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
