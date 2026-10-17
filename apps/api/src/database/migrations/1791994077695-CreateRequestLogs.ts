import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRequestLogs1791994077695 implements MigrationInterface {
  name = 'CreateRequestLogs1791994077695';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "request_logs" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "method" character varying NOT NULL,
        "path" character varying NOT NULL,
        "query" character varying(500),
        "statusCode" integer NOT NULL,
        "isError" boolean NOT NULL,
        "durationMs" integer NOT NULL,
        "ip" character varying,
        "userAgent" character varying(500),
        "referer" character varying(500),
        "adminId" uuid,
        "adminRole" character varying,
        "requestBodyBytes" integer,
        CONSTRAINT "PK_request_logs_id" PRIMARY KEY ("id")
      )`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_request_logs_createdAt" ON "request_logs" ("createdAt")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_request_logs_path" ON "request_logs" ("path")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_request_logs_adminId" ON "request_logs" ("adminId")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."IDX_request_logs_adminId"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_request_logs_path"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_request_logs_createdAt"`);
    await queryRunner.query(`DROP TABLE "request_logs"`);
  }
}
