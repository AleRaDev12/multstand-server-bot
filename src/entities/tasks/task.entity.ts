import { Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { NullableColumn } from '../nullable-column.decorator';

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

  @NullableColumn({ type: 'int' })
  cost: number;

  @NullableColumn({ type: 'int' })
  duration: number;

  public format(): string {
    return `Not implemented yet for ${this.constructor.name}`;
  }
}
