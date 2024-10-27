import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity, LabelType } from '../../base.entity';
import { Task } from '../task/task.entity';
import { NullableColumn } from '../../nullable-column.decorator';
import { Master } from '../../master/master.entity';
import { StandProd } from '../../parts/stand-prod/stand-prod.entity';
import { UserRole } from '../../../shared/types';
import { formatWork } from './work-formatting';

@Entity()
export class Work extends BaseEntity {
  public static entityName = 'Work';
  public static nullable = {
    master: false,
    task: false,
    standProd: true,
    date: false,
    createdAt: false,
    cost: false,
    count: false,
    paymentCoefficient: false,
    description: true,
  };

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Master)
  master: Master;

  @ManyToOne(() => Task)
  task: Task;

  @ManyToOne(() => StandProd)
  standProd: StandProd;

  @NullableColumn({ type: 'date' })
  date: Date;

  @NullableColumn({ type: 'timestamp' })
  createdAt: Date;

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

  @NullableColumn({
    type: 'decimal',
    precision: 10,
    scale: 4,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  count: number;

  @NullableColumn({
    type: 'decimal',
    precision: 4,
    scale: 2,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  paymentCoefficient: number;

  @NullableColumn({ type: 'text' })
  description: string;

  public format(userRole: UserRole, labelType: LabelType = 'short'): string {
    return formatWork(this, userRole, labelType);
  }
}
