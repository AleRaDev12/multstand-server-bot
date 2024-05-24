import { Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { Task } from '../tasks/task.entity';
import { StandProd } from '../stand/stand-prod/stand-prod.entity';
import { NullableColumn } from '../nullable-column.decorator';

@Entity()
export class Work extends BaseEntity {
  public static entityName = 'Work';
  public static nullable = {
    task: false,
    standProd: false,
    date: false,
    createdAt: false,
    cost: false,
    count: false,
  };

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Task)
  task: Task;

  @ManyToMany(() => StandProd)
  standProd: StandProd;

  @NullableColumn({ type: 'date' })
  date: Date;

  @NullableColumn({ type: 'datetime' })
  createdAt: Date;

  @NullableColumn({ type: 'int' })
  cost: number;

  @NullableColumn({ type: 'int' })
  count: number;
}
