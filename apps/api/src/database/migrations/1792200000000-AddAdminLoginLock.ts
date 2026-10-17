import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAdminLoginLock1792200000000 implements MigrationInterface {
  name = 'AddAdminLoginLock1792200000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "admins" ADD "failedLoginAttempts" integer NOT NULL DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE "admins" ADD "lockedUntil" TIMESTAMP WITH TIME ZONE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "admins" DROP COLUMN "lockedUntil"`);
    await queryRunner.query(
      `ALTER TABLE "admins" DROP COLUMN "failedLoginAttempts"`,
    );
  }
}
