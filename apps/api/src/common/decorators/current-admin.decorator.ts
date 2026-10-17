import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AdminRole } from '../enums';

export interface CurrentAdminPayload {
  sub: string;
  email: string;
  role: AdminRole;
}

export const CurrentAdmin = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): CurrentAdminPayload => {
    const request = ctx
      .switchToHttp()
      .getRequest<{ user: CurrentAdminPayload }>();
    return request.user;
  },
);
