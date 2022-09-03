import { MigrationInterface, QueryRunner } from "typeorm";

export class migration1662110767543 implements MigrationInterface {
    name = 'migration1662110767543'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "code" varchar NOT NULL, "access_token" varchar NOT NULL, "username" varchar NOT NULL, "avatar_url" varchar NOT NULL DEFAULT (''), CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
