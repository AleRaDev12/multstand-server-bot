import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from '../orders/order.entity';
import { PartIn } from '../part-in/part-in.entity';
import { Master } from '../masters/master.entity';

@Entity()
export class FinancialTransaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  transactionDate: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column()
  transactionType: string;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => Order, { nullable: true })
  order: Order;

  @ManyToOne(() => PartIn, { nullable: true })
  componentPurchase: PartIn;

  @ManyToOne(() => Master, { nullable: true })
  master: Master;
}
