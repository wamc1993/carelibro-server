import { MigrationInterface, QueryRunner } from 'typeorm';

export class createPosts1678501196310 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "post" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "userId" number NOT NULL, "message" varchar NOT NULL, "createdAt" datetime, "updatedAt" datetime, FOREIGN KEY(userId) REFERENCES user(id))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "post"`);
  }
}
