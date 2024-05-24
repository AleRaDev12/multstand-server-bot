import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Component } from '../component/component.entity';
import { StandProd } from '../../stand/stand-prod/stand-prod.entity';
import { BaseEntity } from '../../base.entity';
import { NullableColumn } from '../../nullable-column.decorator';

@Entity()
export class PartOut extends BaseEntity {
  public static entityName = 'PartOut';
  public static nullable = {
    component: false,
    standProd: false,
    dateOrder: false,
    dateArrival: true,
    amount: false,
    count: false,
  };

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Component)
  component: Component;

  @ManyToOne(() => StandProd)
  standProd: StandProd;

  @NullableColumn({ type: 'date' })
  dateOrder: Date;

  @NullableColumn({ type: 'date' })
  dateArrival: Date;

  @NullableColumn({ type: 'int' })
  amount: number;

  @NullableColumn({ type: 'int' })
  count: number;
}
