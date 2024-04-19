import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from '../orders/order.entity';
import { StandModel, StandModelType } from '../stands/stand.entity';
import { fromEnumValue, fromValue, toEnumKey, toKey } from '../../helpers';

export enum ProcessingType {
  OnlySanding = 'Только шлифовка',
  SandingAndVarnish = 'Шлифовка, лак',
  SandingWhiteEnamelVarnish = 'Шлифовка, белая эмаль, лак',
  SandingBlackEnamelVarnish = 'Шлифовка, чёрная эмаль, лак',
}

export enum TripodType {
  Set1 = 'Комплект №1',
  Set2 = 'Комплект №2',
  Set3 = 'Комплект №3',
}

export enum LedType {
  Economy = 'Эконом',
  Premium = 'Премиум',
}

@Entity()
export class StandSet {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order)
  order: Order;

  @Column({
    type: 'text',
    transformer: {
      to: toKey(StandModel),
      from: fromValue(StandModel),
    },
  })
  model: StandModelType;

  @Column({
    type: 'text',
    nullable: true,
    transformer: {
      to: toEnumKey(ProcessingType),
      from: fromEnumValue(ProcessingType),
    },
  })
  processing: ProcessingType;

  @Column({ nullable: true })
  smartphoneMount: number;

  @Column({
    type: 'text',
    nullable: true,
    transformer: {
      to: toEnumKey(TripodType),
      from: fromEnumValue(TripodType),
    },
  })
  tripod: TripodType;

  @Column({
    type: 'text',
    nullable: true,
    transformer: {
      to: toEnumKey(LedType),
      from: fromEnumValue(LedType),
    },
  })
  ledType: LedType;

  @Column({ nullable: true })
  regularGlass: number;

  @Column({ nullable: true })
  highTransparencyGlass: number;

  @Column({ nullable: true })
  dimmersCount: number;

  @Column({ nullable: true })
  shadingFabric: boolean;

  @Column({ nullable: true })
  sideWallsCount: number;

  @Column({ nullable: true })
  rotaryMechanismsCount: number;
}
