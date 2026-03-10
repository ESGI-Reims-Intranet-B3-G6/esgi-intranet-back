import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixNewsModificationsRequestedType1773154932475 implements MigrationInterface {
  name = 'FixNewsModificationsRequestedType1773154932475';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "news" DROP COLUMN "modificationsRequested"`);
    await queryRunner.query(`ALTER TABLE "news" ADD "modificationsRequested" text`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "news" DROP COLUMN "modificationsRequested"`);
    await queryRunner.query(`ALTER TABLE "news" ADD "modificationsRequested" TIMESTAMP`);
  }
}
