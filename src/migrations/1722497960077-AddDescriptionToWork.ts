import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddDescriptionToWork1722497960077 implements MigrationInterface {
  name = 'AddDescriptionToWork1722497960077';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'work',
      new TableColumn({
        name: 'description',
        type: 'text',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('work', 'description');
  }
}
