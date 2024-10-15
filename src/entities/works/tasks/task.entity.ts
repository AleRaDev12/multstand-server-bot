import { Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity, LabelsType } from '../../base.entity';
import { NullableColumn } from '../../nullable-column.decorator';
import { UserRole } from '../../../shared/interfaces';
import { formatTask } from './task-formatting';

@Entity()
export class Task extends BaseEntity {
  public static entityName = 'Task';
  public static nullable = {
    category: true,
    name: false,
    shownName: true,
    cost: false,
    duration: false,
  };

  @PrimaryGeneratedColumn()
  id: number;

  @NullableColumn({ type: 'text' })
  category: string;

  @NullableColumn({ type: 'text' })
  name: string;

  @NullableColumn({ type: 'text' })
  shownName: string;

  @NullableColumn({
    type: 'decimal',
    precision: 10,
    scale: 4,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  cost: number;

  @NullableColumn({ type: 'int' })
  duration: number;

  public format(userRole: UserRole, labelType: LabelsType = 'short'): string {
    return formatTask(this, userRole, labelType);
  }
}
