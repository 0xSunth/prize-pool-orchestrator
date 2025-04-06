import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPrizePoolsTable1743967306493 implements MigrationInterface {
    name = 'AddPrizePoolsTable1743967306493'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "prize_pools" ("id" integer NOT NULL, "owner" character varying NOT NULL, "vault" character varying NOT NULL, "feeRecipient" character varying NOT NULL, "treasury" character varying NOT NULL, "bonusPerEpoch" bigint NOT NULL, "maxBonus" bigint NOT NULL, "decayPerEpoch" bigint NOT NULL, "epochDuration" bigint NOT NULL, "entryDeadline" bigint NOT NULL, "maxParticipants" bigint NOT NULL, "minDepositAmount" bigint NOT NULL, "maxWithdrawFee" bigint NOT NULL, CONSTRAINT "PK_82ea1a958a23fd496b0f9cb2f48" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "prize_pools"`);
    }

}
