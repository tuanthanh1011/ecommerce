import { MigrationInterface, QueryRunner } from 'typeorm';

/** Drink sub-types become the menu groups (Trà sữa Việt, Trà, Cà phê…) + a Best Seller flag. */
export class ProductMenuGroups1792300000000 implements MigrationInterface {
  name = 'ProductMenuGroups1792300000000';

  private async swapDrinkEnum(q: QueryRunner, values: string[]) {
    await q.query(`UPDATE "products" SET "drinkSubType" = NULL`);
    await q.query(
      `ALTER TABLE "products" ALTER COLUMN "drinkSubType" TYPE varchar`,
    );
    await q.query(`DROP TYPE "public"."products_drinksubtype_enum"`);
    await q.query(
      `CREATE TYPE "public"."products_drinksubtype_enum" AS ENUM(${values.map((v) => `'${v}'`).join(', ')})`,
    );
    await q.query(
      `ALTER TABLE "products" ALTER COLUMN "drinkSubType" TYPE "public"."products_drinksubtype_enum" USING "drinkSubType"::"public"."products_drinksubtype_enum"`,
    );
  }

  public async up(queryRunner: QueryRunner): Promise<void> {
    await this.swapDrinkEnum(queryRunner, [
      'MILK_TEA',
      'NEW',
      'TEA',
      'SPECIAL',
      'COFFEE',
      'FRUIT',
      'TOPPING',
    ]);
    await queryRunner.query(
      `ALTER TABLE "products" ADD "isBestSeller" boolean NOT NULL DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "products" DROP COLUMN "isBestSeller"`,
    );
    await this.swapDrinkEnum(queryRunner, ['HOT', 'ICED', 'FRESH']);
  }
}
