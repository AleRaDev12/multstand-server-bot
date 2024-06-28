import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddStatusToStandOrder1719568355310 implements MigrationInterface {
  name = 'AddStatusToStandOrder1719568355310';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'stand_order',
      new TableColumn({
        name: 'status',
        type: 'text',
        isNullable: false,
        default: "'Preliminary'",
      }),
    );

    await queryRunner.query(`
      UPDATE stand_order
      SET status = 'Preliminary'
      WHERE status IS NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('stand_order', 'status');
  }
}
