import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().default(3001),

  DATABASE_URL: Joi.string().required(),

  JWT_ACCESS_SECRET: Joi.string().required(),
  JWT_ACCESS_EXPIRES_IN: Joi.string().default('15m'),
  JWT_REFRESH_SECRET: Joi.string().required(),
  JWT_REFRESH_EXPIRES_IN: Joi.string().default('30d'),

  // Garage (self-hosted S3-compatible storage) — primary upload target.
  GARAGE_REGION: Joi.string().default('garage'),
  GARAGE_ACCESS_KEY_ID: Joi.string().required(),
  GARAGE_SECRET_ACCESS_KEY: Joi.string().required(),
  GARAGE_BUCKET_NAME: Joi.string().required(),
  // Docker-network address, used for server-to-server calls (delete, backup sync).
  GARAGE_INTERNAL_ENDPOINT: Joi.string().required(),
  // Address the admin's *browser* can reach — must match what presigned PUT
  // URLs are signed against (localhost in dev, a real domain in prod).
  GARAGE_PUBLIC_ENDPOINT: Joi.string().required(),
  // Garage's website endpoint base — what GET requests for uploaded files use.
  GARAGE_PUBLIC_BASE_URL: Joi.string().required(),

  // Cloudflare R2 — backup target only (see modules/backups). Not used for
  // live traffic, so no R2_PUBLIC_BASE_URL is needed here anymore.
  R2_ACCOUNT_ID: Joi.string().required(),
  R2_ACCESS_KEY_ID: Joi.string().required(),
  R2_SECRET_ACCESS_KEY: Joi.string().required(),
  R2_BACKUP_BUCKET_NAME: Joi.string().required(),
  R2_ENDPOINT: Joi.string().required(),
  BACKUP_RETENTION_COUNT: Joi.number().default(3),
  BACKUP_CRON: Joi.string().default('0 3 * * *'),

  CORS_ORIGIN: Joi.string().default('http://localhost:3000'),

  RATE_LIMIT_TTL_SECONDS: Joi.number().default(60),
  RATE_LIMIT_MAX: Joi.number().default(120),

  LOGIN_MAX_FAILED_ATTEMPTS: Joi.number().default(5),
  LOGIN_LOCK_MINUTES: Joi.number().default(15),

  REQUEST_LOG_RETENTION_DAYS: Joi.number().default(30),

  // Advisory + enforced cap on `sizeBytes` declared at presign time (see
  // MediaService.presign — presigned PUT alone can't bind the actual
  // upload's byte size, so this is the authoritative check on the one
  // legitimate path to obtain an upload URL). Default 15 MiB.
  MAX_UPLOAD_SIZE_BYTES: Joi.number().default(15 * 1024 * 1024),
});
