import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { NullableColumn } from '../nullable-column.decorator';
import { BaseEntity } from '../base.entity';
import { User } from '../user/user.entity';

@Entity()
export class Master extends BaseEntity {
  public static entityName = 'Master';
  public static nullable = {
    paymentCoefficient: false,
  };

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  user: User;

  @NullableColumn({ type: 'decimal', precision: 4, scale: 2 })
  paymentCoefficient: number;
}
