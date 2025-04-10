import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateSchedulerTable1744188171155 implements MigrationInterface {
  name = 'UpdateSchedulerTable1744188171155';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "prize_pools" ADD "address" character varying NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "prize_pools" DROP COLUMN "address"`);
  }
}
