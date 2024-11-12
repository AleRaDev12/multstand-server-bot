import { formatLabels } from '../../../shared/helpers';
import { Task } from './task.entity';
import { EntityLabels, LabelType } from '../../base.entity';
import { UserRole } from '../../../shared/types';

const labels: EntityLabels<Task, string> = {
  manager: {
    short: {
      shownName: 'Задача',
      cost: 'Оплата',
      duration: 'Длительность план',
    },
    full: {
      id: 'ID задачи',
      category: 'Категория',
      shownName: 'Задача',
      cost: 'Оплата',
      duration: 'Длительность план',
    },
  },
  master: {
    short: {
      shownName: 'Задача',
      duration: 'Длительность план',
    },
    full: {
      shownName: 'Задача',
      duration: 'Длительность план',
    },
  },
};

export function formatTask(
  task: Task,
  userRole: UserRole,
  labelType: LabelType = 'short',
  paymentCoefficient: number,
): string {
  if (labelType === 'line') {
    const payment = task.cost * paymentCoefficient;
    const paymentFixed = Number.isInteger(payment)
      ? payment
      : payment.toFixed(2);

    const taskInfo = `${task.shownName} | ${paymentFixed}₽ | ${task.duration}м`;

    if (userRole !== 'manager') {
      return taskInfo;
    }

    const componentsInfo =
      task.components?.length > 0
        ? task.components
            .map((component) => `\n   ${component.format(userRole, labelType)}`)
            .join('')
        : '';

    return `${taskInfo}${componentsInfo}`;
  }

  return formatLabels(task, labels[userRole][labelType]);
}
