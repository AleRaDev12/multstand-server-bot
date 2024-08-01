import {
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity, LabelsType } from '../../base.entity';
import { Task } from '../tasks/task.entity';
import { NullableColumn } from '../../nullable-column.decorator';
import { Master } from '../../master/master.entity';
import { StandProd } from '../../parts/stand-prod/stand-prod.entity';
import { UserRole } from '../../../shared/interfaces';

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

  @ManyToMany(() => StandProd, (standProd) => standProd.work)
  @JoinTable({ name: 'work_stand_prod' })
  standProd: StandProd[];

  @NullableColumn({ type: 'date' })
  date: Date;

  @NullableColumn({ type: 'datetime' })
  createdAt: Date;

  @NullableColumn({ type: 'int' })
  cost: number;

  @NullableColumn({ type: 'int' })
  count: number;

  @NullableColumn({ type: 'decimal', precision: 4, scale: 2 })
  paymentCoefficient: number;

  @NullableColumn({ type: 'text' })
  description: string;

  public format(userRole: UserRole, labelType?: LabelsType): string {
    return `Not implemented yet for ${this.constructor.name}`;
  }
}
