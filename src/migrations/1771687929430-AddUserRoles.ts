import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserRoles1771687929430 implements MigrationInterface {
  name = 'AddUserRoles1771687929430';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD "userRole" character varying NOT NULL DEFAULT 'ETUDIANT'`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "userRole"`);
  }
}
