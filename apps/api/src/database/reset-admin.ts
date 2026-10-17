import { randomBytes } from 'crypto';
import * as bcrypt from 'bcrypt';
import AppDataSource from './data-source';
import { Admin } from '../modules/admins/entities/admin.entity';
import { RefreshToken } from '../modules/auth/entities/refresh-token.entity';
import { AdminRole } from '../common/enums';

/**
 * Recovers the single Admin account: sets a new password, re-activates and
 * unlocks it, and signs out every session. Creates the account if it is gone.
 *
 *   ADMIN_NEW_PASSWORD=...  new password (a random one is generated if unset)
 *   SEED_ADMIN_EMAIL / SEED_ADMIN_NAME  used only when the Admin must be created
 */
async function resetAdmin() {
  const dataSource = await AppDataSource.initialize();
  const adminsRepo = dataSource.getRepository(Admin);
  const tokensRepo = dataSource.getRepository(RefreshToken);

  const password =
    process.env.ADMIN_NEW_PASSWORD || randomBytes(12).toString('base64url');
  const passwordHash = await bcrypt.hash(password, 10);

  let admin = await adminsRepo.findOne({ where: { role: AdminRole.ADMIN } });
  if (admin) {
    admin.passwordHash = passwordHash;
    admin.isActive = true;
    admin.failedLoginAttempts = 0;
    admin.lockedUntil = null;
    await adminsRepo.save(admin);
    await tokensRepo.update({ adminId: admin.id }, { revoked: true });
  } else {
    admin = await adminsRepo.save(
      adminsRepo.create({
        email: process.env.SEED_ADMIN_EMAIL ?? 'admin@st-coffee.local',
        fullName: process.env.SEED_ADMIN_NAME ?? 'Super Admin',
        role: AdminRole.ADMIN,
        passwordHash,
      }),
    );
  }

  console.log(`Admin account: ${admin.email}`);
  console.log(`New password:  ${password}`);

  await dataSource.destroy();
}

resetAdmin().catch((err) => {
  console.error(err);
  process.exit(1);
});
