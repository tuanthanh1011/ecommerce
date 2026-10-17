import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSiteSettingsAndProductIsNew1792100000000 implements MigrationInterface {
  name = 'AddSiteSettingsAndProductIsNew1792100000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "products" ADD "isNew" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `CREATE TABLE "site_settings" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "key" character varying NOT NULL,
        "value" jsonb NOT NULL,
        CONSTRAINT "UQ_site_settings_key" UNIQUE ("key"),
        CONSTRAINT "PK_site_settings_id" PRIMARY KEY ("id")
      )`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "site_settings"`);
    await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "isNew"`);
  }
}
