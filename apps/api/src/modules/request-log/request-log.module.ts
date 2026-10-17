import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestLog } from './entities/request-log.entity';
import { RequestLogController } from './request-log.controller';
import { RequestLogService } from './request-log.service';
import { RequestLogInterceptor } from './request-log.interceptor';

@Module({
  imports: [TypeOrmModule.forFeature([RequestLog])],
  controllers: [RequestLogController],
  providers: [RequestLogService, RequestLogInterceptor],
  exports: [RequestLogService, RequestLogInterceptor],
})
export class RequestLogModule {}
