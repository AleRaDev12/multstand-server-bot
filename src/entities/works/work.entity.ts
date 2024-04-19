import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Task } from '../tasks/task.entity';

@Entity()
export class Work {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Task)
  task: Task;

  // Date of work
  @Column({
    type: 'date',
  })
  date: Date;

  @Column({
    type: 'datetime',
  })
  createdAt: Date;
}
