import { Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity, LabelType } from '../../base.entity';
import { NullableColumn } from '../../nullable-column.decorator';
import { UserRole } from '../../../shared/types';
import { Component } from '../../parts/component/component.entity';
import { formatTask } from './task-format';

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

  @ManyToMany(() => Component, (component) => component.tasks)
  components: Component[];

  public format(
    userRole: UserRole,
    labelType: LabelType = 'short',
    paymentCoefficient: number = 1,
  ): string {
    return formatTask(this, userRole, labelType, paymentCoefficient);
  }
}
