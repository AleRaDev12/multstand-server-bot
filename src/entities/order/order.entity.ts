import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { Client } from '../client/client.entity';
import { NullableColumn } from '../nullable-column.decorator';

@Entity()
export class Order extends BaseEntity {
  public static entityName = 'Order';
  public static nullable = {
    client: false,
    amount: false,
    contractDate: false,
    daysToComplete: false,
    description: true,
    deliveryType: true,
    deliveryCost: true,
  };

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Client)
  client: Client;

  @NullableColumn()
  amount: number;

  @NullableColumn()
  contractDate: Date;

  @NullableColumn()
  daysToComplete: number;

  @NullableColumn()
  description: string;

  @NullableColumn()
  deliveryType: string;

  @NullableColumn()
  deliveryCost: number;
}
