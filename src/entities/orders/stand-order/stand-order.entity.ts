import { BaseEntity } from '../../base.entity';
import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { NullableColumn } from '../../nullable-column.decorator';
import { fromValue, toKey } from '../../../shared/helpers';
import {
  Led,
  Painting,
  PaintingType,
  StandModel,
  StandModelType,
  Tripod,
  TripodType,
} from '../../unions';
import { Order } from '../order/order.entity';
import { StandOrderStatus, StandOrderStatusType } from './stand-order-types';
import {
  formatStandOrder,
  formatStandOrderShorten,
} from './stand-order-formatting';

@Entity()
export class StandOrder extends BaseEntity {
  public static entityName = 'StandOrder';

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order)
  order: Order;

  @NullableColumn({
    type: 'text',
    transformer: {
      to: toKey(StandOrderStatus),
      from: fromValue(StandOrderStatus),
    },
  })
  status: StandOrderStatusType;

  @NullableColumn({
    type: 'text',
    transformer: {
      to: toKey(StandModel),
      from: fromValue(StandModel),
    },
  })
  model: StandModelType;

  @NullableColumn({ type: 'decimal' })
  cost: number;

  @NullableColumn({
    type: 'text',
    transformer: {
      to: toKey(Painting),
      from: fromValue(Painting),
    },
  })
  painting: PaintingType;

  @NullableColumn()
  smartphoneMount: number;

  @NullableColumn({
    type: 'text',
    transformer: {
      to: toKey(Tripod),
      from: fromValue(Tripod),
    },
  })
  tripod: TripodType;

  @NullableColumn({
    type: 'text',
    transformer: {
      to: toKey(Led),
      from: fromValue(Led),
    },
  })
  ledType: (typeof Led)[keyof typeof Led];

  @NullableColumn()
  glassesRegular: number;

  @NullableColumn()
  glassesHighTransparency: number;

  @NullableColumn()
  dimmersCount: number;

  @NullableColumn({ type: 'int' })
  shadingFabric: number;

  @NullableColumn()
  sideWallsCount: number;

  @NullableColumn()
  rotaryMechanismsCount: number;

  @NullableColumn()
  deliveryCost: number;

  public static nullable = {
    order: false,
    model: false,
    cost: true,
    painting: true,
    smartphoneMount: true,
    tripod: true,
    ledType: true,
    glassesRegular: true,
    glassesHighTransparency: true,
    dimmersCount: true,
    shadingFabric: true,
    sideWallsCount: true,
    rotaryMechanismsCount: true,
    deliveryCost: true,
    status: false,
  };

  public format(): string {
    return formatStandOrder(this);
  }

  public formatShorten(): string {
    return formatStandOrderShorten(this);
  }
}
