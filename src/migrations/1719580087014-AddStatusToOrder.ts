import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddStatusToOrder1719580087014 implements MigrationInterface {
  name = 'AddStatusToOrder1719580087014';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'order',
      new TableColumn({
        name: 'status',
        type: 'text',
        isNullable: false,
        default: "'Preliminary'",
      }),
    );

    await queryRunner.query(`
      UPDATE order
      SET status = 'Preliminary'
      WHERE status IS NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('order', 'status');
  }
}
