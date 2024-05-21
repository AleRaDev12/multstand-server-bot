import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from '../order/order.entity';
import { PartIn } from '../component/part-in/part-in.entity';
import { Master } from '../master/master.entity';

@Entity()
export class Money {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  transactionDate: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => Order, { nullable: true })
  order: Order;

  @ManyToOne(() => PartIn, { nullable: true })
  partIn: PartIn;

  @ManyToOne(() => Master, { nullable: true })
  master: Master;
}
