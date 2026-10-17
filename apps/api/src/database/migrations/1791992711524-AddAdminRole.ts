import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAdminRole1791992711524 implements MigrationInterface {
  name = 'AddAdminRole1791992711524';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."admins_role_enum" AS ENUM('ADMIN', 'EMPLOYEE')`,
    );
    await queryRunner.query(
      `ALTER TABLE "admins" ADD "role" "public"."admins_role_enum" NOT NULL DEFAULT 'ADMIN'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "admins" DROP COLUMN "role"`);
    await queryRunner.query(`DROP TYPE "public"."admins_role_enum"`);
  }
}
