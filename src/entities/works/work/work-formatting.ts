import { formatLabels } from '../../../shared/helpers';
import { Work } from './work.entity';
import { EntityLabels, LabelType } from '../../base.entity';
import { UserRole } from '../../../shared/types';

const labels: EntityLabels<Work, string> = {
  manager: {
    short: {
      date: 'Дата',
      cost: 'Оплата',
      count: 'Количество',
      paymentCoefficient: 'Коэффициент',
      description: 'Комментарий',
    },
    full: {
      id: 'ID работы',
      date: 'Дата',
      cost: 'Оплата',
      count: 'Количество',
      paymentCoefficient: 'Коэффициент',
      description: 'Комментарий',
      createdAt: 'Создано',
    },
  },
  master: {
    short: {
      date: 'Дата',
      cost: 'Оплата',
      count: 'Количество',
    },
    full: {
      date: 'Дата',
      cost: 'Оплата',
      count: 'Количество',
      description: 'Комментарий',
    },
  },
};

export function formatWork(
  work: Work,
  userRole: UserRole,
  labelType: LabelType,
): string {
  const { cost, count, paymentCoefficient, task } = work;

  const costSumWOCoefficient = Math.floor(cost * count);
  const costSumWCoefficient = Math.floor(
    costSumWOCoefficient * paymentCoefficient,
  );
  const durationPlanSum = Math.floor(task?.duration * count);

  const workAdditionalInfo =
    userRole !== 'manager'
      ? ''
      : `Оплата: ${costSumWCoefficient}\nДлительность план: ${durationPlanSum}`;

  const taskDescription = task ? `\n\n${task.format(userRole)}` : '';

  const formattedWork = formatLabels(work, labels[userRole][labelType]);

  return `${formattedWork}\n${workAdditionalInfo}${taskDescription}`;
}
