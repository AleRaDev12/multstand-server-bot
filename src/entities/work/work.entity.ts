import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Task } from '../tasks/task.entity';
import { StandProd } from '../stand-prod/stand-prod.entity';

@Entity()
export class Work {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Task)
  task: Task;

  @ManyToMany(() => StandProd)
  standProd: StandProd;

  @Column({
    type: 'date',
  })
  date: Date;

  @Column({
    type: 'datetime',
  })
  createdAt: Date;

  @Column({
    type: 'int',
  })
  cost: number;

  @Column({
    type: 'int',
  })
  count: number;
}
