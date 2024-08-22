import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddDescriptionToStandOrder1724350624253
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'stand_order',
      new TableColumn({
        name: 'description',
        type: 'text',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('stand_order', 'description');
  }
}
