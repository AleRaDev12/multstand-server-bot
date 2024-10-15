import { formatLabels } from '../../../shared/helpers';
import { Task } from './task.entity';
import { EntityLabels, LabelsType } from '../../base.entity';
import { UserRole } from '../../../shared/interfaces';

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
  labelType: LabelsType,
): string {
  return formatLabels(task, labels[userRole][labelType]);
}
