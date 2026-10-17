import { Admin } from './entities/admin.entity';

/** An admin as returned over the API — never includes the password hash. */
export function toPublicAdmin(admin: Admin): Partial<Admin> {
  const copy: Partial<Admin> = { ...admin };
  delete copy.passwordHash;
  return copy;
}
