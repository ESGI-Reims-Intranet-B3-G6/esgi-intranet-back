import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddNews1773069380060 implements MigrationInterface {
  name = 'AddNews1773069380060';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "news" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "publishedAt" TIMESTAMP, "lastRevision" TIMESTAMP NOT NULL DEFAULT now(), "modificationsRequested" TIMESTAMP, "title" character varying(512) NOT NULL, "content" text NOT NULL, "userEmail" character varying, CONSTRAINT "PK_39a43dfcb6007180f04aff2357e" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "news" ADD CONSTRAINT "FK_14355ee6ce48b3b1b143df80cde" FOREIGN KEY ("userEmail") REFERENCES "users"("email") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "news" DROP CONSTRAINT "FK_14355ee6ce48b3b1b143df80cde"`);
    await queryRunner.query(`DROP TABLE "news"`);
  }
}
