import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class RemoveUserName1719325991840 implements MigrationInterface {
  name = 'RemoveUserName1719325991840';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('user', 'username');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'user',
      new TableColumn({
        name: 'username',
        type: 'varchar',
        isNullable: true,
      }),
    );
  }
}
