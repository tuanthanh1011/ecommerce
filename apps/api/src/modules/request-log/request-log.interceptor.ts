import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import type { Request, Response } from 'express';
import { describeError } from '../../common/utils/describe-error';
import { RequestLogService } from './request-log.service';
import { CurrentAdminPayload } from '../../common/decorators/current-admin.decorator';

/**
 * Logs every request's metadata (method, path, status, timing, caller) once
 * the response has actually finished. Listening on the raw `res.on('finish')`
 * event — rather than hooking the rxjs pipeline — means this fires exactly
 * once with the true final status code whether the request succeeded,
 * threw, or was rejected by a guard, with no risk of ordering bugs against
 * the exception filter. The DB write itself is fire-and-forget: a slow or
 * failing log write must never add latency to, or fail, the real response.
 */
@Injectable()
export class RequestLogInterceptor implements NestInterceptor {
  private readonly logger = new Logger(RequestLogInterceptor.name);

  constructor(private requestLogService: RequestLogService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    if (context.getType() !== 'http') {
      return next.handle();
    }

    const httpCtx = context.switchToHttp();
    const request = httpCtx.getRequest<Request>();
    const response = httpCtx.getResponse<Response>();

    // CORS preflight carries no useful application signal and fires once per
    // cross-origin request with custom headers — pure noise in this table.
    if (request.method === 'OPTIONS') {
      return next.handle();
    }

    const startedAt = process.hrtime.bigint();

    response.on('finish', () => {
      const durationMs =
        Number(process.hrtime.bigint() - startedAt) / 1_000_000;
      const user = (request as Request & { user?: CurrentAdminPayload }).user;
      const contentLength = request.get('content-length');

      this.requestLogService
        .record({
          method: request.method,
          path: request.path,
          query: request.url.includes('?')
            ? request.url.slice(request.url.indexOf('?') + 1).slice(0, 500)
            : null,
          statusCode: response.statusCode,
          durationMs: Math.round(durationMs),
          ip: request.ip ?? null,
          userAgent: request.get('user-agent')?.slice(0, 500) ?? null,
          referer: request.get('referer')?.slice(0, 500) ?? null,
          adminId: user?.sub ?? null,
          adminRole: user?.role ?? null,
          requestBodyBytes: contentLength ? Number(contentLength) : null,
        })
        .catch((err: unknown) =>
          this.logger.error(
            `Failed to persist request log: ${describeError(err).message}`,
          ),
        );
    });

    return next.handle();
  }
}
