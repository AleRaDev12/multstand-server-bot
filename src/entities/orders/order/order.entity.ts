import { Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity, EntityFieldsMap } from '../../base.entity';
import { Client } from '../../client/client.entity';
import { NullableColumn } from '../../nullable-column.decorator';
import { differenceInDays, format } from 'date-fns';
import { formatLabels } from '../../../shared/helpers';
import { StandOrder } from '../stand-order/stand-order.entity';
import { Transaction } from '../../money/transaction/transaction.entity';

@Entity()
export class Order extends BaseEntity {
  public static entityName = 'Order';
  public static nullable: EntityFieldsMap<Order, boolean> = {
    client: false,
    amount: true, // remove this field in the future
    contractDate: false,
    daysToSend: true,
    sendingDeadlineDate: true,
    deliveryDeadlineDate: true,
    description: true,
    deliveryType: true,
    deliveryCost: true,
    deliveryAddress: true,
    deliveryTrackNumber: true,
  };

  private labels: EntityFieldsMap<Order, string> = {
    contractDate: 'Договор',
    deliveryCost: 'Стоимость доставки',
    daysToSend: 'Дней на поставку',
    deliveryType: 'Тип доставки',
    deliveryAddress: 'Адрес доставки',
    deliveryTrackNumber: 'Трек-номер',
    description: 'Описание',
    id: 'id заказа',
  };

  private labelsShorten: EntityFieldsMap<Order, string> = {
    contractDate: 'Договор',
    deliveryCost: 'Стоимость доставки',
    description: 'Описание',
  };

  public format(): string {
    const { daysToSend, deliveryDeadlineDate, sendingDeadlineDate } = this;

    if (sendingDeadlineDate !== null && deliveryDeadlineDate !== null) {
      return "Error: Can't have both sendingDeadlineDate and deliveryDeadlineDate";
    }

    const additionalInfo = [];

    if (sendingDeadlineDate !== null) {
      const daysUntilSend = differenceInDays(sendingDeadlineDate, new Date());
      additionalInfo.push(
        `Крайний срок отправки: ${format(sendingDeadlineDate, 'yyyy-MM-dd')}, осталось ${daysUntilSend} дней`,
      );
    } else if (deliveryDeadlineDate !== null) {
      const daysUntilDelivery = differenceInDays(
        deliveryDeadlineDate,
        new Date(),
      );
      additionalInfo.push(
        `Крайний срок доставки: ${format(deliveryDeadlineDate, 'yyyy-MM-dd')}, осталось ${daysUntilDelivery} дней`,
      );
    } else {
      additionalInfo.push(
        `Количество дней до отправки ${daysToSend}, оплат не поступало`,
      );
    }

    const formattedLabels = formatLabels(this, this.labels);
    return [formattedLabels, ...additionalInfo].join('\n');
  }

  public formatShorten(): string {
    const { daysToSend, deliveryDeadlineDate, sendingDeadlineDate } = this;

    if (sendingDeadlineDate !== null && deliveryDeadlineDate !== null) {
      return "Error: Can't have both sendingDeadlineDate and deliveryDeadlineDate";
    }

    const additionalInfo = [];

    if (sendingDeadlineDate !== null) {
      const daysUntilSend = differenceInDays(sendingDeadlineDate, new Date());
      additionalInfo.push(
        `Крайний срок отправки: ${format(sendingDeadlineDate, 'yyyy-MM-dd')}, осталось ${daysUntilSend} дней`,
      );
    } else if (deliveryDeadlineDate !== null) {
      const daysUntilDelivery = differenceInDays(
        deliveryDeadlineDate,
        new Date(),
      );
      additionalInfo.push(
        `Крайний срок доставки: ${format(deliveryDeadlineDate, 'yyyy-MM-dd')}, осталось ${daysUntilDelivery} дней`,
      );
    } else {
      additionalInfo.push(`Дней до отправки ${daysToSend}, пока не оплачено`);
    }

    const formattedLabels = formatLabels(this, this.labelsShorten);
    return [formattedLabels, ...additionalInfo].join('\n');
  }

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Client)
  client: Client;

  @OneToMany(() => StandOrder, (standOrder) => standOrder.order)
  standOrders: StandOrder[];

  @OneToMany(() => Transaction, (transaction) => transaction.order)
  money: Transaction[];

  @NullableColumn()
  amount: number;

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
}
