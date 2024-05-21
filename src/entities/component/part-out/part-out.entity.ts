import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Component } from '../component/component.entity';
import { StandProd } from '../../stand/stand-prod/stand-prod.entity';

@Entity()
export class PartOut {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Component)
  component: Component;

  @ManyToOne(() => StandProd)
  standProd: StandProd;

  @Column({
    type: 'date',
    // transformer: {
    //   to: toKey(StandModel),
    //   from: fromValue(StandModel),
    // },
  })
  dateOrder: Date;

  @Column({
    type: 'date',
    nullable: true,
    // transformer: {
    //   to: toKey(StandModel),
    //   from: fromValue(StandModel),
    // },
  })
  dateArrival: Date;

  @Column({
    type: 'int',
    // transformer: {
    //   to: toKey(StandModel),
    //   from: fromValue(StandModel),
    // },
  })
  amount: number;

  @Column({
    type: 'int',
    // transformer: {
    //   to: toKey(StandModel),
    //   from: fromValue(StandModel),
    // },
  })
  count: number;
}
