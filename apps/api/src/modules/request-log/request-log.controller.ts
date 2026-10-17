import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RequestLog } from './entities/request-log.entity';
import { Roles } from '../../common/decorators/roles.decorator';
import { AdminRole } from '../../common/enums';
import { RequestLogQueryDto } from './dto/request-log-query.dto';

// Raw traffic/audit data — Admin-only.
@ApiBearerAuth()
@ApiTags('request-logs')
@Roles(AdminRole.ADMIN)
@Controller('admin/request-logs')
export class RequestLogController {
  constructor(
    @InjectRepository(RequestLog)
    private requestLogRepo: Repository<RequestLog>,
  ) {}

  @Get()
  async findAll(@Query() query: RequestLogQueryDto) {
    const page = query.page ?? 1;
    const limit = Math.min(query.limit ?? 50, 200);
    const [data, total] = await this.requestLogRepo.findAndCount({
      where: {
        ...(query.path ? { path: query.path } : {}),
        ...(query.isError !== undefined ? { isError: query.isError } : {}),
        ...(query.adminId ? { adminId: query.adminId } : {}),
      },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total, page, limit };
  }
}
