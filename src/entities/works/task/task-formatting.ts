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
): string {
  if (labelType === 'line') {
    const taskInfo = `${task.shownName} | ${task.cost}₽ | ${task.duration}м`;

    if (userRole !== 'manager') {
      return taskInfo;
    }

    const componentsInfo =
      task.components?.length > 0
        ? task.components
            .map((component) => `   ${component.format(userRole, labelType)}`)
            .join('\n')
        : '';

    return `${taskInfo}\n${componentsInfo}`;
  }

  return formatLabels(task, labels[userRole][labelType]);
}
