import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from '../order/order.entity';
import { PartIn } from '../component/part-in/part-in.entity';
import { User } from '../user/user.entity';
import { BaseEntity } from '../base.entity';
import { NullableColumn } from '../nullable-column.decorator';

@Entity()
export class Money extends BaseEntity {
  public static entityName = 'Money';
  public static nullable = {
    transactionDate: false,
    amount: false,
    description: true,
    order: true,
    partIn: true,
    master: true,
  };

  @PrimaryGeneratedColumn()
  id: number;

  @NullableColumn({ type: 'date' })
  transactionDate: Date;

  @NullableColumn({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @NullableColumn()
  description: string;

  @ManyToOne(() => Order, { nullable: true })
  order: Order;

  @ManyToOne(() => PartIn, { nullable: true })
  partIn: PartIn;

  @ManyToOne(() => User, { nullable: true })
  master: User;
}
