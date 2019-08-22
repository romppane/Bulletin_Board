import { MigrationInterface, QueryRunner } from 'typeorm';

export class TemporaryUsernames1566459567245 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query('ALTER TABLE post ADD COLUMN username VARCHAR(18) NOT NULL');
    await queryRunner.query('ALTER TABLE comment ADD COLUMN username VARCHAR(18) NOT NULL');
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query('ALTER TABLE post DROP COLUMN username');
    await queryRunner.query('ALTER TABLE comment DROP COLUMN username');
  }
}
