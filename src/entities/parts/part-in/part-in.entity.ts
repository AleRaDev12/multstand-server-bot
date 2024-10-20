import { Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Component } from '../component/component.entity';
import { NullableColumn } from '../../nullable-column.decorator';
import { BaseEntity } from '../../base.entity';
import { formatLabels } from '../../../shared/helpers';
import { PartOut } from '../part-out/part-out.entity';

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
    id: 'id partIn',
  };

  public format(): string {
    const costPerEntity = (this.amount / this.count).toFixed(2);

    const additionalInfo = [`Стоимость единицы: ${costPerEntity}`];

    const formattedLabels = formatLabels(this, this.labels);

    return [formattedLabels, ...additionalInfo].join('\n');
  }

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Component)
  component: Component;

  @OneToMany(() => PartOut, (partOut) => partOut.partIn)
  partsOut: PartOut[];

  @NullableColumn({ type: 'date' })
  dateOrder: Date;

  @NullableColumn({ type: 'date' })
  dateArrival: Date;

  @NullableColumn({
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  amount: number;

  @NullableColumn({
    type: 'decimal',
    precision: 8,
    scale: 2,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  count: number;

  @NullableColumn()
  description: string;
}
