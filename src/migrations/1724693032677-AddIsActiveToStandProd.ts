import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddIsActiveToStandProd1724693032677 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'stand_prod',
      new TableColumn({
        name: 'isActive',
        type: 'boolean',
        default: true,
        isNullable: false,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('stand_prod', 'isActive');
  }
}
