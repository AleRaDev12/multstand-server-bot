import { EntityLabels, LabelsType } from '../../base.entity';
import { StandProd } from './stand-prod.entity';
import { UserRole } from '../../../shared/interfaces';
import { formatLabels } from '../../../shared/helpers';

const labels: EntityLabels<StandProd, string> = {
  manager: {
    short: {
      id: 'Станок-изделие номер',
      description: 'Описание',
    },
    full: {
      id: 'Станок-изделие номер',
      description: 'Описание',
    },
  },
  master: {
    short: {
      id: 'Станок-изделие номер',
      description: 'Описание',
    },
    full: {
      id: 'Станок-изделие номер',
      description: 'Описание',
    },
  },
};

export function formatStandProd(
  standProd: StandProd,
  userRole: UserRole,
  labelType: LabelsType,
): string {
  return formatLabels(standProd, labels[userRole ?? 'master'][labelType]);
}
