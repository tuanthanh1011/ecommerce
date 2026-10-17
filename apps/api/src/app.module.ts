import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule, ThrottlerGuard, seconds } from '@nestjs/throttler';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { envValidationSchema } from './config/env.validation';
import { ROOT_ENV_PATH } from './config/root-env';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { HealthController } from './health.controller';
import { AuthModule } from './modules/auth/auth.module';
import { AdminsModule } from './modules/admins/admins.module';
import { MediaModule } from './modules/media/media.module';
import { StoryModule } from './modules/story/story.module';
import { StoresModule } from './modules/stores/stores.module';
import { ProductsModule } from './modules/products/products.module';
import { PostsModule } from './modules/posts/posts.module';
import { JobsModule } from './modules/jobs/jobs.module';
import { DocumentsModule } from './modules/documents/documents.module';
import { InternalAnnouncementsModule } from './modules/internal-announcements/internal-announcements.module';
import { SiteSettingsModule } from './modules/site-settings/site-settings.module';
import { BackupsModule } from './modules/backups/backups.module';
import { RequestLogModule } from './modules/request-log/request-log.module';
import { RequestLogInterceptor } from './modules/request-log/request-log.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ROOT_ENV_PATH,
      validationSchema: envValidationSchema,
    }),
    ScheduleModule.forRoot(),
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => [
        {
          name: 'default',
          ttl: seconds(
            configService.get<number>('RATE_LIMIT_TTL_SECONDS') ?? 60,
          ),
          limit: configService.get<number>('RATE_LIMIT_MAX') ?? 120,
        },
      ],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DATABASE_URL'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        migrations: [__dirname + '/database/migrations/*{.ts,.js}'],
        synchronize: false,
        // No per-query logging: it floods the dev terminal. Errors and
        // slow-query warnings still surface.
        logging: ['error', 'warn'],
      }),
    }),
    AuthModule,
    AdminsModule,
    MediaModule,
    StoryModule,
    StoresModule,
    ProductsModule,
    PostsModule,
    JobsModule,
    DocumentsModule,
    InternalAnnouncementsModule,
    SiteSettingsModule,
    BackupsModule,
    RequestLogModule,
  ],
  controllers: [HealthController],
  providers: [
    // Order matters: cheapest/least-trusted check first, so an abusive client
    // is rejected before we do JWT verification or DB-backed role checks.
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: RequestLogInterceptor,
    },
  ],
})
export class AppModule {}
