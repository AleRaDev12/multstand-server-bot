import { Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../base.entity';
import { Client } from '../../client/client.entity';
import { NullableColumn } from '../../nullable-column.decorator';
import { addDays, differenceInDays, format } from 'date-fns';
import { formatLabels } from '../../../shared/helpers';
import { StandOrder } from '../stand-order/stand-order.entity';

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

  private labels = {
    contractDate: 'Дата договора',
    amount: 'Стоимость',
    deliveryCost: 'Стоимость доставки',
    daysToComplete: 'Дней на поставку',
    deliveryType: 'Тип доставки',
    description: 'Описание',
    id: 'id заказа',
  };

  public format(): string {
    const { contractDate, daysToComplete } = this;
    const deliveryDeadline = addDays(contractDate, daysToComplete);
    const daysUntilSend = differenceInDays(deliveryDeadline, new Date());
    const daysUntilDelivery = '-'; // temp

    const additionalInfo = [
      `Крайний срок отправки: ${format(deliveryDeadline, 'yyyy-MM-dd')}, осталось ${daysUntilSend} дней`,
      `Крайний срок доставки: ${daysUntilDelivery}, осталось ${daysUntilDelivery} дней`,
    ];

    const formattedLabels = formatLabels(this, this.labels);

    return [formattedLabels, ...additionalInfo].join('\n');
  }

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Client)
  client: Client;

  @OneToMany(() => StandOrder, (standOrder) => standOrder.order)
  standOrders: StandOrder[];

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
