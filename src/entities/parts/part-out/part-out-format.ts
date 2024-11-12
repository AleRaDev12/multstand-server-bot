import { UserRole } from '../../../shared/types';
import { LabelType } from '../../base.entity';
import { PartOut } from './part-out.entity';

export function formatPartOut(
  partOut: PartOut,
  userRole: UserRole,
  labelType: LabelType = 'short',
): string {
  if (userRole !== 'manager') {
    return '';
  }

  return `${partOut.partIn.component.name} ${partOut.count}шт`;
}
