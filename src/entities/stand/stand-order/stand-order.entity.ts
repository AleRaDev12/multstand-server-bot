import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from '../../order/order.entity';
import { fromValue, toKey } from '../../../helpers';
import {
  Led,
  Painting,
  PaintingType,
  StandModel,
  StandModelType,
  Tripod,
  TripodType,
} from '../../unions';

@Entity()
export class StandOrder {
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

  @Column({ type: 'decimal', nullable: true })
  cost: number;

  @Column({
    type: 'text',
    nullable: true,
    transformer: {
      to: toKey(Painting),
      from: fromValue(Painting),
    },
  })
  painting: PaintingType;

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
  tripod: TripodType;

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
  glassesRegular: number;

  @Column({ nullable: true })
  glassesHighTransparency: number;

  @Column({ nullable: true })
  dimmersCount: number;

  @Column({ type: 'int', nullable: true })
  shadingFabric: number; // Ткань для затенения, 0 если нет

  @Column({ nullable: true })
  sideWallsCount: number;

  @Column({ nullable: true })
  rotaryMechanismsCount: number;
}
