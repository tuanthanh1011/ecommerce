import { MigrationInterface, QueryRunner } from 'typeorm';

/** The Documents / internal announcements / schedule modules were removed; "Nội bộ" is now site_settings only. */
export class DropStaffContent1792400000000 implements MigrationInterface {
  name = 'DropStaffContent1792400000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "documents"`);
    await queryRunner.query(
      `DROP TYPE IF EXISTS "public"."documents_category_enum"`,
    );
    await queryRunner.query(`DROP TABLE IF EXISTS "schedule_entries"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "internal_announcements"`);
  }

  public async down(): Promise<void> {
    // Not reversible: the removed content is not recreated.
  }
}
