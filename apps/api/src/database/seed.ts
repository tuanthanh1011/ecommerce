import * as bcrypt from 'bcrypt';
import AppDataSource from './data-source';
import { Admin } from '../modules/admins/entities/admin.entity';

async function seed() {
  const dataSource = await AppDataSource.initialize();
  const adminsRepo = dataSource.getRepository(Admin);

  const email = process.env.SEED_ADMIN_EMAIL ?? 'admin@st-coffee.local';
  const password = process.env.SEED_ADMIN_PASSWORD ?? 'ChangeMe123!';
  const fullName = process.env.SEED_ADMIN_NAME ?? 'Super Admin';

  const existing = await adminsRepo.findOne({ where: { email } });
  if (existing) {
    console.log(`Admin ${email} already exists, skipping.`);
  } else {
    const passwordHash = await bcrypt.hash(password, 10);
    const admin = adminsRepo.create({ email, passwordHash, fullName });
    await adminsRepo.save(admin);
    console.log(`Seeded admin: ${email} / ${password}`);
  }

  await dataSource.destroy();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
