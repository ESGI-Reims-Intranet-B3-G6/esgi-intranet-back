import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserGroup1772972761798 implements MigrationInterface {
  name = 'AddUserGroup1772972761798';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" ADD "group" character varying`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "group"`);
  }
}
