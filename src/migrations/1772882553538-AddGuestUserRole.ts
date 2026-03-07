import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddGuestUserRole1772882553538 implements MigrationInterface {
  name = 'AddGuestUserRole1772882553538';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "userRole" SET DEFAULT 'GUEST'`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "userRole" SET DEFAULT 'ETUDIANT'`);
  }
}
