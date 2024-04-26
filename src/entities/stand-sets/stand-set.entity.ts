import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from '../orders/order.entity';
import { StandModel, StandModelType } from '../stands/stand.entity';
import { fromValue, toKey } from '../../helpers';

export const Processing = {
  OnlySanding: 'Только шлифовка',
  SandingAndVarnish: 'Шлифовка, лак',
  SandingWhiteEnamelVarnish: 'Шлифовка, белая эмаль, лак',
  SandingBlackEnamelVarnish: 'Шлифовка, чёрная эмаль, лак',
};

export const Tripod = {
  No: 'Без штатива',
  Set1: 'Комплект №1',
  Set2: 'Комплект №2',
  Set3: 'Комплект №3',
};

export const Led = {
  Economy: 'Эконом',
  Premium: 'Премиум',
};

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
      to: toKey(Processing),
      from: fromValue(Processing),
    },
  })
  processing: (typeof Processing)[keyof typeof Processing];

  @Column({ nullable: true })
  smartphoneMount: number;

  @Column({
    type: 'text',
    nullable: true,
    transformer: {
      to: toKey(Tripod),
      from: fromValue(Tripod),
    },
  })
  tripod: (typeof Tripod)[keyof typeof Tripod];

  @Column({
    type: 'text',
    nullable: true,
    transformer: {
      to: toKey(Led),
      from: fromValue(Led),
    },
  })
  ledType: (typeof Led)[keyof typeof Led];

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
