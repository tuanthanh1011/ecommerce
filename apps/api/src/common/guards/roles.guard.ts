import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AdminRole } from '../enums';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { CurrentAdminPayload } from '../decorators/current-admin.decorator';

/** HTTP methods that never change data. */
const READ_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

/**
 * Runs after JwtAuthGuard. Admin always passes. Employee is READ-ONLY: it may
 * only use GET/HEAD requests, and only on routes with no @Roles() (any
 * authenticated role) or ones explicitly listing AdminRole.EMPLOYEE — every
 * create/update/delete is refused here, in one place, rather than per
 * controller. Public() routes (login, refresh, logout, /public/*) have no
 * `request.user` and are skipped outright.
 */
@Injectable()
export class RolesGuard {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const request = context
      .switchToHttp()
      .getRequest<{ method: string; user?: CurrentAdminPayload }>();
    const user = request.user;

    if (
      user?.role === AdminRole.EMPLOYEE &&
      !READ_METHODS.has(request.method)
    ) {
      throw new ForbiddenException(
        'Tài khoản nhân viên chỉ có quyền xem, không thể thêm, sửa hoặc xoá',
      );
    }

    const requiredRoles = this.reflector.getAllAndOverride<AdminRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles || requiredRoles.length === 0) return true;

    if (!user) return false;
    if (user.role === AdminRole.ADMIN) return true;
    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException(
        'Tài khoản của bạn không có quyền truy cập mục này',
      );
    }
    return true;
  }
}
