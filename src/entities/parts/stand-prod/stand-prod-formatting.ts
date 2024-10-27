import { EntityLabels, LabelType } from '../../base.entity';
import { StandProd } from './stand-prod.entity';
import { UserRole } from '../../../shared/types';
import { formatLabels } from '../../../shared/helpers';

const labels: EntityLabels<StandProd, string> = {
  manager: {
    short: {
      id: 'Изделие #',
      description: 'Описание',
    },
    full: {
      id: 'Изделие #',
      description: 'Описание',
    },
  },
  master: {
    short: {
      id: 'Изделие #',
      description: 'Описание',
    },
    full: {
      id: 'Изделие #',
      description: 'Описание',
    },
  },
};

export function formatStandProd(
  standProd: StandProd,
  userRole: UserRole,
  labelType: LabelType,
): string {
  return formatLabels(standProd, labels[userRole ?? 'master'][labelType]);
}
