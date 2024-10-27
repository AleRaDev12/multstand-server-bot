import { Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity, EntityFieldsMap, LabelType } from '../../base.entity';
import { Client } from '../../client/client.entity';
import { NullableColumn } from '../../nullable-column.decorator';
import { fromValue, toKey } from '../../../shared/helpers';
import { StandOrder } from '../stand-order/stand-order.entity';
import { Transaction } from '../../money/transaction/transaction.entity';
import { OrderStatusType, OrderTypes } from './order-types';
import { formatOrder } from './order-formatting';
import { UserRole } from '../../../shared/types';

@Entity()
export class Order extends BaseEntity {
  public static entityName = 'Order';

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Client)
  client: Client;

  @OneToMany(() => StandOrder, (standOrder) => standOrder.order)
  standOrders: StandOrder[];

  @OneToMany(() => Transaction, (transaction) => transaction.order)
  money: Transaction[];

  @NullableColumn({
    type: 'text',
    transformer: {
      to: toKey(OrderTypes),
      from: fromValue(OrderTypes),
    },
  })
  status: OrderStatusType;

  @NullableColumn({ type: 'date' })
  contractDate: Date;

  @NullableColumn()
  daysToSend: number;

  // Deadline for order shipment
  @NullableColumn({ type: 'date' })
  sendingDeadlineDate: Date;

  // Deadline for order delivery
  @NullableColumn({ type: 'date' })
  deliveryDeadlineDate: Date;

  @NullableColumn()
  description: string;

  @NullableColumn()
  deliveryType: string;

  @NullableColumn()
  deliveryCost: number;

  @NullableColumn()
  deliveryAddress: string;

  @NullableColumn()
  deliveryTrackNumber: string;

  public static nullable: EntityFieldsMap<Order, boolean> = {
    client: false,
    contractDate: false,
    daysToSend: true,
    sendingDeadlineDate: true,
    deliveryDeadlineDate: true,
    description: true,
    deliveryType: true,
    deliveryCost: true,
    deliveryAddress: true,
    deliveryTrackNumber: true,
    status: false,
  };

  public format(userRole: UserRole, labelType: LabelType = 'short') {
    return formatOrder(this, userRole, labelType);
  }
}
