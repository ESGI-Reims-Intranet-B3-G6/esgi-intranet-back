import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeUserIdToEmail1772897736010 implements MigrationInterface {
  name = 'ChangeUserIdToEmail1772897736010';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433"`);
    await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "id" DROP NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "PK_97672ac88f789774dd47f7c8be3" PRIMARY KEY ("email")`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "PK_97672ac88f789774dd47f7c8be3"`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")`
    );
    await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "id" SET NOT NULL`);
  }
}
