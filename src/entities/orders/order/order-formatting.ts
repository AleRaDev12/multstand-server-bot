import { differenceInDays, format } from 'date-fns';
import { formatLabels } from '../../../shared/helpers';
import { Order } from './order.entity';
import { EntityLabels, LabelType } from '../../base.entity';
import { UserRole } from '../../../shared/types';
import { filter } from 'rxjs';

const labels: EntityLabels<Order, string> = {
  manager: {
    short: {
      contractDate: 'Договор',
      status: 'Статус заказа',
      deliveryCost: 'Стоимость доставки',
      daysToSend: 'Дней на поставку',
      deliveryType: 'Тип доставки',
      deliveryAddress: 'Адрес доставки',
      deliveryTrackNumber: 'Трек-номер',
      description: 'Описание',
      id: 'id заказа',
    },
    full: {
      contractDate: 'Договор',
      status: 'Статус заказа',
      deliveryCost: 'Стоимость доставки',
      daysToSend: 'Дней на поставку',
      deliveryType: 'Тип доставки',
      deliveryAddress: 'Адрес доставки',
      deliveryTrackNumber: 'Трек-номер',
    },
  },
  master: {
    short: {},
    full: {},
  },
};

function checkDeadlineConflict(order: Order): string | null {
  const { sendingDeadlineDate, deliveryDeadlineDate } = order;
  if (sendingDeadlineDate !== null && deliveryDeadlineDate !== null) {
    return "Error: Can't have both sendingDeadlineDate and deliveryDeadlineDate";
  }
  return null;
}

export function generateOrderDeadline(order: Order): string[] {
  const { daysToSend, sendingDeadlineDate, deliveryDeadlineDate } = order;
  const currentDate = new Date();
  const additionalInfo = [];

  if (sendingDeadlineDate !== null) {
    const daysUntilSend = differenceInDays(sendingDeadlineDate, currentDate);
    additionalInfo.push(
      `До отправки: ${daysUntilSend} дней (${format(sendingDeadlineDate, 'yyyy-MM-dd')})`,
    );
  } else if (deliveryDeadlineDate !== null) {
    const daysUntilDelivery = differenceInDays(
      deliveryDeadlineDate,
      currentDate,
    );
    additionalInfo.push(
      `До доставки: ${daysUntilDelivery} дней (${format(deliveryDeadlineDate, 'yyyy-MM-dd')})`,
    );
  } else {
    additionalInfo.push(`До отправки ${daysToSend} дней, оплат не поступало`);
  }

  return additionalInfo;
}

export function formatOrder(
  order: Order,
  userRole: UserRole,
  labelType: LabelType,
): string {
  const error = checkDeadlineConflict(order);
  if (error) return error;

  const additionalInfo = generateOrderDeadline(order);
  const formattedLabels = formatLabels(order, labels[userRole][labelType]);
  return [formattedLabels, ...additionalInfo].filter(Boolean).join('\n');
}
