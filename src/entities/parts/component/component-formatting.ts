import { formatLabels } from '../../../shared/helpers';
import { EntityLabels, LabelsType } from '../../base.entity';
import { UserRole } from '../../../shared/interfaces';
import { Component } from './component.entity';

const labels: EntityLabels<Component, string> = {
  manager: {
    short: {
      name: 'Название',
      type: 'Тип',
      description: 'Описание',
    },
    full: {
      name: 'Название',
      type: 'Тип',
      description: 'Описание',
      link: 'Ссылка',
      comment: 'Комментарий',
      id: 'id компонента',
    },
  },
  master: {
    short: {},
    full: {},
  },
};

export function formatComponent(
  component: Component,
  userRole: UserRole,
  labelType: LabelsType,
): string {
  const formattedLabels = formatLabels(component, labels[userRole][labelType]);
  return formattedLabels;
}
