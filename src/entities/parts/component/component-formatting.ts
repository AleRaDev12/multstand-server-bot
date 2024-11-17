import { formatLabels } from '../../../shared/helpers';
import { EntityLabels, LabelType } from '../../base.entity';
import { UserRole } from '../../../shared/types';
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
  labelType: LabelType,
): string {
  try {
    if (labelType === 'line') {
      return component.name;
    }

    return formatLabels(component, labels[userRole][labelType]);
  } catch (e) {
    console.error(e);
  }
}
