import { SetMetadata } from '@nestjs/common';
import { AdminRole } from '../enums';

export const ROLES_KEY = 'roles';

/**
 * Restricts a route/controller to the given roles. Omit entirely to allow
 * any authenticated role (Admin and Employee alike) — only Public() routes
 * and routes with no @Roles() skip this check.
 */
export const Roles = (...roles: AdminRole[]) => SetMetadata(ROLES_KEY, roles);
