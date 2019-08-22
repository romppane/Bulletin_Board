import { MigrationInterface, QueryRunner } from 'typeorm';

export class CommentUsernames1566461597750 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query('ALTER TABLE comment ADD COLUMN username VARCHAR(18) NOT NULL');
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query('ALTER TABLE comment DROP COLUMN username');
  }
}
