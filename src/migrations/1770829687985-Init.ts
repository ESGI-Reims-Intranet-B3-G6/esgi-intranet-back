import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1770829687985 implements MigrationInterface {
  name = 'Init1770829687985';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users" ("id" character varying(36) NOT NULL, "email" character varying NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "disabledAt" TIMESTAMP, "lastLogin" TIMESTAMP NOT NULL, "refreshToken" character varying(255), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
