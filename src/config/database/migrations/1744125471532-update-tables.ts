import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateTables1744125471532 implements MigrationInterface {
    name = 'UpdateTables1744125471532'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "prize_pools" DROP CONSTRAINT "FK_453219efca7516a1bc2be52d07a"`);
        await queryRunner.query(`ALTER TABLE "prize_pools" DROP CONSTRAINT "UQ_453219efca7516a1bc2be52d07a"`);
        await queryRunner.query(`ALTER TABLE "prize_pools" DROP COLUMN "schedulerId"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "prize_pools" ADD "schedulerId" integer`);
        await queryRunner.query(`ALTER TABLE "prize_pools" ADD CONSTRAINT "UQ_453219efca7516a1bc2be52d07a" UNIQUE ("schedulerId")`);
        await queryRunner.query(`ALTER TABLE "prize_pools" ADD CONSTRAINT "FK_453219efca7516a1bc2be52d07a" FOREIGN KEY ("schedulerId") REFERENCES "schedulers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
