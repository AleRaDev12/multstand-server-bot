import { BaseEntity, EntityFieldsMap } from '../../base.entity';
import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { NullableColumn } from '../../nullable-column.decorator';
import { Order } from '../../orders/order/order.entity';
import { Master } from '../../master/master.entity';
import { Account } from '../account/account.entity';
import { PartIn } from '../../parts/part-in/part-in.entity';

@Entity()
export class Transaction extends BaseEntity {
  public static entityName = 'Money';
  public static nullable: EntityFieldsMap<Transaction, boolean> = {
    transactionDate: false,
    amount: false,
    description: true,
    order: true,
    partIn: true,
    master: true,
    account: false,
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

  @ManyToOne(() => Master, { nullable: true })
  master: Master;

  @ManyToOne(() => Account, (account) => account.transactions, {
    nullable: false,
  })
  account: Account;
}
