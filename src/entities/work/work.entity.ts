import {
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from '../base.entity';
import { Task } from '../tasks/task.entity';
import { NullableColumn } from '../nullable-column.decorator';
import { StandProd } from '../component/stand-prod/stand-prod.entity';
import { Master } from '../master/master.entity';

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
}
