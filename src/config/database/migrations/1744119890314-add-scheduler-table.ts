import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSchedulerTable1744119890314 implements MigrationInterface {
  name = 'AddSchedulerTable1744119890314';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "schedulers" ("id" SERIAL NOT NULL, "lastExecution" TIMESTAMP, "nextExecution" TIMESTAMP, "status" character varying(20) NOT NULL DEFAULT 'idle', "retryAt" TIMESTAMP, "notes" text, "prizePoolId" integer, CONSTRAINT "REL_b66b62c8a5e2942d7de9e88dea" UNIQUE ("prizePoolId"), CONSTRAINT "PK_3e70c13153c58b629cd91dda7b2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`ALTER TABLE "prize_pools" ADD "schedulerId" integer`);
    await queryRunner.query(
      `ALTER TABLE "prize_pools" ADD CONSTRAINT "UQ_453219efca7516a1bc2be52d07a" UNIQUE ("schedulerId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "prize_pools" ADD CONSTRAINT "FK_453219efca7516a1bc2be52d07a" FOREIGN KEY ("schedulerId") REFERENCES "schedulers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "schedulers" ADD CONSTRAINT "FK_b66b62c8a5e2942d7de9e88dea6" FOREIGN KEY ("prizePoolId") REFERENCES "prize_pools"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "schedulers" DROP CONSTRAINT "FK_b66b62c8a5e2942d7de9e88dea6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "prize_pools" DROP CONSTRAINT "FK_453219efca7516a1bc2be52d07a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "prize_pools" DROP CONSTRAINT "UQ_453219efca7516a1bc2be52d07a"`,
    );
    await queryRunner.query(`ALTER TABLE "prize_pools" DROP COLUMN "schedulerId"`);
    await queryRunner.query(`DROP TABLE "schedulers"`);
  }
}
