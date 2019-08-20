import { MigrationInterface, QueryRunner } from 'typeorm';
export class UserSeed1565945881563 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    queryRunner.query("INSERT INTO user (avatar) VALUES ('avatar')");
  }
  public async down(queryRunner: QueryRunner): Promise<any> {}
}
