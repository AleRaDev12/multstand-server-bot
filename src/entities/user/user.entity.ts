import { Entity, PrimaryGeneratedColumn } from 'typeorm';
import { NullableColumn } from '../nullable-column.decorator';
import { BaseEntity } from '../base.entity';

@Entity()
export class User extends BaseEntity {
  public static entityName = 'User';
  public static nullable = {
    paymentCoefficient: true,
    role: false,
    username: false,
    telegramUserId: false,
  };

  @PrimaryGeneratedColumn()
  id: number;

  @NullableColumn({ unique: true })
  telegramUserId: number;

  @NullableColumn({ type: 'decimal', precision: 4, scale: 2 })
  paymentCoefficient: number;

  @NullableColumn()
  role: string; // 'manager', 'master', 'unregistered'

  @NullableColumn()
  username: string;
}
