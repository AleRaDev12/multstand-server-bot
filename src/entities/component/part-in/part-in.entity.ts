import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Component } from '../component/component.entity';
import { NullableColumn } from '../../nullable-column.decorator';
import { BaseEntity } from '../../base.entity';
import { formatLabels } from '../../../shared/helpers';

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

  private labels = {
    dateOrder: 'Дата заказа',
    dateArrival: 'Дата получения',
    amount: 'Стоимость партии с доставкой',
    count: 'Количество',
    description: 'Описание',
    id: 'id поступления части',
  };

  public format(): string {
    const costPerEntity = this.amount / this.count;

    const additionalInfo = [`Стоимость единицы: ${costPerEntity}`];

    const formattedLabels = formatLabels(this, this.labels);

    return [formattedLabels, ...additionalInfo].join('\n');
  }

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
