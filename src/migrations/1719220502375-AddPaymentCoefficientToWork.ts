import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddPaymentCoefficientToWork1719220502375
  implements MigrationInterface
{
  name = 'AddPaymentCoefficientToWork1719220502375';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'work',
      new TableColumn({
        name: 'paymentCoefficient',
        type: 'decimal',
        precision: 4,
        scale: 2,
        isNullable: false,
        default: 1,
      }),
    );

    await queryRunner.query(`
      UPDATE work
      SET 
        paymentCoefficient = (
          SELECT COALESCE(master.paymentCoefficient, 1)
          FROM master
          WHERE master.id = work.masterId
        ),
        cost = CASE 
          WHEN (
            SELECT COALESCE(master.paymentCoefficient, 1)
            FROM master
            WHERE master.id = work.masterId
          ) != 0 
          THEN cost / (
            SELECT COALESCE(master.paymentCoefficient, 1)
            FROM master
            WHERE master.id = work.masterId
          )
          ELSE cost
        END
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Сначала вернем исходные значения cost
    await queryRunner.query(`
      UPDATE work
      SET cost = cost * paymentCoefficient
    `);

    // Затем удаляем колонку paymentCoefficient
    await queryRunner.dropColumn('work', 'paymentCoefficient');
  }
}
