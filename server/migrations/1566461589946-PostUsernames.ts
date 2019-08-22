import { MigrationInterface, QueryRunner } from 'typeorm';

export class PostUsernames1566461589946 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query('ALTER TABLE post ADD COLUMN username VARCHAR(18) NOT NULL');
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query('ALTER TABLE post DROP COLUMN username');
  }
}
