import { Entity, PrimaryGeneratedColumn } from 'typeorm';
import { NullableColumn } from '../nullable-column.decorator';
import { BaseEntity } from '../base.entity';

@Entity()
export class Master extends BaseEntity {
  public static entityName = 'Master';
  public static nullable = {
    name: false,
    paymentCoefficient: false,
    role: false,
  };

  @PrimaryGeneratedColumn()
  id: number;

  @NullableColumn()
  name: string;

  @NullableColumn({ type: 'decimal', precision: 4, scale: 2 })
  paymentCoefficient: number;

  @NullableColumn()
  role: string;
}
