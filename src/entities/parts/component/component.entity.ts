import { BaseEntity, LabelType } from '../../base.entity';
import { Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';
import { NullableColumn } from '../../nullable-column.decorator';
import { formatComponent } from './component-formatting';
import { UserRole } from '../../../shared/types';
import { Task } from '../../works/task/task.entity';

@Entity()
export class Component extends BaseEntity {
  public static entityName = 'Component';
  public static nullable = {
    name: false,
    type: true,
    description: true,
    link: true,
    historicalAverageCost: true,
    comment: true,
  };

  private labels = {
    name: 'Наименование',
    type: 'Тип',
    description: 'Описание',
    link: 'Ссылка',
    historicalAverageCost: 'Ориентир стоимости (не расчёт)',
    comment: 'Комментарий',
    id: 'id компонента',
  };

  public format(userRole: UserRole, labelType: LabelType = 'short') {
    return formatComponent(this, userRole, labelType);
  }

  @PrimaryGeneratedColumn()
  id: number;

  @NullableColumn()
  name: string;

  @NullableColumn()
  type: string;

  @NullableColumn()
  description: string;

  @NullableColumn()
  link: string;

  @NullableColumn({
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  historicalAverageCost: number;

  @NullableColumn()
  comment: string;

  @ManyToMany(() => Task, (task) => task.components)
  @JoinTable()
  tasks: Task[];
}
