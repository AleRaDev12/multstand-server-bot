import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Component } from '../component/component.entity';
import { NullableColumn } from '../../nullable-column.decorator';
import { BaseEntity } from '../../base.entity';

@Entity()
export class PartIn extends BaseEntity {
  public static entityName = 'PartIn';
  public static nullable = {
    component: false,
    dateOrder: false,
    dateArrival: true,
    amount: false,
    count: false,
    description: true,
  };

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Component)
  component: Component;

  @NullableColumn({ type: 'date' })
  dateOrder: Date;

  @NullableColumn({ type: 'date' })
  dateArrival: Date;

  @NullableColumn({ type: 'decimal' })
  amount: number;

  @NullableColumn({ type: 'int' })
  count: number;

  @NullableColumn()
  description: string;
}
