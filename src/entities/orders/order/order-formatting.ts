import { differenceInDays, format } from 'date-fns';
import { formatLabels } from '../../../shared/helpers';
import { Order } from './order.entity';
import { EntityLabels, LabelsType } from '../../base.entity';
import { UserRole } from '../../../shared/interfaces';

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
    short: {
      status: 'Статус заказа',
    },
    full: {
      status: 'Статус заказа',
    },
  },
};

function checkDeadlineConflict(order: Order): string | null {
  const { sendingDeadlineDate, deliveryDeadlineDate } = order;
  if (sendingDeadlineDate !== null && deliveryDeadlineDate !== null) {
    return "Error: Can't have both sendingDeadlineDate and deliveryDeadlineDate";
  }
  return null;
}

function generateDeadlineInfo(order: Order): string[] {
  const { daysToSend, sendingDeadlineDate, deliveryDeadlineDate } = order;
  const currentDate = new Date();
  const additionalInfo = [];

  if (sendingDeadlineDate !== null) {
    const daysUntilSend = differenceInDays(sendingDeadlineDate, currentDate);
    additionalInfo.push(
      `Крайний срок отправки: ${format(sendingDeadlineDate, 'yyyy-MM-dd')}, осталось ${daysUntilSend} дней`,
    );
  } else if (deliveryDeadlineDate !== null) {
    const daysUntilDelivery = differenceInDays(
      deliveryDeadlineDate,
      currentDate,
    );
    additionalInfo.push(
      `Крайний срок доставки: ${format(deliveryDeadlineDate, 'yyyy-MM-dd')}, осталось ${daysUntilDelivery} дней`,
    );
  } else {
    additionalInfo.push(
      `Количество дней до отправки ${daysToSend}, оплат не поступало`,
    );
  }

  return additionalInfo;
}

export function formatOrder(
  order: Order,
  userRole: UserRole,
  labelType: LabelsType,
): string {
  const error = checkDeadlineConflict(order);
  if (error) return error;

  const additionalInfo = generateDeadlineInfo(order);
  const formattedLabels = formatLabels(order, labels[userRole][labelType]);
  return [formattedLabels, ...additionalInfo].join('\n');
}
